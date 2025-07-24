export default async function handler(req, res) {
  // Only allow this in development or with a secret key
  const isDev = process.env.NODE_ENV === 'development';
  const hasSecretKey = req.query.secret === process.env.DEBUG_SECRET;
  
  if (!isDev && !hasSecretKey) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      platform: process.platform,
      nodeVersion: process.version,
      
      // Environment variables (without exposing sensitive values)
      envVars: {
        LYRIC_API: !!process.env.LYRIC_API,
        GROQ_API: !!process.env.GROQ_API,
        KEYWORD_PROMPT: !!process.env.KEYWORD_PROMPT,
        ANALYSIS_PROMPT: !!process.env.ANALYSIS_PROMPT,
        LYRIC_API_length: process.env.LYRIC_API?.length || 0,
        GROQ_API_length: process.env.GROQ_API?.length || 0,
      },
      
      // Configuration files check
      config: {
        hasNextConfig: true, // Assume it exists since we're running
        hasPackageJson: true,
      },
      
      // Module imports test
      moduleTests: {}
    };

    // Test critical imports
    try {
      const { LYRIC_API, GROQ_API } = await import('@/lib/config');
      diagnostics.moduleTests.config = { 
        success: true, 
        LYRIC_API: !!LYRIC_API, 
        GROQ_API: !!GROQ_API 
      };
    } catch (error) {
      diagnostics.moduleTests.config = { 
        success: false, 
        error: error.message 
      };
    }

    try {
      const { keywordsgetGroqChatCompletion, analysisgetGroqChatCompletion } = await import('@/lib/action');
      diagnostics.moduleTests.action = { 
        success: true, 
        hasKeywordsFunction: typeof keywordsgetGroqChatCompletion === 'function',
        hasAnalysisFunction: typeof analysisgetGroqChatCompletion === 'function'
      };
    } catch (error) {
      diagnostics.moduleTests.action = { 
        success: false, 
        error: error.message 
      };
    }

    try {
      const getLyrics = await import('@/misc/getLyrics');
      diagnostics.moduleTests.getLyrics = { 
        success: true, 
        isFunction: typeof getLyrics.default === 'function'
      };
    } catch (error) {
      diagnostics.moduleTests.getLyrics = { 
        success: false, 
        error: error.message 
      };
    }

    try {
      const { KEYWORD_PROMPT, ANALYSIS_PROMPT } = await import('@/lib/prompts');
      diagnostics.moduleTests.prompts = { 
        success: true, 
        hasKeywordPrompt: !!KEYWORD_PROMPT,
        hasAnalysisPrompt: !!ANALYSIS_PROMPT,
        keywordPromptLength: KEYWORD_PROMPT?.length || 0,
        analysisPromptLength: ANALYSIS_PROMPT?.length || 0
      };
    } catch (error) {
      diagnostics.moduleTests.prompts = { 
        success: false, 
        error: error.message 
      };
    }

    // Network connectivity test (basic)
    try {
      // Test if we can make a basic HTTP request
      const response = await fetch('https://api.github.com', { 
        method: 'HEAD',
        timeout: 5000 
      });
      diagnostics.networkTest = {
        success: response.ok,
        status: response.status
      };
    } catch (error) {
      diagnostics.networkTest = {
        success: false,
        error: error.message
      };
    }

    return res.status(200).json(diagnostics);

  } catch (error) {
    return res.status(500).json({
      error: 'Diagnostic failed',
      message: error.message,
      stack: isDev ? error.stack : undefined
    });
  }
}
