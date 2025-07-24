// Simple health check endpoint for production debugging
export default async function handler(req, res) {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    status: 'checking...'
  };

  let allPassed = true;
  const issues = [];

  // Check 1: Environment Variables
  if (!process.env.LYRIC_API) {
    issues.push('LYRIC_API environment variable is missing');
    allPassed = false;
  }

  if (!process.env.GROQ_API) {
    issues.push('GROQ_API environment variable is missing');
    allPassed = false;
  }

  // Check 2: Module Imports
  try {
    const { LYRIC_API, GROQ_API } = require('../../lib/config');
    if (!LYRIC_API || !GROQ_API) {
      issues.push('Config module not loading environment variables properly');
      allPassed = false;
    }
  } catch (error) {
    issues.push(`Config module import failed: ${error.message}`);
    allPassed = false;
  }

  try {
    const { keywordsgetGroqChatCompletion } = require('../../lib/action');
    if (typeof keywordsgetGroqChatCompletion !== 'function') {
      issues.push('Keywords function not available');
      allPassed = false;
    }
  } catch (error) {
    issues.push(`Action module import failed: ${error.message}`);
    allPassed = false;
  }

  // Check 3: Network connectivity (basic)
  try {
    // This will throw if DNS resolution fails
    await new Promise((resolve, reject) => {
      const dns = require('dns');
      dns.lookup('api.groq.com', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (error) {
    issues.push(`Network connectivity issue: ${error.message}`);
    allPassed = false;
  }

  checks.status = allPassed ? 'healthy' : 'issues_detected';
  checks.issues = issues;
  checks.healthy = allPassed;

  // Return appropriate status code
  return res.status(allPassed ? 200 : 500).json(checks);
}
