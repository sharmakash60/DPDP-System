# 🔐 DPDP + SOC2 Compliance Scanner with ML Anomaly Detection

A production-style compliance and security analytics platform built using Python, Streamlit, Machine Learning, and rule-based scanning.

This project scans configuration files, logs, source code, and system artifacts for compliance violations related to:

- DPDP (Digital Personal Data Protection Act)
- SOC2 Security Controls
- Sensitive Data Exposure
- Access Control Issues
- Weak Encryption
- Monitoring & Incident Gaps
- Data Retention Risks
- Third-Party Transfer Risks

The system combines:

✅ Rule-Based Detection

✅ ML-Based Anomaly Detection

✅ Risk Scoring Engine

✅ Interactive Dashboard

✅ Downloadable JSON Reports

---

# 🚀 Features

## 🔎 Compliance Scanning

Scans:

- Configuration files
- Application logs
- Database logs
- Environment files
- Source code
- Text files

Detects:

- Emails
- Aadhaar numbers
- PAN numbers
- Weak cryptography
- Plaintext secrets
- HTTP usage
- Missing consent mechanisms
- Missing access control
- Missing audit logs
- Retention policy issues
- Vendor security gaps

---

## 🧠 Machine Learning Integration

Uses Isolation Forest anomaly detection to:

- Detect suspicious findings
- Identify abnormal compliance patterns
- Generate risk scores
- Highlight high-risk violations

---

## 📊 Interactive Dashboard

Built using Streamlit.

Includes:

- Rule scan metrics
- ML risk analysis
- Severity distribution charts
- Risk score visualization
- Framework distribution pie charts
- High-risk findings table
- Downloadable reports

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend logic |
| Streamlit | Dashboard UI |
| Pandas | Data processing |
| Scikit-learn | ML anomaly detection |
| Matplotlib | Visualizations |
| Git & GitHub | Version control |

---

# 📂 Project Structure

```bash
DPDP-System/
│
├── main.py
├── rules.py
├── ml_model.py
├── compliance_rules_v2.txt
├── requirements.txt
├── .gitignore
├── real_data/
│   ├── app.log
│   ├── access.log
│   ├── config.env
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/sharmakash60/DPDP-System.git
```

## 2️⃣ Move Into Project

```bash
cd DPDP-System
```

## 3️⃣ Create Virtual Environment

```bash
python -m venv .venvv
```

## 4️⃣ Activate Environment

### Windows

```bash
.venvv\Scripts\activate
```

### Linux / Mac

```bash
source .venvv/bin/activate
```

---

# 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

---

# ▶️ Run the Application

## Generate Rules

```bash
python rules.py generate
```

## Start Dashboard

```bash
streamlit run main.py
```

---

# 📥 Input Data

Place your configuration and log files inside:

```bash
real_data/
```

Example:

```bash
real_data/
├── app.log
├── access.log
├── db_config.env
```

Then use:

```text
real_data
```

inside the dashboard Target Path.

---

# 🧠 ML Risk Scoring

The ML engine converts findings into numerical features and applies:

```python
IsolationForest()
```

Risk scores are generated based on:

- Severity
- Category
- Framework
- Anomaly behavior

---

# 📊 Dashboard Analytics

The dashboard includes:

- Severity Distribution
- Framework Distribution
- Risk Score Distribution
- High Risk Detection
- ML Risk Analysis

---

# 🔐 Compliance Frameworks

## DPDP

Includes controls for:

- Consent Management
- Data Retention
- Encryption
- User Rights
- Monitoring
- Incident Response
- Third-Party Transfers

## SOC2

Includes controls for:

- Security Governance
- Logging & Monitoring
- Availability & Recovery
- Confidentiality
- Change Management
- Infrastructure Security

---

# 📤 Report Export

The application generates downloadable:

```bash
report.json
```

containing:

- Findings
- Risk Scores
- Severity
- Framework
- Categories

---

# 🚀 Future Improvements

- Real-time log streaming
- Kafka integration
- User authentication
- Cloud deployment
- Role-based access control
- Threat intelligence integration
- Database-backed rules engine
- Live alerts and notifications
- Advanced ML models
- Time-series anomaly detection

---

# 📸 Screenshots

Add screenshots here after uploading images to GitHub.

Example:

```md
![Dashboard](screenshots/dashboard.png)
```

---

# 🧪 Example Test Data

Example log entry:

```text
user email = test@gmail.com
password_plaintext = 12345
http://unsafe-api.com
```

The system detects:

- Email exposure
- Plaintext secrets
- Insecure HTTP usage

---

# 👨‍💻 Author

## Kash Sharma

Data Science Graduate focused on:

- Machine Learning
- Data Analytics
- MLOps
- Security Analytics
- Compliance Engineering

---

# ⭐ Project Highlights

✅ 400 Compliance Rules

✅ DPDP + SOC2 Support

✅ ML-Based Detection

✅ Streamlit Dashboard

✅ JSON Reporting

✅ Risk Scoring System

✅ Real-World Architecture

---

# 📄 License

This project is intended for educational and research purposes.
