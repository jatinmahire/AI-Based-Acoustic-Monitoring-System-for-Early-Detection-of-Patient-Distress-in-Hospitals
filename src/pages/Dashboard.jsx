import { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../components/Layout';
import './Dashboard.css';

// Fake alert data pool
const alertPool = [
    { room: 203, patient: 'Mike Johnson', type: 'Respiratory distress detected', confidence: 94, severity: 'high', icon: '🚨' },
    { room: 105, patient: 'Helen Park', type: 'Patient stress levels elevated', confidence: 81, severity: 'medium', icon: '⚠️' },
    { room: 312, patient: 'James Carter', type: 'Abnormal heart rate pattern', confidence: 88, severity: 'high', icon: '🚨' },
    { room: 207, patient: 'David Lee', type: 'Fall risk detected via motion sensor', confidence: 76, severity: 'medium', icon: '⚠️' },
    { room: 118, patient: 'Anna White', type: 'Sleep apnea episode detected', confidence: 91, severity: 'high', icon: '🚨' },
    { room: 204, patient: 'Emily Davis', type: 'Panic keywords detected in audio', confidence: 85, severity: 'medium', icon: '⚠️' },
    { room: 301, patient: 'Robert Kim', type: 'Sudden movement anomaly', confidence: 72, severity: 'low', icon: '🔔' },
    { room: 215, patient: 'Grace Miller', type: 'Cough frequency above threshold', confidence: 79, severity: 'medium', icon: '⚠️' },
    { room: 109, patient: 'Thomas Brown', type: 'Blood pressure spike detected', confidence: 93, severity: 'high', icon: '🚨' },
    { room: 220, patient: 'Lisa Chen', type: 'Restless movement pattern', confidence: 68, severity: 'low', icon: '🔔' },
    { room: 310, patient: 'Kevin Patel', type: 'Help keyword detected in audio', confidence: 90, severity: 'high', icon: '🚨' },
    { room: 112, patient: 'Sarah Lopez', type: 'Sudden temperature increase', confidence: 83, severity: 'medium', icon: '⚠️' },
];

// Detection events for the AI monitoring simulation
const detectionEvents = [
    { type: 'cough', message: 'Persistent cough detected', room: 204, severity: 'medium' },
    { type: 'panic', message: 'Panic vocalization detected', room: 312, severity: 'high' },
    { type: 'help', message: '"Help" keyword detected in audio', room: 310, severity: 'high' },
    { type: 'fall', message: 'Fall detected via motion sensor', room: 207, severity: 'high' },
    { type: 'breathing', message: 'Irregular breathing pattern', room: 118, severity: 'medium' },
    { type: 'movement', message: 'Abnormal movement detected', room: 301, severity: 'medium' },
    { type: 'heartrate', message: 'Heart rate anomaly detected', room: 109, severity: 'high' },
    { type: 'stress', message: 'Elevated stress indicators', room: 105, severity: 'medium' },
    { type: 'oxygen', message: 'SpO2 level dropping', room: 203, severity: 'high' },
    { type: 'cry', message: 'Distress vocalization detected', room: 215, severity: 'medium' },
];

function getTimeAgo(index) {
    const times = ['Just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago', '18 min ago', '25 min ago', '32 min ago'];
    return times[index] || `${30 + index * 5} min ago`;
}

function Dashboard() {
    const [alerts, setAlerts] = useState(() => alertPool.slice(0, 4));
    const [stats, setStats] = useState({
        total: 24,
        active: 3,
        emergency: 1,
        normal: 20,
    });
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [popups, setPopups] = useState([]);
    const [scanProgress, setScanProgress] = useState(0);
    const [detectionCount, setDetectionCount] = useState(0);
    const monitoringRef = useRef(null);
    const scanRef = useRef(null);
    const popupIdRef = useRef(0);

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate new alerts arriving (baseline)
    const addRandomAlert = useCallback(() => {
        const pool = alertPool.filter(a => !alerts.find(existing => existing.room === a.room && existing.type === a.type));
        if (pool.length === 0) return;
        const newAlert = { ...pool[Math.floor(Math.random() * pool.length)], timestamp: Date.now() };
        setAlerts(prev => [newAlert, ...prev].slice(0, 8));
        setStats(prev => ({
            ...prev,
            active: Math.min(prev.active + 1, 8),
            emergency: newAlert.severity === 'high' ? Math.min(prev.emergency + 1, 5) : prev.emergency,
        }));
    }, [alerts]);

    useEffect(() => {
        const interval = setInterval(addRandomAlert, 15000);
        return () => clearInterval(interval);
    }, [addRandomAlert]);

    // Remove popup after timeout
    const removePopup = useCallback((id) => {
        setPopups(prev => prev.map(p => p.id === id ? { ...p, exiting: true } : p));
        setTimeout(() => {
            setPopups(prev => prev.filter(p => p.id !== id));
        }, 400);
    }, []);

    // Add a popup notification
    const addPopup = useCallback((detection) => {
        const id = ++popupIdRef.current;
        const popup = { id, ...detection, exiting: false };
        setPopups(prev => [...prev, popup].slice(-4)); // max 4 popups
        // Auto remove after 6 seconds
        setTimeout(() => removePopup(id), 6000);
    }, [removePopup]);

    // Start/Stop AI Monitoring
    const toggleMonitoring = useCallback(() => {
        if (isMonitoring) {
            // Stop
            clearInterval(monitoringRef.current);
            clearInterval(scanRef.current);
            monitoringRef.current = null;
            scanRef.current = null;
            setIsMonitoring(false);
            setScanProgress(0);
        } else {
            // Start
            setIsMonitoring(true);
            setDetectionCount(0);
            setScanProgress(0);

            // Scan progress animation
            scanRef.current = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) return 0;
                    return prev + 2;
                });
            }, 200);

            // Generate fake detection every 10 seconds
            monitoringRef.current = setInterval(() => {
                const event = detectionEvents[Math.floor(Math.random() * detectionEvents.length)];
                addPopup(event);
                setDetectionCount(prev => prev + 1);

                // Also add to alert panel
                const newAlert = {
                    room: event.room,
                    patient: alertPool.find(a => a.room === event.room)?.patient || 'Unknown',
                    type: event.message,
                    confidence: 70 + Math.floor(Math.random() * 25),
                    severity: event.severity,
                    icon: event.severity === 'high' ? '🚨' : '⚠️',
                    timestamp: Date.now(),
                };
                setAlerts(prev => [newAlert, ...prev].slice(0, 10));
                setStats(prev => ({
                    ...prev,
                    active: Math.min(prev.active + 1, 12),
                    emergency: event.severity === 'high' ? Math.min(prev.emergency + 1, 6) : prev.emergency,
                }));
            }, 10000);

            // Fire one immediately after 2s so user sees it quickly
            setTimeout(() => {
                const event = detectionEvents[Math.floor(Math.random() * detectionEvents.length)];
                addPopup(event);
                setDetectionCount(prev => prev + 1);
            }, 2000);
        }
    }, [isMonitoring, addPopup]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (monitoringRef.current) clearInterval(monitoringRef.current);
            if (scanRef.current) clearInterval(scanRef.current);
        };
    }, []);

    return (
        <Layout>
            {/* Popup Notifications */}
            <div className="popup-container">
                {popups.map((popup, i) => (
                    <div
                        key={popup.id}
                        className={`ai-popup ${popup.severity} ${popup.exiting ? 'exiting' : ''}`}
                        style={{ bottom: `${24 + i * 110}px` }}
                    >
                        <div className="popup-glow"></div>
                        <button className="popup-close" onClick={() => removePopup(popup.id)}>✕</button>
                        <div className="popup-icon">
                            {popup.severity === 'high' ? '🚨' : '⚠️'}
                        </div>
                        <div className="popup-content">
                            <span className="popup-title">AI Detected Distress — Room {popup.room}</span>
                            <span className="popup-message">{popup.message}</span>
                            <span className="popup-meta">
                                <span className={`popup-severity ${popup.severity}`}>
                                    {popup.severity === 'high' ? '🔴 HIGH PRIORITY' : '🟡 MEDIUM'}
                                </span>
                                <span className="popup-time">Just now</span>
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
                    <div className="status-online">System Online</div>
                </div>
            </div>

            {/* AI Monitoring Control Bar */}
            <div className={`monitoring-bar fade-in ${isMonitoring ? 'active' : ''}`}>
                <div className="monitoring-left">
                    <div className={`monitoring-indicator ${isMonitoring ? 'active' : ''}`}>
                        <span className="indicator-dot"></span>
                        <span>{isMonitoring ? 'AI Monitoring Active' : 'AI Monitoring Standby'}</span>
                    </div>
                    {isMonitoring && (
                        <div className="monitoring-stats">
                            <span className="monitor-stat">
                                <span className="stat-label">Detections:</span>
                                <span className="stat-num">{detectionCount}</span>
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
                            <span className="scan-label">Scanning audio & vitals…</span>
                        </div>
                    )}
                    <button
                        className={`monitoring-btn ${isMonitoring ? 'stop' : 'start'}`}
                        onClick={toggleMonitoring}
                    >
                        <span className="btn-pulse"></span>
                        <span>{isMonitoring ? '⏹ Stop Monitoring' : '▶ Start AI Monitoring'}</span>
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

                <div className="stat-card orange fade-in fade-in-delay-2">
                    <div className="stat-icon orange">⚠️</div>
                    <div className="stat-info">
                        <h3>{stats.active}</h3>
                        <p>Active Alerts</p>
                    </div>
                    <div className="stat-trend warn">Live</div>
                </div>

                <div className="stat-card red fade-in fade-in-delay-3">
                    <div className="stat-icon red">🚨</div>
                    <div className="stat-info">
                        <h3>{stats.emergency}</h3>
                        <p>High Emergency</p>
                    </div>
                    <div className="stat-trend danger">Critical</div>
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
                        <span className="alert-count">{alerts.length} alerts</span>
                    </div>

                    <div className="alerts-list">
                        {alerts.map((alert, index) => (
                            <div
                                key={`${alert.room}-${alert.type}-${index}`}
                                className={`alert-card ${alert.severity} ${index === 0 ? 'newest' : ''}`}
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <div className="alert-header">
                                    <div className="alert-room-info">
                                        <span className="alert-icon">{alert.icon}</span>
                                        <div>
                                            <span className="alert-room">Room {alert.room}</span>
                                            <span className="alert-patient">{alert.patient}</span>
                                        </div>
                                    </div>
                                    <span className={`alert-badge ${alert.severity}`}>
                                        {alert.severity === 'high' ? '🔴 HIGH' : alert.severity === 'medium' ? '🟡 MEDIUM' : '🟢 LOW'}
                                    </span>
                                </div>

                                <p className="alert-description">{alert.type}</p>

                                <div className="alert-footer">
                                    <div className="alert-confidence">
                                        <span>AI Confidence:</span>
                                        <div className="confidence-bar">
                                            <div
                                                className={`confidence-fill ${alert.severity}`}
                                                style={{ width: `${alert.confidence}%` }}
                                            ></div>
                                        </div>
                                        <span className="confidence-value">{alert.confidence}%</span>
                                    </div>
                                    <span className="alert-time">{getTimeAgo(index)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side Panel */}
                <div className="side-panel">
                    {/* AI System Status */}
                    <div className="card system-card fade-in fade-in-delay-2">
                        <div className="section-title">
                            <span className="icon">🤖</span>
                            <span>AI Engine Status</span>
                        </div>
                        <div className="ai-metrics">
                            <div className="ai-metric">
                                <span className="metric-label">Model Accuracy</span>
                                <div className="metric-bar-container">
                                    <div className="metric-bar" style={{ width: '96%' }}></div>
                                </div>
                                <span className="metric-value">96.2%</span>
                            </div>
                            <div className="ai-metric">
                                <span className="metric-label">Audio Analysis</span>
                                <div className="metric-bar-container">
                                    <div className="metric-bar" style={{ width: '89%' }}></div>
                                </div>
                                <span className="metric-value">89.1%</span>
                            </div>
                            <div className="ai-metric">
                                <span className="metric-label">Motion Detection</span>
                                <div className="metric-bar-container">
                                    <div className="metric-bar" style={{ width: '94%' }}></div>
                                </div>
                                <span className="metric-value">94.5%</span>
                            </div>
                            <div className="ai-metric">
                                <span className="metric-label">Vitals Processing</span>
                                <div className="metric-bar-container">
                                    <div className="metric-bar" style={{ width: '98%' }}></div>
                                </div>
                                <span className="metric-value">98.0%</span>
                            </div>
                        </div>
                        <div className="ai-uptime">
                            <span>⏱️ Uptime: 99.97%</span>
                            <span>🔄 Last sync: 3s ago</span>
                        </div>
                    </div>

                    {/* Quick Ward Overview */}
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

                    {/* Recent Activity */}
                    <div className="card activity-card fade-in fade-in-delay-4">
                        <div className="section-title">
                            <span className="icon">📋</span>
                            <span>Recent Activity</span>
                        </div>
                        <div className="activity-list">
                            {[
                                { text: 'Nurse dispatched to Room 203', time: '2 min ago', type: 'action' },
                                { text: 'AI alert resolved — Room 118', time: '8 min ago', type: 'resolved' },
                                { text: 'New patient admitted — Room 220', time: '15 min ago', type: 'info' },
                                { text: 'Shift change — Ward B', time: '32 min ago', type: 'info' },
                                { text: 'Emergency protocol activated — ICU', time: '45 min ago', type: 'action' },
                            ].map((activity, i) => (
                                <div key={i} className="activity-item">
                                    <div className={`activity-dot ${activity.type}`}></div>
                                    <div className="activity-content">
                                        <span className="activity-text">{activity.text}</span>
                                        <span className="activity-time">{activity.time}</span>
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
