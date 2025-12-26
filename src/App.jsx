import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EquipmentChecklist from './EquipmentChecklist';
import ManagerDashboard from './ManagerDashboard';
import SeniorManagerDashboard from './SeniorManagerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EquipmentChecklist />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/senior-manager-dashboard" element={<SeniorManagerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;