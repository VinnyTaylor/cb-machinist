import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { materials } from '../data/materials';
import './MaterialsRef.css';

export const MaterialsRef: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredMaterials = useMemo(() => {
    if (!search.trim()) return materials;

    const query = search.toLowerCase();
    return materials.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.notes.toLowerCase().includes(query)
    );
  }, [search]);

  const difficultyColors: Record<string, string> = {
    Easy: 'var(--accent3)',
    Medium: 'var(--accent)',
    Hard: 'var(--red)'
  };

  return (
    <div className="materials-ref">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search materials..."
      />

      <div className="materials-table-wrapper">
        <table className="materials-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Diff</th>
              <th>Rough SFM</th>
              <th>Finish SFM</th>
              <th>HSS</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map((mat) => (
              <MaterialRow key={mat.id} material={mat} difficultyColors={difficultyColors} />
            ))}
          </tbody>
        </table>
      </div>

      {filteredMaterials.length === 0 && (
        <div className="no-results">
          No materials found matching "{search}"
        </div>
      )}
    </div>
  );
};

interface MaterialRowProps {
  material: typeof materials[0];
  difficultyColors: Record<string, string>;
}

const MaterialRow: React.FC<MaterialRowProps> = ({ material, difficultyColors }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr onClick={() => setExpanded(!expanded)} className="clickable">
        <td className="mat-name">{material.name}</td>
        <td>
          <span
            className="difficulty-badge"
            style={{ background: difficultyColors[material.difficulty] }}
          >
            {material.difficulty.charAt(0)}
          </span>
        </td>
        <td className="mono">{material.roughSFM}</td>
        <td className="mono">{material.finishSFM}</td>
        <td className="mono">{material.hssSFM}</td>
      </tr>
      {expanded && (
        <tr className="notes-row">
          <td colSpan={5}>
            <div className="mat-notes">
              <span className="notes-label">Notes:</span> {material.notes}
              <br />
              <span className="notes-label">Chip Load (0.5" cutter):</span> {material.chipLoad}"
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
