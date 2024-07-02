
import searchSong from './searchSong.js';
import { checkOptions } from './helpers/index.js';

/**
 * @param {{apiKey: string, title: string, artist: string, optimizeQuery: boolean}} options
 */
export default async function (options) {
    checkOptions(options);
    let results = await searchSong(options);
    if (!results) return null;
    return results[0].albumArt;
};
