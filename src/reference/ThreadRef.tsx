import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { standardThreads } from '../data/threads';
import './ThreadRef.css';

export const ThreadRef: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredThreads = useMemo(() => {
    if (!search.trim()) return standardThreads;

    const query = search.toLowerCase();
    return standardThreads.filter(t =>
      t.name.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="thread-ref">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search thread size..."
      />

      <div className="thread-table-wrapper">
        <table className="thread-table">
          <thead>
            <tr>
              <th>Thread</th>
              <th>TPI</th>
              <th>Pitch</th>
              <th>Major Ø</th>
              <th>Depth</th>
              <th>Minor Ø</th>
            </tr>
          </thead>
          <tbody>
            {filteredThreads.map((thread) => (
              <tr key={thread.name}>
                <td className="thread-name">{thread.name}</td>
                <td className="mono">{thread.tpi}</td>
                <td className="mono">{thread.pitch.toFixed(5)}</td>
                <td className="mono major">{thread.majorDia.toFixed(4)}</td>
                <td className="mono">{thread.threadDepth.toFixed(4)}</td>
                <td className="mono minor">{thread.minorDia.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredThreads.length === 0 && (
        <div className="no-results">
          No threads found matching "{search}"
        </div>
      )}
    </div>
  );
};
