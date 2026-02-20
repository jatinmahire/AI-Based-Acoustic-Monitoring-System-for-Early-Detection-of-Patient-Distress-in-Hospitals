import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Fake login — just navigate after brief delay
        setTimeout(() => {
            navigate('/dashboard');
        }, 1200);
    };

    return (
        <div className="login-page">
            {/* Animated background particles */}
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
                    <div className="form-group">
                        <label htmlFor="email">Staff Email</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                id="email"
                                type="text"
                                placeholder="Enter your staff email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                onChange={(e) => setPassword(e.target.value)}
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
