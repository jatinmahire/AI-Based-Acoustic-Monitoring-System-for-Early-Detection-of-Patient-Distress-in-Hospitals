# 🏥 AI Patient Distress Monitoring System

> **Real-time AI-powered patient monitoring dashboard for hospitals** — detecting distress, alerting nurses, and providing comfort assistance to patients.

![Dashboard Preview](screenshots/dashboard.png)

---

## 🚀 Problem Statement

In hospitals, patients often experience distress — respiratory issues, panic attacks, falls, or emotional stress — that goes unnoticed until a nurse physically checks in. **Delayed response times** directly impact patient outcomes and hospital efficiency.

## 💡 Our Solution

An **AI-powered real-time monitoring system** that:

- 🎤 **Listens** for audio cues (coughing, crying, "help" calls)
- 📹 **Analyzes** video feeds for falls and abnormal movement
- 📊 **Monitors** vitals for anomalies (heart rate, SpO2, stress)
- 🚨 **Alerts** nurses instantly with severity-based priority
- 💚 **Comforts** patients automatically with calming exercises

## ✨ Features

### 📊 Command Center Dashboard
- Real-time stats: total patients, active alerts, emergencies
- Live clock and AI system status
- Alert panel with severity (HIGH / MEDIUM), confidence %, and timestamps
- Ward overview and activity feed

### 🚨 AI Detection System
- Start/Stop AI Monitoring with one click
- Auto-generates alerts every 10 seconds
- Detects: cough, panic, falls, irregular breathing, heart rate anomaly, SpO2 drops, stress
- Popup toast notifications with priority coloring

### 🛏️ Patient Room Monitor
- 8 patient rooms with live status
- Color-coded: 🟢 Normal, 🟡 Warning, 🔴 Critical
- Individual vitals display per room
- AI monitoring toggle per room

### 💚 AI Comfort Assistant
- Activated on distress detection
- **Guided breathing exercise** with animated circle (inhale → hold → exhale)
- Calming messages: "Stay calm, nurse is coming"
- Play calming audio button with wave animation
- **Live stress meter** (SVG gauge) that decreases during comfort protocol
- Automated comfort actions: dim lights, adjust temperature, notify nurse

### 📈 Analytics Dashboard
- **Stress Events Timeline** — Line chart showing peak hours
- **Emergency Count** — Color-coded bar chart
- **Alert Types Distribution** — Doughnut chart (Respiratory, Cardiac, Fall, Stress, Pain)
- **Ward Alert Heatmap** — Horizontal bar chart
- **Response Time Comparison** — AI detection (1.9s avg) vs Nurse response (2.7 min)
- Period selector: Today / Week / Month

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Charts | Chart.js + react-chartjs-2 |
| Routing | React Router DOM v7 |
| Styling | Custom CSS (Glassmorphism + Dark Medical Theme) |
| Fonts | Inter + Orbitron (Google Fonts) |

## 🎨 Design

- **Dark medical UI** with navy/teal color scheme
- **Glassmorphism** card effects with backdrop blur
- **Neon accents** — teal, red, orange, purple glows
- **Micro-animations** — fade-ins, pulse effects, shimmer bars
- **Responsive** layout for desktop and tablet

## 📸 Screenshots

| Dashboard | AI Alerts | Comfort AI | Analytics |
|-----------|----------|------------|-----------|
| ![Dashboard](screenshots/dashboard.png) | ![Alerts](screenshots/alerts.png) | ![Comfort](screenshots/comfort.png) | ![Analytics](screenshots/analytics.png) |

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-patient-monitoring.git
cd ai-patient-monitoring

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

## 🔮 Future Scope (Round 2 — Real AI Backend)

| Feature | Technology |
|---------|-----------|
| Real audio analysis | Python + TensorFlow / PyTorch |
| Speech-to-text detection | Whisper API |
| Video fall detection | OpenCV + MediaPipe |
| Vitals monitoring | IoT sensor integration |
| Real-time alerts | WebSocket + Firebase |
| Database | MongoDB / PostgreSQL |
| Deployment | Docker + AWS / GCP |
| Mobile app | React Native |

## 👥 Team

Built for hackathon prototype demonstration.

## 📄 License

MIT License — free to use and modify.

---

> **Note:** This is a frontend prototype. AI detection is simulated for demonstration purposes. Real AI backend will be implemented in the next development phase.
