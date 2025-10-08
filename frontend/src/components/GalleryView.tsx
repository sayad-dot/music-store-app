// frontend/src/components/GalleryView.tsx
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Song } from '../types';
import SongDetail from './SongDetail';

interface GalleryViewProps {
  songs: Song[];
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

const GalleryView: React.FC<GalleryViewProps> = ({
  songs,
  onLoadMore,
  isLoading,
  hasMore
}) => {
  const [expandedSong, setExpandedSong] = useState<number | null>(null);

  return (
    <div className="gallery-view">
      <InfiniteScroll
        pageStart={0}
        loadMore={onLoadMore}
        hasMore={hasMore && !isLoading}
        loader={<div key="loader" className="loading">Loading more songs...</div>}
        useWindow={true}
      >
        <div className="songs-grid">
          {songs.map((song) => (
            <div key={`song-${song.id}`} className="song-card">
              <div className="card-header">
                <img src={song.coverImage} alt={`Cover for ${song.title}`} />
                <div className="card-info">
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                  <p className="album">{song.album}</p>
                  <p className="genre">{song.genre}</p>
                  <p className="likes">❤️ {song.likes}</p>
                </div>
              </div>
              
              <button
                className="expand-btn"
                onClick={() => setExpandedSong(expandedSong === song.id ? null : song.id)}
              >
                {expandedSong === song.id ? 'Collapse' : 'Expand'}
              </button>

              {expandedSong === song.id && (
                <div className="card-detail">
                  <SongDetail song={song} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {!hasMore && songs.length > 0 && (
        <div className="end-message">
          <p>All songs loaded! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default GalleryView;