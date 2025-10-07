// frontend/src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
  const [hasMore, setHasMore] = useState(true);

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
      
      if (state.displayMode === 'gallery' && append) {
        setGallerySongs(prev => [...prev, ...newSongs]);
      } else if (state.displayMode === 'gallery') {
        setGallerySongs(newSongs);
      } else {
        setState(prev => ({ ...prev, songs: newSongs }));
      }
      
      // Check if we have more songs to load (for gallery view)
      if (state.displayMode === 'gallery') {
        setHasMore(newSongs.length === 20); // If we got less than pageSize, we've reached the end
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.seed, state.language, state.averageLikes, state.displayMode]);

  useEffect(() => {
    if (state.displayMode === 'table') {
      fetchSongs(state.currentPage);
    } else {
      // Reset gallery when switching to gallery mode or when parameters change
      setGallerySongs([]);
      setHasMore(true);
      fetchSongs(1);
    }
  }, [state.seed, state.language, state.averageLikes, state.displayMode, state.currentPage]);

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
    setState(prev => ({ ...prev, seed: Math.random().toString(36).substring(2, 15), currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const handleLoadMore = () => {
    if (!state.isLoading && hasMore) {
      const nextPage = Math.floor(gallerySongs.length / 20) + 1;
      fetchSongs(nextPage, true);
    }
  };

  return (
    <div className="app">
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