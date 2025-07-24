// Alternative authentication test using Client ID + Secret
export default async function handler(req, res) {
  // You can test this method if access token fails
  const CLIENT_ID = 'SQnrhIQSzwMuYUQH_g83HcjSvO099DpmarelOCyIHa4AUEJCdz8FJKV_KhFyfa2W';
  const CLIENT_SECRET = 'dWbymrom0kwWIp9ngnaQOjpum6_2XxNZL6dWXDwYzGfFdfpdd3Fmb5xFnXeRDVqmA04BV18gq2AH52GHq0qEiQ';
  
  try {
    // Test using client credentials
    const testUrl = `https://api.genius.com/search?q=test&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'LyricSense/1.0',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Client credentials authentication working',
        method: 'client_credentials',
        hasResults: data.response?.hits?.length > 0
      });
    } else {
      return res.status(response.status).json({
        success: false,
        method: 'client_credentials',
        error: data
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
