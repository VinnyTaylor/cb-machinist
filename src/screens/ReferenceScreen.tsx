import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GCodeRef } from '../reference/GCodeRef';
import { MaterialsRef } from '../reference/MaterialsRef';
import { TapDrillRef } from '../reference/TapDrillRef';
import { ThreadRef } from '../reference/ThreadRef';
import './ReferenceScreen.css';

type RefTab = 'gcode' | 'materials' | 'tapdrill' | 'thread';

const tabs: { id: RefTab; label: string }[] = [
  { id: 'gcode', label: 'G-Codes' },
  { id: 'materials', label: 'Materials' },
  { id: 'tapdrill', label: 'Tap Drills' },
  { id: 'thread', label: 'Threads' }
];

export const ReferenceScreen: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<RefTab>('gcode');

  // Handle navigation state for deep linking
  useEffect(() => {
    const state = location.state as { tab?: RefTab } | null;
    if (state?.tab && tabs.some(t => t.id === state.tab)) {
      setActiveTab(state.tab);
    }
  }, [location.state]);

  const renderContent = () => {
    switch (activeTab) {
      case 'gcode':
        return <GCodeRef />;
      case 'materials':
        return <MaterialsRef />;
      case 'tapdrill':
        return <TapDrillRef />;
      case 'thread':
        return <ThreadRef />;
      default:
        return <GCodeRef />;
    }
  };

  return (
    <div className="page reference-screen">
      {/* Tab Bar */}
      <div className="ref-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`ref-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="ref-content">
        {renderContent()}
      </div>
    </div>
  );
};
