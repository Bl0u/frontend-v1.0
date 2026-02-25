import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/Onboarding.css';
import '../fonts/style/fontsStyle.css';

// ─── Inline SVG Icons ──────────────────────────────────────────────────

const StudentIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4L2 16l22 12 22-12L24 4z" />
        <path d="M8 20v12c0 0 4 8 16 8s16-8 16-8V20" />
        <path d="M42 16v16" />
        <circle cx="42" cy="34" r="2" />
    </svg>
);

const GraduateIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4L2 16l22 12 22-12L24 4z" />
        <path d="M8 20v12c0 0 4 8 16 8s16-8 16-8V20" />
        <rect x="18" y="2" width="12" height="6" rx="2" />
        <path d="M24 8v-2" />
        <path d="M20 2h8" />
        <line x1="24" y1="36" x2="24" y2="44" />
        <path d="M18 44h12" />
    </svg>
);

const ExamsIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="4" width="32" height="40" rx="3" />
        <line x1="14" y1="14" x2="34" y2="14" />
        <line x1="14" y1="20" x2="34" y2="20" />
        <line x1="14" y1="26" x2="28" y2="26" />
        <polyline points="14 34 18 38 26 30" />
    </svg>
);

const CollegeIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="18" width="36" height="26" rx="2" />
        <path d="M24 4L6 18h36L24 4z" />
        <rect x="18" y="30" width="12" height="14" rx="1" />
        <rect x="10" y="24" width="6" height="8" rx="1" />
        <rect x="32" y="24" width="6" height="8" rx="1" />
    </svg>
);

const PrepIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 40V12a4 4 0 014-4h12l4 4h16a4 4 0 014 4v24a4 4 0 01-4 4H8a4 4 0 01-4-4z" />
        <circle cx="24" cy="26" r="6" />
        <path d="M28.2 30.2L34 36" />
    </svg>
);

const PartnerIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="14" r="6" />
        <circle cx="32" cy="14" r="6" />
        <path d="M6 36c0-6 4-10 10-10h0c2.5 0 4.7.8 6.5 2" />
        <path d="M42 36c0-6-4-10-10-10h0c-2.5 0-4.7.8-6.5 2" />
        <path d="M20 38l4-4 4 4" />
    </svg>
);

// ─── Use-case options ──────────────────────────────────────────────────
const USE_CASES = [
    { id: 'exams', label: 'Previous Exams', icon: ExamsIcon },
    { id: 'college', label: 'College Resources', icon: CollegeIcon },
    { id: 'prep', label: 'Exam Preparation', icon: PrepIcon },
    { id: 'partner', label: 'Find a Partner', icon: PartnerIcon },
];

// ─── Animation variants ────────────────────────────────────────────────
const phaseVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
};

// ─── Progress Indicator ────────────────────────────────────────────────
const ProgressDots = ({ phase }) => (
    <div className="onboarding-progress">
        <div className={`progress-dot ${phase >= 1 ? 'active' : ''}`} />
        <div className={`progress-line ${phase >= 2 ? 'active' : ''}`} />
        <div className={`progress-dot ${phase >= 2 ? 'active' : ''}`} />
        <div className={`progress-line ${phase >= 3 ? 'active' : ''}`} />
        <div className={`progress-dot ${phase >= 3 ? 'active' : ''}`} />
    </div>
);

