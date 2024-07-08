import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YT_API;

/**
 * Fetches the YouTube video URL for a given song title and artist name.
 * @param {string} title - The title of the song.
 * @param {string} artist - The name of the artist.
 * @returns {Promise<string>} - The URL of the YouTube video.
 */
export default async function getYoutubeVideo(title, artist) {
  const query = `${title} ${artist}`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const videoId = response.data.items[0].id.videoId;

    // Fetch video insights to get the most played part
    const insightsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const insightsResponse = await axios.get(insightsUrl);
    const mostPlayedPart = getMostPlayedPart(insightsResponse.data.items[0]);

    return `https://www.youtube.com/embed/${videoId}?start=${mostPlayedPart.start}&end=${mostPlayedPart.end}`;
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    throw error;
  }
}

/**
 * Extracts the most played part from the video insights.
 * @param {object} videoData - The video data from YouTube API.
 * @returns {object} - The start and end times of the most played part.
 */
function getMostPlayedPart(videoData) {
  // Placeholder logic for extracting the most played part
  // You will need to replace this with actual logic based on YouTube API response
  return {
    start: 60, // Example start time in seconds
    end: 120   // Example end time in seconds
  };
}
