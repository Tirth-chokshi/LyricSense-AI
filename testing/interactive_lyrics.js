const searchSong = require("./searchSong");
const getLyrics = require("./getLyrics");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Utility function to ask user questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Main interactive function
async function interactiveLyricsSearch() {
  console.log("🎵 Interactive Lyrics Search Tool 🎵");
  console.log("═".repeat(50));
  console.log("Search for any song and get its lyrics!\n");

  try {
    // Ask user for song title
    const songTitle = await askQuestion("🔍 Enter song title or keywords: ");

    if (!songTitle) {
      console.log("❌ Please enter a valid song title");
      return;
    }

    console.log(`\n⏳ Searching for songs containing: "${songTitle}"`);
    console.log("─".repeat(60));

    // Configuration for searching (artist field kept blank as requested)
    const options = {
      apiKey:
        "",
      title: songTitle,
      artist: "", // Keep artist blank as per user request
      optimizeQuery: true,
      authHeader: true,
    };

    // Search for songs
    const searchResults = await searchSong(options);

    if (!searchResults || searchResults.length === 0) {
      console.log("❌ No results found. Try different keywords.");
      return;
    }

    console.log(`✅ Found ${searchResults.length} result(s):\n`);

    // Display all results with numbers
    searchResults.forEach((result, index) => {
      console.log(
        `${(index + 1).toString().padStart(2, "0")}. ${result.title}`
      );
      console.log(`    🆔 ID: ${result.id}`);
      console.log(
        `    🎨 Album Art: ${
          result.albumArt ? "✅ Available" : "❌ Not available"
        }`
      );
      console.log("");
    });

    // Ask user to choose a song
    while (true) {
      const choice = await askQuestion(
        `📝 Enter song number (1-${searchResults.length}) or 'q' to quit: `
      );

      if (choice.toLowerCase() === "q") {
        console.log("👋 Goodbye!");
        return;
      }

      const selectedIndex = parseInt(choice) - 1;

      if (
        isNaN(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= searchResults.length
      ) {
        console.log(
          `❌ Please enter a number between 1 and ${searchResults.length}, or 'q' to quit.`
        );
        continue;
      }

      const selectedSong = searchResults[selectedIndex];
      console.log(`\n🎵 Getting lyrics for: ${selectedSong.title}`);
      console.log("⏳ Please wait...");
      console.log("─".repeat(80));

      try {
        // Extract lyrics from the selected result
        const lyrics = await getLyrics(selectedSong.url);

        if (lyrics) {
          console.log("✅ Lyrics found!\n");
          console.log("📝 LYRICS:");
          console.log("═".repeat(80));
          console.log(lyrics);
          console.log("═".repeat(80));
        } else {
          console.log(
            "❌ Could not extract lyrics for this song. The lyrics might not be available."
          );
        }
      } catch (lyricsError) {
        console.log("❌ Error getting lyrics:", lyricsError.message);
      }

      // Ask if user wants to search again
      const searchAgain = await askQuestion(
        "\n🔄 Would you like to search for another song? (y/n): "
      );
      if (
        searchAgain.toLowerCase() !== "y" &&
        searchAgain.toLowerCase() !== "yes"
      ) {
        console.log("👋 Thank you for using Lyrics Search Tool!");
        return;
      }

      console.log("\n" + "═".repeat(50) + "\n");
      return interactiveLyricsSearch(); // Restart the search
    }
  } catch (error) {
    console.error("❌ An error occurred:", error.message || error);
    console.log("Please try again or check your internet connection.");
  }
}

// Graceful exit handler
process.on("SIGINT", () => {
  console.log("\n\n👋 Goodbye! Thanks for using Lyrics Search Tool!");
  rl.close();
  process.exit(0);
});

// Run the interactive tool if this file is executed directly
if (require.main === module) {
  interactiveLyricsSearch()
    .catch(console.error)
    .finally(() => {
      rl.close();
    });
}

module.exports = { interactiveLyricsSearch };
