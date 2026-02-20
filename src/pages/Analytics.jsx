import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Layout from '../components/Layout';
import './Analytics.css';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Filler, Tooltip, Legend
);

// Chart theme defaults
const chartFont = { family: "'Inter', sans-serif", size: 11 };
const gridColor = 'rgba(255,255,255,0.04)';
const tickColor = '#5a6477';

// Fake Data
const hourLabels = ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];

const stressData = {
    labels: hourLabels,
    datasets: [{
        label: 'Stress Events',
        data: [1, 2, 3, 5, 4, 6, 8, 7, 12, 9, 6, 5, 4, 3, 2],
        borderColor: '#ff4757',
        backgroundColor: 'rgba(255, 71, 87, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ff4757',
        pointBorderColor: '#0a0e1a',
        pointBorderWidth: 2,
        borderWidth: 2,
    }],
};

const emergencyData = {
    labels: hourLabels,
    datasets: [{
        label: 'Emergency Alerts',
        data: [0, 1, 0, 2, 1, 3, 2, 1, 4, 2, 1, 1, 0, 1, 0],
        backgroundColor: (ctx) => {
            const val = ctx.raw;
            if (val >= 3) return 'rgba(255, 71, 87, 0.7)';
            if (val >= 2) return 'rgba(255, 165, 2, 0.7)';
            return 'rgba(0, 212, 170, 0.5)';
        },
        borderRadius: 6,
        borderSkipped: false,
    }],
};

const wardHeatmapData = {
    labels: ['ICU Ward A', 'General Ward B', 'Cardiac Ward C', 'Neuro Ward D', 'Pediatric Ward E'],
    datasets: [{
        label: 'Alert Count',
        data: [14, 5, 11, 7, 3],
        backgroundColor: [
            'rgba(255, 71, 87, 0.7)',
            'rgba(0, 212, 170, 0.5)',
            'rgba(255, 165, 2, 0.7)',
            'rgba(0, 168, 255, 0.5)',
            'rgba(46, 213, 115, 0.5)',
        ],
        borderColor: [
            '#ff4757', '#00d4aa', '#ffa502', '#00a8ff', '#2ed573',
        ],
        borderWidth: 2,
    }],
};

const responseTimeData = {
    labels: hourLabels,
    datasets: [
        {
            label: 'AI Detection (sec)',
            data: [2.1, 1.8, 2.3, 1.5, 1.9, 2.0, 1.7, 2.4, 1.6, 1.8, 2.1, 1.9, 2.0, 1.7, 2.2],
            borderColor: '#00d4aa',
            backgroundColor: 'rgba(0, 212, 170, 0.06)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#00d4aa',
        },
        {
            label: 'Nurse Response (min)',
            data: [3.2, 2.8, 3.5, 2.1, 2.9, 3.1, 2.5, 3.8, 2.3, 2.7, 3.0, 2.6, 2.9, 2.4, 3.1],
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.06)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#a855f7',
        },
    ],
};

const alertTypeData = {
    labels: ['Respiratory', 'Cardiac', 'Fall Risk', 'Stress', 'Pain', 'Other'],
    datasets: [{
        data: [28, 19, 15, 22, 10, 6],
        backgroundColor: [
            'rgba(255, 71, 87, 0.8)',
            'rgba(255, 165, 2, 0.8)',
            'rgba(0, 168, 255, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(0, 212, 170, 0.8)',
            'rgba(90, 100, 119, 0.6)',
        ],
        borderColor: '#0f1629',
        borderWidth: 3,
    }],
};

const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true, labels: { color: tickColor, font: chartFont, padding: 16 } },
        tooltip: { backgroundColor: 'rgba(15, 22, 41, 0.95)', titleFont: chartFont, bodyFont: chartFont, borderColor: 'rgba(0, 212, 170, 0.2)', borderWidth: 1, padding: 12, cornerRadius: 8 },
    },
    scales: {
        x: { grid: { color: gridColor }, ticks: { color: tickColor, font: chartFont } },
        y: { grid: { color: gridColor }, ticks: { color: tickColor, font: chartFont }, beginAtZero: true },
    },
};

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: 'rgba(15, 22, 41, 0.95)', titleFont: chartFont, bodyFont: chartFont, borderColor: 'rgba(0, 212, 170, 0.2)', borderWidth: 1, padding: 12, cornerRadius: 8 },
    },
    scales: {
        x: { grid: { color: gridColor }, ticks: { color: tickColor, font: chartFont } },
        y: { grid: { color: gridColor }, ticks: { color: tickColor, font: chartFont }, beginAtZero: true },
    },
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
        legend: { position: 'bottom', labels: { color: tickColor, font: chartFont, padding: 14, usePointStyle: true, pointStyleWidth: 8 } },
        tooltip: { backgroundColor: 'rgba(15, 22, 41, 0.95)', titleFont: chartFont, bodyFont: chartFont, borderColor: 'rgba(0, 212, 170, 0.2)', borderWidth: 1, padding: 12, cornerRadius: 8 },
    },
};

