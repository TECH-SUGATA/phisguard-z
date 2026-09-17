# 🛡️ PHISGUARD-Z

### AI-Powered Phishing, URL Intelligence & Zero-Day Threat Analysis Platform

<p align="center">
  <a href="https://phisguard-z.onrender.com/">
    <img src="https://img.shields.io/badge/Live%20Demo-PHISGUARD--Z-00C853?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/TECH-SUGATA/phisguard-z">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
</p>

<p align="center">
  <strong>Detect suspicious URLs. Analyze phishing indicators. Investigate email threats. Surface anomalous payload behavior.</strong>
</p>

<p align="center">
  PHISGUARD-Z combines deterministic security heuristics with Gemini-powered analysis in a unified cyber-defense dashboard.
</p>

---

## 🚀 Live Project

| Resource | Link |
|---|---|
| 🌐 **Live Application** | https://phisguard-z.onrender.com/ |
| 💻 **GitHub Repository** | https://github.com/TECH-SUGATA/phisguard-z |

---

## 🔎 What is PHISGUARD-Z?

**PHISGUARD-Z** is an AI-powered cybersecurity analysis platform designed to inspect suspicious URLs, phishing indicators, email-based social engineering signals, and potentially malicious payload patterns.

It combines **rule-based security analysis**, **URL intelligence**, **AI-assisted threat analysis**, **phishing detection**, and **SOC-oriented response workflows** into a unified cybersecurity dashboard.

The platform follows a layered security-analysis architecture:

