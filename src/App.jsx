import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Analytics from './pages/Analytics';
import Comfort from './pages/Comfort';
import Settings from './pages/Settings';
import AlertHistory from './pages/AlertHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/comfort" element={<Comfort />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<AlertHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
