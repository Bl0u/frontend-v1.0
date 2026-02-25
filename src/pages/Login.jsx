import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaArrowLeft, FaPen } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/Login.css';
import '../fonts/style/fontsStyle.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);

    const { login, user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const passwordInputRef = useRef(null);

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    // Autofocus password on step 2
    useEffect(() => {
        if (step === 2 && passwordInputRef.current) {
            setTimeout(() => passwordInputRef.current.focus(), 350);
        }
    }, [step]);

    const handleContinue = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('Please enter your email or username');
            return;
        }
        setStep(2);
    };

    const handleEditEmail = () => {
        setStep(1);
        setPassword('');
        setShowPassword(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!password) {
            toast.error('Please enter your password');
            return;
        }
        await login({ email, password });
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-form-container">
                {/* Heading */}
                <h1 className="login-heading" style={{ fontFamily: 'Zuume-Bold' }}>
                    Log in
                </h1>

                <form onSubmit={step === 1 ? handleContinue : handleLogin}>
                    {/* Email — always visible */}
                    <label className="login-label">Email or Username</label>
                    <div className="login-input-wrapper">
                        <input
                            type="text"
                            className={`login-input ${step === 2 ? 'locked' : ''}`}
                            placeholder="Enter your email or username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly={step === 2}
                            autoFocus
                        />
                        {step === 2 && (
                            <button
                                type="button"
                                className="login-email-edit"
                                onClick={handleEditEmail}
                                title="Edit email"
                            >
                                <FaPen size={12} />
                            </button>
                        )}
                    </div>

                    {/* Password — slides down in-place */}
                    <AnimatePresence>
                        {step === 2 && (
                            <motion.div
                                key="password-section"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                            >
                                <label className="login-label" style={{ marginTop: 4 }}>Password</label>
                                <div className="login-input-wrapper">
                                    <input
                                        ref={passwordInputRef}
                                        type={showPassword ? 'text' : 'password'}
                                        className="login-input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ paddingRight: 44 }}
                                    />
                                    <button
                                        type="button"
                                        className="login-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit button */}
                    <button type="submit" className="login-submit-btn">
                        {step === 1 ? 'Continue' : 'Log in'}
                    </button>
                </form>

                {/* Register link */}
                <p className="register-link-row">
                    Don't have an account?{' '}
                    <Link to="/register">Register</Link>
                </p>

                {/* Back to home */}
                <p className="login-back-home">
                    <Link to="/"><FaArrowLeft size={11} /> Back to home</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
