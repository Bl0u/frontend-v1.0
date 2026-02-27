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

// ─── Inline SVG Icons ──────────────────────────────────────────────────

const PeerIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8z" />
        <path d="M40 44c0-8.8-7.2-16-16-16S8 35.2 8 44" />
    </svg>
);

const ProjectIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="14" r="6" />
        <circle cx="32" cy="14" r="6" />
        <path d="M4 42c0-6.6 5.4-12 12-12s12 5.4 12 12" />
        <path d="M20 42c0-6.6 5.4-12 12-12s12 5.4 12 12" />
    </svg>
);

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        major: '',
        academicLevel: '',
        university: '',
        partnerType: '',
        matchingGoal: '',
        topics: [],
        availabilityDays: [],
        timezone: 'GMT+2', // Default
        studyMode: 'Online',
        commitmentLevel: 'Balanced'
    });

    const { register, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Get email/password from navigation state
    const email = location.state?.email || '';
    const password = location.state?.password || '';

    useEffect(() => {
        if (!email || !password) {
            navigate('/register');
        }
    }, [email, password, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/register');
    };

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        const finalData = {
            ...formData,
            email,
            password,
            role: 'student', // Default role for students
            availability: {
                days: formData.availabilityDays,
                timeRanges: ['Evening'] // Default on onboarding
            }
        };

        const success = await register(finalData);
        setIsSubmitting(false);

        if (success) {
            navigate('/dashboard');
        }
    };

    const isStep2Valid = formData.name && formData.major && formData.academicLevel && formData.university;
    const isStep3Valid = formData.partnerType && formData.matchingGoal && formData.topics.length > 0;

    return (
        <div className="onboarding-page">
            <button className="onboarding-logout" onClick={handleLogout}>
                <FiLogOut size={15} /> Log out
            </button>

            <ProgressDots phase={phase} />

            <AnimatePresence mode="wait">
                {/* ═══ Phase 1: Account Setup ═══ */}
                {phase === 1 && (
                    <motion.div key="phase-1" className="onboarding-phase" variants={phaseVariants} initial="initial" animate="animate" exit="exit">
                        <h2 className="onboarding-title" style={{ fontFamily: 'Zuume-Bold' }}>Secure your spot</h2>
                        <p className="onboarding-subtitle">Choose a unique username to get started</p>

                        <div className="username-input-group">
                            <span className="username-prefix">@</span>
                            <input
                                type="text"
                                name="username"
                                className="username-input"
                                placeholder="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                autoFocus
                            />
                        </div>

                        <button className="onboarding-btn" onClick={() => setPhase(2)} disabled={formData.username.length < 3}>
                            Continue <FaArrowRight />
                        </button>
                    </motion.div>
                )}

                {/* ═══ Phase 2: Core Identity ═══ */}
                {phase === 2 && (
                    <motion.div key="phase-2" className="onboarding-phase" variants={phaseVariants} initial="initial" animate="animate" exit="exit">
                        <h2 className="onboarding-title" style={{ fontFamily: 'Zuume-Bold' }}>Core Identity</h2>
                        <p className="onboarding-subtitle">Tell us about your academic background</p>

                        <div className="onboarding-form-grid">
                            <div className="onboarding-input-wrap">
                                <label>Display Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Full Name" />
                            </div>
                            <div className="onboarding-input-wrap">
                                <label>Major / Field *</label>
                                <input type="text" name="major" value={formData.major} onChange={onChange} placeholder="e.g. Computer Science" />
                            </div>
                            <div className="onboarding-input-wrap">
                                <label>Academic Level *</label>
                                <select name="academicLevel" value={formData.academicLevel} onChange={onChange}>
                                    <option value="">Select Level</option>
                                    <option value="Level 1">Level 1</option>
                                    <option value="Level 2">Level 2</option>
                                    <option value="Level 3">Level 3</option>
                                    <option value="Level 4">Level 4</option>
                                    <option value="Graduated">Graduated</option>
                                </select>
                            </div>
                            <div className="onboarding-input-wrap">
                                <label>University / Faculty *</label>
                                <input type="text" name="university" value={formData.university} onChange={onChange} placeholder="e.g. Cairo University" />
                            </div>
                        </div>

                        <div className="onboarding-btn-group">
                            <button className="onboarding-back" onClick={() => setPhase(1)}><FaArrowLeft /> Back</button>
                            <button className="onboarding-btn" onClick={() => setPhase(3)} disabled={!isStep2Valid}>
                                Next Step <FaArrowRight />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ═══ Phase 3: Partner Matching Essentials ═══ */}
                {phase === 3 && (
                    <motion.div key="phase-3" className="onboarding-phase" variants={phaseVariants} initial="initial" animate="animate" exit="exit">
                        <h2 className="onboarding-title" style={{ fontFamily: 'Zuume-Bold' }}>Matching Essentials</h2>
                        <p className="onboarding-subtitle">What kind of study partner are you looking for?</p>

                        <div className="cards-grid cards-grid-2">
                            <div
                                className={`selection-card ${formData.partnerType === 'peer' ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, partnerType: 'peer' })}
                            >
                                <div className="card-icon"><PeerIcon /></div>
                                <span className="card-label">Peer (Study Together)</span>
                                <div className="card-check"><FaCheck /></div>
                            </div>

                            <div
                                className={`selection-card ${formData.partnerType === 'project teammate' ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, partnerType: 'project teammate' })}
                            >
                                <div className="card-icon"><ProjectIcon /></div>
                                <span className="card-label">Project Teammate</span>
                                <div className="card-check"><FaCheck /></div>
                            </div>
                        </div>

                        <div className="onboarding-form-grid">
                            <div className="onboarding-input-wrap">
                                <label>Primary Goal *</label>
                                <input type="text" name="matchingGoal" value={formData.matchingGoal} onChange={onChange} placeholder="e.g. Exam prep" />
                            </div>
                            <div className="onboarding-input-wrap full-width">
                                <label>Topics / Areas (Comma separated) *</label>
                                <input
                                    type="text"
                                    placeholder="AI, Math, History..."
                                    onChange={(e) => setFormData({ ...formData, topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                />
                            </div>
                        </div>

                        <div className="onboarding-btn-group">
                            <button className="onboarding-back" onClick={() => setPhase(2)}><FaArrowLeft /> Back</button>
                            <button className="onboarding-btn" onClick={handleFinish} disabled={!isStep3Valid || isSubmitting}>
                                {isSubmitting ? 'Finalizing...' : 'Finish Profile'} {!isSubmitting && <FaArrowRight />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
