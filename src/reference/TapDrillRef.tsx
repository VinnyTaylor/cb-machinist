import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { tapDrills } from '../data/tapdrills';
import './TapDrillRef.css';

export const TapDrillRef: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredDrills = useMemo(() => {
    if (!search.trim()) return tapDrills;

    const query = search.toLowerCase();
    return tapDrills.filter(t =>
      t.thread.toLowerCase().includes(query) ||
      t.tapDrill.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="tapdrill-ref">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search thread size..."
      />

      <div className="tapdrill-table-wrapper">
        <table className="tapdrill-table">
          <thead>
            <tr>
              <th>Thread</th>
              <th>TPI</th>
              <th>Tap Drill</th>
              <th>Decimal</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrills.map((drill) => (
              <tr key={drill.thread}>
                <td className="thread-name">{drill.thread}</td>
                <td className="mono">{drill.tpi}</td>
                <td className="tap-drill">{drill.tapDrill}</td>
                <td className="decimal">{drill.decimalSize.toFixed(4)}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredDrills.length === 0 && (
        <div className="no-results">
          No threads found matching "{search}"
        </div>
      )}
    </div>
  );
};
