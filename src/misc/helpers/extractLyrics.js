
import axios from 'axios';
import cheerio from 'cheerio-without-node-native';


/**
 * @param {string} url - Genius URL
 */


export default async function (url) {
	try {
		console.log('[ExtractLyrics] Fetching lyrics from:', url);
		
		// Enhanced request with headers to avoid blocking
		let { data } = await axios.get(url, {
			timeout: 15000,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.5',
				'Accept-Encoding': 'gzip, deflate, br',
				'Connection': 'keep-alive',
				'Upgrade-Insecure-Requests': '1',
			}
		});
		
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
        
        // More fallback selectors
        if (!lyrics) {
            lyrics = $('div[class="lyrics"]').text().trim();
        }
        
        if (!lyrics) {
            $('div[class*="lyrics"]').each((i, elem) => {
                lyrics += $(elem).text().trim() + '\n\n';
            });
        }
        
        console.log('[ExtractLyrics] Lyrics extraction result:', {
        	found: !!lyrics,
        	length: lyrics?.length || 0
        });
        
        if (!lyrics) return null;
        return lyrics.trim();
	} catch (e) {
		console.error('[ExtractLyrics] Error:', e.message);
		throw e;
	}
};
