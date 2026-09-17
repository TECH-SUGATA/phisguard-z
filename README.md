🛡️ PHISGUARD-Z

<p align="center">
  <img src="./assets/phisguard-banner.png" width="100%" alt="PHISGUARD-Z — AI-Powered Phishing Detection & Cyber Awareness Platform">
</p>

<p align="center">
  <strong>Autonomous Zero-Day &amp; Phishing Interceptor</strong>
</p>

<p align="center">
  AI-assisted phishing detection, suspicious URL inspection, zero-day-style anomaly analysis, threat learning, and SOC-oriented security workflows.
</p>

<p align="center">
  <a href="https://phisguard-z.vercel.app/">
    <img src="https://img.shields.io/badge/Frontend-Live-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Frontend Live">
  </a>
  <a href="https://phisguard-z.onrender.com/">
    <img src="https://img.shields.io/badge/Backend-Live-00C853?style=for-the-badge&logo=render&logoColor=white" alt="Backend Live">
  </a>
  <a href="https://github.com/TECH-SUGATA/phisguard-z">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-5B5BEA?style=flat-square" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 6">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js Backend">
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI">
</p>

🌐 Live Deployment

Component

URL

🚀 Frontend — Vercel

https://phisguard-z.vercel.app/

🧠 Backend / API — Render

https://phisguard-z.onrender.com/

💻 GitHub Repository

https://github.com/TECH-SUGATA/phisguard-z

Deployment architecture: the React/Vite frontend is deployed on Vercel, while the Express/Node.js security backend is deployed on Render.

📖 Table of Contents

Overview

Core Capabilities

Security Operations Dashboard

Deep Link & Zero-Day Neural Inspection Lab

Threat Analysis Workflow

Security Modules

Risk & Threat Telemetry

AI Security Engine

Architecture

Technology Stack

Project Structure

Local Development

Production Build

API Surface

Deployment

Security Considerations

Roadmap

Capability Matrix

Release

Author

License

🔥 Overview

PHISGUARD-Z is a cybersecurity research and demonstration platform designed around phishing analysis, suspicious-link inspection, zero-day-style anomaly detection, email/BEC investigation, threat-pattern learning, and SOC-oriented response workflows.

The interface combines a security dashboard with dedicated modules for investigating suspicious inputs and presenting analysis results in a structured security-operations workflow.

Core security workflow

             ┌─────────────────────────────┐
             │ URL / Email / Suspicious    │
             │ Input / Payload Scenario    │
             └──────────────┬──────────────┘
                            │
                            ▼
             ┌─────────────────────────────┐
             │ Normalization & Heuristics  │
             └──────────────┬──────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   URL / Domain       Email & BEC       Payload / Anomaly
     Analysis           Analysis            Analysis
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
             ┌─────────────────────────────┐
             │ AI-Assisted Analysis        │
             │ & Threat Correlation        │
             └──────────────┬──────────────┘
                            │
                            ▼
             ┌─────────────────────────────┐
             │ Risk / Threat Assessment    │
             └──────────────┬──────────────┘
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
           Quarantine   Learn Pattern  Forensics

✨ Core Capabilities

🔗 Deep URL & Suspicious-Link Inspection

URL normalization and lexical inspection

Domain and hostname analysis

Shannon entropy analysis

Punycode / IDN inspection

Homoglyph-oriented spoofing checks

Suspicious-pattern scoring

AI-assisted threat classification

📧 Email & BEC Analysis

Suspicious-message investigation

Business-email-compromise style analysis

Credential-harvesting indicators

Suspicious link detection

Social-engineering signals

Threat severity and response workflow

⚡ Zero-Day-Style Anomaly Analysis

Novel/anomalous indicator investigation

Obfuscation-oriented analysis

Evasion signal inspection

AI-assisted forensic interpretation

Threat-pattern learning workflow

🧠 Threat Learning

Detection pattern extraction

Learned threat-pattern storage in the running server

Reuse of observed indicators in future analysis

Security intelligence workflow visualization

🚨 SOC-Oriented Response

Quarantine workflow

Pattern-learning workflow

Forensic investigation modal

