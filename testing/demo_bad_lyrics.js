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

async function interactiveLyricsSearch() {
  console.log("🎵 Welcome to the Interactive Lyrics Search Tool! 🎵\n");

  try {
    // Ask user for song title
    const songTitle = await askQuestion(
      "Enter the song title (or part of it): "
    );

    if (!songTitle) {
      console.log("❌ Please enter a valid song title");
      rl.close();
      return;
    }

    console.log(`\n🔍 Searching for songs containing: "${songTitle}"`);
    console.log("─".repeat(60));

    // Configuration for searching
    const options = {
      apiKey:
        "",
      title: songTitle,
      artist: " ", // Keep artist blank as requested
      optimizeQuery: true,
      authHeader: true,
    };

    // Step 1: Search for the song
    const searchResults = await searchSong(options);

    if (!searchResults || searchResults.length === 0) {
      console.log("❌ No results found for this song");
      rl.close();
      return;
    }

    console.log(`✅ Found ${searchResults.length} result(s):\n`);

    // Display all results with numbers
    searchResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.title}`);
      console.log(`   🆔 ID: ${result.id}`);
      console.log(`   🔗 URL: ${result.url}`);
      console.log(
        `   🎨 Album Art: ${
          result.albumArt ? "✅ Available" : "❌ Not available"
        }`
      );
      console.log("");
    });

    // Ask user to choose a song
    const choice = await askQuestion(
      `\nEnter the number (1-${searchResults.length}) of the song you want lyrics for: `
    );

    const selectedIndex = parseInt(choice) - 1;

    if (
      isNaN(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= searchResults.length
    ) {
      console.log("❌ Invalid choice. Please enter a valid number.");
      rl.close();
      return;
    }

    const selectedSong = searchResults[selectedIndex];
    console.log(`\n🎵 Getting lyrics for: ${selectedSong.title}`);
    console.log("─".repeat(60));

    // Step 2: Extract lyrics from the selected result
    const lyrics = await getLyrics(selectedSong.url);

    if (lyrics) {
      console.log("✅ Lyrics extracted successfully!\n");
      console.log("📝 LYRICS:");
      console.log("═".repeat(80));
      console.log(lyrics);
      console.log("═".repeat(80));
    } else {
      console.log("❌ Could not extract lyrics for this song");
    }
  } catch (error) {
    console.error("❌ Error:", error.message || error);
  } finally {
    rl.close();
  }
}

// Run the interactive tool
if (require.main === module) {
  interactiveLyricsSearch().catch(console.error);
}

module.exports = { interactiveLyricsSearch };
