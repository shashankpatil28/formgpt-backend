// File: formgpt-backend/api/controllers/form.controller.js
import { formService } from '../services/form.service.js';

/**
 * Handles the request to generate a form schema.
 */
export async function generateForm(req, res, next) {
  try {
    const { prompt } = req.body;

    // 1. Basic Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ 
        message: 'Invalid input: "prompt" is required and must be a non-empty string.' 
      });
    }

    // 2. Call the service layer
    const schema = await formService.generateFormSchema(prompt);

    // 3. Send the successful response
    res.status(200).json(schema);

  } catch (error) {
    // 4. Pass errors to the global error handler
    next(error);
  }
}