```text
User Input
      ↓
Deterministic Security Heuristics
      ↓
URL / Domain / Encoding / Spoofing Analysis
      ↓
Gemini-Powered Deep Analysis
      ↓
Threat Classification + Risk Signals
      ↓
Quarantine / Pattern Learning / SOC Workflow
✨ Key Features
🔗 Intelligent URL Inspection

PHISGUARD-Z analyzes URLs using multiple security indicators:

Domain and hostname inspection
Suspicious lexical pattern detection
URL normalization
Domain spoofing detection
Brand impersonation indicators
Punycode and homoglyph analysis
Entropy-based anomaly detection
DGA-like domain analysis
Risk and threat severity scoring
🧠 AI-Powered Threat Analysis

When the Gemini API is configured, PHISGUARD-Z performs deeper AI-assisted analysis after the initial heuristic scan.

The AI layer helps classify suspicious activity and generate structured security intelligence.

URL
 ↓
Heuristic Scan
 ↓
Threat Indicators
 ↓
Gemini Analysis
 ↓
Threat Assessment
 ↓
Recommended Action
📧 Phishing & BEC Email Analysis

The platform includes a dedicated email-analysis workflow for detecting suspicious messages and business-email-compromise style threats.

It can analyze:

Suspicious language
Social engineering indicators
Credential harvesting patterns
Urgency and manipulation signals
Suspicious links
Potential phishing intent
Recommended security actions

The system can return structured information such as:

Threat Category
Risk Score
Recommended Action
Quarantine Recommendation
Extracted Indicators
🧪 Payload & Obfuscation Analysis

The security analysis workflow can identify suspicious encoding and anti-analysis patterns.

Detection includes signals related to:

Base64-style encoding
Hex encoding
Percent encoding
Dynamic-code indicators
Debugger detection patterns
Browser automation checks
Suspicious tunnel/cloaking domains
Obfuscation indicators
🔄 Threat Pattern Learning

PHISGUARD-Z includes a learning workflow that can transform observed threat intelligence into reusable threat-pattern information.

New Threat
    ↓
Analyze
    ↓
Extract Indicators
    ↓
Generate Pattern
    ↓
Store / Learn
    ↓
Future Threat Detection
📡 Threat Intelligence & Synchronization

The backend exposes threat-intelligence endpoints for:

Learned patterns
Threat indicators
Engine status
Pattern synchronization
Threat intelligence retrieval
🚨 SOC Alert Workflow

PHISGUARD-Z provides a SOC-oriented alert workflow for processing security incidents.

Alerts can contain:

Threat identifier
Severity
Risk score
Incident type
Delivery metadata
Recommended response
📊 Cybersecurity Operations Dashboard

The frontend is designed as a modern dark-themed cybersecurity dashboard inspired by SOC and threat-intelligence interfaces.

The dashboard brings together:

URL inspection
Threat telemetry
Threat statistics
Email analysis
Payload inspection
Threat intelligence
Alert management
Pattern learning
Security monitoring
🧠 Security Analysis Pipeline
                     ┌────────────────────────┐
                     │   URL / Email /        │
                     │   Payload Input        │
                     └────────────┬───────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │ Deterministic          │
                     │ Security Heuristics    │
                     └────────────┬───────────┘
                                  │
               ┌──────────────────┼──────────────────┐
               ▼                  ▼                  ▼
        URL Signals         Spoofing / IDN      Obfuscation
        & Domain            & Punycode          Indicators
               │                  │                  │
               └──────────────────┼──────────────────┘
                                  ▼
                     ┌────────────────────────┐
                     │ Gemini Deep Analysis   │
                     │      AI Layer          │
                     └────────────┬───────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │ Threat Assessment      │
                     │ + Risk Signals         │
                     └────────────┬───────────┘
                                  │
                  ┌───────────────┼────────────────┐
                  ▼               ▼                ▼
             Quarantine      Learn Pattern     SOC Workflow
🛠️ Technology Stack
Frontend
React 19
Vite 6
TypeScript
Tailwind CSS 4
Lucide React
Motion
D3
Backend
Node.js
Express 4
TypeScript
TSX
esbuild
dotenv
AI Layer
Google Gemini SDK
@google/genai
Security & Analysis
URL/domain heuristics
Punycode analysis
Homoglyph detection
Entropy analysis
Lexical anomaly detection
Payload obfuscation checks
JSON REST APIs
Threat-pattern learning
Deployment
GitHub
Render
Vite
esbuild
📂 Project Structure
PHISGUARD-Z/
│
├── src/                  # React frontend
│
├── server.ts             # Express + AI/security backend
├── index.html            # Vite entry document
├── package.json          # Project scripts and dependencies
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── metadata.json         # AI Studio metadata
├── .env.example          # Environment variable template
├── .gitignore            # Git exclusions
├── bun.lock              # Lockfile
└── README.md             # Project documentation
⚙️ Local Installation
1. Clone the Repository
git clone https://github.com/TECH-SUGATA/phisguard-z.git
cd phisguard-z
2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env file using .env.example as a reference.

GEMINI_API_KEY=your_gemini_api_key

⚠️ Never commit real API keys or credentials to GitHub.

4. Start the Development Server
npm run dev

The development environment uses the Express backend together with the Vite-powered frontend.

🏗️ Production Build

Build the project:

npm run build

Start the production server:

npm start

The production build uses Vite for the frontend and esbuild to bundle the backend server.

🔌 API Endpoints
Method	Endpoint	Description
GET	/api/health	Service and security-engine health information
GET	/api/threat-intel	Retrieve threat-intelligence information
GET	/api/threat-intel/sync	Synchronize learned threat patterns
POST	/api/background-scan/batch	Batch URL heuristic scanning
POST	/api/scan	URL inspection and optional Gemini analysis
POST	/api/learn-pattern	Store a learned threat pattern
POST	/api/scan-email	Email phishing/BEC analysis
POST	/api/dispatch-soc-alert	SOC security alert workflow
POST	/api/detonate-payload	Payload and obfuscation analysis
🧪 Example URL Scan
Request
POST /api/scan
Content-Type: application/json
JSON Body
{
  "url": "https://example.com/login",
  "fastMode": false
}
Processing Flow
URL Input
   ↓
Normalization
   ↓
Domain Analysis
   ↓
Lexical Analysis
   ↓
Spoofing / Punycode Detection
   ↓
Entropy Analysis
   ↓
Threat Scoring
   ↓
Gemini Deep Analysis
   ↓
Final Threat Assessment
☁️ Deployment
Render Deployment

The live production application is currently hosted at:

🌐 https://phisguard-z.onrender.com/

Recommended Render configuration:

Build Command:
npm install && npm run build
Start Command:
npm start

Configure environment variables inside the Render dashboard.

Example:

GEMINI_API_KEY=your_gemini_api_key

Never put production secrets directly inside the Git repository.

🔄 GitHub → Render Deployment Workflow
Google AI Studio / Local Development
                ↓
             GitHub
                ↓
             Render
                ↓
        PHISGUARD-Z LIVE

After connecting the repository to Render, future changes pushed to the connected branch can be used for automatic deployments.

🔐 Security Considerations

PHISGUARD-Z is intended as a defensive cybersecurity research and analysis platform.

It should be considered an assistive security-analysis system rather than a replacement for a complete enterprise SOC platform.

Important Security Practices
Keep GEMINI_API_KEY outside source control.
Validate and sanitize untrusted input.
Never execute unknown payloads directly on production infrastructure.
Treat AI-generated results as analytical signals.
Validate important decisions using security analysts.
Add authentication before exposing sensitive APIs.
Add authorization and role-based access control.
Add rate limiting and abuse prevention.
Add persistent logging and audit trails.
Use isolated sandbox infrastructure for dynamic payload execution.
Add production-grade monitoring before large-scale deployment.
📈 Future Roadmap
 Persistent threat database
 User authentication
 Role-based access control
 Rate limiting
 Advanced threat-intelligence feeds
 Domain reputation integrations
 Real-time security notifications
 SOC incident management
 Container-isolated malware sandbox
 Historical threat analytics
 Case management
 Security audit logging
 CI/CD security scanning
 Advanced threat visualization
 Enterprise deployment architecture
🎯 Project Workflow

PHISGUARD-Z follows a practical cybersecurity workflow:

INSPECT
   ↓
CLASSIFY
   ↓
INVESTIGATE
   ↓
CONTAIN
   ↓
LEARN

This approach combines:

URL intelligence
Phishing analysis
Email threat analysis
Spoofing detection
Punycode analysis
Obfuscation detection
Threat scoring
AI-assisted investigation
Pattern learning
SOC response workflows
🌟 Why PHISGUARD-Z?

PHISGUARD-Z brings multiple cybersecurity capabilities together instead of relying on a single detection technique.

Traditional Approach
URL Scanner
Email Scanner
Threat Intelligence
Alert System
      ↓
Separate Tools
PHISGUARD-Z Approach
             ┌─────────────────┐
             │   PHISGUARD-Z   │
             └────────┬────────┘
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
   URL Analysis   Email Analysis   Payload Analysis
       │              │              │
       └──────────────┼──────────────┘
                      ↓
              AI Threat Analysis
                      ↓
             Threat Intelligence
                      ↓
              Pattern Learning
                      ↓
               SOC Response
📊 Platform Capabilities
Capability	Status
URL Inspection	✅
Phishing Detection	✅
Email Analysis	✅
BEC Analysis	✅
Punycode Detection	✅
Homoglyph Detection	✅
Entropy Analysis	✅
Obfuscation Detection	✅
AI-Assisted Analysis	✅
Threat Scoring	✅
Threat Pattern Learning	✅
Threat Intelligence	✅
SOC Alert Workflow	✅
Production Deployment	✅
Persistent Database	🚧
Authentication	🚧
Enterprise Sandbox	🚧
🧑‍💻 Author
Sugata Nayak

Computer Science & Engineering — Artificial Intelligence

GitHub

https://github.com/TECH-SUGATA

Project Repository

https://github.com/TECH-SUGATA/phisguard-z

🌐 Project Links
🚀 Live Demo

https://phisguard-z.onrender.com/

💻 GitHub Repository

https://github.com/TECH-SUGATA/phisguard-z

📄 License

No license file is currently included in the repository.

Before distributing this project as open-source software, add an appropriate open-source license such as MIT, Apache-2.0, or another license that matches your intended usage.

⭐ Support

If you find PHISGUARD-Z useful for:

Cybersecurity research
AI experimentation
Security education
Phishing analysis
Threat detection
Portfolio development
Hackathon projects

consider giving the repository a ⭐ on GitHub.

<p align="center">
🛡️ PHISGUARD-Z

<strong>Detect. Analyze. Contain. Learn.</strong>

AI-Powered Phishing & Zero-Day Threat Analysis Platform

</p> ```
