import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { getAlertHistory } from './Dashboard';
import './AlertHistory.css';

function AlertHistory() {
    const [severityFilter, setSeverityFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('timestamp');
    const [sortDir, setSortDir] = useState('desc');

    const rawHistory = getAlertHistory();

    // Filtered + sorted
    const filteredAlerts = useMemo(() => {
        let result = [...rawHistory];

        // Severity filter
        if (severityFilter !== 'all') {
            result = result.filter(a => a.severityLevel === severityFilter);
        }

        // Time filter
        const now = Date.now();
        if (timeFilter === '5min') result = result.filter(a => (now - a.timestamp) < 5 * 60 * 1000);
        else if (timeFilter === '15min') result = result.filter(a => (now - a.timestamp) < 15 * 60 * 1000);
        else if (timeFilter === '30min') result = result.filter(a => (now - a.timestamp) < 30 * 60 * 1000);
        else if (timeFilter === '1hr') result = result.filter(a => (now - a.timestamp) < 60 * 60 * 1000);

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(a =>
                a.patientName.toLowerCase().includes(q) ||
                a.condition.toLowerCase().includes(q) ||
                a.id.toLowerCase().includes(q) ||
                String(a.roomNumber).includes(q) ||
                a.ward.toLowerCase().includes(q)
            );
        }

        // Sort
        result.sort((a, b) => {
            let valA, valB;
            if (sortField === 'timestamp') { valA = a.timestamp; valB = b.timestamp; }
            else if (sortField === 'severity') {
                const order = { high: 3, medium: 2, low: 1 };
                valA = order[a.severityLevel] || 0;
                valB = order[b.severityLevel] || 0;
            }
            else if (sortField === 'confidence') { valA = a.confidenceScore; valB = b.confidenceScore; }
            else if (sortField === 'room') { valA = a.roomNumber; valB = b.roomNumber; }
            else { valA = a.timestamp; valB = b.timestamp; }

            return sortDir === 'desc' ? valB - valA : valA - valB;
        });

        return result;
    }, [rawHistory, severityFilter, timeFilter, searchQuery, sortField, sortDir]);

    // Stats
    const totalAlerts = rawHistory.length;
    const highCount = rawHistory.filter(a => a.severityLevel === 'high').length;
    const medCount = rawHistory.filter(a => a.severityLevel === 'medium').length;
    const lowCount = rawHistory.filter(a => a.severityLevel === 'low').length;

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    const sortIcon = (field) => {
        if (sortField !== field) return '↕';
        return sortDir === 'desc' ? '↓' : '↑';
    };

    return (
        <Layout>
            <div className="history-header fade-in">
                <div>
                    <h1 className="page-title">📋 Alert History</h1>
                    <p className="page-subtitle">Complete log of all AI-generated medical alerts</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="history-stats fade-in">
                <div className="h-stat total">
                    <span className="h-stat-num">{totalAlerts}</span>
                    <span className="h-stat-label">Total Alerts</span>
                </div>
                <div className="h-stat high">
                    <span className="h-stat-num">{highCount}</span>
                    <span className="h-stat-label">🔴 High</span>
                </div>
                <div className="h-stat medium">
                    <span className="h-stat-num">{medCount}</span>
                    <span className="h-stat-label">🟡 Medium</span>
                </div>
                <div className="h-stat low">
                    <span className="h-stat-num">{lowCount}</span>
                    <span className="h-stat-label">🟢 Low</span>
                </div>
            </div>

            {/* Filters */}
            <div className="history-filters fade-in">
                <div className="filter-group">
                    <label className="filter-label">Severity</label>
                    <div className="filter-buttons">
                        {['all', 'high', 'medium', 'low'].map(s => (
                            <button
                                key={s}
                                className={`filter-btn ${severityFilter === s ? 'active' : ''} ${s}`}
                                onClick={() => setSeverityFilter(s)}
                            >
                                {s === 'all' ? 'All' : s === 'high' ? '🔴 High' : s === 'medium' ? '🟡 Medium' : '🟢 Low'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Time Range</label>
                    <div className="filter-buttons">
                        {[
                            { key: 'all', label: 'All Time' },
                            { key: '5min', label: 'Last 5 min' },
                            { key: '15min', label: 'Last 15 min' },
                            { key: '30min', label: 'Last 30 min' },
                            { key: '1hr', label: 'Last 1 hr' },
                        ].map(t => (
                            <button
                                key={t.key}
                                className={`filter-btn ${timeFilter === t.key ? 'active' : ''}`}
                                onClick={() => setTimeFilter(t.key)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group search-group">
                    <label className="filter-label">Search</label>
                    <input
                        type="text"
                        className="history-search"
                        placeholder="Search patient, room, condition, ID…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Results Count */}
            <div className="history-results-info fade-in">
                Showing <strong>{filteredAlerts.length}</strong> of {totalAlerts} alerts
            </div>

            {/* Table */}
            <div className="history-table-wrap fade-in">
                {filteredAlerts.length === 0 ? (
                    <div className="no-history">
                        <span className="no-history-icon">📭</span>
                        <p>No alerts match your filters</p>
                        <p className="no-history-hint">Try adjusting the severity or time range filters</p>
                    </div>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Alert ID</th>
                                <th className="sortable" onClick={() => toggleSort('timestamp')}>
                                    Time {sortIcon('timestamp')}
                                </th>
                                <th className="sortable" onClick={() => toggleSort('room')}>
                                    Room {sortIcon('room')}
                                </th>
                                <th>Patient</th>
                                <th>Condition</th>
                                <th className="sortable" onClick={() => toggleSort('severity')}>
                                    Severity {sortIcon('severity')}
                                </th>
                                <th className="sortable" onClick={() => toggleSort('confidence')}>
                                    Confidence {sortIcon('confidence')}
                                </th>
                                <th>Vitals</th>
                                <th>Ward</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlerts.map((alert) => (
                                <tr key={alert.id} className={`history-row ${alert.severityLevel}`}>
                                    <td className="td-id">{alert.id}</td>
                                    <td className="td-time">
                                        <span className="time-main">{alert.formattedTime}</span>
                                        <span className="time-date">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                    </td>
                                    <td className="td-room">{alert.roomNumber}</td>
                                    <td className="td-patient">
                                        <span className="patient-name">{alert.patientName}</span>
                                        <span className="patient-id">{alert.patientId}</span>
                                    </td>
                                    <td className="td-condition">
                                        <span className="cond-icon">{alert.icon}</span>
                                        <span className="cond-text">{alert.condition}</span>
                                    </td>
                                    <td>
                                        <span className={`severity-pill ${alert.severityLevel}`}>
                                            {alert.severityLevel === 'high' ? '🔴' : alert.severityLevel === 'medium' ? '🟡' : '🟢'} {alert.severityLevel.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="td-conf">
                                        <div className="conf-cell">
                                            <div className="conf-bar-bg">
                                                <div className={`conf-bar-fill ${alert.severityLevel}`} style={{ width: `${alert.confidenceScore}%` }}></div>
                                            </div>
                                            <span>{alert.confidenceScore}%</span>
                                        </div>
                                    </td>
                                    <td className="td-vitals">
                                        <span>❤️{alert.vitals.heartRate}</span>
                                        <span>🩸{alert.vitals.spO2}%</span>
                                        <span>🌡️{alert.vitals.temperature}°</span>
                                    </td>
                                    <td className="td-ward">{alert.ward}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}

export default AlertHistory;
