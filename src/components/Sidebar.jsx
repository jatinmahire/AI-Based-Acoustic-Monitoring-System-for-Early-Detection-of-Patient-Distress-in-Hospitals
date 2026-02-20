import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🏥</div>
        <div className="brand-text">
          <h2>AI NurseGuard</h2>
          <span>Patient Monitoring</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-label">Main</span>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/rooms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">🛏️</span>
            <span>Patient Rooms</span>
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📈</span>
            <span>Analytics</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <span className="nav-label">System</span>
          <NavLink to="/comfort" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">💚</span>
            <span>Comfort AI</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-dot"></div>
          <span>AI System Online</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
