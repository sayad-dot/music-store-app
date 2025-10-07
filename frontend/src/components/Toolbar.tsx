import React from 'react';

interface ToolbarProps {
  language: string;
  seed: string;
  averageLikes: number;
  displayMode: 'table' | 'gallery';
  onLanguageChange: (language: string) => void;
  onSeedChange: (seed: string) => void;
  onAverageLikesChange: (averageLikes: number) => void;
  onDisplayModeChange: (displayMode: 'table' | 'gallery') => void;
  onRandomSeed: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  language,
  seed,
  averageLikes,
  displayMode,
  onLanguageChange,
  onSeedChange,
  onAverageLikesChange,
  onDisplayModeChange,
  onRandomSeed
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="en-US">English (USA)</option>
          <option value="de-DE">German (Germany)</option>
        </select>
      </div>

      <div className="toolbar-group">
        <label htmlFor="seed">Seed:</label>
        <input
          id="seed"
          type="text"
          value={seed}
          onChange={(e) => onSeedChange(e.target.value)}
          placeholder="Enter 64-bit seed"
        />
        <button type="button" onClick={onRandomSeed}>
          Random
        </button>
      </div>

      <div className="toolbar-group">
        <label htmlFor="likes">Avg Likes:</label>
        <input
          id="likes"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={averageLikes}
          onChange={(e) => onAverageLikesChange(parseFloat(e.target.value))}
        />
      </div>

      <div className="toolbar-group">
        <button
          type="button"
          className={displayMode === 'table' ? 'active' : ''}
          onClick={() => onDisplayModeChange('table')}
        >
          Table View
        </button>
        <button
          type="button"
          className={displayMode === 'gallery' ? 'active' : ''}
          onClick={() => onDisplayModeChange('gallery')}
        >
          Gallery View
        </button>
      </div>
    </div>
  );
};

export default Toolbar;