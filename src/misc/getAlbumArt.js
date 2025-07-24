
import searchSong from './searchSong.js';
import { checkOptions } from './helpers/index.js';

/**
 * @param {{apiKey: string, title: string, artist: string, optimizeQuery: boolean}} options
 */
const GetAlbumArt = async function getAlbumArt(options) {
    checkOptions(options);
    let results = await searchSong(options);
    if (!results) return null;
    return results[0].albumArt;
};

GetAlbumArt.displayName = "GetAlbumArt";

export default GetAlbumArt;
