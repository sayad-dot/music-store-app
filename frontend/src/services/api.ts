// frontend/src/services/api.ts
import axios from 'axios';
import { Song, GenerationParams } from '../types';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

console.log('API_BASE URL:', API_BASE); // For debugging

export const musicApi = {
  getSongs: async (params: GenerationParams): Promise<Song[]> => {
    try {
      const response = await axios.get(`${API_BASE}/api/songs`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw error;
    }
  },

  getAudioPreview: async (seed: string): Promise<string> => {
    try {
      const response = await axios.get(`${API_BASE}/api/audio/${seed}`);
      return response.data.audio;
    } catch (error) {
      console.error('Error fetching audio preview:', error);
      throw error;
    }
  }
};