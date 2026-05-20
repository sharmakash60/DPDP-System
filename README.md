# 🔐 DPDP-SOC2 Intelligence Platform
### AI-Powered Compliance Monitoring & Threat Analytics System

A production-grade compliance intelligence platform engineered using **FastAPI**, **React**, and **Machine Learning** to automate regulatory auditing, infrastructure threat detection, and anomaly-based security analysis across enterprise environments.

The platform performs intelligent inspection of infrastructure datasets and operational logs against **DPDP** and **SOC2** compliance standards while leveraging machine learning models to identify suspicious activity patterns, abnormal access behavior, and high-risk operational vectors.

---

# 📌 Overview

Traditional compliance operations depend heavily on:

- Manual auditing
- Static spreadsheets
- Delayed reporting
- Fragmented monitoring systems
- Reactive security workflows

This platform introduces a centralized AI-driven compliance architecture capable of:

- Parsing structured and unstructured datasets
- Detecting anomalous system behavior
- Generating real-time compliance risk scores
- Visualizing infrastructure risk metrics
- Exporting machine-readable audit intelligence
- Delivering enterprise-style security analytics

---

# 🧠 Core Architecture

```text
┌─────────────────────────────┐
│        React Frontend       │
│  Security Analytics Layer   │
└──────────────┬──────────────┘
               │ REST API
               ▼
┌─────────────────────────────┐
│       FastAPI Backend       │
│ Parsing + ML Inference API  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  ML Threat Detection Engine │
│ Random Forest Classification│
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Compliance Risk Engine      │
│ DPDP + SOC2 Evaluation      │
└─────────────────────────────┘
```

---

# 🚀 Platform Capabilities

## ✅ Compliance Intelligence

The engine evaluates uploaded infrastructure artifacts against multiple operational and governance dimensions including:

- DPDP regulatory indicators
- SOC2 security controls
- Infrastructure attack signatures
- Unauthorized access behavior
- Sensitive data exposure
- Threat activity patterns
- Weak security configurations
- Operational anomaly vectors

---

# 🤖 Machine Learning Threat Detection

The backend dynamically performs behavioral classification using:

```python
RandomForestClassifier()
```

to detect suspicious activity across uploaded infrastructure datasets.

### Detection Pipeline Includes

- Semantic threat keyword analysis
- Dynamic feature extraction
- Heuristic behavioral evaluation
- Numerical anomaly thresholding
- Vectorized security scoring
- Threat prioritization logic

---

# 📊 Interactive Security Analytics Dashboard

The React frontend delivers enterprise-style operational analytics including:

## Security Metrics

- Compliance integrity scoring
- Threat density analysis
- Infrastructure scan statistics
- Real-time risk tracking

## Visualization Systems

- Severity distribution charts
- Risk progression analytics
- Threat cluster mapping
- Anomalous execution analysis
- Infrastructure risk allocation

## Operational Features

- Secure authentication UI
- Real-time dataset uploads
- JSON report exporting
- Interactive remediation visibility
- Responsive dashboard architecture

---

# ⚡ Backend Infrastructure

The FastAPI backend provides high-performance REST APIs for:

- File ingestion
- Dataset parsing
- ML inference
- Compliance analysis
- Threat classification
- Risk aggregation
- Report generation

---

# 🔌 API Endpoint

## Upload & Analyze Dataset

```http
POST /api/upload
```

---

# 📥 Supported Dataset Formats

```text
.log
.csv
.json
.db
```

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI |
| Machine Learning | Scikit-learn |
| Data Processing | Pandas |
| Numerical Computing | NumPy |
| Visualization | Recharts |
| API Communication | Axios |
| ML Algorithm | Random Forest |
| Styling | CSS3 |
| Version Control | Git & GitHub |

---

# 📂 Project Structure

```bash
DPDP-System/
│
├── api.py
├── requirements.txt
├── config_data.csv
├── log_data.csv
├── README.md
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── components/
│   │   ├── assets/
│   │   └── styles/
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
│
└── .gitignore
```

---

# ⚙️ Local Development Setup

---

# 1️⃣ Clone Repository

```bash
git clone https://github.com/sharmakash60/DPDP-System.git
```

---

# 2️⃣ Navigate Into Project

```bash
cd DPDP-System
```

---

# ⚡ Backend Setup (FastAPI)

## Create Virtual Environment

```bash
python -m venv .venvv
```

---

## Activate Environment

### Windows

```bash
.venvv\Scripts\activate
```

### Linux / macOS

```bash
source .venvv/bin/activate
```

---

## Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## Run FastAPI Backend

```bash
uvicorn api:app --reload
```

Backend Server:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup (React + Vite)

## Navigate Into Frontend

```bash
cd frontend
```

---

## Install Frontend Dependencies

```bash
npm install
```

---

## Start Frontend Development Server

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 🧠 Threat Intelligence Pipeline

```text
Dataset Upload
      ↓
Hybrid Parsing Engine
      ↓
Dynamic Feature Extraction
      ↓
Semantic Threat Analysis
      ↓
Random Forest Classification
      ↓
Risk Probability Generation
      ↓
Compliance Visualization
```

---

# 🔐 Supported Compliance Domains

## DPDP (Digital Personal Data Protection)

Coverage includes:

- Consent handling
- Data retention monitoring
- Security governance
- User privacy analysis
- Data exposure detection
- Access monitoring
- Incident visibility

---

## SOC2 Security Controls

Coverage includes:

- Infrastructure security
- Monitoring & logging
- Access governance
- Threat management
- Security event tracking
- Operational integrity

---

# 📤 Exportable Reporting

The platform generates downloadable machine-readable reports:

```bash
report.json
```

containing:

- Threat vectors
- ML classifications
- Risk probabilities
- Security findings
- Compliance intelligence
- Operational metrics

---

# 🔌 API Example

## Upload Dataset

```bash
curl -X POST "http://127.0.0.1:8000/api/upload" \
-F "file=@log_data.csv"
```

---

# ☁️ Deployment Ready

The platform architecture supports deployment on:

- Docker
- Render
- Railway
- Vercel
- Netlify
- AWS
- Azure
- Google Cloud Platform

Frontend and backend services can be deployed independently for scalable infrastructure management.

---

# 🚀 Future Roadmap

## Planned Enterprise Enhancements

- JWT Authentication
- Role-Based Access Control
- PostgreSQL Integration
- Kafka Event Streaming
- Dockerized Infrastructure
- SIEM Integrations
- Cloud-native Deployment
- CI/CD Automation
- Real-time Threat Feeds
- Advanced Deep Learning Models
- Distributed ML Pipelines

---

---

# 👨‍💻 Author

## Kash Sharma

Machine Learning Engineer & Data Analyst focused on:

- AI Systems
- MLOps
- Security Analytics
- Compliance Engineering
- Intelligent Monitoring Systems
- Enterprise ML Infrastructure

---

# ⭐ Engineering Highlights

✅ React + FastAPI Enterprise Architecture  
✅ ML-Powered Threat Detection  
✅ Random Forest Behavioral Analysis  
✅ Real-Time Compliance Analytics  
✅ DPDP + SOC2 Intelligence Mapping  
✅ Interactive Security Dashboard  
✅ Production-Style API Infrastructure  
✅ JSON Threat Intelligence Reporting  
✅ Responsive Modern UI System  

---

# 📄 License

This project is intended for research, and portfolio demonstration purposes.
