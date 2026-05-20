import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import { Plus, X } from 'lucide-react';
import Footer from '../components/Footer';
import './Home.css';

export default function Home() {
  const navigate = useNavigate(); // Navigation initializer
  const [openHeroIdx, setOpenHeroIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.firstName}! Our team will contact ${formData.company} shortly.`);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '' });
  };

  const heroFeatures = [
    { title: "Centralized compliance hub", text: "Manage DPDP, SOC 2, and ISO frameworks from a single, unified dashboard with real-time syncing." },
    { title: "Automated workflows", text: "Eliminate manual data entry. We automatically pull configurations to map against controls." },
    { title: "Risk & control mapping", text: "Instantly see which systems fail compliance checks and get remediation tasks." },
    { title: "Continuous compliance with AI", text: "Our AI engine monitors your databases 24/7, flagging anomalous access patterns instantly." }
  ];

  // Upgraded FAQs with mapped answers
  const faqs = [
    { 
      q: "What compliance areas do you cover?", 
      a: "We provide comprehensive, end-to-end support for major global and national frameworks including SOC 2 Type II, Digital Personal Data Protection (DPDP Act), ISO 27001, and customized local data audit schemas." 
    },
    { 
      q: "How is data security ensured?", 
      a: "AuditEase operates strictly via local runtime scanning and sandboxed metadata streams. Your raw customer databases and system logs are never transmitted outside your secure environment infrastructure." 
    },
    { 
      q: "How does automation benefit my team?", 
      a: "By completely dropping manual spreadsheets. Our platform auto-tokenizes raw backend log outputs, cross-checks infrastructure states, and generates fully exportable compliance reports with zero script preparation needed." 
    },
    { 
      q: "Can I integrate with existing tools?", 
      a: "Yes, our engine integrates seamlessly with typical cloud hosting layers, modern web frameworks, SQL instances, and relational storage architectures like Supabase to parse metadata directly." 
    },
    { 
      q: "Is the platform suitable for global use?", 
      a: "Absolutely. The rule matrix updates automatically to ensure compliance metrics cross-reference parameters defined by international validation standards as well as newly emerging privacy laws." 
    },
    { 
      q: "What onboarding support is available?", 
      a: "All tiers gain instant access to our interactive dashboard setup wizards. Enterprise subscriptions unlock specialized configuration assistance from data privacy engineers to align custom heuristic models." 
    }
  ];

  const testimonials = [
    { quote: "AuditEase reduced our compliance overhead by 80%. The real-time mapping to DPDP frameworks saved us months of manual auditing.", name: "Sarah Jenkins", role: "CTO, TechNova" },
    { quote: "The automated evidence collection is a game-changer. Our SOC2 audit went flawlessly without interrupting our engineering team.", name: "Marcus Thorne", role: "VP Engineering, CloudSync" },
    { quote: "Absolutely seamless onboarding. The visual dashboard gives our executive team instant clarity on our security posture.", name: "Priya Patel", role: "InfoSec Lead, FinSecure" }
  ];

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-content">
          <h1>Your Path To <br/><span className="text-green">Intelligent Audit & Compliance</span></h1>
          <p>Compliance isn't a checklist—it's a strategic asset. Manual, reactive audits create risk, slow growth, and drain resources. AuditEase redefines compliance.</p>
          {/* Linked to go straight to dashboard page */}
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>GET STARTED</button>
        </div>
        
        <div className="hero-accordion">
          {heroFeatures.map((feat, idx) => (
            <div key={idx} className={`accordion-card ${openHeroIdx === idx ? 'active' : ''}`} onClick={() => setOpenHeroIdx(openHeroIdx === idx ? null : idx)}>
              <div className="accordion-header">
                {openHeroIdx === idx ? <X size={18} className="text-green" /> : <Plus size={18} className="text-green" />}
                <span className="accordion-title">{feat.title}</span>
              </div>
              <div className="accordion-body">
                <p>{feat.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-box"><h2>150+</h2><p><strong>Compliance frameworks</strong><br/>Supported</p></div>
          <div className="stat-box"><h2>80%</h2><p><strong>Manual effort</strong><br/>Reduction</p></div>
          <div className="stat-box"><h2>24/7</h2><p><strong>Live compliance</strong><br/>Monitoring</p></div>
          <div className="stat-box"><h2>60%</h2><p><strong>Time to certification</strong><br/>Faster</p></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonial-section container">
        <h2 className="section-title">How modern teams like yours <br/><span className="text-green">fly through audits</span></h2>
        <p className="section-subtitle">Our customers aren't just managing compliance more efficiently—they're using it to move their businesses forward.</p>
        
        <div className="testimonials-grid">
          {testimonials.map((test, idx) => (
            <div key={idx} className="testimonial-card">
              <p className="quote">"{test.quote}"</p>
              <div className="author">
                <strong>{test.name}</strong>
                <span>{test.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-banner">
          <h2>Make Compliance <span className="text-green">Easy, Fast,</span> and <span className="text-green">Autonomous</span></h2>
        </div>
        <div className="faq-content container">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`accordion-card ${openFaqIdx === idx ? 'active' : ''}`} onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}>
                <div className="accordion-header">
                  {openFaqIdx === idx ? <X size={18} className="text-green" /> : <Plus size={18} className="text-green" />}
                  <span className="accordion-title">{faq.q}</span>
                </div>
                {/* Clean, collapsible container for FAQ descriptions */}
                <div className="accordion-body">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Reach Out Section */}
      <section className="reach-out-section container">
        <div className="form-header">
          <h2>Reach out</h2>
          <p>We'd love to know how we can help you! Please fill out the form and our compliance experts will get back to you.</p>
        </div>

        <form className="reach-out-form" onSubmit={handleContactSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>First name <span className="req">*</span></label>
              <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Last name <span className="req">*</span></label>
              <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Email <span className="req">*</span></label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Phone number <span className="req">*</span></label>
              <div className="phone-input">
                <select className="country-code"><option>IN ▼</option><option>US ▼</option></select>
                <input type="tel" placeholder="+91" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
            </div>
          </div>

          <div className="input-group full-width">
            <label>Company name <span className="req">*</span></label>
            <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
          </div>

          <div className="form-submit-row">
            <button type="submit" className="btn-dark-large">Send Request</button>
          </div>
        </form>
      </section>
      
    
    </div>
  );
}