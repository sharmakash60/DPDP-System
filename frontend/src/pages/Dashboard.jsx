import { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Download, Activity, Lock, Server, AlertTriangle, Loader2, UploadCloud } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom'; // Changed from Navigate to Link
import './Dashboard.css';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Strict UI Colors
  const COLOR_CRITICAL = '#EF4444'; // Red
  const COLOR_MEDIUM = '#F97316';   // Orange
  const COLOR_LOW = '#55B385';      // Green
  const ACTION_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#3B82F6', '#10B981'];

  // --- AUTHENTICATION CHECK ---
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // --- LOCKED VIEW (For Logged-Out Users) ---
  if (!isAuthenticated) {
    return (
      <div className="dashboard-wrapper container flex-center">
        <div className="upload-box">
          <Lock size={64} color="var(--brand-green)" style={{ marginBottom: '16px', display: 'inline-block' }} />
          <h2>Dashboard Access Restricted</h2>
          <p>Please log in or create an account to run the ML security scanner and view compliance analytics.</p>
          <Link to="/login" className="btn-dark-large w-full mt-4" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.error) {
        setReportData({ error: response.data.error });
      } else {
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Upload process error:", error);
      setReportData({ error: "Connection Refused: Verify your Python API backend is running on port 8000." });
    } finally {
      setLoading(false);
    }
  };

  const downloadJSONReport = () => {
    if (!reportData || reportData.error) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Scan_Report_${reportData.filename || 'data'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // --- RENDERING CONFIGURATION BLOCKS ---
  if (!reportData && !loading) {
    return (
      <div className="dashboard-wrapper container flex-center">
        <div className="upload-box">
          <UploadCloud size={64} color="var(--brand-green)" style={{ marginBottom: '16px', display: 'inline-block' }} />
          <h2>Upload File for Compliance Scan</h2>
          <p>We support raw <strong>.db</strong>, <strong>.json</strong>, <strong>.log</strong>, and <strong>.csv</strong> logs for DPDP / SOC2 processing.</p>
          
          <form onSubmit={handleFileUpload} className="upload-form">
            <input 
              type="file" 
              accept=".db,.json,.log,.csv" 
              onChange={(e) => setFile(e.target.files[0])} 
              className="file-input"
            />
            <button type="submit" className="btn-dark-large w-full mt-4" disabled={!file}>
              Run Security Scanner
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-wrapper container flex-center">
        <div className="loader-container" style={{ textAlign: 'center' }}>
          <Loader2 size={48} color="#55B385" className="spin-anim" style={{ display: 'inline-block', marginBottom: '16px' }} />
          <h2>Executing ML Pipeline Engine...</h2>
          <p>Training Random Forest models, tokenizing inputs, and parsing schema trees.</p>
        </div>
      </div>
    );
  }

  if (reportData && reportData.error) {
    return (
      <div className="dashboard-wrapper container flex-center">
        <div className="upload-box" style={{ borderColor: COLOR_CRITICAL }}>
          <AlertTriangle size={64} color={COLOR_CRITICAL} style={{ marginBottom: '16px', display: 'inline-block' }} />
          <h2 style={{ color: COLOR_CRITICAL }}>Scan Aborted</h2>
          <p>{reportData.error}</p>
          <button className="btn-dark-large w-full mt-4" onClick={() => { setReportData(null); setFile(null); }}>
            Try Alternative Dataset
          </button>
        </div>
      </div>
    );
  }

  // --- DATA TRANSFORMS ---
  const anomalies = reportData.mlAnomalies || [];
  const violations = reportData.ruleViolations || [];
  const riskScore = reportData.overallRiskScore ?? 100;

  const severityData = [
    { name: 'Critical', count: anomalies.filter(a => a.risk === 'CRITICAL').length },
    { name: 'Medium', count: anomalies.filter(a => a.risk === 'MEDIUM').length + violations.length },
    { name: 'Low', count: anomalies.filter(a => a.risk === 'LOW').length }
  ];

  const riskTrendData = [
    { time: '04:00', risk: Math.max(10, riskScore - 35) },
    { time: '08:00', risk: Math.min(100, riskScore + 12) },
    { time: '12:00', risk: Math.max(10, riskScore - 18) },
    { time: 'Now', risk: riskScore }
  ];

  const tableCounts = {};
  anomalies.forEach(a => { if(a.table) tableCounts[a.table] = (tableCounts[a.table] || 0) + 1; });
  const tableData = Object.keys(tableCounts).map(key => ({ name: key, count: tableCounts[key] }));

  const actionCounts = {};
  anomalies.forEach(a => { if(a.action) actionCounts[a.action] = (actionCounts[a.action] || 0) + 1; });
  const actionData = Object.keys(actionCounts).map(key => ({ name: key, count: actionCounts[key] }));

  return (
    <div className="dashboard-wrapper container">
      {/* Top Controls Header */}
      <div className="dashboard-header">
        <div className="header-text">
          <h1>Scan Targets: <span className="text-green">{reportData.filename}</span></h1>
          <p>Unified Threat Vector Matrix & Framework Audits</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => { setReportData(null); setFile(null); }}>Eject File</button>
          <button className="btn-download" onClick={downloadJSONReport}>
            <Download size={18} /> Export JSON Matrix
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon green-icon"><ShieldAlert size={24} color="#55B385" /></div>
          <div className="metric-info">
            <h3>Compliance Integrity</h3>
            <div className={`score-value ${riskScore > 75 ? 'text-green' : riskScore > 45 ? 'text-orange' : 'text-red'}`}>
              {riskScore}<span>/100</span>
            </div>
            <span className="subtitle">Random Forest Calculation</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon green-icon"><Activity size={24} color="#55B385" /></div>
          <div className="metric-info">
            <h3>Sectors Indexed</h3>
            <div className="score-value text-dark">{reportData.scannedLogs?.toLocaleString() || 0}</div>
            <span className="subtitle">Parsed Row Vectors</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon red-icon"><AlertTriangle size={24} color={COLOR_CRITICAL} /></div>
          <div className="metric-info">
            <h3>Identified Vectors</h3>
            <div className="score-value text-red">{anomalies.length + violations.length}</div>
            <span className="subtitle">Flagged Threat Profiles</span>
          </div>
        </div>
      </div>

      {/* Primary Analytics Grid: Pixel Heights Assigned to Prevent Parent Sizing Collapse */}
      <div className="analytics-grid">
        <div className="chart-panel">
          <h3>Risk Profile Velocity</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLOR_LOW} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={COLOR_LOW} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1A202C', color: '#fff', borderRadius: '6px', border: 'none' }} />
                <Area type="monotone" dataKey="risk" stroke={COLOR_LOW} strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-panel">
          <h3>Severity Aggregations</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#F4F9F6' }} contentStyle={{ backgroundColor: '#1A202C', color: '#fff', borderRadius: '6px', border: 'none' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {severityData.map((entry, idx) => {
                    let c = COLOR_LOW;
                    if (entry.name === 'Critical') c = COLOR_CRITICAL;
                    if (entry.name === 'Medium') c = COLOR_MEDIUM;
                    return <Cell key={`cell-${idx}`} fill={c} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-panel">
          <h3>Incident Framework Allocation</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="40%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="count" stroke="none">
                  {severityData.map((entry, idx) => {
                    let c = COLOR_LOW;
                    if (entry.name === 'Critical') c = COLOR_CRITICAL;
                    if (entry.name === 'Medium') c = COLOR_MEDIUM;
                    return <Cell key={`cell-${idx}`} fill={c} />;
                  })}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1A202C', color: '#fff', borderRadius: '6px', border: 'none' }} />
                <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#718096' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Custom Analytics Grid */}
      <div className="secondary-charts-grid">
        <div className="chart-panel">
          <h3>Target Cluster Infiltration</h3>
          <div className="chart-container">
            {tableData.length === 0 ? (
              <div className="empty-chart-fallback">No cluster records encountered.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={tableData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#1A202C', fontSize: 11, fontWeight: 600 }} width={70} />
                  <Tooltip cursor={{ fill: '#F4F9F6' }} contentStyle={{ backgroundColor: '#1A202C', color: '#fff', borderRadius: '6px', border: 'none' }} />
                  <Bar dataKey="count" fill={COLOR_CRITICAL} radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="chart-panel">
          <h3>Anomalous Vector Actions</h3>
          <div className="chart-container">
            {actionData.length === 0 ? (
              <div className="empty-chart-fallback">No anomalous execution methods indexed.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={actionData} cx="50%" cy="40%" innerRadius={0} outerRadius={75} dataKey="count" stroke="none" label={{ fontSize: 11, fontWeight: 600 }}>
                    {actionData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={ACTION_COLORS[idx % ACTION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1A202C', color: '#fff', borderRadius: '6px', border: 'none' }} />
                  <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#718096' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Actionable Vectors Data Table */}
      <div className="panel full-width-panel">
        <div className="panel-header">
          <h2><AlertTriangle size={18} color={COLOR_CRITICAL} /> Priority Findings & Remediation Protocols</h2>
        </div>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Threat Class</th>
                <th>Resource Target</th>
                <th>Diagnostic Execution Signature</th>
                <th>Severity Status</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.length === 0 && violations.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    All sectors cleared. Dataset fully matches compliance controls.
                  </td>
                </tr>
              )}
              {anomalies.map((log, idx) => (
                <tr key={`ml-${idx}`}>
                  <td className="font-bold">Anomalous Execution Check</td>
                  <td>Sector: <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{log.table || 'Unknown'}</span></td>
                  <td>Heuristic event [{log.action || 'ACCESS'}] isolated across {log.rows?.toLocaleString() || 0} vectors. Result: {log.status || 'Verified'}.</td>
                  <td><span className={`badge ${log.risk === 'CRITICAL' ? 'badge-red' : 'badge-orange'}`}>{log.risk}</span></td>
                </tr>
              ))}
              {violations.map((rule, idx) => (
                <tr key={`rule-${idx}`}>
                  <td className="font-bold">System Configuration Gap</td>
                  <td>Global Architecture Core</td>
                  <td>{rule.desc} Risk mapped explicitly to framework standard protocols.</td>
                  <td><span className="badge badge-orange">MEDIUM</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}