Security alert dispatch workflow

Audit-report workflow

📊 Security Operations Dashboard

The dashboard provides a SOC-style command center with high-level security telemetry and investigation controls.

Dashboard indicators

Indicator

Purpose

🌐 Links Inspected

Tracks suspicious links processed by the platform

🛡️ Threats Neutralized

Displays intercepted/contained threat activity

⚡ Zero-Day Attacks

Highlights zero-day-style anomaly findings

🧠 Learned Patterns

Represents reusable threat-pattern intelligence

The dashboard also exposes:

Deep inspection controls

URL test presets

Threat-result cards

Risk indicators

AI engine status

Extension-style threat notifications

Audit and response actions

🔗 Deep Link & Zero-Day Neural Inspection Lab

The central investigation interface allows an analyst to submit a URL or suspicious hyperlink for deeper analysis.

Analysis flow

Paste URL
   ↓
Deep Inspection
   ↓
URL + Domain Normalization
   ↓
Lexical / Entropy Analysis
   ↓
Punycode / Homoglyph Analysis
   ↓
Zero-Day-Style Anomaly Analysis
   ↓
AI-Assisted Forensics
   ↓
Risk & Threat Classification
   ↓
Response / Investigation Actions

Security signals exposed by the interface

Total Risk Score

Zero-Day Anomaly

Domain Entropy

Punycode / Homoglyph indicators

Engine classification

Threat category

Investigation context

🧪 Security Test Presets

The current interface includes demonstration presets such as:

Microsoft (Zero-Day)
PayPal (Homograph)
Chase (Credential)
MetaMask (Zero-Day)
DocuSign (OAuth)

These presets are intended for demonstrations, UI testing, and security-analysis workflows.

🚨 Threat Detection Result

The dashboard presents structured threat findings, for example:

CRITICAL ZERO-DAY
Engine: zero_day_neural_net

Credential Harvester

Available response actions include:

┌─────────────────┐
│   Quarantine    │
└─────────────────┘

┌─────────────────┐
│  Learn Pattern  │
└─────────────────┘

┌─────────────────┐
│ Forensic Review │
└─────────────────┘

AI and heuristic detections should be treated as analysis signals and independently validated before high-impact security decisions.

📈 Risk & Threat Telemetry

The inspection experience exposes security-oriented measurements such as:

Total Risk Score
Zero-Day Anomaly
Domain Entropy
Punycode / Homoglyph
Threat Engine
Threat Classification

Example values displayed in the current UI include:

Risk Score        → 98 / 100
Zero-Day Anomaly  → 92%
Domain Entropy    → 4.055 bits

These values are presented by the application as part of the analysis interface and are not, by themselves, proof that a URL or payload is malicious.

🧠 AI Security Engine

PHISGUARD-Z uses Google's Gemini SDK on the server side for AI-assisted analysis.

The backend also includes a fallback model pool so that an unavailable or rate-limited model can be skipped and the analysis can continue with another configured candidate.

High-level AI workflow

Security Input
     ↓
Heuristic Signals
     ↓
Gemini-Assisted Analysis
     ↓
Structured Threat Findings
     ↓
UI + Forensic Workflow

The Gemini credential is a server-side secret and should remain on the backend deployment.

🧩 Security Modules

📧 Email & BEC

Dedicated analysis workspace for suspicious messages, phishing indicators, social-engineering patterns, credential theft signals, and response actions.

🧪 Zero-Day Sandbox

Investigation-oriented interface for anomalous payload behavior, obfuscation, evasion indicators, and forensic results.

🛡️ Popup Protection

User-facing browser/extension-style threat notifications, including blocked-threat feedback.

🌐 URL Inspection

Direct investigation workflow covering URL normalization, lexical signals, entropy, spoofing indicators, Punycode, and threat scoring.

📑 Audit Reports

Structured representation of threat findings and investigation context for security reporting.

🧠 Learner

A pattern-learning workflow that turns observed indicators into reusable threat intelligence within the running application.

🔐 Vault

Dedicated UI area for protected security and investigation context.

🎮 Simulator

Controlled interface for demonstrating threat scenarios and security-response workflows.

