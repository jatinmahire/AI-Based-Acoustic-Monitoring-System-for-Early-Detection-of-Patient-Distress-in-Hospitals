/**
 * AI Engine Module — Simulated Medical Alert Generator
 * 
 * Generates realistic, structured medical alerts based on
 * predefined conditions, patient profiles, and room data.
 * Each alert follows a strict schema for consistency.
 */

// ─── Patient Database ────────────────────────────────────────
const patients = [
    { id: 'P-1001', name: 'Mike Johnson', age: 67, room: 203, ward: 'ICU Ward A', history: ['COPD', 'hypertension'] },
    { id: 'P-1002', name: 'Helen Park', age: 54, room: 105, ward: 'General Ward B', history: ['anxiety', 'insomnia'] },
    { id: 'P-1003', name: 'James Carter', age: 72, room: 312, ward: 'Cardiac Ward C', history: ['arrhythmia', 'CHF'] },
    { id: 'P-1004', name: 'David Lee', age: 81, room: 207, ward: 'Neuro Ward D', history: ['Parkinsons', 'fall risk'] },
    { id: 'P-1005', name: 'Anna White', age: 59, room: 118, ward: 'ICU Ward A', history: ['sleep apnea', 'obesity'] },
    { id: 'P-1006', name: 'Emily Davis', age: 34, room: 204, ward: 'General Ward B', history: ['panic disorder'] },
    { id: 'P-1007', name: 'Robert Kim', age: 45, room: 301, ward: 'Neuro Ward D', history: ['epilepsy'] },
    { id: 'P-1008', name: 'Grace Miller', age: 62, room: 215, ward: 'General Ward B', history: ['pneumonia', 'asthma'] },
    { id: 'P-1009', name: 'Thomas Brown', age: 70, room: 109, ward: 'Cardiac Ward C', history: ['hypertension', 'diabetes'] },
    { id: 'P-1010', name: 'Lisa Chen', age: 28, room: 220, ward: 'General Ward B', history: ['post-surgery'] },
    { id: 'P-1011', name: 'Kevin Patel', age: 55, room: 310, ward: 'ICU Ward A', history: ['stroke recovery'] },
    { id: 'P-1012', name: 'Sarah Lopez', age: 48, room: 112, ward: 'General Ward B', history: ['fever', 'infection'] },
];

// ─── Medical Conditions with Severity Weights ───────────────
const conditions = [
    // Respiratory
    { condition: 'Respiratory distress detected', category: 'respiratory', baseSeverity: 'high', baseConfidence: [88, 97], icon: '🫁', triggerText: 'Abnormal breathing pattern with reduced SpO2' },
    { condition: 'Persistent cough pattern detected', category: 'respiratory', baseSeverity: 'medium', baseConfidence: [72, 86], icon: '🤧', triggerText: 'Cough frequency exceeds 12/min threshold' },
    { condition: 'Sleep apnea episode detected', category: 'respiratory', baseSeverity: 'high', baseConfidence: [85, 95], icon: '😴', triggerText: 'Breathing cessation >10s during sleep' },
    { condition: 'SpO2 level critically low', category: 'respiratory', baseSeverity: 'high', baseConfidence: [90, 99], icon: '🩸', triggerText: 'Blood oxygen saturation below 90%' },

    // Cardiac
    { condition: 'Abnormal heart rate pattern', category: 'cardiac', baseSeverity: 'high', baseConfidence: [82, 94], icon: '❤️', triggerText: 'Irregular QRS complex detected' },
    { condition: 'Blood pressure spike detected', category: 'cardiac', baseSeverity: 'high', baseConfidence: [87, 96], icon: '📈', triggerText: 'Systolic BP >180 mmHg sustained' },
    { condition: 'Tachycardia episode detected', category: 'cardiac', baseSeverity: 'medium', baseConfidence: [78, 91], icon: '💓', triggerText: 'Heart rate >120 BPM for >2 minutes' },

    // Motion / Fall
    { condition: 'Fall detected via motion sensor', category: 'motion', baseSeverity: 'high', baseConfidence: [80, 93], icon: '🚶', triggerText: 'Sudden vertical acceleration change' },
    { condition: 'Abnormal movement pattern detected', category: 'motion', baseSeverity: 'medium', baseConfidence: [65, 80], icon: '🔄', triggerText: 'Continuous restless movement >15 min' },
    { condition: 'Patient left bed unexpectedly', category: 'motion', baseSeverity: 'medium', baseConfidence: [75, 88], icon: '🛏️', triggerText: 'Pressure sensor released outside schedule' },

    // Audio / Stress
    { condition: 'Panic vocalization detected', category: 'audio', baseSeverity: 'high', baseConfidence: [83, 95], icon: '🗣️', triggerText: 'Audio classifier: distress vocalization' },
    { condition: '"Help" keyword detected in audio', category: 'audio', baseSeverity: 'high', baseConfidence: [88, 97], icon: '🆘', triggerText: 'Speech-to-text match: emergency keyword' },
    { condition: 'Elevated stress indicators', category: 'stress', baseSeverity: 'medium', baseConfidence: [70, 84], icon: '😰', triggerText: 'Heart rate variability + cortisol estimate' },
    { condition: 'Distress vocalization detected', category: 'audio', baseSeverity: 'medium', baseConfidence: [72, 86], icon: '😢', triggerText: 'Crying or moaning pattern classified' },

    // Vitals
    { condition: 'Temperature spike detected', category: 'vitals', baseSeverity: 'medium', baseConfidence: [80, 92], icon: '🌡️', triggerText: 'Body temp >39.5°C sustained >10 min' },
    { condition: 'Glucose level anomaly', category: 'vitals', baseSeverity: 'medium', baseConfidence: [76, 89], icon: '💉', triggerText: 'Blood glucose outside safe range' },
];

