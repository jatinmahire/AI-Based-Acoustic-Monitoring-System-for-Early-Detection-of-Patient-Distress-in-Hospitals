import Layout from '../components/Layout';

const rooms = [
    { id: 201, patient: 'John Doe', age: 67, status: 'normal', vitals: '98.6°F • 72 BPM' },
    { id: 202, patient: 'Sarah Smith', age: 54, status: 'normal', vitals: '98.2°F • 78 BPM' },
    { id: 203, patient: 'Mike Johnson', age: 71, status: 'critical', vitals: '101.2°F • 110 BPM' },
    { id: 204, patient: 'Emily Davis', age: 45, status: 'warning', vitals: '99.1°F • 92 BPM' },
    { id: 205, patient: 'Robert Brown', age: 62, status: 'normal', vitals: '97.8°F • 68 BPM' },
    { id: 206, patient: 'Lisa Wilson', age: 38, status: 'normal', vitals: '98.4°F • 74 BPM' },
    { id: 207, patient: 'David Lee', age: 82, status: 'warning', vitals: '99.8°F • 88 BPM' },
    { id: 208, patient: 'Maria Garcia', age: 59, status: 'normal', vitals: '98.0°F • 70 BPM' },
];

const statusStyles = {
    normal: { bg: 'var(--alert-green-bg)', color: 'var(--alert-green)', label: 'Normal', icon: '💚' },
    warning: { bg: 'var(--alert-orange-bg)', color: 'var(--alert-orange)', label: 'Warning', icon: '⚠️' },
    critical: { bg: 'var(--alert-red-bg)', color: 'var(--alert-red)', label: 'Critical', icon: '🚨' },
};

function Rooms() {
    return (
        <Layout>
            <div className="page-header fade-in">
                <h1>🛏️ Patient Room Monitor</h1>
                <p>Live room status & patient vitals overview</p>
            </div>

            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {rooms.map((room, i) => {
                    const st = statusStyles[room.status];
                    return (
                        <div
                            key={room.id}
                            className="card fade-in"
                            style={{
                                animationDelay: `${i * 0.08}s`,
                                opacity: 0,
                                borderLeft: `3px solid ${st.color}`,
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Room {room.id}</span>
                                <span style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    background: st.bg,
                                    color: st.color,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                }}>
                                    {st.icon} {st.label}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.88rem', marginBottom: '6px' }}>{room.patient}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Age: {room.age} • {room.vitals}</p>
                            <div style={{
                                marginTop: '14px',
                                display: 'flex',
                                gap: '8px',
                            }}>
                                <span className="status-online" style={{ fontSize: '0.72rem' }}>AI Monitoring Active</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
}

export default Rooms;
