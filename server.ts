import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleCopilotRequest, handleRecommendationRequest } from './src/api/router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// API Endpoints
app.post('/api/ai/copilot', async (req, res) => {
  try {
    const result = await handleCopilotRequest(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/recommend', async (req, res) => {
  try {
    const result = await handleRecommendationRequest(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'InduSense AI Neural Pipeline v2.8' });
});

// Serve static assets in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`InduSense AI Server listening on port ${PORT}`);
});
