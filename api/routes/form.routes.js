// File: formgpt-backend/api/routes/form.routes.js
import { Router } from 'express';
import { generateForm } from '../controllers/form.controller.js';

const router = Router();

router.post('/generate', generateForm);

export default router;