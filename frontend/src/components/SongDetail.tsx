// frontend/src/components/SongDetail.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Song } from '../types';

interface SongDetailProps {
  song: Song;
}

const SongDetail: React.FC<SongDetailProps> = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyric, setCurrentLyric] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentLyric(prev => {
          if (prev >= song.lyrics.length - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, song.lyrics.length]);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setAudioError(null);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioError('Failed to play audio preview');
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 5; // Assume 5s for generated audio
      const lyricIndex = Math.floor((currentTime / duration) * song.lyrics.length);
      setCurrentLyric(Math.min(lyricIndex, song.lyrics.length - 1));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentLyric(0);
  };

  const handleAudioError = () => {
    setAudioError('Audio preview not available');
    setIsPlaying(false);
  };

  return (
    <div className="song-detail">
      <div className="detail-section">
        <h4>Album Cover</h4>
        <img src={song.coverImage} alt="Album cover" className="detail-cover" />
      </div>

      <div className="detail-section">
        <h4>Audio Preview</h4>
        <audio
          ref={audioRef}
          src={song.audioPreview}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleAudioError}
          preload="metadata"
        />
        <div className="audio-controls">
          <button 
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlay}
            disabled={!!audioError}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <div className="audio-info">
            <small>5-second melody • Generated from seed</small>
            {audioError && <div className="audio-error">{audioError}</div>}
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h4>Reviews</h4>
        {song.reviews.map((review, index) => (
          <div key={index} className="review">
            {review}
          </div>
        ))}
      </div>

      <div className="detail-section">
        <h4>Lyrics</h4>
        <div className="lyrics-container">
          {song.lyrics.map((line, index) => (
            <div
              key={index}
              className={`lyric-line ${index === currentLyric ? 'current' : ''}`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongDetail;