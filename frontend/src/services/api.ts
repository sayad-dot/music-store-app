// frontend/src/services/api.ts
import axios from 'axios';
import { Song, GenerationParams } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

console.log('API_BASE URL:', API_BASE);

export const musicApi = {
  getSongs: async (params: GenerationParams): Promise<Song[]> => {
    try {
      const response = await axios.get(`${API_BASE}/api/songs`, { 
        params,
        timeout: 10000 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw new Error('Failed to fetch songs. Please check if the backend is running.');
    }
  },

  getAudioPreview: async (seed: string): Promise<string> => {
    try {
      const response = await axios.get(`${API_BASE}/api/audio/${seed}`, {
        timeout: 10000
      });
      return response.data.audio;
    } catch (error) {
      console.error('Error fetching audio preview:', error);
      throw new Error('Failed to load audio preview.');
    }
  }
};