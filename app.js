// File: formgpt-backend/app.js
import express from 'express';
import cors from 'cors';
import path from 'path'; // Import path
import { fileURLToPath } from 'url'; // Import url utilities

import formRoutes from './api/routes/form.routes.js';
import { errorHandler } from './api/middleware/errorHandler.js';

// --- Setup __dirname for ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// static middlewares
app.use(cors());
app.use(express.json());

// --- Serve Static Files ---
// Point express to our new 'public' folder
// Any requests for files in /public will be served
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to FormGPT Backend API' });
});

// Mount the form builder routes
app.use('/api/v1/form-builder', formRoutes);

// --- Error Handling ---

// Custom 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Error: Resource not found.' });
});

// Global error handler
app.use(errorHandler);

export { app };