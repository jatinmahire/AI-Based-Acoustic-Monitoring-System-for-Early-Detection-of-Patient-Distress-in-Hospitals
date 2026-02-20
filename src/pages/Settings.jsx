import { useState } from 'react';
import Layout from '../components/Layout';
import './Settings.css';

function Settings() {
    const [activeTab, setActiveTab] = useState('architecture');

    return (
        <Layout>
            <div className="settings-header fade-in">
                <div>
                    <h1 className="page-title">⚙️ System Settings</h1>
                    <p className="page-subtitle">Architecture, configuration & deployment details</p>
                </div>
            </div>

            <div className="settings-tabs fade-in">
                {[
                    { id: 'architecture', label: '🏗️ Architecture', },
                    { id: 'deployment', label: '🚀 Deployment', },
                    { id: 'config', label: '🔧 Configuration', },
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'architecture' && (
                <div className="settings-content fade-in">
                    {/* Architecture Intro */}
                    <div className="arch-intro-card">
                        <h2>🏗️ System Architecture — Production Design</h2>
                        <p>
                            In production, the AI NurseGuard system will use a multi-tier architecture combining
                            <strong> Edge AI devices</strong> at each bedside, an <strong>encrypted hospital server</strong> for
                            data aggregation, and a <strong>real-time nurse dashboard</strong> for monitoring and response.
                        </p>
                    </div>

                    {/* ASCII/Visual Architecture Diagram */}
                    <div className="arch-diagram-card">
                        <h3>📐 System Architecture Diagram</h3>
                        <div className="arch-diagram">
                            {/* Tier 1: Edge Devices */}
                            <div className="arch-tier">
                                <div className="tier-label">TIER 1 — Edge AI Devices (Bedside)</div>
                                <div className="tier-nodes">
                                    <div className="arch-node edge">
                                        <span className="node-icon">🎤</span>
                                        <span className="node-title">Audio Sensor</span>
                                        <span className="node-desc">Cough, cry, speech detection</span>
                                    </div>
                                    <div className="arch-node edge">
                                        <span className="node-icon">📹</span>
                                        <span className="node-title">IR Camera</span>
                                        <span className="node-desc">Fall & motion detection</span>
                                    </div>
                                    <div className="arch-node edge">
                                        <span className="node-icon">💓</span>
                                        <span className="node-title">Vitals Monitor</span>
                                        <span className="node-desc">HR, SpO2, BP, Temp</span>
                                    </div>
                                    <div className="arch-node edge">
                                        <span className="node-icon">🧠</span>
                                        <span className="node-title">Edge AI Chip</span>
                                        <span className="node-desc">NVIDIA Jetson / Coral TPU</span>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="arch-arrow">
                                <div className="arrow-line"></div>
                                <span className="arrow-label">🔒 TLS 1.3 Encrypted</span>
                                <div className="arrow-line"></div>
                            </div>

                            {/* Tier 2: Hospital Server */}
                            <div className="arch-tier">
                                <div className="tier-label">TIER 2 — Encrypted Hospital Server</div>
                                <div className="tier-nodes">
                                    <div className="arch-node server">
                                        <span className="node-icon">🖥️</span>
                                        <span className="node-title">Data Aggregator</span>
                                        <span className="node-desc">Collects all edge data</span>
                                    </div>
                                    <div className="arch-node server">
                                        <span className="node-icon">🤖</span>
                                        <span className="node-title">AI Inference Engine</span>
                                        <span className="node-desc">TensorFlow / PyTorch models</span>
                                    </div>
                                    <div className="arch-node server">
                                        <span className="node-icon">🗄️</span>
                                        <span className="node-title">HIPAA Database</span>
                                        <span className="node-desc">Encrypted patient records</span>
                                    </div>
                                    <div className="arch-node server">
                                        <span className="node-icon">🔐</span>
                                        <span className="node-title">Auth Gateway</span>
                                        <span className="node-desc">OAuth 2.0 + MFA</span>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="arch-arrow">
                                <div className="arrow-line"></div>
                                <span className="arrow-label">⚡ WebSocket (Real-Time)</span>
                                <div className="arrow-line"></div>
                            </div>

                            {/* Tier 3: Dashboard */}
                            <div className="arch-tier">
                                <div className="tier-label">TIER 3 — Nurse Dashboard (This UI)</div>
                                <div className="tier-nodes">
                                    <div className="arch-node dashboard">
                                        <span className="node-icon">📊</span>
                                        <span className="node-title">Live Dashboard</span>
                                        <span className="node-desc">Real-time alerts & vitals</span>
                                    </div>
                                    <div className="arch-node dashboard">
                                        <span className="node-icon">🔔</span>
                                        <span className="node-title">Alert Manager</span>
                                        <span className="node-desc">Acknowledge & escalate</span>
                                    </div>
                                    <div className="arch-node dashboard">
                                        <span className="node-icon">💚</span>
                                        <span className="node-title">Comfort AI</span>
                                        <span className="node-desc">Automated patient comfort</span>
                                    </div>
                                    <div className="arch-node dashboard">
                                        <span className="node-icon">📈</span>
                                        <span className="node-title">Analytics</span>
                                        <span className="node-desc">Trends & risk prediction</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Flow Details */}
                    <div className="arch-details-grid">
                        <div className="detail-card">
                            <h4>🧠 Edge AI Processing</h4>
                            <ul>
                                <li>Audio: YAMNet (cough/cry/speech classifier) runs on-device</li>
                                <li>Vision: MoveNet pose estimation for fall detection</li>
                                <li>Vitals: Real-time stream from IoT sensors via BLE</li>
                                <li>Latency: &lt;200ms edge inference</li>
                                <li>Privacy: Raw audio/video never leaves the device</li>
                            </ul>
                        </div>
                        <div className="detail-card">
                            <h4>🔐 Security & Compliance</h4>
                            <ul>
                                <li>HIPAA-compliant data handling</li>
                                <li>End-to-end TLS 1.3 encryption</li>
                                <li>AES-256 at-rest encryption for patient data</li>
                                <li>Role-based access (Nurse / Admin / Doctor)</li>
                                <li>Audit logging for all alert acknowledgements</li>
                            </ul>
                        </div>
                        <div className="detail-card">
                            <h4>⚡ Real-Time Communication</h4>
                            <ul>
                                <li>WebSocket for sub-second alert delivery</li>
                                <li>MQTT for edge → server telemetry</li>
                                <li>Fallback to SSE for degraded connections</li>
                                <li>Offline queuing on edge devices</li>
                                <li>Auto-reconnect with exponential backoff</li>
                            </ul>
                        </div>
                        <div className="detail-card">
                            <h4>📊 AI Models</h4>
                            <ul>
                                <li>Audio Distress Classifier — 96.2% accuracy</li>
                                <li>Fall Detection CNN — 94.5% accuracy</li>
                                <li>Vitals Anomaly LSTM — 89.1% accuracy</li>
                                <li>Predictive Risk Score — Gradient Boosted model</li>
                                <li>Models retrain weekly on anonymized data</li>
                            </ul>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="tech-stack-card">
                        <h3>🛠️ Technology Stack</h3>
                        <div className="tech-grid">
                            {[
                                { layer: 'Edge Hardware', tech: 'NVIDIA Jetson Nano, Coral Edge TPU, Raspberry Pi 4' },
                                { layer: 'Edge AI', tech: 'TensorFlow Lite, ONNX Runtime, YAMNet, MoveNet' },
                                { layer: 'Communication', tech: 'MQTT, WebSocket, TLS 1.3, BLE 5.0' },
                                { layer: 'Server Backend', tech: 'Node.js, Python FastAPI, Redis, PostgreSQL' },
                                { layer: 'AI/ML Pipeline', tech: 'PyTorch, TensorFlow, scikit-learn, MLflow' },
                                { layer: 'Frontend', tech: 'React 18, Vite, Chart.js, CSS3 Animations' },
                                { layer: 'Security', tech: 'OAuth 2.0, JWT, AES-256, HIPAA compliance' },
                                { layer: 'DevOps', tech: 'Docker, Kubernetes, GitHub Actions, Prometheus' },
                            ].map(item => (
                                <div key={item.layer} className="tech-item">
                                    <span className="tech-layer">{item.layer}</span>
                                    <span className="tech-value">{item.tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'deployment' && (
                <div className="settings-content fade-in">
                    <div className="arch-intro-card">
                        <h2>🚀 Deployment Pipeline</h2>
                        <p>The system follows a staged deployment: Edge devices → Hospital Server → Dashboard. Each component is independently deployable and scalable.</p>
                    </div>
                    <div className="arch-details-grid">
                        <div className="detail-card">
                            <h4>📦 Phase 1 — Prototype (Current)</h4>
                            <ul>
                                <li>Frontend-only simulation</li>
                                <li>Simulated AI engine generates alerts</li>
                                <li>No real hardware dependency</li>
                                <li>Demo-ready for hackathon judging</li>
                            </ul>
                        </div>
                        <div className="detail-card">
                            <h4>🔬 Phase 2 — Pilot (6 months)</h4>
                            <ul>
                                <li>Deploy 5 edge devices in ICU</li>
                                <li>Connect to hospital WiFi</li>
                                <li>Real vitals integration via BLE</li>
                                <li>Train models on real clinical data</li>
                            </ul>
                        </div>
                        <div className="detail-card">
                            <h4>🏥 Phase 3 — Hospital Scale (1 year)</h4>
                            <ul>
                                <li>100+ rooms with edge AI</li>
                                <li>Dedicated hospital server cluster</li>
                                <li>EHR integration (HL7 FHIR)</li>
                                <li>Multi-hospital federation</li>
                            </ul>
                        </div>
                        <div className="detail-card">
                            <h4>🌐 Phase 4 — SaaS (2 years)</h4>
                            <ul>
                                <li>Cloud-hosted multi-tenant platform</li>
                                <li>Subscription model for hospitals</li>
                                <li>API marketplace for integrations</li>
                                <li>Global regulatory compliance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'config' && (
                <div className="settings-content fade-in">
                    <div className="arch-intro-card">
                        <h2>🔧 System Configuration</h2>
                        <p>Current prototype configuration parameters. In production, these would be managed via the hospital admin panel.</p>
                    </div>
                    <div className="config-table-wrap">
                        <table className="config-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { param: 'AI_SCAN_INTERVAL', value: '8000ms', desc: 'Time between AI detection cycles' },
                                    { param: 'CRITICAL_WINDOW', value: '30s', desc: 'Window for multi-alert CRITICAL escalation' },
                                    { param: 'CRITICAL_THRESHOLD', value: '3 alerts', desc: 'Alerts within window to trigger CRITICAL' },
                                    { param: 'MAX_POPUP_STACK', value: '4', desc: 'Max simultaneous popup notifications' },
                                    { param: 'ALERT_AUTO_DISMISS', value: '6000ms', desc: 'Popup auto-dismiss timeout' },
                                    { param: 'RISK_UPDATE_INTERVAL', value: 'Per alert', desc: 'When patient risk scores are recalculated' },
                                    { param: 'SEVERITY_ESCALATION', value: 'Enabled', desc: 'High-risk patients auto-escalate severity' },
                                    { param: 'ENCRYPTION', value: 'TLS 1.3 + AES-256', desc: 'Data encryption standard' },
                                    { param: 'AUTH_METHOD', value: 'OAuth 2.0 + MFA', desc: 'Authentication method' },
                                    { param: 'DATA_RETENTION', value: '90 days', desc: 'Alert history retention period' },
                                ].map(row => (
                                    <tr key={row.param}>
                                        <td className="config-param">{row.param}</td>
                                        <td className="config-value">{row.value}</td>
                                        <td>{row.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Settings;
