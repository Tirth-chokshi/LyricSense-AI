// Simple health check endpoint for production debugging
export default async function handler(req, res) {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    status: 'checking...'
  };

  let allPassed = true;
  const issues = [];
  const warnings = [];

  // Check 1: Environment Variables
  if (!process.env.LYRIC_API) {
    issues.push('LYRIC_API environment variable is missing');
    allPassed = false;
  } else {
    checks.lyricApiLength = process.env.LYRIC_API.length;
    if (process.env.LYRIC_API.length < 10) {
      warnings.push('LYRIC_API seems too short - might be invalid');
    }
  }

  if (!process.env.GROQ_API) {
    issues.push('GROQ_API environment variable is missing');
    allPassed = false;
  } else {
    checks.groqApiLength = process.env.GROQ_API.length;
    if (process.env.GROQ_API.length < 50) {
      warnings.push('GROQ_API seems too short - might be invalid');
    }
  }

  // Check 2: Module Imports
  try {
    const { LYRIC_API, GROQ_API } = require('../../lib/config');
    if (!LYRIC_API || !GROQ_API) {
      issues.push('Config module not loading environment variables properly');
      allPassed = false;
    }
    checks.configLoaded = true;
  } catch (error) {
    issues.push(`Config module import failed: ${error.message}`);
    allPassed = false;
    checks.configLoaded = false;
  }

  try {
    const { keywordsgetGroqChatCompletion } = require('../../lib/action');
    if (typeof keywordsgetGroqChatCompletion !== 'function') {
      issues.push('Keywords function not available');
      allPassed = false;
    }
    checks.actionFunctionsLoaded = true;
  } catch (error) {
    issues.push(`Action module import failed: ${error.message}`);
    allPassed = false;
    checks.actionFunctionsLoaded = false;
  }

  try {
    const getLyrics = require('../../misc/getLyrics');
    if (typeof getLyrics.default !== 'function') {
      issues.push('GetLyrics function not available');
      allPassed = false;
    }
    checks.lyricsModuleLoaded = true;
  } catch (error) {
    issues.push(`Lyrics module import failed: ${error.message}`);
    allPassed = false;
    checks.lyricsModuleLoaded = false;
  }

  // Check 3: Network connectivity
  const networkChecks = [];
  
  try {
    // Check Groq API connectivity
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'HEAD',
      timeout: 5000
    });
    networkChecks.push({
      service: 'Groq API',
      status: response.status,
      accessible: response.ok
    });
  } catch (error) {
    networkChecks.push({
      service: 'Groq API',
      status: 'error',
      accessible: false,
      error: error.message
    });
    warnings.push(`Groq API not accessible: ${error.message}`);
  }

  try {
    // Check Genius API (common lyrics source)
    const response = await fetch('https://api.genius.com/', {
      method: 'HEAD',
      timeout: 5000
    });
    networkChecks.push({
      service: 'Genius API',
      status: response.status,
      accessible: response.ok
    });
  } catch (error) {
    networkChecks.push({
      service: 'Genius API',
      status: 'error',
      accessible: false,
      error: error.message
    });
    warnings.push(`Genius API not accessible: ${error.message}`);
  }

  checks.networkChecks = networkChecks;
  checks.status = allPassed ? 'healthy' : 'issues_detected';
  checks.issues = issues;
  checks.warnings = warnings;
  checks.healthy = allPassed;

  // Return appropriate status code
  return res.status(allPassed ? 200 : 500).json(checks);
}
