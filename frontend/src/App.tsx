// frontend/src/App.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Song, AppState, GenerationParams } from './types';
import { musicApi } from './services/api';
import Toolbar from './components/Toolbar';
import TableView from './components/TableView';
import GalleryView from './components/GalleryView';
import './App.css';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    songs: [],
    language: 'en-US',
    seed: Math.random().toString(36).substring(2, 15),
    averageLikes: 0,
    displayMode: 'table',
    currentPage: 1,
    isLoading: false
  });

  const [gallerySongs, setGallerySongs] = useState<Song[]>([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Track previous parameters to detect changes
  const prevParamsRef = useRef({ 
    seed: state.seed, 
    language: state.language, 
    averageLikes: state.averageLikes 
  });

  const fetchSongs = useCallback(async (page: number, append: boolean = false) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const params: GenerationParams = {
      seed: state.seed,
      language: state.language,
      averageLikes: state.averageLikes,
      page: page,
      pageSize: state.displayMode === 'table' ? 10 : 20
    };

    try {
      const newSongs = await musicApi.getSongs(params);
      
      if (state.displayMode === 'gallery') {
        if (append) {
          setGallerySongs(prev => [...prev, ...newSongs]);
        } else {
          setGallerySongs(newSongs);
          setGalleryPage(1);
        }
        setHasMore(newSongs.length === 20);
      } else {
        setState(prev => ({ ...prev, songs: newSongs }));
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.seed, state.language, state.averageLikes, state.displayMode]);

  // Effect for table view
  useEffect(() => {
    if (state.displayMode === 'table') {
      fetchSongs(state.currentPage);
    }
  }, [state.currentPage, state.displayMode]);

  // Effect for gallery view and parameter changes
  useEffect(() => {
    const paramsChanged = 
      prevParamsRef.current.seed !== state.seed ||
      prevParamsRef.current.language !== state.language ||
      prevParamsRef.current.averageLikes !== state.averageLikes;

    if (paramsChanged || state.displayMode === 'gallery') {
      // Reset gallery when parameters change
      setGallerySongs([]);
      setGalleryPage(1);
      setHasMore(true);
      
      if (state.displayMode === 'gallery') {
        fetchSongs(1, false);
      }
      
      // Update previous params
      prevParamsRef.current = {
        seed: state.seed,
        language: state.language,
        averageLikes: state.averageLikes
      };
    }
  }, [state.seed, state.language, state.averageLikes, state.displayMode, fetchSongs]);

  const handleLanguageChange = (language: string) => {
    setState(prev => ({ ...prev, language, currentPage: 1 }));
  };

  const handleSeedChange = (seed: string) => {
    setState(prev => ({ ...prev, seed, currentPage: 1 }));
  };

  const handleAverageLikesChange = (averageLikes: number) => {
    setState(prev => ({ ...prev, averageLikes, currentPage: 1 }));
  };

  const handleDisplayModeChange = (displayMode: 'table' | 'gallery') => {
    setState(prev => ({ ...prev, displayMode, currentPage: 1 }));
  };

  const handleRandomSeed = () => {
    setState(prev => ({ 
      ...prev, 
      seed: Math.random().toString(36).substring(2, 15), 
      currentPage: 1 
    }));
  };

  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const handleLoadMore = () => {
    if (!state.isLoading && hasMore) {
      const nextPage = galleryPage + 1;
      setGalleryPage(nextPage);
      fetchSongs(nextPage, true);
    }
  };

  return (
    <div className="app">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🎵 Music Store</h1>
      <Toolbar
        language={state.language}
        seed={state.seed}
        averageLikes={state.averageLikes}
        displayMode={state.displayMode}
        onLanguageChange={handleLanguageChange}
        onSeedChange={handleSeedChange}
        onAverageLikesChange={handleAverageLikesChange}
        onDisplayModeChange={handleDisplayModeChange}
        onRandomSeed={handleRandomSeed}
      />
      
      {state.displayMode === 'table' ? (
        <TableView
          songs={state.songs}
          currentPage={state.currentPage}
          onPageChange={handlePageChange}
          isLoading={state.isLoading}
        />
      ) : (
        <GalleryView
          songs={gallerySongs}
          onLoadMore={handleLoadMore}
          isLoading={state.isLoading}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};

export default App;