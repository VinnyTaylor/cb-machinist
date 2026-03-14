import React, { useState } from 'react';
import { Card } from '../components/Card';
import { NoteBox } from '../components/NoteBox';
import { PillToggle } from '../components/PillToggle';
import {
  toolCoatings,
  endMillRecommendations,
  drillRecommendations,
  insertRecommendations,
  fluteGuidance,
  fluteDecisionFactors,
  coatingOverview,
  coatingSelectionGuide
} from '../data/tooling';
import './ToolingRef.css';

type TabType = 'coatings' | 'flutes' | 'endmills' | 'drills' | 'inserts';

export const ToolingRef: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('coatings');

  return (
    <div className="tooling-ref">
      <PillToggle
        options={[
          { value: 'coatings', label: 'Coatings' },
          { value: 'flutes', label: 'Flutes' },
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
        <>
          <Card title="Coating Quick Guide" icon="⚡">
            <div className="tool-table-wrapper">
              <table className="tool-table coating-overview-table">
                <thead>
                  <tr>
                    <th>Coating</th>
                    <th>Color</th>
                    <th>Heat</th>
                    <th>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {coatingOverview.map((c) => (
                    <tr key={c.coating}>
                      <td className="coating-name-cell">
                        <span>{c.coating}</span>
                        <span className="price-badge">{c.priceRange}</span>
                      </td>
                      <td>{c.color}</td>
                      <td>{c.heatResistance}</td>
                      <td>{c.primaryUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <NoteBox variant="tip" title="Quick Selection">
              <strong>Aluminum:</strong> Uncoated, ZrN, or DLC (avoid TiAlN/AlTiN)<br/>
              <strong>Steel:</strong> TiN, TiAlN, or TiCN<br/>
              <strong>Stainless/Titanium:</strong> AlTiN or TiAlN<br/>
              <strong>Hardened Steel:</strong> AlTiN only
            </NoteBox>
          </Card>

          <Card title="Coating Details" icon="🎨">
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

          <Card title="Coating by Material" icon="🔍">
            <div className="coating-selection-grid">
              {Object.values(coatingSelectionGuide).map((guide) => (
                <div key={guide.material} className="selection-card">
                  <h4 className="selection-title">{guide.material}</h4>
                  <div className="selection-row">
                    <span className="selection-label">Use:</span>
                    <span className="tag-list">
                      {guide.recommended.map((c, i) => (
                        <span key={i} className="tag good">{c}</span>
                      ))}
                    </span>
                  </div>
                  <div className="selection-row">
                    <span className="selection-label">Avoid:</span>
                    <span className="tag-list">
                      {guide.avoid.map((c, i) => (
                        <span key={i} className="tag bad">{c}</span>
                      ))}
                    </span>
                  </div>
                  <p className="selection-reason">{guide.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {activeTab === 'flutes' && (
        <>
          <Card title="Flute Count Guide" icon="🌀">
            <NoteBox variant="info" title="Why Flute Count Matters">
              The number of flutes affects chip evacuation, tool rigidity, surface finish, and achievable feed rates.
              Choosing the right flute count for your material and operation is critical for tool life and part quality.
            </NoteBox>

            <div className="flute-cards">
              {fluteGuidance.map((flute) => (
                <div key={flute.fluteCount} className="flute-card">
                  <h4 className="flute-title">{flute.fluteCount}</h4>
                  <div className="flute-props">
                    <div className="flute-prop">
                      <span className="prop-label">Chip Load</span>
                      <span className="prop-value">{flute.chipLoad}</span>
                    </div>
                    <div className="flute-prop">
                      <span className="prop-label">Rigidity</span>
                      <span className="prop-value">{flute.rigidity}</span>
                    </div>
                    <div className="flute-prop">
                      <span className="prop-label">Chip Evacuation</span>
                      <span className="prop-value">{flute.chipEvacuation}</span>
                    </div>
                  </div>
                  <div className="flute-best">
                    <span className="section-label">Best For:</span>
                    <span className="tag-list">
                      {flute.bestFor.map((item, i) => (
                        <span key={i} className="tag good">{item}</span>
                      ))}
                    </span>
                  </div>
                  <p className="flute-notes">{flute.notes}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="When to Choose More or Fewer Flutes" icon="🤔">
            <div className="decision-grid">
              <div className="decision-card more-flutes">
                <h4 className="decision-title">{fluteDecisionFactors.moreFlutes.title}</h4>
                <ul className="decision-list">
                  {fluteDecisionFactors.moreFlutes.factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
              <div className="decision-card fewer-flutes">
                <h4 className="decision-title">{fluteDecisionFactors.fewerFlutes.title}</h4>
                <ul className="decision-list">
                  {fluteDecisionFactors.fewerFlutes.factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>

            <NoteBox variant="tip" title={fluteDecisionFactors.tradeoffs.title}>
              <ul className="tradeoff-list">
                {fluteDecisionFactors.tradeoffs.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </NoteBox>
          </Card>
        </>
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
