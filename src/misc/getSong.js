import searchSong from './searchSong.js';
import extractLyrics from './helpers/extractLyrics.js';
import { checkOptions } from './helpers/index.js';
/**
 * @param {{apiKey: string, title: string, artist: string, optimizeQuery: boolean}} options
 */
export default async function (options) {
    try {
        checkOptions(options);
        let results = await searchSong(options);
        if (!results) return null;
        let lyrics = await extractLyrics(results[0].url);
        return {
            id: results[0].id,
            title: results[0].title,
            url: results[0].url,
            lyrics,
            albumArt: results[0].albumArt
        };
    } catch (e) {
        throw e;
    }
};
