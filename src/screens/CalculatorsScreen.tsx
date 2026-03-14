import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SpeedsFeedsCalc } from '../calculators/SpeedsFeedsCalc';
import { ThreadCalc } from '../calculators/ThreadCalc';
import { TrigCalc } from '../calculators/TrigCalc';
import { BoltCircleCalc } from '../calculators/BoltCircleCalc';
import { TaperCalc } from '../calculators/TaperCalc';
import { FractionCalc } from '../calculators/FractionCalc';
import './CalculatorsScreen.css';

type CalcTab = 'speeds' | 'thread' | 'trig' | 'bolt' | 'taper' | 'fraction';

const tabs: { id: CalcTab; label: string; icon: string }[] = [
  { id: 'speeds', label: 'Speeds & Feeds', icon: '⚙️' },
  { id: 'thread', label: 'Thread', icon: '🔩' },
  { id: 'trig', label: 'Trig', icon: '📐' },
  { id: 'bolt', label: 'Bolt Circle', icon: '🔲' },
  { id: 'taper', label: 'Taper', icon: '📏' },
  { id: 'fraction', label: 'Decimal', icon: '🔢' }
];

export const CalculatorsScreen: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<CalcTab>('speeds');

  // Handle navigation state for deep linking
  useEffect(() => {
    const state = location.state as { tab?: CalcTab } | null;
    if (state?.tab && tabs.some(t => t.id === state.tab)) {
      setActiveTab(state.tab);
    }
  }, [location.state]);

  const renderCalculator = () => {
    switch (activeTab) {
      case 'speeds':
        return <SpeedsFeedsCalc />;
      case 'thread':
        return <ThreadCalc />;
      case 'trig':
        return <TrigCalc />;
      case 'bolt':
        return <BoltCircleCalc />;
      case 'taper':
        return <TaperCalc />;
      case 'fraction':
        return <FractionCalc />;
      default:
        return <SpeedsFeedsCalc />;
    }
  };

  return (
    <div className="page calculators-screen">
      {/* Tab Bar */}
      <div className="calc-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`calc-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <div className="calc-content">
        {renderCalculator()}
      </div>
    </div>
  );
};
