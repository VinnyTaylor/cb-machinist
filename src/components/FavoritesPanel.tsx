import React, { useState } from 'react';
import { Favorite } from '../hooks/useFavorites';
import './FavoritesPanel.css';

interface FavoritesPanelProps<T> {
  favorites: Favorite<T>[];
  onLoad: (data: T) => void;
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
  formatPreview?: (data: T) => string;
}

export function FavoritesPanel<T>({
  favorites,
  onLoad,
  onSave,
  onDelete,
  formatPreview
}: FavoritesPanelProps<T>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    if (newName.trim()) {
      onSave(newName.trim());
      setNewName('');
      setShowSaveForm(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setShowSaveForm(false);
      setNewName('');
    }
  };

  return (
    <div className="favorites-panel">
      <button
        className="favorites-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="favorites-icon">⭐</span>
        <span className="favorites-label">Presets</span>
        <span className="favorites-count">{favorites.length}</span>
        <span className={`favorites-chevron ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="favorites-content">
          {/* Save Current */}
          {!showSaveForm ? (
            <button
              className="favorites-save-btn"
              onClick={() => setShowSaveForm(true)}
            >
              + Save Current Settings
            </button>
          ) : (
            <div className="favorites-save-form">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Preset name..."
                autoFocus
                maxLength={30}
              />
              <div className="favorites-save-actions">
                <button className="save-confirm" onClick={handleSave}>Save</button>
                <button className="save-cancel" onClick={() => {
                  setShowSaveForm(false);
                  setNewName('');
                }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Favorites List */}
          {favorites.length > 0 ? (
            <div className="favorites-list">
              {favorites.map((fav) => (
                <div key={fav.id} className="favorite-item">
                  <button
                    className="favorite-load"
                    onClick={() => onLoad(fav.data)}
                  >
                    <span className="favorite-name">{fav.name}</span>
                    {formatPreview && (
                      <span className="favorite-preview">{formatPreview(fav.data)}</span>
                    )}
                  </button>
                  <button
                    className="favorite-delete"
                    onClick={() => onDelete(fav.id)}
                    aria-label="Delete preset"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="favorites-empty">No saved presets yet</p>
          )}
        </div>
      )}
    </div>
  );
}
