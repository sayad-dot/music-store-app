// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import { MusicController } from './controllers/MusicController';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const musicController = new MusicController();

// Routes
app.get('/api/songs', musicController.getSongs);
app.get('/api/audio/:seed', musicController.getAudioPreview);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});