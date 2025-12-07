import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EquipmentChecklist from './EquipmentChecklist';
import ManagerDashboard from './ManagerDashboard'; // Import the new file

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EquipmentChecklist />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;