🔎 Forensic Investigation

Detailed result views covering classification, risk, anomaly signals, engine output, and response controls.

🏗️ Architecture

Production deployment architecture

                         INTERNET
                            │
                            ▼
              ┌───────────────────────────┐
              │   Vercel Production UI    │
              │   React + Vite + TS       │
              │                           │
              │ phisguard-z.vercel.app   │
              └─────────────┬─────────────┘
                            │
                            │ HTTPS API
                            ▼
              ┌───────────────────────────┐
              │     Render Backend        │
              │   Node + Express + TS     │
              │                           │
              │ phisguard-z.onrender.com │
              └─────────────┬─────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │      Gemini AI API        │
              │   Server-side analysis    │
              └───────────────────────────┘

Internal security-analysis architecture

┌──────────────────────────────────────────────────────┐
│                    PHISGUARD-Z                        │
└──────────────────────────┬───────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   URL Inspection      Email / BEC      Payload / Anomaly
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                 Security Heuristics
                           │
                           ▼
                  AI-Assisted Analysis
                           │
                           ▼
                  Threat Correlation
                           │
                           ▼
                    Risk Assessment
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
     Quarantine       Learn Pattern      Forensics

🛠️ Technology Stack

Frontend

React 19

TypeScript

Vite 6

Tailwind CSS 4 / Tailwind Vite plugin

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

AI

Google Gemini

@google/genai

Additional Libraries

jsPDF

JSZip

Deployment

GitHub

Vercel — frontend

Render — backend

📂 Project Structure

PHISGUARD-Z/
│
├── assets/
│   └── phisguard-banner.png
│
├── src/
│   ├── components/
│   │   ├── AdvancedSecurityView.tsx
│   │   ├── AuditReportModal.tsx
│   │   ├── BrowserSimulator.tsx
│   │   ├── DashboardView.tsx
│   │   ├── EmailSecurityView.tsx
│   │   ├── ExtensionPopup.tsx
│   │   ├── FloatingExtensionDock.tsx
│   │   ├── InstallExtensionModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── NeuralLearner.tsx
│   │   ├── QuarantineVault.tsx
│   │   ├── ThreatAlertModal.tsx
│   │   └── ThreatHeatmap.tsx
│   │
│   ├── data/
│   │   ├── emailThreatPresets.ts
│   │   └── sampleThreats.ts
│   │
│   ├── utils/
│   │   ├── audio.ts
│   │   ├── extensionPackager.ts
│   │   ├── reportExporter.ts
│   │   └── ...
│   │
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md

⚙️ Local Development

1. Clone the repository

git clone https://github.com/TECH-SUGATA/phisguard-z.git
cd phisguard-z

2. Install dependencies

npm install

3. Configure environment variables

Create a local .env file in the project root:

GEMINI_API_KEY=your_gemini_api_key

The checked-in .env.example also contains APP_URL because the project originated from an AI Studio deployment template. The current server code reads GEMINI_API_KEY for Gemini access.

Never commit secrets

.env
.env.local
.env.production

should not contain credentials that are committed to GitHub.

4. Start development

npm run dev

The development script starts server.ts, which runs the Express API and Vite development middleware together.

🏭 Production Build

Build the frontend and bundle the backend:

npm run build

Start the production server:

npm start

Other available scripts:

npm run preview
npm run lint
npm run clean

🔌 API Surface

The current Express server defines these API routes:

Method

Endpoint

Purpose

GET

/api/health

Backend health/status check

GET

/api/threat-intel

Threat-intelligence data

GET

/api/threat-intel/sync

Threat-intelligence synchronization

POST

/api/background-scan/batch

Batch background URL analysis

POST

/api/scan

Deep URL/security inspection

POST

/api/learn-pattern

Store/learn a threat pattern

POST

/api/scan-email

Email/BEC analysis

POST

/api/dispatch-soc-alert

SOC alert dispatch workflow

POST

/api/detonate-payload

Payload/obfuscation analysis workflow

Example: URL scan

POST /api/scan
Content-Type: application/json

{
  "url": "https://example.com/login",
  "fastMode": false
}

☁️ Deployment

