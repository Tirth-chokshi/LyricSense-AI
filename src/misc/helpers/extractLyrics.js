import axios from "axios";
import * as cheerio from "cheerio";

export default async function extractLyrics(url) {
  try {
    let { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let lyrics = $('div[class="lyrics"]').text().trim();

    if (!lyrics) {
      lyrics = "";
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }

    if (!lyrics) {
      // Try additional selectors for newer Genius pages
      $('div[data-lyrics-container="true"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }

    if (!lyrics) return null;
    return lyrics.trim();
  } catch (error) {
    console.error("Error extracting lyrics:", error);
    throw new Error("Failed to extract lyrics");
  }
}
