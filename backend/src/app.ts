// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import { MusicController } from './controllers/MusicController';

const app = express();

const port = parseInt(process.env.PORT || '3001', 10);

// Updated CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://music-store-app.vercel.app',
      'https://music-store-app-knig.vercel.app',
      /\.vercel\.app$/ // This will allow all Vercel preview deployments
    ];
    
    // Check if the origin matches any allowed pattern
    if (allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return origin === pattern;
      } else if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return false;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

const musicController = new MusicController();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Music Store API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.get('/api/songs', musicController.getSongs);
app.get('/api/audio/:seed', musicController.getAudioPreview);

// Handle preflight requests
app.options('*', cors(corsOptions));

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Allowed CORS origins:', [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://music-store-app.vercel.app',
    'https://music-store-app-knig.vercel.app',
    'All *.vercel.app domains'
  ]);
});

export default app;