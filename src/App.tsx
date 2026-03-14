import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { InstallBanner } from './components/InstallBanner';
import { HomeScreen } from './screens/HomeScreen';
import { CalculatorsScreen } from './screens/CalculatorsScreen';
import { ReferenceScreen } from './screens/ReferenceScreen';
import { ManualScreen } from './screens/ManualScreen';
import './theme/variables.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/calculators" element={<CalculatorsScreen />} />
        <Route path="/reference" element={<ReferenceScreen />} />
        <Route path="/manual" element={<ManualScreen />} />
      </Routes>
      <BottomNav />
      <InstallBanner />
    </BrowserRouter>
  );
}

export default App;
