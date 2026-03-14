import React, { useState } from 'react';
import { Card } from '../components/Card';
import { NoteBox } from '../components/NoteBox';
import { PillToggle } from '../components/PillToggle';
import { toolCoatings, endMillRecommendations, drillRecommendations, insertRecommendations } from '../data/tooling';
import './ToolingRef.css';

type TabType = 'coatings' | 'endmills' | 'drills' | 'inserts';

export const ToolingRef: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('coatings');

  return (
    <div className="tooling-ref">
      <PillToggle
        options={[
          { value: 'coatings', label: 'Coatings' },
          { value: 'endmills', label: 'End Mills' },
          { value: 'drills', label: 'Drills' },
          { value: 'inserts', label: 'Inserts' }
        ]}
        value={activeTab}
        onChange={setActiveTab}
        fullWidth
        size="small"
      />

      {activeTab === 'coatings' && (
        <Card title="Tool Coatings" icon="🎨">
          <div className="coating-cards">
            {toolCoatings.map((coating) => (
              <div key={coating.id} className="coating-card">
                <div className="coating-header">
                  <span className="coating-name">{coating.name}</span>
                  <span className="coating-abbrev">{coating.abbrev}</span>
                </div>
                <div className="coating-props">
                  <div className="prop">
                    <span className="prop-label">Max Temp</span>
                    <span className="prop-value">{coating.maxTemp}°F</span>
                  </div>
                  <div className="prop">
                    <span className="prop-label">Hardness</span>
                    <span className="prop-value">{coating.hardness}</span>
                  </div>
                  <div className="prop">
                    <span className="prop-label">Color</span>
                    <span className="prop-value">{coating.color}</span>
                  </div>
                </div>
                <div className="coating-best">
                  <span className="section-label">Best For:</span>
                  <span className="tag-list">
                    {coating.bestFor.map((item, i) => (
                      <span key={i} className="tag good">{item}</span>
                    ))}
                  </span>
                </div>
                <div className="coating-avoid">
                  <span className="section-label">Avoid:</span>
                  <span className="tag-list">
                    {coating.avoid.map((item, i) => (
                      <span key={i} className="tag bad">{item}</span>
                    ))}
                  </span>
                </div>
                <p className="coating-notes">{coating.notes}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'endmills' && (
        <Card title="End Mill Selection" icon="🔧">
          <div className="tool-table-wrapper">
            <table className="tool-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Flutes</th>
                  <th>Helix</th>
                  <th>Coating</th>
                </tr>
              </thead>
              <tbody>
                {endMillRecommendations.map((rec) => (
                  <tr key={rec.materialCategory}>
                    <td className="material-cell">{rec.materialCategory.replace('-', ' ')}</td>
                    <td>{rec.fluteNote}</td>
                    <td className="mono">{rec.helix}</td>
                    <td>{rec.coating.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="detail-cards">
            {endMillRecommendations.map((rec) => (
              <div key={rec.materialCategory} className="detail-card">
                <h4 className="detail-title">{rec.materialCategory.replace('-', ' ')}</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Flutes</span>
                    <span className="detail-value">{rec.fluteNote}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Helix</span>
                    <span className="detail-value">{rec.helix}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Geometry</span>
                    <span className="detail-value">{rec.geometry}</span>
                  </div>
                </div>
                <div className="detail-coatings">
                  {rec.coating.map((c, i) => (
                    <span key={i} className="tag good">{c}</span>
                  ))}
                </div>
                <p className="detail-notes">{rec.notes}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'drills' && (
        <Card title="Drill Selection" icon="🔩">
          <div className="tool-table-wrapper">
            <table className="tool-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Point Angle</th>
                  <th>Type</th>
                  <th>Coating</th>
                </tr>
              </thead>
              <tbody>
                {drillRecommendations.map((rec) => (
                  <tr key={rec.materialCategory}>
                    <td className="material-cell">{rec.materialCategory.replace('-', ' ')}</td>
                    <td className="mono">{rec.pointAngle}°</td>
                    <td>{rec.type}</td>
                    <td>{rec.coating.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <NoteBox variant="tip" title="Drill Point Angles">
            118° - General purpose, most materials. 135° - Reduces work hardening, better for stainless/titanium. 90° - Plastics and soft materials.
          </NoteBox>

          <div className="detail-cards">
            {drillRecommendations.map((rec) => (
              <div key={rec.materialCategory} className="detail-card">
                <h4 className="detail-title">{rec.materialCategory.replace('-', ' ')}</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Point Angle</span>
                    <span className="detail-value accent">{rec.pointAngle}°</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{rec.type}</span>
                  </div>
                </div>
                <div className="detail-coatings">
                  {rec.coating.map((c, i) => (
                    <span key={i} className="tag good">{c}</span>
                  ))}
                </div>
                <p className="detail-notes">{rec.notes}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'inserts' && (
        <Card title="Lathe Insert Selection" icon="📐">
          <div className="tool-table-wrapper">
            <table className="tool-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Grade</th>
                  <th>Geometry</th>
                </tr>
              </thead>
              <tbody>
                {insertRecommendations.map((rec) => (
                  <tr key={rec.materialCategory}>
                    <td className="material-cell">{rec.materialCategory.replace('-', ' ')}</td>
                    <td>{rec.grade}</td>
                    <td>{rec.geometry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="detail-cards">
            {insertRecommendations.map((rec) => (
              <div key={rec.materialCategory} className="detail-card">
                <h4 className="detail-title">{rec.materialCategory.replace('-', ' ')}</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Grade</span>
                    <span className="detail-value">{rec.grade}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Geometry</span>
                    <span className="detail-value">{rec.geometry}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Chipbreaker</span>
                    <span className="detail-value">{rec.chipbreaker}</span>
                  </div>
                </div>
                <div className="detail-coatings">
                  {rec.coating.map((c, i) => (
                    <span key={i} className="tag good">{c}</span>
                  ))}
                </div>
                <p className="detail-notes">{rec.notes}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
