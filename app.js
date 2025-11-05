// File: formgpt-backend/app.js
import express from 'express';
import cors from 'cors';
import formRoutes from './api/routes/form.routes.js';
import { errorHandler } from './api/middleware/errorHandler.js';

const app = express();
-

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// --- API Routes ---

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Mount the form builder routes
app.use('/api/v1/form-builder', formRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to FormGPT Backend API' });
});

// --- Error Handling ---

// Custom 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Error: Resource not found.' });
});

// Global error handler
app.use(errorHandler);

export { app };