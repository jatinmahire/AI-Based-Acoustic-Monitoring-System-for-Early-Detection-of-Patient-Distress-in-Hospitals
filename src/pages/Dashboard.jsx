import { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../components/Layout';
import { generateAlertBatch, createAIEngine, getPatients, generateRiskScores, updateRiskFromAlert } from '../engine/aiEngine';
import './Dashboard.css';

// Time ago display
function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return `${Math.floor(diff / 3600)}h ago`;
}

// CRITICAL escalation config
const CRITICAL_WINDOW_MS = 30000;
const CRITICAL_THRESHOLD = 3;

// Global in-memory alert history
const alertHistoryStore = [];
export function getAlertHistory() { return alertHistoryStore; }

function Dashboard() {
    const [alerts, setAlerts] = useState(() => generateAlertBatch(4));
    const [stats, setStats] = useState({ total: 24, active: 4, emergency: 1, normal: 20 });
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [popups, setPopups] = useState([]);
    const [scanProgress, setScanProgress] = useState(0);
    const [detectionCount, setDetectionCount] = useState(0);
    const [engineStats, setEngineStats] = useState(null);

    // Loading animation state
    const [isBooting, setIsBooting] = useState(false);

    // CRITICAL failure detection
    const [criticalMode, setCriticalMode] = useState(false);
    const recentAlertTimestamps = useRef([]);

    // Predictive risk scores
    const [riskScores, setRiskScores] = useState(() => generateRiskScores());
    const allPatients = useRef(getPatients());

    // System status indicators (simulated)
    const systemIndicators = [
        { label: 'Edge AI Device', status: isMonitoring ? 'Connected' : 'Standby', icon: '🧠', active: isMonitoring },
        { label: 'Audio Monitoring', status: isMonitoring ? 'Active' : 'Idle', icon: '🎤', active: isMonitoring },
        { label: 'Data Encryption', status: 'Enabled', icon: '🔐', active: true },
        { label: 'Server Status', status: 'Running', icon: '🖥️', active: true },
    ];

    const engineRef = useRef(null);
    const scanRef = useRef(null);
    const popupIdRef = useRef(0);

    // Seed initial batch into history
    useEffect(() => {
        alerts.forEach(a => {
            if (!alertHistoryStore.find(h => h.id === a.id)) {
                alertHistoryStore.push({ ...a });
            }
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Recompute stats
    useEffect(() => {
        const activeAlerts = alerts.filter(a => !a.acknowledged);
        setStats({
            total: 24,
            active: activeAlerts.length,
            emergency: activeAlerts.filter(a => a.severityLevel === 'high').length,
            normal: Math.max(0, 24 - activeAlerts.length),
        });
    }, [alerts]);

    // CRITICAL auto-clear
    useEffect(() => {
        if (!criticalMode) return;
        const timeout = setTimeout(() => setCriticalMode(false), 15000);
        return () => clearTimeout(timeout);
    }, [criticalMode]);

    // Remove popup
    const removePopup = useCallback((id) => {
        setPopups(prev => prev.map(p => p.id === id ? { ...p, exiting: true } : p));
        setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 400);
    }, []);

    // Add popup
    const addPopup = useCallback((alert) => {
        const id = ++popupIdRef.current;
        const popup = {
            id, alertId: alert.id, room: alert.roomNumber,
            message: alert.condition, severity: alert.severityLevel,
            confidence: alert.confidenceScore, category: alert.category,
            triggerDetail: alert.triggerDetail, timestamp: alert.timestamp,
            icon: alert.icon, exiting: false,
        };
        setPopups(prev => [...prev, popup].slice(-4));
        setTimeout(() => removePopup(id), 6000);
    }, [removePopup]);

    // CRITICAL check
    const checkCriticalEscalation = useCallback(() => {
        const now = Date.now();
        recentAlertTimestamps.current = recentAlertTimestamps.current.filter(ts => (now - ts) < CRITICAL_WINDOW_MS);
        recentAlertTimestamps.current.push(now);
        if (recentAlertTimestamps.current.length >= CRITICAL_THRESHOLD) {
            setCriticalMode(true);
        }
    }, []);

    // Handle new alert
    const handleNewAlert = useCallback((alert) => {
        setAlerts(prev => [alert, ...prev].slice(0, 15));
        addPopup(alert);
        setDetectionCount(prev => prev + 1);
        checkCriticalEscalation();
        setRiskScores(prev => updateRiskFromAlert(prev, alert));
        // Save to history
        alertHistoryStore.push({ ...alert });
    }, [addPopup, checkCriticalEscalation]);

    const acknowledgeAlert = useCallback((alertId) => {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    }, []);

    const dismissAlert = useCallback((alertId) => {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
    }, []);

    const clearAllAlerts = useCallback(() => {
        setAlerts([]);
        setCriticalMode(false);
        recentAlertTimestamps.current = [];
    }, []);

    const acknowledgeAll = useCallback(() => {
        setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    }, []);

    // Toggle monitoring with loading animation
    const toggleMonitoring = useCallback(() => {
        if (isMonitoring) {
            if (engineRef.current) engineRef.current.stop();
            if (scanRef.current) clearInterval(scanRef.current);
            scanRef.current = null;
            setIsMonitoring(false);
            setScanProgress(0);
            setEngineStats(null);
        } else {
            // Boot sequence animation
            setIsBooting(true);
            setTimeout(() => {
                setIsBooting(false);
                setIsMonitoring(true);
                setDetectionCount(0);
                setScanProgress(0);

                engineRef.current = createAIEngine(handleNewAlert, {
                    intervalMs: 8000,
                    initialDelayMs: 2000,
                });
                engineRef.current.start();

                scanRef.current = setInterval(() => {
                    setScanProgress(prev => (prev >= 100 ? 0 : prev + 2));
                    if (engineRef.current) setEngineStats(engineRef.current.getStats());
                }, 200);
            }, 2500);
        }
    }, [isMonitoring, handleNewAlert]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (engineRef.current) engineRef.current.stop();
            if (scanRef.current) clearInterval(scanRef.current);
        };
    }, []);

    const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
    const topRiskPatients = allPatients.current
        .map(p => ({ ...p, risk: riskScores[p.id] || { score: 0, label: 'LOW', trend: '→' } }))
        .sort((a, b) => b.risk.score - a.risk.score);

    return (
        <Layout>
            {/* CRITICAL flashing overlay */}
            {criticalMode && (
                <div className="critical-overlay">
                    <div className="critical-banner">
                        <span className="critical-icon">🚨</span>
                        <div className="critical-text">
                            <span className="critical-title">⚠️ CRITICAL EMERGENCY — MULTIPLE ALERTS DETECTED</span>
                            <span className="critical-sub">{recentAlertTimestamps.current.length} alerts in last 30 seconds — Immediate attention required</span>
                        </div>
                        <button className="critical-dismiss" onClick={() => setCriticalMode(false)}>✕ Dismiss</button>
                    </div>
                </div>
            )}

            {/* Boot/Loading Overlay */}
            {isBooting && (
                <div className="boot-overlay">
                    <div className="boot-card">
                        <div className="boot-spinner"></div>
                        <h3 className="boot-title">Initializing AI Engine</h3>
                        <div className="boot-steps">
                            <div className="boot-step done">✅ Loading neural network models…</div>
                            <div className="boot-step done delay-1">✅ Connecting Edge AI devices…</div>
                            <div className="boot-step animating delay-2">⏳ Calibrating audio sensors…</div>
                            <div className="boot-step pending delay-3">⬜ Starting vitals stream…</div>
                        </div>
                        <div className="boot-bar">
                            <div className="boot-bar-fill"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Notifications */}
            <div className="popup-container">
                {popups.map((popup, i) => (
                    <div
                        key={popup.id}
                        className={`ai-popup ${popup.severity} ${popup.exiting ? 'exiting' : ''}`}
                        style={{ bottom: `${24 + i * 130}px` }}
                    >
                        <div className="popup-glow"></div>
                        <button className="popup-close" onClick={() => removePopup(popup.id)}>✕</button>
                        <div className="popup-icon">{popup.icon}</div>
                        <div className="popup-content">
                            <span className="popup-title">AI Detected — Room {popup.room}</span>
                            <span className="popup-message">{popup.message}</span>
                            <span className="popup-trigger">{popup.triggerDetail}</span>
                            <span className="popup-meta">
                                <span className={`popup-severity ${popup.severity}`}>
                                    {popup.severity === 'high' ? '🔴 HIGH' : '🟡 MEDIUM'}
                                </span>
                                <span className="popup-conf">🎯 {popup.confidence}%</span>
                                <span className="popup-time">
                                    {new Date(popup.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Page Header */}
            <div className="dashboard-header fade-in">
                <div>
                    <h1 className="page-title">📊 Command Center</h1>
                    <p className="page-subtitle">Real-time patient monitoring & AI distress detection</p>
                </div>
                <div className="header-right">
                    <div className="live-clock">
                        <span className="clock-dot"></span>
                        <span>{currentTime.toLocaleTimeString()}</span>
                    </div>
                    <div className={`status-online ${criticalMode ? 'critical' : ''}`}>
                        {criticalMode ? '🔴 CRITICAL' : 'System Online'}
                    </div>
                </div>
            </div>

            {/* System Status Indicators */}
            <div className="system-indicators fade-in">
                {systemIndicators.map((ind) => (
                    <div key={ind.label} className={`sys-indicator ${ind.active ? 'active' : 'inactive'}`}>
                        <span className="sys-ind-icon">{ind.icon}</span>
                        <div className="sys-ind-info">
                            <span className="sys-ind-label">{ind.label}</span>
                            <span className={`sys-ind-status ${ind.active ? 'online' : 'offline'}`}>
                                <span className="sys-ind-dot"></span>
                                {ind.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Monitoring Control Bar */}
            <div className={`monitoring-bar fade-in ${isMonitoring ? 'active' : ''} ${criticalMode ? 'critical-bar' : ''}`}>
                <div className="monitoring-left">
                    <div className={`monitoring-indicator ${isMonitoring ? 'active' : ''}`}>
                        <span className="indicator-dot"></span>
                        <span>{isMonitoring ? 'AI Engine Active' : 'AI Engine Standby'}</span>
                    </div>
                    {isMonitoring && engineStats && (
                        <div className="monitoring-stats">
                            <span className="monitor-stat">
                                <span className="stat-label">Detections:</span>
                                <span className="stat-num">{detectionCount}</span>
                            </span>
                            <span className="monitor-stat">
                                <span className="stat-label">Interval:</span>
                                <span className="stat-num">{engineStats.intervalMs / 1000}s</span>
                            </span>
                            <span className="monitor-stat">
                                <span className="stat-label">Uptime:</span>
                                <span className="stat-num">{engineStats.uptime}s</span>
                            </span>
                            <span className="monitor-stat">
                                <span className="stat-label">Scan:</span>
                                <span className="stat-num">{scanProgress}%</span>
                            </span>
                        </div>
                    )}
                </div>
                <div className="monitoring-right">
                    {isMonitoring && (
                        <div className="scan-bar-wrapper">
                            <div className="scan-bar">
                                <div className="scan-fill" style={{ width: `${scanProgress}%` }}></div>
                            </div>
                            <span className="scan-label">AI Engine scanning audio, vitals & motion…</span>
                        </div>
                    )}
                    <button
                        className={`monitoring-btn ${isMonitoring ? 'stop' : 'start'}`}
                        onClick={toggleMonitoring}
                        disabled={isBooting}
                    >
                        <span className="btn-pulse"></span>
                        <span>{isBooting ? '⏳ Booting…' : isMonitoring ? '⏹ Stop AI Engine' : '▶ Start AI Engine'}</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                <div className="stat-card teal fade-in fade-in-delay-1">
                    <div className="stat-icon teal">🏥</div>
                    <div className="stat-info">
                        <h3>{stats.total}</h3>
                        <p>Total Patients</p>
                    </div>
                    <div className="stat-trend up">↑ 2 today</div>
                </div>
                <div className={`stat-card orange fade-in fade-in-delay-2 ${criticalMode ? 'critical-pulse' : ''}`}>
                    <div className="stat-icon orange">⚠️</div>
                    <div className="stat-info">
                        <h3>{stats.active}</h3>
                        <p>Active Alerts</p>
                    </div>
                    <div className="stat-trend warn">{criticalMode ? '🔴 CRITICAL' : 'Live'}</div>
                </div>
                <div className={`stat-card red fade-in fade-in-delay-3 ${criticalMode ? 'critical-pulse' : ''}`}>
                    <div className="stat-icon red">🚨</div>
                    <div className="stat-info">
                        <h3>{stats.emergency}</h3>
                        <p>High Emergency</p>
                    </div>
                    <div className="stat-trend danger">{criticalMode ? 'CATASTROPHIC' : 'Critical'}</div>
                </div>
                <div className="stat-card green fade-in fade-in-delay-4">
                    <div className="stat-icon green">💚</div>
                    <div className="stat-info">
                        <h3>{stats.normal}</h3>
                        <p>Normal Status</p>
                    </div>
                    <div className="stat-trend up">Stable</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Live Alerts Panel */}
                <div className="alerts-panel fade-in">
                    <div className="panel-header">
                        <div className="section-title">
                            <span className="icon">🔔</span>
                            <span>Live AI Alerts</span>
                            <span className="live-dot"></span>
                        </div>
                        <div className="panel-actions">
                            <span className="alert-count">{unacknowledgedCount} unread / {alerts.length} total</span>
                            {alerts.length > 0 && (
                                <>
                                    <button className="panel-btn ack-all-btn" onClick={acknowledgeAll}>✓ Ack All</button>
                                    <button className="panel-btn clear-all-btn" onClick={clearAllAlerts}>🗑️ Clear All</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="alerts-list">
                        {alerts.length === 0 && (
                            <div className="no-alerts">
                                <span className="no-alert-icon">✅</span>
                                <p>No active alerts — all clear!</p>
                                <p className="no-alert-hint">Start AI Engine to begin monitoring</p>
                            </div>
                        )}
                        {alerts.map((alert, index) => (
                            <div
                                key={alert.id}
                                className={`alert-card ${alert.severityLevel} ${index === 0 ? 'newest' : ''} ${alert.acknowledged ? 'acknowledged' : ''}`}
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <div className="alert-header">
                                    <div className="alert-room-info">
                                        <span className="alert-icon">{alert.icon}</span>
                                        <div>
                                            <span className="alert-room">Room {alert.roomNumber}</span>
                                            <span className="alert-patient">{alert.patientName} ({alert.patientId})</span>
                                        </div>
                                    </div>
                                    <span className={`alert-badge ${alert.severityLevel}`}>
                                        {alert.severityLevel === 'high' ? '🔴 HIGH' : alert.severityLevel === 'medium' ? '🟡 MEDIUM' : '🟢 LOW'}
                                    </span>
                                </div>

                                <p className="alert-description">{alert.condition}</p>
                                <p className="alert-trigger">{alert.triggerDetail}</p>

                                <div className="alert-vitals">
                                    <span>❤️ {alert.vitals.heartRate} BPM</span>
                                    <span>🩸 SpO2 {alert.vitals.spO2}%</span>
                                    <span>🌡️ {alert.vitals.temperature}°C</span>
                                    <span>🫁 {alert.vitals.respiratoryRate}/min</span>
                                </div>

                                <div className="alert-timestamp-row">
                                    <span className="alert-timestamp">🕐 {alert.formattedTime}</span>
                                    <span className="alert-ago">{timeAgo(alert.timestamp)}</span>
                                    {riskScores[alert.patientId] && (
                                        <span className={`risk-mini-badge ${riskScores[alert.patientId].label.toLowerCase()}`}>
                                            Risk: {riskScores[alert.patientId].score}%
                                        </span>
                                    )}
                                    <span className="alert-id-badge">{alert.id}</span>
                                </div>

                                <div className="alert-footer">
                                    <div className="alert-confidence">
                                        <span>AI Confidence:</span>
                                        <div className="confidence-bar">
                                            <div
                                                className={`confidence-fill ${alert.severityLevel}`}
                                                style={{ width: `${alert.confidenceScore}%` }}
                                            ></div>
                                        </div>
                                        <span className="confidence-value">{alert.confidenceScore}%</span>
                                    </div>
                                </div>

                                <div className="alert-actions">
                                    {!alert.acknowledged ? (
                                        <button className="alert-action-btn ack-btn" onClick={() => acknowledgeAlert(alert.id)}>
                                            ✓ Acknowledge
                                        </button>
                                    ) : (
                                        <span className="ack-badge">✅ Acknowledged</span>
                                    )}
                                    <button className="alert-action-btn dismiss-btn" onClick={() => dismissAlert(alert.id)}>
                                        ✕ Dismiss
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side Panel */}
                <div className="side-panel">
                    {/* Predictive Risk Scores */}
                    <div className="card risk-card fade-in fade-in-delay-1">
                        <div className="section-title">
                            <span className="icon">🎯</span>
                            <span>Predictive Risk Scores</span>
                        </div>
                        <div className="risk-list">
                            {topRiskPatients.slice(0, 6).map(p => (
                                <div key={p.id} className={`risk-item ${p.risk.label.toLowerCase()}`}>
                                    <div className="risk-patient-info">
                                        <span className="risk-name">{p.name}</span>
                                        <span className="risk-room">Room {p.room}</span>
                                    </div>
                                    <div className="risk-score-area">
                                        <div className="risk-bar-bg">
                                            <div
                                                className={`risk-bar-fill ${p.risk.label.toLowerCase()}`}
                                                style={{ width: `${p.risk.score}%` }}
                                            ></div>
                                        </div>
                                        <span className={`risk-percentage ${p.risk.label.toLowerCase()}`}>
                                            {p.risk.score}%
                                        </span>
                                        <span className={`risk-label-badge ${p.risk.label.toLowerCase()}`}>
                                            {p.risk.trend} {p.risk.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI System Status */}
                    <div className="card system-card fade-in fade-in-delay-2">
                        <div className="section-title">
                            <span className="icon">🤖</span>
                            <span>AI Engine Status</span>
                        </div>
                        <div className="ai-metrics">
                            {[
                                { label: 'Model Accuracy', value: '96.2%', width: '96%' },
                                { label: 'Audio Analysis', value: '89.1%', width: '89%' },
                                { label: 'Motion Detection', value: '94.5%', width: '94%' },
                                { label: 'Vitals Processing', value: '98.0%', width: '98%' },
                            ].map(m => (
                                <div key={m.label} className="ai-metric">
                                    <span className="metric-label">{m.label}</span>
                                    <div className="metric-bar-container">
                                        <div className="metric-bar" style={{ width: m.width }}></div>
                                    </div>
                                    <span className="metric-value">{m.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="ai-uptime">
                            <span>⏱️ Uptime: 99.97%</span>
                            <span>🔄 Last sync: 3s ago</span>
                        </div>
                    </div>

                    {/* Ward Overview */}
                    <div className="card ward-card fade-in fade-in-delay-3">
                        <div className="section-title">
                            <span className="icon">🏢</span>
                            <span>Ward Overview</span>
                        </div>
                        <div className="ward-list">
                            {[
                                { name: 'ICU Ward A', patients: 6, alerts: 2, status: 'warning' },
                                { name: 'General Ward B', patients: 8, alerts: 0, status: 'normal' },
                                { name: 'Cardiac Ward C', patients: 5, alerts: 1, status: 'warning' },
                                { name: 'Neuro Ward D', patients: 5, alerts: 0, status: 'normal' },
                            ].map((ward) => (
                                <div key={ward.name} className="ward-item">
                                    <div className="ward-info">
                                        <span className="ward-name">{ward.name}</span>
                                        <span className="ward-patients">{ward.patients} patients</span>
                                    </div>
                                    <div className={`ward-status ${ward.status}`}>
                                        {ward.alerts > 0 ? `${ward.alerts} alert${ward.alerts > 1 ? 's' : ''}` : 'Clear'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
