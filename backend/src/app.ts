// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import { MusicController } from './controllers/MusicController';

const app = express();

// Railway provides PORT via environment variable
const port = parseInt(process.env.PORT || '3001', 10);

// Configure CORS to allow requests from your Vercel frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://music-store-app.vercel.app',
    'https://music-store-app-*.vercel.app' // For preview deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const musicController = new MusicController();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Music Store API is running' });
});

// Routes
app.get('/api/songs', musicController.getSongs);
app.get('/api/audio/:seed', musicController.getAudioPreview);

// Listen on 0.0.0.0 to accept external connections
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;