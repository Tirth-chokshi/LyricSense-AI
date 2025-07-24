# Production Error Troubleshooting Guide

Your LyricSense app is working in development but failing in production with 500 errors from the Keywords and Analysis APIs. Here's a systematic approach to debug and fix this issue.

## Quick Diagnostic Steps

### 1. Check Debug Endpoint
First, access your debug endpoint to get detailed diagnostic information:

**In Production:**
```
https://your-domain.com/api/debug?secret=YOUR_DEBUG_SECRET
```

**In Development:**
```
http://localhost:3000/api/debug
```

### 2. Environment Variables Check
The most common cause of this issue is missing or incorrect environment variables in production.

**Required Environment Variables:**
- `LYRIC_API` - Your lyrics API key
- `GROQ_API` - Your Groq API key  
- `KEYWORD_PROMPT` - The prompt for keyword analysis
- `ANALYSIS_PROMPT` - The prompt for detailed analysis
- `DEBUG_SECRET` (optional) - For production debugging

**Check in your deployment platform:**

#### Vercel:
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Ensure all variables are set for Production environment
4. Click "Redeploy" after adding/updating variables

#### Netlify:
1. Go to Site settings → Environment variables
2. Add all required variables
3. Redeploy your site

#### Other platforms:
- Check your platform's documentation for environment variable configuration

### 3. API Key Validation
Verify your API keys are working:

**Test Groq API:**
```bash
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma2-9b-it",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

**Test Lyrics API:**
- Verify your lyrics API key is valid and has sufficient quota
- Check if the API service is accessible from your production environment

## Common Production Issues

### 1. Environment Variable Case Sensitivity
- Ensure environment variable names match exactly
- Some platforms are case-sensitive

### 2. Build-time vs Runtime Variables
- In Next.js, some variables need to be available at build time
- If using `NEXT_PUBLIC_` prefix, the variables are exposed to the client

### 3. Network Connectivity
Production environments may have different network policies:
- Firewall restrictions
- Outbound connection limits
- Different DNS resolution

### 4. Memory/Timeout Limits
- Production may have stricter memory limits
- API timeouts might be different
- Check your platform's function timeout settings

## Debugging Steps

### 1. Check Logs
Look at your production logs for detailed error messages:

**Vercel:**
```bash
vercel logs your-project-name --follow
```

**Netlify:**
Check Functions logs in the dashboard

### 2. Test Individual Components
Use the debug endpoint to check:
- Module imports
- Environment variables
- Network connectivity
- Configuration files

### 3. Gradual Deployment
If possible, test in a staging environment that mirrors production

### 4. API Response Analysis
The enhanced error handling now provides detailed debug information in the UI. Look for:
- Environment configuration errors
- Module import failures
- Network connectivity issues
- API service availability

## Enhanced Error Messages

The updated code now provides detailed error context including:
- Server response details
- Environment variable status
- Import module status
- Network connectivity status
- Timestamp and environment information

## Quick Fixes

### 1. Redeploy with Environment Variables
```bash
# For Vercel
vercel env add LYRIC_API
vercel env add GROQ_API
vercel env add KEYWORD_PROMPT
vercel env add ANALYSIS_PROMPT
vercel --prod
```

### 2. Check API Service Status
- Verify Groq API service status
- Check lyrics API service availability
- Ensure API keys haven't expired

### 3. Platform-Specific Configurations

#### Vercel Function Configuration
Add to `vercel.json`:
```json
{
  "functions": {
    "src/pages/api/*.js": {
      "maxDuration": 30
    }
  }
}
```

#### Netlify Function Configuration
Add to `netlify.toml`:
```toml
[functions]
  timeout = 30
  node_bundler = "nft"
```

## Next Steps

1. **Access the debug endpoint** to get detailed diagnostic information
2. **Check environment variables** in your production deployment
3. **Verify API keys** are valid and have sufficient quota
4. **Check production logs** for specific error messages
5. **Test network connectivity** from your production environment

The enhanced error handling will now show you exactly what's failing in production, making it easier to identify and fix the root cause.

## Contact Support

If you continue to have issues after checking these items, the debug information from the error messages will help identify the specific problem area.
