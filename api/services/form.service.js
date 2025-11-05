// File: formgpt-backend/api/services/form.service.js
import { config } from '../../config/index.js';
import { MASTER_PROMPT } from '../utils/prompt.util.js';

/**
 * Calls the OpenRouter API to generate a form schema.
 * @param {string} userPrompt The user's text description of the form.
 * @returns {Promise<object>} The parsed JSON schema object.
 */
async function generateFormSchema(userPrompt) {
  if (!config.openRouterKey) {
    throw new Error('OPENROUTER_API_KEY is not set. Please check your .env file.');
  }

  const messages = [
    { role: 'system', content: MASTER_PROMPT },
    { role: 'user', content: userPrompt }
  ];

  let rawAiResponse = ''; // Variable to store the raw string for debugging

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': config.siteUrl, // Optional, for analytics
        'X-Title': config.siteTitle     // Optional, for analytics
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // Using the model you specified
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    rawAiResponse = data.choices[0].message.content;

    // --- NEW FIX ---
    // Clean the AI response to remove markdown fences
    // Find the first '[' and the last ']'
    const startIndex = rawAiResponse.indexOf('[');
    const endIndex = rawAiResponse.lastIndexOf(']');

    let jsonString = '';

    if (startIndex !== -1 && endIndex !== -1) {
      jsonString = rawAiResponse.substring(startIndex, endIndex + 1);
    } else {
      // Fallback: If no array, maybe it's an object?
      const startObjIndex = rawAiResponse.indexOf('{');
      const endObjIndex = rawAiResponse.lastIndexOf('}');
      if (startObjIndex !== -1 && endObjIndex !== -1) {
        jsonString = rawAiResponse.substring(startObjIndex, endObjIndex + 1);
      } else {
        // No valid JSON structure found, throw an error
        throw new Error('No valid JSON array or object found in AI response.');
      }
    }
    // --- END NEW FIX ---

    // The most important step: Parse the CLEANED string
    const schema = JSON.parse(jsonString);
    return schema;

  } catch (error) {
    console.error('Error in generateFormSchema:', error);
    if (error instanceof SyntaxError) {
      // This means the AI gave us invalid JSON
      console.error('--- FAILED TO PARSE (Original AI Response) ---');
      console.error(rawAiResponse);
      console.error('-----------------------------------------------');
      throw new Error('Failed to parse AI response. The generated JSON was invalid.');
    }
    // Re-throw other errors to be caught by the controller
    throw error; 
  }
}

// Export all service functions
export const formService = {
  generateFormSchema
};