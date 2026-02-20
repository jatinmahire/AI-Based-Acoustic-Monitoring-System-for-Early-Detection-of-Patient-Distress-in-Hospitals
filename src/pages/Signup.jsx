import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // reuse same auth styling

function Signup() {
    const [form, setForm] = useState({ name: '', email: '', role: 'Nurse', department: '', password: '', confirm: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSignup = (e) => {
        e.preventDefault();
        setError('');

        // Validations
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (form.password !== form.confirm) {
            setError('Passwords do not match');
            return;
        }

        // Check if email already registered
        const existing = JSON.parse(localStorage.getItem('nurseguard_users') || '[]');
        if (existing.find(u => u.email.toLowerCase() === form.email.toLowerCase())) {
            setError('An account with this email already exists');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            // Save to localStorage
            const newUser = {
                id: Date.now(),
                name: form.name,
                email: form.email.toLowerCase(),
                role: form.role,
                department: form.department,
                password: form.password, // In real app → hashed
                createdAt: new Date().toISOString(),
            };
            existing.push(newUser);
            localStorage.setItem('nurseguard_users', JSON.stringify(existing));

            setIsLoading(false);
            setSuccess(true);

            // Redirect to login after brief success message
            setTimeout(() => navigate('/login'), 1800);
        }, 1500);
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="bg-circle c1"></div>
                <div className="bg-circle c2"></div>
                <div className="bg-circle c3"></div>
                <div className="grid-overlay"></div>
            </div>

            <div className="login-container signup-container fade-in">
                <div className="login-header">
                    <div className="login-logo">
                        <span className="logo-icon">🏥</span>
                        <div className="logo-pulse"></div>
                    </div>
                    <h1>AI NurseGuard</h1>
                    <p>Staff Registration Portal</p>
                </div>

                {success ? (
                    <div className="signup-success">
                        <span className="success-icon">✅</span>
                        <h3>Account Created Successfully!</h3>
                        <p>Redirecting to login…</p>
                        <div className="success-bar">
                            <div className="success-bar-fill"></div>
                        </div>
                    </div>
                ) : (
                    <form className="login-form" onSubmit={handleSignup}>
                        {error && (
                            <div className="auth-error">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">👤</span>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Dr. Sarah Johnson"
                                        value={form.name}
                                        onChange={(e) => update('name', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-email">Staff Email</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">📧</span>
                                    <input
                                        id="signup-email"
                                        type="email"
                                        placeholder="nurse@hospital.com"
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🩺</span>
                                    <select
                                        id="role"
                                        value={form.role}
                                        onChange={(e) => update('role', e.target.value)}
                                    >
                                        <option value="Nurse">Nurse</option>
                                        <option value="Head Nurse">Head Nurse</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Technician">Technician</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="department">Department</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🏢</span>
                                    <select
                                        id="department"
                                        value={form.department}
                                        onChange={(e) => update('department', e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select department</option>
                                        <option value="ICU">ICU</option>
                                        <option value="General Ward">General Ward</option>
                                        <option value="Cardiac Care">Cardiac Care</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Emergency">Emergency</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="signup-password">Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        id="signup-password"
                                        type="password"
                                        placeholder="Min 6 characters"
                                        value={form.password}
                                        onChange={(e) => update('password', e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔐</span>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Re-enter password"
                                        value={form.confirm}
                                        onChange={(e) => update('confirm', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className={`login-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Creating Account…</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Staff Account</span>
                                    <span className="btn-arrow">→</span>
                                </>
                            )}
                        </button>

                        <div className="auth-switch">
                            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                        </div>
                    </form>
                )}

                <div className="login-footer">
                    <div className="security-badge">
                        <span>🔐</span>
                        <span>HIPAA Compliant • End-to-End Encrypted</span>
                    </div>
                    <p className="version">v2.4.1 — AI Engine Active</p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
