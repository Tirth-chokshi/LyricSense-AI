import axios from 'axios';
import { getTitle, checkOptions } from './helpers/index.js';

const searchUrl = 'https://api.genius.com/search?q=';

/**
 * @param {{apiKey: string, title: string, artist: string, optimizeQuery: boolean, authHeader: boolean}} options
 */
export default async function (options) {
    try {
        checkOptions(options);
        let { apiKey = process.env.LYRIC_API, title, artist, optimizeQuery = false, authHeader = false } = options;
        const song = optimizeQuery ? getTitle(title, artist) : `${title} ${artist}`;
        const reqUrl = `${searchUrl}${encodeURIComponent(song)}`;
        const headers = {
            Authorization: 'Bearer ' + apiKey
        };
        let { data } = await axios.get(
            authHeader ? reqUrl : `${reqUrl}&access_token=${apiKey}`,
            authHeader && { headers }
        );
        if (data.response.hits.length === 0) return null;
        const results = data.response.hits.map((val) => {
            const { full_title, song_art_image_url, id, url, primary_artist } = val.result;
            return {
                id,
                title: val.result.title, // Use the actual song title
                artist: primary_artist.name, // Add the artist name
                fullTitle: full_title, // Keep the full title for display
                albumArt: song_art_image_url,
                url
            };
        });

        return results;
    } catch (e) {
        throw e;
    }
};
