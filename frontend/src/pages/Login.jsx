import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simulate API Login authentication
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '80vh', backgroundColor: '#F8FAFC' }}>
      <div className="upload-box" style={{ maxWidth: '400px', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <ShieldCheck size={48} color="var(--brand-green)" />
        </div>
        <h2 style={{ marginBottom: '8px' }}>Welcome Back</h2>
        <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Secure access to AuditEase</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} color="#94A3B8" style={{ position: 'absolute', top: '14px', left: '14px' }} />
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="file-input" 
              style={{ paddingLeft: '40px' }}
              required 
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#94A3B8" style={{ position: 'absolute', top: '14px', left: '14px' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="file-input" 
              style={{ paddingLeft: '40px' }}
              required 
            />
          </div>

          <button type="submit" className="btn-dark-large w-full" style={{ marginTop: '8px' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--brand-green)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}