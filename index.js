// File: formgpt-backend/index.js
import { app } from './app.js';
import { config } from './config/index.js';

app.listen(config.port, () => {
  console.log(`🚀 FormGPT Backend (ESM) listening on http://localhost:${config.port}`);
});