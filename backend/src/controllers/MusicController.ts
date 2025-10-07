// backend/src/controllers/MusicController.ts
import { Request, Response } from 'express';
import { MusicGeneratorService } from '../services/MusicGeneratorService';

export class MusicController {
  private musicService: MusicGeneratorService;

  constructor() {
    this.musicService = new MusicGeneratorService();
  }

  getSongs = (req: Request, res: Response) => {
    try {
      const { seed, language, averageLikes, page, pageSize } = req.query;
      
      const params = {
        seed: seed as string || 'default',
        language: language as string || 'en-US',
        averageLikes: parseFloat(averageLikes as string) || 0,
        page: parseInt(page as string) || 1,
        pageSize: parseInt(pageSize as string) || 10
      };

      const songs = this.musicService.generateSongs(params);
      res.json(songs);
    } catch (error) {
      console.error('Error generating songs:', error);
      res.status(500).json({ error: 'Failed to generate songs' });
    }
  };

  getAudioPreview = (req: Request, res: Response) => {
    try {
      const { seed } = req.params;
      res.json({ audio: `preview for ${seed}` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate audio' });
    }
  };
}