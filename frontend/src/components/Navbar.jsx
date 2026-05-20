import { ShieldCheck, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';
  
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="logo">
          <ShieldCheck size={28} color="var(--brand-green)" />
          <span style={{ color: 'var(--brand-dark)' }}>AuditEase</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active-link' : ''}`}>Home</Link>
          {/* Dashboard is ALWAYS visible */}
          <Link to="/dashboard" className={`nav-item ${isDashboard ? 'active-link' : ''}`}>Dashboard</Link>
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={16} /> Logout
            </button>
          ) : (
            /* PREMIUM: Single User Icon button for Login/Signup */
            <Link to="/login" className="btn-icon-premium" title="Login / Sign Up">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}