// ─── Severity Escalation Rules ──────────────────────────────
function resolveSeverity(baseSeverity, confidence, patientHistory) {
    // High-risk patients escalate medium → high if confidence > 85
    const isHighRisk = patientHistory.some(h =>
        ['COPD', 'CHF', 'arrhythmia', 'stroke recovery', 'fall risk'].includes(h)
    );
    if (baseSeverity === 'medium' && confidence > 85 && isHighRisk) {
        return 'high';
    }
    // Very high confidence on anything is at least medium
    if (baseSeverity === 'low' && confidence > 90) {
        return 'medium';
    }
    return baseSeverity;
}

// ─── Fake Vitals Generator ──────────────────────────────────
function generateVitals(severity) {
    const base = {
        heartRate: 72 + Math.floor(Math.random() * 20),
        spO2: 97 - Math.floor(Math.random() * 3),
        temperature: +(36.5 + Math.random() * 0.8).toFixed(1),
        bloodPressure: `${115 + Math.floor(Math.random() * 15)}/${72 + Math.floor(Math.random() * 10)}`,
        respiratoryRate: 14 + Math.floor(Math.random() * 4),
    };

    if (severity === 'high') {
        base.heartRate = 105 + Math.floor(Math.random() * 35);
        base.spO2 = 85 + Math.floor(Math.random() * 7);
        base.temperature = +(37.5 + Math.random() * 2.5).toFixed(1);
        base.bloodPressure = `${160 + Math.floor(Math.random() * 30)}/${90 + Math.floor(Math.random() * 15)}`;
        base.respiratoryRate = 22 + Math.floor(Math.random() * 10);
    } else if (severity === 'medium') {
        base.heartRate = 90 + Math.floor(Math.random() * 25);
        base.spO2 = 91 + Math.floor(Math.random() * 5);
        base.temperature = +(37.0 + Math.random() * 1.5).toFixed(1);
        base.respiratoryRate = 18 + Math.floor(Math.random() * 6);
    }

    return base;
}

// ─── Alert ID Generator ─────────────────────────────────────
let alertSequence = 1000;

function generateAlertId() {
    alertSequence += 1;
    return `ALR-${String(alertSequence).padStart(5, '0')}`;
}

// ─── Core: Generate a Single Alert ──────────────────────────
/**
 * Generates one structured medical alert object.
 * 
 * @returns {Object} Alert with fields:
 *   - id: string           (e.g. "ALR-01001")
 *   - roomNumber: number   (e.g. 203)
 *   - patientId: string    (e.g. "P-1001")
 *   - patientName: string
 *   - ward: string
 *   - condition: string    (human-readable condition description)
 *   - category: string     (respiratory|cardiac|motion|audio|stress|vitals)
 *   - confidenceScore: number (0-100)
 *   - severityLevel: string   (low|medium|high)
 *   - timestamp: number       (Date.now() epoch ms)
 *   - formattedTime: string   (HH:MM:SS)
 *   - triggerDetail: string   (what triggered the AI detection)
 *   - vitals: object          (current patient vitals snapshot)
 *   - icon: string            (emoji icon)
 *   - acknowledged: boolean
 */
export function generateAlert() {
    // Pick random patient and condition
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const conditionDef = conditions[Math.floor(Math.random() * conditions.length)];

    // Generate confidence within the condition's range
    const [minConf, maxConf] = conditionDef.baseConfidence;
    const confidenceScore = minConf + Math.floor(Math.random() * (maxConf - minConf + 1));

    // Resolve severity (may escalate for high-risk patients)
    const severityLevel = resolveSeverity(conditionDef.baseSeverity, confidenceScore, patient.history);

    // Generate vitals snapshot
    const vitals = generateVitals(severityLevel);

    const now = Date.now();

    return {
        id: generateAlertId(),
        roomNumber: patient.room,
        patientId: patient.id,
        patientName: patient.name,
        ward: patient.ward,
        condition: conditionDef.condition,
        category: conditionDef.category,
        confidenceScore,
        severityLevel,
        timestamp: now,
        formattedTime: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        triggerDetail: conditionDef.triggerText,
        vitals,
        icon: conditionDef.icon,
        acknowledged: false,
    };
}

// ─── Batch Generator ────────────────────────────────────────
/**
 * Generates multiple alerts at once.
 * @param {number} count - Number of alerts to generate
 * @returns {Array} Array of alert objects
 */
