import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaLinkedinIn, FaArrowRight, FaPen, FaEye, FaEyeSlash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/Register.css';

// Animated phrases for the floating message box
const PHRASES = [
    'Search for your university',
    'Search for previous exams',
    'Search for study material',
    'Search for partners',
];
const PHRASE_DURATION = 3500; // ms per phrase

// Password requirement checks
const PASSWORD_RULES = [
    { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
    { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
    { label: 'One number', test: (pw) => /\d/.test(pw) },
    { label: 'One special character', test: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw) },
];

// ─── Floating Message Box (Right Panel) ────────────────────────────────
const FloatingMessageBox = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % PHRASES.length);
        }, PHRASE_DURATION);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="floating-msg-box">
            {/* Search icon */}
            <div className="msg-icon">
                <FaSearch />
            </div>

            {/* Animated text */}
            <div className="floating-msg-text-wrapper">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={activeIndex}
                        className="floating-msg-text"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        {PHRASES[activeIndex]}
                    </motion.span>
                </AnimatePresence>
                <span className="typing-cursor" />
            </div>

            {/* Arrow icon */}
            <div className="msg-send">
                <FaArrowRight />
            </div>
        </div>
    );
};

// ─── Main Register Component ───────────────────────────────────────────
const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1); // 1 = email, 2 = password
    const [showPassword, setShowPassword] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const passwordInputRef = useRef(null);

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    // ── Email step handlers ──
    const handleContinue = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }
        setStep(2);
        // Focus password field after transition
        setTimeout(() => passwordInputRef.current?.focus(), 400);
    };

    const handleEditEmail = () => {
        setStep(1);
        setPassword('');
        setPasswordTouched(false);
        setShowPassword(false);
    };

    // ── Password step handlers ──
    const handleRegister = (e) => {
        e.preventDefault();
        const allMet = PASSWORD_RULES.every((rule) => rule.test(password));
        if (!allMet) {
            toast.error('Please meet all password requirements');
            return;
        }
        // Placeholder — will connect to full registration flow later
        toast.success('Registration flow coming soon!');
    };

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    return (
        <div className="register-page">
            {/* ═══════ LEFT PANEL — Form ═══════ */}
            <div className="register-form-panel">
                <div className="register-form-inner">
                    {/* Row 1: Heading */}
                    <h1 className="register-heading">Create your account</h1>

                    {/* Row 2: Google button */}
                    <button className="social-btn" type="button" onClick={() => toast.info('Google sign-in coming soon')}>
                        <FaGoogle style={{ color: '#4285F4' }} />
                        Continue with Google
                    </button>

                    {/* Row 3: LinkedIn button */}
                    <button className="social-btn" type="button" onClick={() => toast.info('LinkedIn sign-in coming soon')}>
                        <FaLinkedinIn style={{ color: '#0A66C2' }} />
                        Continue with LinkedIn
                    </button>

                    {/* Row 4: Divider */}
                    <div className="divider-or"><span>or</span></div>

                    {/* Row 5 & 6: Email */}
                    <form onSubmit={step === 1 ? handleContinue : handleRegister}>
                        <label className="register-label">Email</label>
                        <div className="register-input-wrapper">
                            <input
                                type="email"
                                className={`register-input ${step === 2 ? 'locked' : ''}`}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                readOnly={step === 2}
                                required
                            />
                            {/* Edit icon when locked */}
                            {step === 2 && (
                                <button type="button" className="email-edit-btn" onClick={handleEditEmail} title="Edit email">
                                    <FaPen size={12} />
                                </button>
                            )}
                        </div>

                        {/* ── Step 2: Password section (animated) ── */}
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
                                    <label className="register-label" style={{ marginTop: 4 }}>Password</label>
                                    <div className="register-input-wrapper">
                                        <input
                                            ref={passwordInputRef}
                                            type={showPassword ? 'text' : 'password'}
                                            className="register-input"
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (!passwordTouched) setPasswordTouched(true);
                                            }}
                                            required
                                            style={{ paddingRight: 44 }}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                            title={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </button>
                                    </div>

                                    {/* Password requirements checklist */}
                                    <AnimatePresence>
                                        {passwordTouched && (
                                            <motion.ul
                                                className="password-requirements"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                {PASSWORD_RULES.map((rule, idx) => {
                                                    const met = rule.test(password);
                                                    return (
                                                        <li key={idx} className={met ? 'met' : 'unmet'}>
                                                            <span className="req-icon">
                                                                {met ? <FaCheck /> : <FaTimes />}
                                                            </span>
                                                            {rule.label}
                                                        </li>
                                                    );
                                                })}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Row 7: Terms notice */}
                        <p className="terms-notice">
                            By continuing, you agree to our{' '}
                            <a href="#terms">Terms of Service</a> and{' '}
                            <a href="#privacy">Privacy Policy</a>.
                        </p>

                        {/* Row 8: Continue / Register button */}
                        <button type="submit" className="register-submit-btn">
                            {step === 1 ? 'Continue' : 'Create Account'}
                        </button>
                    </form>

                    {/* Row 9: Login link */}
                    <p className="login-link-row">
                        Already have an account?{' '}
                        <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>

            {/* ═══════ RIGHT PANEL — Decorative ═══════ */}
            <div className="register-decor-panel">
                {/* Aurora glow border */}
                <div className="aurora-border" />
                <div className="aurora-border-wide" />

                {/* Background blobs */}
                <div className="decor-blob decor-blob-1" />
                <div className="decor-blob decor-blob-2" />
                <div className="decor-blob decor-blob-3" />

                {/* Floating message box */}
                <FloatingMessageBox />
            </div>
        </div>
    );
};

export default Register;
