import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <ShieldCheck size={28} color="var(--brand-green)" />
            <span style={{ color: 'var(--brand-dark)' }}>AuditEase</span>
          </Link>
          <p>Enterprise-grade DPDP & SOC2 compliance scanning powered by advanced ML algorithms.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Product</h4>
            <Link to="/dashboard">Scanner</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link to="/">Documentation</Link>
            <Link to="/">Blog</Link>
            <Link to="/">Compliance Guide</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} AuditEase. All rights reserved.</p>
        <div className="social-links-text">
    
        </div>
      </div>
    </footer>
  );
}