export function generateAlertBatch(count = 4) {
    const alerts = [];
    const usedRooms = new Set();
    for (let i = 0; i < count; i++) {
        let alert;
        let attempts = 0;
        do {
            alert = generateAlert();
            attempts++;
        } while (usedRooms.has(alert.roomNumber) && attempts < 20);
        usedRooms.add(alert.roomNumber);
        // Stagger timestamps for initial load
        alert.timestamp = Date.now() - (i * 90000); // 90s apart
        alert.formattedTime = new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        alerts.push(alert);
    }
    return alerts;
}

// ─── AI Engine Controller ───────────────────────────────────
/**
 * Creates an AI Engine instance that generates alerts at regular intervals.
 * 
 * @param {Function} onAlert - Callback fired with each new alert object
 * @param {Object} options
 * @param {number} options.intervalMs - Milliseconds between alerts (default: 8000)
 * @param {number} options.initialDelayMs - Delay before first alert (default: 2000)
 * @returns {Object} Controller with start(), stop(), isRunning(), getStats()
 */
export function createAIEngine(onAlert, options = {}) {
    const { intervalMs = 8000, initialDelayMs = 2000 } = options;

    let intervalId = null;
    let timeoutId = null;
    let running = false;
    let totalDetections = 0;
    let startTime = null;

    function fireAlert() {
        const alert = generateAlert();
        totalDetections++;
        onAlert(alert);
    }

    return {
        start() {
            if (running) return;
            running = true;
            startTime = Date.now();
            totalDetections = 0;

            // First alert after short delay
            timeoutId = setTimeout(() => {
                fireAlert();
                // Then regular interval
                intervalId = setInterval(fireAlert, intervalMs);
            }, initialDelayMs);
        },

        stop() {
            if (!running) return;
            running = false;
            if (timeoutId) clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
            timeoutId = null;
            intervalId = null;
        },

        isRunning() {
            return running;
        },

        getStats() {
            return {
                totalDetections,
                running,
                uptime: running ? Math.floor((Date.now() - startTime) / 1000) : 0,
                intervalMs,
            };
        },
    };
}

// ─── Exports Summary ────────────────────────────────────────
// generateAlert()      → single structured alert
// generateAlertBatch() → array of alerts for initial state
// createAIEngine()     → controller with start/stop/stats
// getPatients()        → patient database
// generateRiskScores() → risk scores for all patients
// updateRiskFromAlert()→ updates risk based on new alert

// ─── Patient Exports ────────────────────────────────────────
export function getPatients() {
    return patients.map(p => ({ ...p }));
}

// ─── Risk Score System ──────────────────────────────────────
/**
 * Generate initial risk scores for all patients.
 * Base risk is calculated from medical history severity.
 * 
 * @returns {Object} Map of patientId → { score, label, trend }
 */
export function generateRiskScores() {
    const scores = {};
    const highRiskConditions = ['COPD', 'CHF', 'arrhythmia', 'stroke recovery', 'fall risk'];
    const medRiskConditions = ['hypertension', 'diabetes', 'sleep apnea', 'obesity', 'epilepsy', 'panic disorder'];

    patients.forEach(p => {
        let base = 15 + Math.floor(Math.random() * 15); // 15-30 base

        // Add risk from history
        p.history.forEach(h => {
            if (highRiskConditions.includes(h)) base += 18 + Math.floor(Math.random() * 10);
            else if (medRiskConditions.includes(h)) base += 10 + Math.floor(Math.random() * 8);
            else base += 5 + Math.floor(Math.random() * 5);
        });

        // Age factor
        if (p.age > 70) base += 12;
        else if (p.age > 55) base += 6;

        // Cap at 95
        const score = Math.min(95, Math.max(5, base));
        const label = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
        const trend = ['↑', '↓', '→'][Math.floor(Math.random() * 3)];

        scores[p.id] = { score, label, trend, lastUpdate: Date.now() };
    });

    return scores;
}

/**
 * Update a patient's risk score based on a new alert.
 * Called when new alerts arrive — bumps risk for affected patient.
 * 
 * @param {Object} riskScores - Current risk scores map
 * @param {Object} alert - New alert object from generateAlert()
 * @returns {Object} Updated risk scores map
 */
export function updateRiskFromAlert(riskScores, alert) {
    const updated = { ...riskScores };
    const patientId = alert.patientId;

    if (updated[patientId]) {
        const bump = alert.severityLevel === 'high' ? (8 + Math.floor(Math.random() * 7))
            : alert.severityLevel === 'medium' ? (4 + Math.floor(Math.random() * 5))
                : (2 + Math.floor(Math.random() * 3));

        const newScore = Math.min(98, updated[patientId].score + bump);
        updated[patientId] = {
            score: newScore,
            label: newScore >= 70 ? 'HIGH' : newScore >= 40 ? 'MEDIUM' : 'LOW',
            trend: '↑',
            lastUpdate: Date.now(),
        };
    }

    return updated;
}
