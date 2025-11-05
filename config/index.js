// File: formgpt-backend/config/index.js
import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  openRouterKey: process.env.OPENROUTER_API_KEY,
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  siteTitle: process.env.SITE_TITLE || 'FormGPT Backend',

  // Router model to be used
  OpenRouterModel: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
};