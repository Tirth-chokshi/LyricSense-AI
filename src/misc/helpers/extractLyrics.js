
import axios from 'axios';
import cheerio from 'cheerio-without-node-native';


/**
 * @param {string} url - Genius URL
 */


export default async function (url) {
	try {
		let { data } = await axios.get(url);
		const $ = cheerio.load(data);
        
        // Try multiple possible selectors
        let lyrics = '';
        
        // Modern Genius structure
        $('[data-lyrics-container="true"]').each((i, elem) => {
            lyrics += $(elem).text().trim() + '\n\n';
        });
        
        // Fallback to older structure if needed
        if (!lyrics) {
            $('div[class^="Lyrics__Container"]').each((i, elem) => {
                lyrics += $(elem).text().trim() + '\n\n';
            });
        }
        
        // Last resort fallback
        if (!lyrics) {
            lyrics = $('div[class="lyrics"]').text().trim();
        }
        
        if (!lyrics) return null;
        return lyrics.trim();
	} catch (e) {
		throw e;
	}
};
