// frontend/src/services/api.ts
import axios from 'axios';
import { Song, GenerationParams } from '../types';

const API_BASE = 'http://localhost:3001/api';

export const musicApi = {
  getSongs: async (params: GenerationParams): Promise<Song[]> => {
    const response = await axios.get(`${API_BASE}/songs`, { params });
    return response.data;
  },

  getAudioPreview: async (seed: string): Promise<string> => {
    const response = await axios.get(`${API_BASE}/audio/${seed}`);
    return response.data.audio;
  }
};