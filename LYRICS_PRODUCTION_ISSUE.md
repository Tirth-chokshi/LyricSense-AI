# Production Lyrics Issue - Specific Solution Guide

## Issue Analysis
Your LyricSense app works perfectly in development but fails to fetch lyrics in production with 404 errors. The error shows:
- Environment variables are properly set (`hasLyricAPI: true`, `hasPrompts: true`)
- The APIs are accessible and functioning
- The specific issue is with lyrics fetching from Genius API

## Root Cause
This is a **network connectivity issue** between your production environment and the Genius API service. Common causes:

### 1. **Production Environment Network Restrictions**
- Many hosting platforms (Vercel, Netlify, etc.) have different network policies than localhost
- Some platforms block or limit external API calls
- Firewalls may block certain domains or IP ranges

### 2. **Genius API Production Limitations**
- Different rate limits for production vs development
- IP-based restrictions or geolocation blocking
- API key validation differences

### 3. **DNS/Network Configuration**
- Production environment may not resolve `api.genius.com` properly
- Different network routes in production

## Immediate Diagnostic Steps

### Step 1: Test Your Diagnostic Endpoints
Access these URLs in production to get detailed information:

**Health Check:**
```
https://your-domain.com/api/health
```

**Lyrics-Specific Test:**
```
https://your-domain.com/api/test-lyrics?songTitle=People You Know&artistName=Selena Gomez
```

### Step 2: Check Production Logs
Look for specific network errors in your production deployment logs.

## Solutions (In Order of Likelihood)

### Solution 1: Verify Genius API Access from Production
Test if your production environment can reach Genius API:

1. **Check the health endpoint** - it will test connectivity to `api.genius.com`
2. **Look for these specific errors:**
   - `ENOTFOUND api.genius.com` → DNS resolution issue
   - `ECONNREFUSED` → Connection blocked
   - `timeout` → Network timeout
   - `403/401` → API key issue

### Solution 2: Platform-Specific Configuration

#### For Vercel:
```json
// vercel.json
{
  "functions": {
    "src/pages/api/*.js": {
      "maxDuration": 30,
      "timeout": 30
    }
  }
}
```

#### For Netlify:
```toml
# netlify.toml
[functions]
  timeout = 30
  external_node_modules = ["axios", "cheerio-without-node-native"]
```

### Solution 3: Genius API Key Verification
Your LYRIC_API key might have restrictions:

1. **Check your Genius API dashboard:**
   - Verify the key is active
   - Check usage limits and quotas
   - Look for IP restrictions or domain restrictions

2. **Test the key manually:**
```bash
curl -H "Authorization: Bearer YOUR_LYRIC_API_KEY" \
     "https://api.genius.com/search?q=People%20You%20Know%20Selena%20Gomez"
```

### Solution 4: Implement Retry Logic and Fallbacks
The enhanced APIs I created include:
- Automatic retry on network failures
- Multiple search strategies
- Better error reporting
- Fallback options

### Solution 5: Alternative Lyrics Sources
If Genius API continues to fail in production, consider:
- Using multiple lyrics APIs as fallbacks
- Implementing lyrics caching
- Using a different lyrics service for production

## Quick Fixes to Try

### 1. Increase Timeout Values
Add to your `axios` calls in the lyrics module:
```javascript
timeout: 30000, // 30 seconds instead of default
```

### 2. Add User-Agent Header
Some APIs require proper User-Agent headers in production:
```javascript
headers: {
  'User-Agent': 'LyricSense/1.0 (your-domain.com)',
  'Authorization': 'Bearer ' + apiKey
}
```

### 3. Environment Variable Double-Check
Ensure your production environment variables are exactly correct:
- No extra spaces
- Correct API key format
- Case-sensitive variable names

## Testing Strategy

1. **Run the health check** to identify the specific network issue
2. **Use the lyrics test endpoint** with different songs to see if it's song-specific
3. **Check if the issue is consistent** or intermittent
4. **Test from different locations** if possible

## Expected Results from Diagnostics

The diagnostic endpoints will tell you:
- ✅ **Network accessible**: If `api.genius.com` is reachable
- ✅ **API key valid**: If authentication works
- ✅ **Module imports**: If all code modules load correctly
- ❌ **Specific failure point**: Exactly where the lyrics fetch fails

## Next Steps

1. **Access your health check endpoint** first
2. **Run the lyrics test** with the same song that's failing
3. **Check the enhanced error messages** in your app - they now provide detailed debugging info
4. **Share the diagnostic results** - the output will show exactly what's failing

The enhanced error handling I've implemented will give you specific guidance based on the type of failure detected.

## Contact Platform Support

If diagnostics show network connectivity issues:
- **Vercel**: Check if external API calls are blocked
- **Netlify**: Verify function networking permissions  
- **Other platforms**: Ask about external API access policies

The diagnostic endpoints will provide exact error details to share with platform support.
