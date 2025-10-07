import React, { useState } from 'react';
import { Song } from '../types/index';
import SongDetail from './SongDetail';

interface TableViewProps {
  songs: Song[];
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const TableView: React.FC<TableViewProps> = ({
  songs,
  currentPage,
  onPageChange,
  isLoading
}) => {
  const [expandedSong, setExpandedSong] = useState<number | null>(null);

  if (isLoading) {
    return <div className="loading">Loading songs...</div>;
  }

  return (
    <div className="table-view">
      <table className="songs-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Song</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genre</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <React.Fragment key={song.id}>
              <tr 
                className="song-row"
                onClick={() => setExpandedSong(expandedSong === song.id ? null : song.id)}
              >
                <td>{song.id}</td>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.album}</td>
                <td>{song.genre}</td>
                <td>{song.likes}</td>
              </tr>
              {expandedSong === song.id && (
                <tr>
                  <td colSpan={6}>
                    <SongDetail song={song} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={() => onPageChange(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TableView;