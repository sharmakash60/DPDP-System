import { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, User } from 'lucide-react';
import './Auth.css';

export default function Auth({ defaultMode }) {
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Update state if route changes
  useEffect(() => { setIsLogin(defaultMode === 'login'); }, [defaultMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      alert(`Logging in with ${formData.email}... Success!`);
    } else {
      alert(`Account created for ${formData.name}! Welcome to AuditEase.`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Left Side: Form */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create your account'}</h2>
            <p>{isLogin ? 'Enter your credentials to access your compliance dashboard.' : 'Start automating your compliance today.'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-wrapper">
                <label>Full Name</label>
                <div className="input-icon-group">
                  <User size={18} className="input-icon" />
                  <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
              </div>
            )}

            <div className="input-wrapper">
              <label>Work Email</label>
              <div className="input-icon-group">
                <Mail size={18} className="input-icon" />
                <input type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
            </div>

            <div className="input-wrapper">
              <label>Password</label>
              <div className="input-icon-group">
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength={6} />
              </div>
              {isLogin && <span className="forgot-pass cursor-pointer">Forgot password?</span>}
            </div>

            <button type="submit" className="auth-submit-btn">
              {isLogin ? 'Log In to Dashboard' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            {isLogin ? (
              <p>Don't have an account? <button type="button" className="text-link" onClick={() => setIsLogin(false)}>Sign up</button></p>
            ) : (
              <p>Already have an account? <button type="button" className="text-link" onClick={() => setIsLogin(true)}>Log in</button></p>
            )}
          </div>
        </div>

        {/* Right Side: Branding */}
        <div className="auth-brand-section">
          <div className="brand-content">
            <ShieldCheck size={48} color="white" />
            <h3>Fly through audits.</h3>
            <p>"The visual dashboard is outstanding. AuditEase eliminated our compliance headaches entirely."</p>
            <div className="brand-author">
              <strong>Marcus Thorne</strong>
              <span>VP Engineering, CloudSync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}