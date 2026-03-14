import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { gCodes, GCode } from '../data/gcodes';
import './GCodeRef.css';

type FilterType = 'All' | 'Mill' | 'Lathe' | 'Both';

export const GCodeRef: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredCodes = useMemo(() => {
    let codes = gCodes;

    // Apply type filter
    if (filter !== 'All') {
      codes = codes.filter(c => c.type === filter || c.type === 'Both');
    }

    // Apply search
    if (search.trim()) {
      const query = search.toLowerCase();
      codes = codes.filter(c =>
        c.code.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.haasNote?.toLowerCase().includes(query) ||
        c.fanucNote?.toLowerCase().includes(query)
      );
    }

    return codes;
  }, [search, filter]);

  return (
    <div className="gcode-ref">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search G/M codes..."
      />

      <div className="filter-pills">
        {(['All', 'Mill', 'Lathe', 'Both'] as FilterType[]).map((f) => (
          <button
            key={f}
            className={`filter-pill ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="gcode-list">
        {filteredCodes.map((code) => (
          <GCodeItem key={code.code} code={code} />
        ))}
      </div>

      {filteredCodes.length === 0 && (
        <div className="no-results">
          No codes found matching "{search}"
        </div>
      )}
    </div>
  );
};

const GCodeItem: React.FC<{ code: GCode }> = ({ code }) => {
  const [expanded, setExpanded] = useState(false);

  const typeColors: Record<string, string> = {
    Mill: 'var(--accent2)',
    Lathe: 'var(--accent3)',
    Both: 'var(--accent)'
  };

  return (
    <div
      className={`gcode-item ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="gcode-header">
        <span className="gcode-code">{code.code}</span>
        <span
          className="gcode-type"
          style={{ background: typeColors[code.type] }}
        >
          {code.type}
        </span>
        <span className="gcode-desc">{code.description}</span>
      </div>

      {expanded && (code.haasNote || code.fanucNote) && (
        <div className="gcode-notes">
          {code.haasNote && (
            <div className="gcode-note">
              <span className="note-label">Haas:</span>
              <span className="note-text">{code.haasNote}</span>
            </div>
          )}
          {code.fanucNote && (
            <div className="gcode-note">
              <span className="note-label">Fanuc:</span>
              <span className="note-text">{code.fanucNote}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
