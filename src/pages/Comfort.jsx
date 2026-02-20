import { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../components/Layout';
import './Comfort.css';

// Simulated active alerts that trigger comfort responses
const activeDistressAlerts = [
    { room: 203, patient: 'Mike Johnson', type: 'Respiratory distress', severity: 'high', stressLevel: 82 },
    { room: 105, patient: 'Helen Park', type: 'Elevated stress', severity: 'medium', stressLevel: 64 },
    { room: 312, patient: 'James Carter', type: 'Heart rate anomaly', severity: 'high', stressLevel: 78 },
];

const comfortMessages = [
    { title: 'Stay Calm', message: 'Please stay calm. A nurse has been alerted and is on the way. Try to breathe slowly.', icon: '💙' },
    { title: 'Help is Coming', message: 'Your nurse has been notified. Please try slow breathing for 5 seconds in, 5 seconds out.', icon: '🩺' },
    { title: 'You Are Safe', message: 'You are safe. Medical staff is aware of your situation. Try to relax your shoulders.', icon: '🛡️' },
    { title: 'Deep Breathing', message: 'Let\'s try a calming exercise. Breathe in slowly... hold... breathe out. Repeat 3 times.', icon: '🌿' },
    { title: 'Comfort Protocol', message: 'AI Comfort Protocol activated. Adjusting room lighting and playing calming audio.', icon: '🎵' },
];

function Comfort() {
    const [selectedAlert, setSelectedAlert] = useState(activeDistressAlerts[0]);
    const [comfortActive, setComfortActive] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(comfortMessages[0]);
    const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
    const [breathCount, setBreathCount] = useState(0);
    const [stressLevel, setStressLevel] = useState(82);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stressHistory, setStressHistory] = useState([82, 79, 85, 80, 76, 82]);
    const breathRef = useRef(null);
    const stressRef = useRef(null);

    // Activate comfort for a patient
    const activateComfort = useCallback((alert) => {
        setSelectedAlert(alert);
        setStressLevel(alert.stressLevel);
        setComfortActive(true);
        setBreathCount(0);
        setCurrentMessage(comfortMessages[Math.floor(Math.random() * comfortMessages.length)]);
    }, []);

    // Breathing exercise cycle
    useEffect(() => {
        if (!comfortActive) {
            setBreathPhase('idle');
            if (breathRef.current) clearInterval(breathRef.current);
            return;
        }

        const phases = ['inhale', 'hold', 'exhale', 'hold'];
        const durations = [4000, 2000, 4000, 2000]; // 4s inhale, 2s hold, 4s exhale, 2s rest
        let phaseIndex = 0;

        const runPhase = () => {
            setBreathPhase(phases[phaseIndex]);
            if (phases[phaseIndex] === 'inhale') {
                setBreathCount(prev => prev + 1);
            }
            phaseIndex = (phaseIndex + 1) % phases.length;
            breathRef.current = setTimeout(runPhase, durations[(phaseIndex - 1 + phases.length) % phases.length]);
        };

        runPhase();
        return () => { if (breathRef.current) clearTimeout(breathRef.current); };
    }, [comfortActive]);

    // Simulate stress reduction when comfort is active
    useEffect(() => {
        if (!comfortActive) {
            if (stressRef.current) clearInterval(stressRef.current);
            return;
        }

        stressRef.current = setInterval(() => {
            setStressLevel(prev => {
                const newLevel = Math.max(prev - (1 + Math.random() * 2), 20);
                setStressHistory(h => [...h.slice(-11), Math.round(newLevel)]);
                return newLevel;
            });
        }, 3000);

        return () => clearInterval(stressRef.current);
    }, [comfortActive]);

    // Rotate comfort messages
    useEffect(() => {
        if (!comfortActive) return;
        const interval = setInterval(() => {
            setCurrentMessage(comfortMessages[Math.floor(Math.random() * comfortMessages.length)]);
        }, 8000);
        return () => clearInterval(interval);
    }, [comfortActive]);

    const getStressColor = (level) => {
        if (level >= 70) return 'var(--alert-red)';
        if (level >= 50) return 'var(--alert-orange)';
        if (level >= 30) return 'var(--accent-teal)';
        return 'var(--alert-green)';
    };

    const getStressLabel = (level) => {
        if (level >= 70) return 'HIGH STRESS';
        if (level >= 50) return 'MODERATE';
        if (level >= 30) return 'MILD';
        return 'CALM';
    };

    const breathLabels = {
        idle: 'Start Comfort Protocol',
        inhale: 'Breathe In...',
        hold: 'Hold...',
        exhale: 'Breathe Out...',
    };

    return (
        <Layout>
            <div className="page-header fade-in">
                <h1>💚 AI Comfort Assistant</h1>
                <p>AI-powered patient comfort & stress reduction system</p>
            </div>

            <div className="comfort-layout">
                {/* Left: Patient Alerts */}
                <div className="comfort-patients fade-in">
                    <div className="section-title">
                        <span className="icon">🚨</span>
                        <span>Active Distress Alerts</span>
                    </div>
                    <p className="comfort-subtitle">Select a patient to activate AI Comfort Protocol</p>

                    <div className="patient-alert-list">
                        {activeDistressAlerts.map((alert) => (
                            <div
                                key={alert.room}
                                className={`patient-alert-card ${selectedAlert?.room === alert.room ? 'selected' : ''}`}
                                onClick={() => activateComfort(alert)}
                            >
                                <div className="pa-header">
                                    <span className="pa-room">🛏️ Room {alert.room}</span>
                                    <span className={`pa-severity ${alert.severity}`}>
                                        {alert.severity === 'high' ? '🔴 HIGH' : '🟡 MEDIUM'}
                                    </span>
                                </div>
                                <span className="pa-patient">{alert.patient}</span>
                                <span className="pa-type">{alert.type}</span>
                                <div className="pa-stress-mini">
                                    <span>Stress: {alert.stressLevel}%</span>
                                    <div className="pa-stress-bar">
                                        <div
                                            className="pa-stress-fill"
                                            style={{
                                                width: `${alert.stressLevel}%`,
                                                background: getStressColor(alert.stressLevel),
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <button
                                    className="pa-activate-btn"
                                    onClick={(e) => { e.stopPropagation(); activateComfort(alert); }}
                                >
                                    💚 Activate Comfort AI
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Breathing Animation & Comfort Message */}
                <div className="comfort-center fade-in fade-in-delay-1">
                    {/* Comfort Message Card */}
                    {comfortActive && (
                        <div className="comfort-message-card">
                            <div className="comfort-msg-icon">{currentMessage.icon}</div>
                            <h3 className="comfort-msg-title">{currentMessage.title}</h3>
                            <p className="comfort-msg-text">{currentMessage.message}</p>
                            <div className="comfort-msg-meta">
                                <span>🛏️ Room {selectedAlert.room}</span>
                                <span>👤 {selectedAlert.patient}</span>
                            </div>
                        </div>
                    )}

                    {/* Breathing Circle */}
                    <div className="breathing-section">
                        <h3 className="breathing-title">
                            {comfortActive ? '🫁 Guided Breathing Exercise' : '🫁 Breathing Exercise'}
                        </h3>
                        <div className={`breathing-container ${breathPhase}`}>
                            <div className="breathing-ring ring-1"></div>
                            <div className="breathing-ring ring-2"></div>
                            <div className="breathing-ring ring-3"></div>
                            <div className={`breathing-circle ${breathPhase}`}>
                                <span className="breath-label">{breathLabels[breathPhase]}</span>
                                {comfortActive && <span className="breath-count">Cycle {breathCount}</span>}
                            </div>
                        </div>
                        {!comfortActive && (
                            <button className="btn btn-primary" onClick={() => activateComfort(activeDistressAlerts[0])}>
                                ▶ Start Comfort Protocol
                            </button>
                        )}
                    </div>

                    {/* Voice Button */}
                    <div className="voice-section">
                        <button
                            className={`voice-btn ${isPlaying ? 'playing' : ''}`}
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            <div className="voice-waves">
                                <span className="wave w1"></span>
                                <span className="wave w2"></span>
                                <span className="wave w3"></span>
                                <span className="wave w4"></span>
                                <span className="wave w5"></span>
                            </div>
                            <span>{isPlaying ? '⏸ Pause Calming Audio' : '🔊 Play Calming Voice'}</span>
                        </button>
                        {isPlaying && (
                            <p className="voice-status">🎵 Playing: "Guided Relaxation — Calm Breathing" • 3:42</p>
                        )}
                    </div>
                </div>

                {/* Right: Stress Meter & Stats */}
                <div className="comfort-right fade-in fade-in-delay-2">
                    {/* Stress Meter */}
                    <div className="card stress-card">
                        <div className="section-title">
                            <span className="icon">📊</span>
                            <span>Stress Level Monitor</span>
                        </div>

                        <div className="stress-gauge">
                            <div className="gauge-circle">
                                <svg viewBox="0 0 120 120" className="gauge-svg">
                                    <circle cx="60" cy="60" r="52" className="gauge-bg" />
                                    <circle
                                        cx="60" cy="60" r="52"
                                        className="gauge-fill"
                                        style={{
                                            strokeDasharray: `${(stressLevel / 100) * 327} 327`,
                                            stroke: getStressColor(stressLevel),
                                        }}
                                    />
                                </svg>
                                <div className="gauge-value">
                                    <span className="gauge-num" style={{ color: getStressColor(stressLevel) }}>
                                        {Math.round(stressLevel)}
                                    </span>
                                    <span className="gauge-percent">%</span>
                                </div>
                            </div>
                            <span className="gauge-label" style={{ color: getStressColor(stressLevel) }}>
                                {getStressLabel(stressLevel)}
                            </span>
                        </div>

                        {/* Mini Stress History Chart */}
                        <div className="stress-history">
                            <span className="history-label">Stress Trend</span>
                            <div className="history-bars">
                                {stressHistory.map((val, i) => (
                                    <div key={i} className="history-bar-wrapper">
                                        <div
                                            className="history-bar"
                                            style={{
                                                height: `${val}%`,
                                                background: getStressColor(val),
                                                opacity: 0.4 + (i / stressHistory.length) * 0.6,
                                            }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            {comfortActive && (
                                <span className="history-trend-label">↓ Stress reducing with comfort AI</span>
                            )}
                        </div>
                    </div>

                    {/* Comfort Actions */}
                    <div className="card actions-card">
                        <div className="section-title">
                            <span className="icon">⚡</span>
                            <span>Comfort Actions</span>
                        </div>
                        <div className="action-list">
                            {[
                                { icon: '💡', label: 'Dim Room Lights', status: comfortActive ? 'Active' : 'Standby' },
                                { icon: '🎵', label: 'Calming Audio', status: isPlaying ? 'Playing' : 'Ready' },
                                { icon: '🌡️', label: 'Adjust Temperature', status: 'Optimal (22°C)' },
                                { icon: '📱', label: 'Notify Nurse', status: comfortActive ? 'Notified' : 'Standby' },
                                { icon: '🫁', label: 'Breathing Guide', status: comfortActive ? 'Active' : 'Ready' },
                            ].map((action, i) => (
                                <div key={i} className="action-item">
                                    <span className="action-icon">{action.icon}</span>
                                    <span className="action-label">{action.label}</span>
                                    <span className={`action-status ${comfortActive ? 'active' : ''}`}>{action.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Comfort;
