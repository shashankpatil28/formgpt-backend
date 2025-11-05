// File: formgpt-backend/config/index.js
import 'dotenv/config';

// Export all environment variables
export const config = {
  port: process.env.PORT || 3000,
  openRouterKey: process.env.OPENROUTER_API_KEY,
  
  // Add your site info for OpenRouter analytics (optional but recommended)
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  siteTitle: process.env.SITE_TITLE || 'FormGPT Backend'
};