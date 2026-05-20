import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock, Mail } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    
    // Simulate API Signup
    if (name && email && password) {
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
        <h2 style={{ marginBottom: '8px' }}>Create Account</h2>
        <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Register for AuditEase compliance</p>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} color="#94A3B8" style={{ position: 'absolute', top: '14px', left: '14px' }} />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="file-input" 
              style={{ paddingLeft: '40px' }}
              required 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#94A3B8" style={{ position: 'absolute', top: '14px', left: '14px' }} />
            <input 
              type="email" 
              placeholder="Work Email" 
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
              placeholder="Create Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="file-input" 
              style={{ paddingLeft: '40px' }}
              required 
            />
          </div>

          <button type="submit" className="btn-dark-large w-full" style={{ marginTop: '8px' }}>
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--brand-green)', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}