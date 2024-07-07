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
    return `https://www.youtube.com/embed/${videoId}`;
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    throw error;
  }
}
