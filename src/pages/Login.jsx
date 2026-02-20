import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            // Check credentials against registered users
            const users = JSON.parse(localStorage.getItem('nurseguard_users') || '[]');
            const match = users.find(
                u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );

            if (match) {
                // Store active session
                localStorage.setItem('nurseguard_session', JSON.stringify({
                    id: match.id,
                    name: match.name,
                    email: match.email,
                    role: match.role,
                    department: match.department,
                    loggedInAt: new Date().toISOString(),
                }));
                navigate('/dashboard');
            } else {
                setIsLoading(false);
                if (users.length === 0) {
                    setError('No accounts registered yet. Please sign up first.');
                } else {
                    setError('Invalid email or password. Please try again.');
                }
            }
        }, 1200);
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="bg-circle c1"></div>
                <div className="bg-circle c2"></div>
                <div className="bg-circle c3"></div>
                <div className="grid-overlay"></div>
            </div>

            <div className="login-container fade-in">
                <div className="login-header">
                    <div className="login-logo">
                        <span className="logo-icon">🏥</span>
                        <div className="logo-pulse"></div>
                    </div>
                    <h1>AI NurseGuard</h1>
                    <p>Patient Distress Monitoring System</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Staff Email</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                id="email"
                                type="text"
                                placeholder="Enter your staff email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={`login-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Access Dashboard</span>
                                <span className="btn-arrow">→</span>
                            </>
                        )}
                    </button>

                    <div className="auth-switch">
                        Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                    </div>
                </form>

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

export default Login;