function Analytics() {
    const [selectedPeriod, setSelectedPeriod] = useState('today');

    // Fake summary stats
    const summaryStats = {
        today: { stressEvents: 32, emergencyAlerts: 5, avgResponse: '2.4 min', peakTime: '2:00 PM', aiAccuracy: '96.2%', patientsMonitored: 24 },
        week: { stressEvents: 187, emergencyAlerts: 23, avgResponse: '2.8 min', peakTime: '2:00 PM', aiAccuracy: '95.8%', patientsMonitored: 42 },
        month: { stressEvents: 814, emergencyAlerts: 97, avgResponse: '2.6 min', peakTime: '2:00 PM', aiAccuracy: '96.1%', patientsMonitored: 68 },
    };

    const stats = summaryStats[selectedPeriod];

    return (
        <Layout>
            <div className="analytics-header fade-in">
                <div>
                    <h1 className="page-title">📈 Hospital Analytics</h1>
                    <p className="page-subtitle">AI monitoring performance metrics & hospital insights</p>
                </div>
                <div className="period-selector">
                    {['today', 'week', 'month'].map(p => (
                        <button
                            key={p}
                            className={`period-btn ${selectedPeriod === p ? 'active' : ''}`}
                            onClick={() => setSelectedPeriod(p)}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="analytics-stats fade-in">
                {[
                    { label: 'Stress Events', value: stats.stressEvents, icon: '😰', color: 'red' },
                    { label: 'Emergency Alerts', value: stats.emergencyAlerts, icon: '🚨', color: 'orange' },
                    { label: 'Avg Response Time', value: stats.avgResponse, icon: '⏱️', color: 'teal' },
                    { label: 'Peak Alert Time', value: stats.peakTime, icon: '📍', color: 'purple' },
                    { label: 'AI Accuracy', value: stats.aiAccuracy, icon: '🤖', color: 'blue' },
                    { label: 'Patients Monitored', value: stats.patientsMonitored, icon: '🏥', color: 'green' },
                ].map((stat, i) => (
                    <div key={stat.label} className={`stat-card ${stat.color} fade-in`} style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                        <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Stress Events Timeline */}
                <div className="chart-card large fade-in fade-in-delay-1">
                    <div className="chart-header">
                        <div className="section-title">
                            <span className="icon">📉</span>
                            <span>Stress Events Timeline</span>
                        </div>
                        <span className="chart-badge red">Peak: 2 PM — 12 events</span>
                    </div>
                    <div className="chart-body">
                        <Line data={stressData} options={lineOptions} />
                    </div>
                </div>

                {/* Emergency Count */}
                <div className="chart-card fade-in fade-in-delay-2">
                    <div className="chart-header">
                        <div className="section-title">
                            <span className="icon">🚨</span>
                            <span>Emergency Count</span>
                        </div>
                        <span className="chart-badge orange">5 total today</span>
                    </div>
                    <div className="chart-body">
                        <Bar data={emergencyData} options={barOptions} />
                    </div>
                </div>

                {/* Alert Types Distribution */}
                <div className="chart-card fade-in fade-in-delay-3">
                    <div className="chart-header">
                        <div className="section-title">
                            <span className="icon">🎯</span>
                            <span>Alert Types</span>
                        </div>
                    </div>
                    <div className="chart-body doughnut">
                        <Doughnut data={alertTypeData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Ward Heatmap */}
                <div className="chart-card fade-in fade-in-delay-2">
                    <div className="chart-header">
                        <div className="section-title">
                            <span className="icon">🏢</span>
                            <span>Ward Alert Heatmap</span>
                        </div>
                        <span className="chart-badge red">ICU highest</span>
                    </div>
                    <div className="chart-body">
                        <Bar data={wardHeatmapData} options={{
                            ...barOptions,
                            indexAxis: 'y',
                            plugins: { ...barOptions.plugins, legend: { display: false } },
                        }} />
                    </div>
                </div>

                {/* Response Time */}
                <div className="chart-card large fade-in fade-in-delay-3">
                    <div className="chart-header">
                        <div className="section-title">
                            <span className="icon">⏱️</span>
                            <span>Response Time Comparison</span>
                        </div>
                        <span className="chart-badge teal">AI avg: 1.9s</span>
                    </div>
                    <div className="chart-body">
                        <Line data={responseTimeData} options={lineOptions} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Analytics;
