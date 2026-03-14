import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { ManualContent } from '../manual/ManualContent';
import { chapters } from '../manual/chapters';
import './ManualScreen.css';

export const ManualScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredChapters = useMemo(() => {
    if (!search.trim()) return chapters;

    const query = search.toLowerCase();
    return chapters.filter(chapter =>
      chapter.title.toLowerCase().includes(query) ||
      chapter.content.some(item =>
        item.text?.toLowerCase().includes(query) ||
        item.items?.some(i => i.toLowerCase().includes(query))
      )
    );
  }, [search]);

  const toggleChapter = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="page manual-screen">
      <h2 className="manual-title">Machining Manual</h2>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search chapters..."
      />

      <div className="chapters-list">
        {filteredChapters.map((chapter, index) => (
          <div key={chapter.id} className="chapter-item">
            <button
              className={`chapter-header ${expandedId === chapter.id ? 'expanded' : ''}`}
              onClick={() => toggleChapter(chapter.id)}
            >
              <span className="chapter-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="chapter-icon">{chapter.icon}</span>
              <span className="chapter-title">{chapter.title}</span>
              <ChevronIcon className={`chapter-chevron ${expandedId === chapter.id ? 'rotated' : ''}`} />
            </button>

            {expandedId === chapter.id && (
              <div className="chapter-content">
                <ManualContent content={chapter.content} />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <div className="no-results">
          <p>No chapters found matching "{search}"</p>
        </div>
      )}
    </div>
  );
};

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
