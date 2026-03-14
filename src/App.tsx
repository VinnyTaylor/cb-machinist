import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { BottomNav } from './components/BottomNav';
import { InstallBanner } from './components/InstallBanner';
import { ThemeProvider } from './hooks/useTheme';
import { HomeScreen } from './screens/HomeScreen';
import { CalculatorsScreen } from './screens/CalculatorsScreen';
import { ReferenceScreen } from './screens/ReferenceScreen';
import { ManualScreen } from './screens/ManualScreen';
import './theme/variables.css';

// Lazy load the simulator (heavy 3D dependencies)
const GCodeSimulator = lazy(() => import('./simulator/GCodeSimulator'));

// Loading fallback
const SimulatorLoading = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 80px)',
    color: 'var(--muted)'
  }}>
    Loading Simulator...
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/calculators" element={<CalculatorsScreen />} />
          <Route path="/reference" element={<ReferenceScreen />} />
          <Route path="/manual" element={<ManualScreen />} />
          <Route path="/simulator" element={
            <Suspense fallback={<SimulatorLoading />}>
              <GCodeSimulator />
            </Suspense>
          } />
        </Routes>
        <BottomNav />
        <InstallBanner />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
