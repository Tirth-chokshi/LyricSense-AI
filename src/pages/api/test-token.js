// Simple test to verify Genius API access token
export default async function handler(req, res) {
  const { LYRIC_API } = process.env;
  
  if (!LYRIC_API) {
    return res.status(500).json({ error: 'LYRIC_API not configured' });
  }

  try {
    // Test 1: Direct API call to verify token
    const testUrl = 'https://api.genius.com/search?q=test';
    
    console.log('[Token Test] Testing access token...');
    console.log('[Token Test] Token length:', LYRIC_API.length);
    console.log('[Token Test] Token prefix:', LYRIC_API.substring(0, 8) + '...');
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${LYRIC_API}`,
        'User-Agent': 'LyricSense/1.0',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    const responseText = await response.text();
    console.log('[Token Test] Response status:', response.status);
    console.log('[Token Test] Response:', responseText.substring(0, 200));

    if (response.ok) {
      const data = JSON.parse(responseText);
      return res.status(200).json({
        success: true,
        message: 'Access token is working!',
        tokenLength: LYRIC_API.length,
        apiResponse: {
          status: response.status,
          hasResults: data.response?.hits?.length > 0,
          resultCount: data.response?.hits?.length || 0
        }
      });
    } else {
      return res.status(response.status).json({
        success: false,
        error: 'Token authentication failed',
        details: {
          status: response.status,
          statusText: response.statusText,
          response: responseText,
          tokenLength: LYRIC_API.length,
          suggestions: [
            'Verify the access token is correct',
            'Check if token has expired',
            'Ensure token has proper permissions',
            'Try regenerating the access token in Genius dashboard'
          ]
        }
      });
    }

  } catch (error) {
    console.error('[Token Test] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Network or request error',
      details: {
        message: error.message,
        type: error.constructor.name,
        tokenLength: LYRIC_API.length
      }
    });
  }
}
