// frontend/src/services/api.ts
import axios from 'axios';
import { Song, GenerationParams } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

console.log('API_BASE URL:', API_BASE);

export const musicApi = {
  getSongs: async (params: GenerationParams): Promise<Song[]> => {
    try {
      console.log('🔄 Fetching songs...');
      
      const response = await axios.get(`${API_BASE}/api/songs`, { 
        params,
        timeout: 120000, // ⬅️ INCREASED TO 60 SECONDS
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Songs received successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching songs:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: error.config?.url
      });
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The server is taking too long to generate songs. Please try again.');
      }
      throw new Error('Failed to fetch songs. Please check if the backend is running.');
    }
  },

  getAudioPreview: async (seed: string): Promise<string> => {
    try {
      const response = await axios.get(`${API_BASE}/api/audio/${seed}`, {
        timeout: 120000 // ⬅️ INCREASED TO 60 SECONDS
      });
      return response.data.audio;
    } catch (error) {
      console.error('Error fetching audio preview:', error);
      throw new Error('Failed to load audio preview.');
    }
  }
};