Frontend — Vercel

Production frontend:

https://phisguard-z.vercel.app/

Typical Vite deployment settings for this repository are:

Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install

Backend — Render

Production backend:

https://phisguard-z.onrender.com/

Required backend secret:

GEMINI_API_KEY=your_gemini_api_key

Split-host deployment note

The current React source contains API calls that use relative /api/... paths. When the frontend and backend are hosted on different domains, those requests must be routed to the Render backend (for example through a Vercel rewrite/proxy) or the frontend API base must be changed to use the Render API origin.

A future client-side configuration can use a public Vite variable such as:

VITE_API_URL=https://phisguard-z.onrender.com

with frontend requests built from that value.

Never place GEMINI_API_KEY in a VITE_* variable. Vite client variables are bundled into browser code; Gemini credentials belong on the server.

🔐 Security Considerations

PHISGUARD-Z is intended as a defensive cybersecurity research, education, and analysis platform.

Recommended production controls include:

Keep API secrets server-side.

Validate and sanitize all untrusted input.

Add authentication before exposing sensitive security APIs.

Add authorization and role-based access control.

Add rate limiting and abuse protection.

Use isolated infrastructure for dynamic payload analysis.

Add persistent audit logging.

Add production monitoring and alerting.

Validate AI-generated findings independently.

Treat heuristic/AI risk scores as decision-support signals rather than absolute truth.

📈 Roadmap

Persistent threat database

Authentication

Role-based access control

API rate limiting

Domain reputation integrations

External threat-intelligence integrations

Real-time notifications

SOC incident management

Container-isolated dynamic sandbox

Historical threat analytics

Case management

Persistent security audit logs

CI/CD security checks

Advanced threat visualization

Enterprise deployment support

📊 Capability Matrix

Capability

Current State

Security Dashboard

✅

URL Inspection

✅

Email & BEC

✅

Zero-Day-Style Analysis

✅

Popup Protection UI

✅

Simulator

✅

Learner

✅

Vault

✅

Audit Reports

✅

Threat Scoring

✅

Shannon Entropy Analysis

✅

Punycode / Homoglyph Analysis

✅

AI-Assisted Analysis

✅

Threat Pattern Learning

✅

Quarantine Workflow

✅

Forensic Investigation

✅

Persistent External Database

🚧

Authentication / RBAC

🚧

Enterprise Dynamic Sandbox

🚧

🔄 Development Workflow

Build / Modify
      ↓
GitHub main branch
      ↓
┌───────────────┬────────────────┐
│               │                │
▼               ▼                ▼
Vercel        Render          Local
Frontend      Backend         Testing

For production releases:

Code Change
   ↓
Test Locally
   ↓
Commit
   ↓
Push to GitHub
   ↓
Vercel / Render Deployment
   ↓
Production Verification

🏷️ Release

PHISGUARD-Z v1.0.0

Initial public release of the PHISGUARD-Z security-analysis platform.

Included in v1.0.0

Security dashboard

Deep URL inspection

Email & BEC analysis

Zero-day-style anomaly analysis

AI-assisted threat investigation

Entropy and spoofing analysis

Threat-pattern learning workflow

Quarantine workflow

Forensic investigation workflow

Audit-report workflow

Simulator and extension-style UI components

👨‍💻 Author

Sugata Nayak

B.Tech — Computer Science & Engineering (Artificial Intelligence)

GitHub

https://github.com/TECH-SUGATA

Repository

https://github.com/TECH-SUGATA/phisguard-z

📄 License

No explicit license file is currently included in the project repository.

Add a LICENSE file before distributing PHISGUARD-Z under an open-source license.

⭐ Support the Project

If PHISGUARD-Z is useful for cybersecurity research, AI experimentation, security education, portfolio work, or hackathon demonstrations, consider starring the repository:

⭐ https://github.com/TECH-SUGATA/phisguard-z

<p align="center">
  <strong>🛡️ PHISGUARD-Z</strong>
  <br />
  Detect • Analyze • Investigate • Contain • Learn
  <br /><br />
  <em>AI-Assisted Phishing &amp; Zero-Day Threat Analysis Platform</em>
</p>
