import searchSong from './searchSong.js';
import { checkOptions } from './helpers/index.js';
import extractLyrics from './helpers/extractLyrics.js';

/**
 * Enhanced getLyrics with retry logic and better error handling
 * @param {({apiKey: string, title: string, artist: string, optimizeQuery: boolean}|string)} arg - options object, or Genius URL
 */
export default async function getLyricsWithRetry(arg, retryOptions = {}) {
    const { maxRetries = 2, retryDelay = 1000, fallbackSearch = true } = retryOptions;
    
    const attempt = async (attemptNumber = 1) => {
        try {
            console.log(`[Lyrics] Attempt ${attemptNumber}/${maxRetries + 1} for lyrics fetch`);
            
            if (arg && typeof arg === 'string') {
                console.log('[Lyrics] Direct URL extraction:', arg);
                let lyrics = await extractLyrics(arg);
                return lyrics;
            } else if (typeof arg === 'object') {
                checkOptions(arg);
                
                // Enhanced search with different strategies
                let results = null;
                
                // Strategy 1: Original search
                try {
                    console.log('[Lyrics] Searching with original query...');
                    results = await searchSong(arg);
                } catch (searchError) {
                    console.warn('[Lyrics] Original search failed:', searchError.message);
                    
                    if (fallbackSearch && attemptNumber === 1) {
                        // Strategy 2: Simplified search (remove special characters)
                        try {
                            console.log('[Lyrics] Trying simplified search...');
                            const simplifiedArg = {
                                ...arg,
                                title: arg.title.replace(/[^\w\s]/g, '').trim(),
                                artist: arg.artist.replace(/[^\w\s]/g, '').trim(),
                                optimizeQuery: true
                            };
                            results = await searchSong(simplifiedArg);
                        } catch (fallbackError) {
                            console.warn('[Lyrics] Fallback search also failed:', fallbackError.message);
                            throw searchError; // Throw original error
                        }
                    } else {
                        throw searchError;
                    }
                }
                
                if (!results || results.length === 0) {
                    console.log('[Lyrics] No search results found');
                    return null;
                }
                
                console.log(`[Lyrics] Found ${results.length} search results, trying to extract lyrics...`);
                
                // Try to extract lyrics from multiple results if first fails
                for (let i = 0; i < Math.min(results.length, 3); i++) {
                    try {
                        console.log(`[Lyrics] Trying result ${i + 1}: ${results[i].fullTitle}`);
                        const lyrics = await extractLyrics(results[i].url);
                        if (lyrics && lyrics.trim().length > 50) { // Ensure we got substantial lyrics
                            console.log(`[Lyrics] Successfully extracted lyrics (${lyrics.length} chars)`);
                            return lyrics;
                        } else {
                            console.log(`[Lyrics] Result ${i + 1} had insufficient lyrics content`);
                        }
                    } catch (extractError) {
                        console.warn(`[Lyrics] Failed to extract from result ${i + 1}:`, extractError.message);
                        if (i === results.length - 1) {
                            throw extractError; // If this was the last result, throw the error
                        }
                    }
                }
                
                return null; // No results yielded sufficient lyrics
            } else {
                throw new Error('Invalid argument type');
            }
        } catch (error) {
            console.error(`[Lyrics] Attempt ${attemptNumber} failed:`, error.message);
            
            // Check if we should retry
            if (attemptNumber <= maxRetries) {
                // Only retry on certain types of errors
                const shouldRetry = (
                    error.message.includes('timeout') ||
                    error.message.includes('ECONNRESET') ||
                    error.message.includes('ENOTFOUND') ||
                    error.message.includes('network') ||
                    error.response?.status >= 500
                );
                
                if (shouldRetry) {
                    console.log(`[Lyrics] Retrying in ${retryDelay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    return attempt(attemptNumber + 1);
                }
            }
            
            // Add more context to the error
            const enhancedError = new Error(`Lyrics fetch failed after ${attemptNumber} attempts: ${error.message}`);
            enhancedError.originalError = error;
            enhancedError.attempts = attemptNumber;
            enhancedError.isLyricsError = true;
            throw enhancedError;
        }
    };
    
    return attempt();
}

// Export both the enhanced version and original for compatibility
export { getLyricsWithRetry };
export { default as getLyricsOriginal } from './getLyrics.js';
