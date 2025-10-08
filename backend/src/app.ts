// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import { MusicController } from './controllers/MusicController';

const app = express();
const port = process.env.PORT || 3001;

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;