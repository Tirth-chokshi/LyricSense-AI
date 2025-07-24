
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
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.9',
				'Accept-Encoding': 'gzip, deflate, br',
				'Connection': 'keep-alive',
				'Upgrade-Insecure-Requests': '1',
				'Sec-Fetch-Dest': 'document',
				'Sec-Fetch-Mode': 'navigate',
				'Sec-Fetch-Site': 'none'
			}
		});
		
		const $ = cheerio.load(data);
        
        // Try multiple extraction strategies
        let lyrics = '';
        
        // Strategy 1: Modern Genius structure (2024+)
        $('[data-lyrics-container="true"]').each((i, elem) => {
            lyrics += $(elem).text().trim() + '\n\n';
        });
        
        // Strategy 2: Alternative modern structure
        if (!lyrics) {
            $('div[class*="Lyrics__Container"]').each((i, elem) => {
                lyrics += $(elem).text().trim() + '\n\n';
            });
        }
        
        // Strategy 3: Look for any div with "lyrics" in class name
        if (!lyrics) {
            $('div[class*="lyrics"]').each((i, elem) => {
                const text = $(elem).text().trim();
                if (text.length > 20) { // Only substantial text
                    lyrics += text + '\n\n';
                }
            });
        }
        
        // Strategy 4: Look for specific Genius selectors
        if (!lyrics) {
            const selectors = [
                '[class*="SongPage__Section"]',
                '[class*="lyrics"]',
                '.lyrics',
                '#lyrics-root',
                '[data-testid="lyrics"]'
            ];
            
            for (const selector of selectors) {
                $(selector).each((i, elem) => {
                    const text = $(elem).text().trim();
                    if (text.length > 50) {
                        lyrics += text + '\n\n';
                    }
                });
                if (lyrics) break;
            }
        }
        
        // Strategy 5: Search for lyrics in script tags (sometimes embedded as JSON)
        if (!lyrics) {
            $('script').each((i, elem) => {
                const scriptContent = $(elem).html();
                if (scriptContent && scriptContent.includes('"lyrics"') && scriptContent.includes('"plain"')) {
                    try {
                        // Try to extract lyrics from JSON data
                        const jsonMatch = scriptContent.match(/\{.*"lyrics".*\}/);
                        if (jsonMatch) {
                            const jsonData = JSON.parse(jsonMatch[0]);
                            if (jsonData.lyrics && jsonData.lyrics.plain) {
                                lyrics = jsonData.lyrics.plain;
                            }
                        }
                    } catch (e) {
                        // JSON parsing failed, continue
                    }
                }
            });
        }
        
        // Strategy 6: Fallback - look for any substantial text content
        if (!lyrics) {
            $('body').find('*').each((i, elem) => {
                const $elem = $(elem);
                const text = $elem.text().trim();
                
                // Look for patterns that might be lyrics
                if (text.length > 100 && 
                    text.includes('\n') && 
                    !text.includes('©') && 
                    !text.includes('cookie') &&
                    !text.includes('privacy') &&
                    $elem.children().length < 10) {
                    
                    lyrics = text;
                    return false; // Break the loop
                }
            });
        }
        
        console.log('[ExtractLyrics] Extraction strategies result:', {
        	found: !!lyrics,
        	length: lyrics?.length || 0,
        	preview: lyrics ? lyrics.substring(0, 100) + '...' : null
        });
        
        if (!lyrics || lyrics.length < 50) {
            console.log('[ExtractLyrics] No substantial lyrics found');
            return null;
        }
        
        // Clean up the lyrics
        lyrics = lyrics
            .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
            .replace(/\s+/g, ' ') // Normalize spaces
            .replace(/\n /g, '\n') // Remove spaces at start of lines
            .trim();
        
        return lyrics;
	} catch (e) {
		console.error('[ExtractLyrics] Error:', e.message);
		throw e;
	}
};
