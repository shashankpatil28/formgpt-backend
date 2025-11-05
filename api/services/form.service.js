// File: formgpt-backend/api/services/form.service.js
import { config } from '../../config/index.js';
import { formSchema } from '../utils/formSchema.js';
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

  let rawAiResponse = '';
  let jsonString = ''; 

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': config.siteUrl,
        'X-Title': config.siteTitle     
      },
      body: JSON.stringify({
        model: config.OpenRouterModel,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    rawAiResponse = data.choices[0].message.content;

    // --- 1. The "Cleaner" ---
    const startIndex = rawAiResponse.indexOf('[');
    const endIndex = rawAiResponse.lastIndexOf(']');

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

    // --- 2. The "Parser" ---
    const parsedSchema = JSON.parse(jsonString);

    // --- 3. The "Validator" ---
    const validationResult = formSchema.safeParse(parsedSchema);

    if (!validationResult.success) {
      // Throw a specific error that our handler can catch
      const errorMessage = validationResult.error.errors.map(e => `[${e.path.join('.')}] ${e.message}`).join('; ');
      throw new Error(`Zod Validation Failed: ${errorMessage}`);
    }

    // --- 4. The "Janitor" (Future Step) ---
    
    return validationResult.data;

  } catch (error) {
    console.error('Error in generateFormSchema:', error);
    
    if (error instanceof SyntaxError) {
      // This means JSON.parse() failed
      console.error('--- FAILED TO PARSE (Original AI Response) ---');
      console.error(rawAiResponse);
      console.error('-----------------------------------------------');
      throw new Error('Failed to parse AI response. The generated JSON was invalid.');
    }
    
    if (error.message.startsWith('Zod Validation Failed:')) {
      // This means our new Validator caught a schema error
      console.error('--- ZOD VALIDATION FAILED ---');
      console.error(error.message); // The formatted error
      console.error('--- Original Parsed JSON ---');
      console.error(JSON.stringify(JSON.parse(jsonString), null, 2)); // Log the object that failed
      console.error('-----------------------------');
      throw new Error(`AI generated an invalid schema: ${error.message}`);
    }

    throw error; 
  }
}

// Export all service functions
export const formService = {
  generateFormSchema
};