// ─── Main Onboarding Component ─────────────────────────────────────────
const Onboarding = () => {
    const [phase, setPhase] = useState(1);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState(''); // 'student' | 'graduate'
    const [useCases, setUseCases] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Get email/password from navigation state
    const email = location.state?.email || '';
    const password = location.state?.password || '';

    // Redirect if no credentials
    useEffect(() => {
        if (!email || !password) {
            navigate('/register');
        }
    }, [email, password, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/register');
    };

    const handleUseCaseToggle = (id) => {
        setUseCases((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        const formData = {
            name: username,
            username,
            email,
            password,
            role: role === 'graduate' ? 'student' : 'student', // backend expects 'student' or 'mentor'
        };

        const success = await register(formData);
        setIsSubmitting(false);

        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="onboarding-page">
            {/* Logout */}
            <button className="onboarding-logout" onClick={handleLogout}>
                <FiLogOut size={15} />
                Log out
            </button>

            {/* Progress dots */}
            <ProgressDots phase={phase} />

            {/* Phases */}
            <AnimatePresence mode="wait">
                {/* ═══ Phase 1: Username ═══ */}
                {phase === 1 && (
                    <motion.div
                        key="phase-1"
                        className="onboarding-phase"
                        variants={phaseVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                        <h2 className="onboarding-title" style={{ fontFamily: 'Zuume-Bold' }}>
                            Choose your username
                        </h2>
                        <p className="onboarding-subtitle">
                            This is how others will find you
                        </p>

                        <div className="username-input-group">
                            <span className="username-prefix">@</span>
                            <input
                                type="text"
                                className="username-input"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                autoFocus
                            />
                        </div>

                        <button
                            className="onboarding-btn"
                            onClick={() => setPhase(2)}
                            disabled={username.length < 3}
                        >
                            Continue <FaArrowRight />
                        </button>
                    </motion.div>
                )}

                {/* ═══ Phase 2: Role ═══ */}
                {phase === 2 && (
                    <motion.div
                        key="phase-2"
                        className="onboarding-phase"
                        variants={phaseVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                        <h2 className="onboarding-title" style={{ fontFamily: 'Zuume-Bold' }}>
                            What describes you?
                        </h2>
                        <p className="onboarding-subtitle">
                            Help us personalize your experience
                        </p>

                        <div className="cards-grid cards-grid-2">
                            <div
                                className={`selection-card ${role === 'student' ? 'selected' : ''}`}
                                onClick={() => setRole('student')}
                            >
                                <div className="card-icon"><StudentIcon /></div>
                                <span className="card-label">Student</span>
                                <div className="card-check"><FaCheck /></div>
                            </div>

                            <div
                                className={`selection-card ${role === 'graduate' ? 'selected' : ''}`}
                                onClick={() => setRole('graduate')}
                            >
                                <div className="card-icon"><GraduateIcon /></div>
                                <span className="card-label">Graduate</span>
                                <div className="card-check"><FaCheck /></div>
                            </div>
                        </div>

                        <button
                            className="onboarding-btn"
                            onClick={() => setPhase(3)}
                            disabled={!role}
                        >
                            Continue <FaArrowRight />
                        </button>

                        <button className="onboarding-back" onClick={() => setPhase(1)}>
                            <FaArrowLeft /> Back
                        </button>
                    </motion.div>
                )}

                {/* ═══ Phase 3: Use Cases ═══ */}
                {phase === 3 && (
                    <motion.div
                        key="phase-3"
                        className="onboarding-phase"
                        variants={phaseVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                        <h2 className="onboarding-title" style={{ fontFamily: 'Zuume-Bold' }}>
                            What brings you here?
                        </h2>
                        <p className="onboarding-subtitle">
                            Select all that apply
                        </p>

                        <div className="cards-grid cards-grid-4">
                            {USE_CASES.map(({ id, label, icon: Icon }) => (
                                <div
                                    key={id}
                                    className={`selection-card ${useCases.includes(id) ? 'selected' : ''}`}
                                    onClick={() => handleUseCaseToggle(id)}
                                >
                                    <div className="card-icon"><Icon /></div>
                                    <span className="card-label">{label}</span>
                                    <div className="card-check"><FaCheck /></div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="onboarding-btn"
                            onClick={handleFinish}
                            disabled={useCases.length === 0 || isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : 'Finish'} {!isSubmitting && <FaArrowRight />}
                        </button>

                        <button className="onboarding-back" onClick={() => setPhase(2)}>
                            <FaArrowLeft /> Back
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
