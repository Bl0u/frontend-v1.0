import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { toast } from 'react-toastify';
import { FaRocket, FaChevronRight, FaChevronLeft, FaCheckCircle, FaLayerGroup, FaPlus, FaTrash, FaUserShield } from 'react-icons/fa';

const PitchForm = () => {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(-1); // -1: Category Selection, >=0: Questions, 'roles': Roles Definition
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    const [pitchData, setPitchData] = useState({
        answers: {},
        roles: [],
        mentorNeeded: false
    });

    useEffect(() => {
        if (!currentUser?.token) return;

        const fetchConfig = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/admin/pitch-config`, {
                    headers: { Authorization: `Bearer ${currentUser.token}` }
                });
                setConfig(res.data);
            } catch (error) {
                console.error('Error fetching pitch config', error);
                toast.error('Failed to load pitch form configuration');
            }
        };
        fetchConfig();
    }, [currentUser?.token]);

    // Handle Mentor Auto-role
    useEffect(() => {
        if (!config?.rolesEnabled) return;

        if (pitchData.mentorNeeded) {
            const hasMentorRole = pitchData.roles.some(r => r.roleType === 'mentor');
            if (!hasMentorRole) {
                const mentorRole = {
                    id: `mentor_${Date.now()}`,
                    name: 'Mentor',
                    requirements: '',
                    roleType: 'mentor'
                };
                setPitchData(prev => ({ ...prev, roles: [mentorRole, ...prev.roles] }));
            }
        } else {
            setPitchData(prev => ({
                ...prev,
                roles: prev.roles.filter(r => r.roleType !== 'mentor')
            }));
        }
    }, [pitchData.mentorNeeded, config?.rolesEnabled]);

    const handleAnswerChange = (qId, value) => {
        setPitchData(prev => ({
            ...prev,
            answers: { ...prev.answers, [qId]: value }
        }));
    };

    const handleCheckboxChange = (qId, option, checked) => {
        const currentAnswers = pitchData.answers[qId] || [];
        let newAnswers;
        if (checked) {
            newAnswers = [...currentAnswers, option];
        } else {
            newAnswers = currentAnswers.filter(o => o !== option);
        }
        handleAnswerChange(qId, newAnswers);
    };

    const validateCategory = (catId) => {
        if (!config) return true;
        const catQuestions = config.questions.filter(q => q.categoryId === catId);
        return catQuestions.every(q => {
            if (!q.required) return true;
            const answer = pitchData.answers[q.id];
            if (q.type === 'checkbox') return answer && answer.length > 0;
            return answer && answer.toString().trim() !== '';
        });
    };

    const addRole = () => {
        const newRole = {
            id: `role_${Date.now()}`,
            name: '',
            requirements: '',
            roleType: 'teammate'
        };
        setPitchData(prev => ({ ...prev, roles: [...prev.roles, newRole] }));
    };

    const updateRole = (id, field, value) => {
        setPitchData(prev => ({
            ...prev,
            roles: prev.roles.map(r => r.id === id ? { ...r, [field]: value } : r)
        }));
    };

    const removeRole = (id) => {
        setPitchData(prev => ({
            ...prev,
            roles: prev.roles.filter(r => r.id !== id)
        }));
    };

    const handleSubmit = async () => {
        // Validation
        const missingRequired = config.questions.some(q => {
            if (!q.required) return false;
            const answer = pitchData.answers[q.id];
            if (q.type === 'checkbox') return !answer || answer.length === 0;
            return !answer || answer.toString().trim() === '';
        });

        if (missingRequired) {
            toast.error('Please answer all required questions before broadcasting.');
            return;
        }

        if (config.rolesEnabled && pitchData.roles.length === 0) {
            toast.error('Please add at least one role for your project.');
            return;
        }

        if (config.rolesEnabled && pitchData.roles.some(r => !r.name.trim() || !r.requirements.trim())) {
            toast.error('Please complete all role names and requirements.');
            return;
        }

        setLoading(true);
        try {
            const tokenConfig = { headers: { Authorization: `Bearer ${currentUser.token}` } };

            const finalPitch = {};
            config.questions.forEach(q => {
                const answer = pitchData.answers[q.id];
                if (answer) finalPitch[q.label] = answer;
            });

            await axios.post(`${API_BASE_URL}/api/requests`, {
                pitch: finalPitch,
                message: `Project Pitch by ${currentUser.name}`,
                isPublic: true,
                roles: pitchData.roles,
                mentorNeeded: pitchData.mentorNeeded
            }, tokenConfig);

            toast.success('Your project pitch is now live in the Hub!');
            navigate('/pitch-hub');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post pitch');
        } finally {
            setLoading(false);
        }
    };

    if (!config) return (
        <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
        </div>
    );

    const categories = config.categories || [];
    const questions = activeCategory ? config.questions.filter(q => q.categoryId === activeCategory.id) : [];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EAEEFE] text-[#001E80] rounded-3xl mb-6">
                    <FaRocket size={28} />
                </div>
                <h1
                    className="text-4xl md:text-5xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1 leading-tight"
                    style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                >
                    Pitch Hub 2.1
                </h1>
                <p className="text-[#010D3E]/50 text-base font-medium mt-2 max-w-md mx-auto">
                    Define your project vision and specify the roles you need to bring it to life.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setActiveCategory(cat);
                            setStep(0);
                        }}
                        className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${activeCategory?.id === cat.id
                            ? 'bg-[#001E80] border-[#001E80] text-white shadow-lg shadow-blue-100'
                            : validateCategory(cat.id)
                                ? 'bg-white border-green-100 text-green-600'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                            }`}
                    >
                        {validateCategory(cat.id) && <FaCheckCircle size={10} />}
                        {cat.label}
                    </button>
                ))}
                {config.rolesEnabled && (
                    <button
                        onClick={() => {
                            setActiveCategory({ id: 'roles', label: 'Project Roles' });
                            setStep('roles');
                        }}
                        className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${step === 'roles'
                            ? 'bg-[#001E80] border-[#001E80] text-white shadow-lg shadow-blue-100'
                            : pitchData.roles.length > 0
                                ? 'bg-white border-green-100 text-green-600'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                            }`}
                    >
                        {pitchData.roles.length > 0 && <FaCheckCircle size={10} />}
                        Roles Definition
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-[#001E80]/5 overflow-hidden transition-all duration-500">
                {!activeCategory ? (
                    <div className="p-16 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-[#EAEEFE] rounded-[2rem] flex items-center justify-center mx-auto text-[#001E80]">
                            <FaLayerGroup size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-800">Ready to pitch?</h2>
                            <p className="text-gray-400 font-medium mt-2">Start by filling out your project details.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat); setStep(0); }}
                                    className="p-6 rounded-3xl border-2 border-gray-50 hover:border-[#001E80]/20 hover:bg-gray-50 transition-all text-left group"
                                >
                                    <div className="font-black text-xs uppercase tracking-widest text-gray-400 group-hover:text-[#001E80] mb-1">Begin</div>
                                    <div className="font-extrabold text-gray-800">{cat.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : step === 'roles' ? (
                    <div className="p-10 md:p-16 space-y-10 animate-in slide-in-from-bottom-6 duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black text-gray-800" style={{ fontFamily: 'Zuume-Bold' }}>Project Roles</h2>
                                <p className="text-gray-400 font-medium">Define who you need on your team.</p>
                            </div>
                            <button
                                onClick={addRole}
                                className="bg-[#EAEEFE] text-[#001E80] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-[#001E80] hover:text-white flex items-center gap-2"
                            >
                                <FaPlus /> Add Role
                            </button>
                        </div>

                        <div className="bg-[#EAEEFE]/30 p-6 rounded-3xl border border-[#001E80]/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#001E80] shadow-sm">
                                    <FaUserShield size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Need a Mentor?</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">Check this if you want expert guidance for this project.</p>
                                </div>
                            </div>
                            <div
                                onClick={() => setPitchData(prev => ({ ...prev, mentorNeeded: !prev.mentorNeeded }))}
                                className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all flex items-center ${pitchData.mentorNeeded ? 'bg-[#001E80] justify-end' : 'bg-gray-200 justify-start'}`}
                            >
                                <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {pitchData.roles.map((role) => (
                                <div key={role.id} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative group animate-in zoom-in-95">
                                    {role.roleType !== 'mentor' && (
                                        <button
                                            onClick={() => removeRole(role.id)}
                                            className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    )}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-2 block">Role Name</label>
                                            <input
                                                type="text"
                                                value={role.name}
                                                onChange={(e) => updateRole(role.id, 'name', e.target.value)}
                                                placeholder="e.g. Lead Designer, Frontend Developer..."
                                                disabled={role.roleType === 'mentor'}
                                                className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-[#001E80]/10 rounded-2xl outline-none font-bold text-gray-800 transition-all shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-2 block">Requirements & Benefits</label>
                                            <textarea
                                                value={role.requirements}
                                                onChange={(e) => updateRole(role.id, 'requirements', e.target.value)}
                                                placeholder={role.roleType === 'mentor' ? "What expert guidance do you need? What benefits will the mentor get?" : "Please enter the requirements for this role..."}
                                                className="w-full h-32 px-6 py-4 bg-white border-2 border-transparent focus:border-[#001E80]/10 rounded-2xl outline-none font-medium text-gray-600 transition-all resize-none shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-10 flex flex-col gap-4 max-w-md mx-auto">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-[#001E80] hover:bg-blue-900 text-white py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : <><FaRocket /> Broadcast to Hub</>}
                            </button>
                        </div>
                    </div>
                ) : step < questions.length ? (
                    <div className="p-10 md:p-16 space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <div>
                            <span className="text-xs font-black uppercase tracking-widest text-[#001E80] mb-2 block">
                                {activeCategory.label} · Question {step + 1} of {questions.length}
                            </span>
                            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
                                {questions[step].label}
                                {questions[step].required && <span className="text-red-500 text-xs font-black uppercase tracking-tighter bg-red-50 px-2 py-1 rounded-lg">Required</span>}
                            </h2>
                        </div>

                        <div className="min-h-[200px]">
                            {questions[step].type === 'text' && (
                                <textarea
                                    className="w-full h-48 p-6 bg-gray-50 border-2 border-transparent focus:border-[#001E80]/30 focus:bg-white focus:ring-2 focus:ring-[#001E80]/10 rounded-3xl outline-none transition-all text-lg resize-none font-medium"
                                    placeholder="Type your answer here..."
                                    value={pitchData.answers[questions[step].id] || ''}
                                    onChange={(e) => handleAnswerChange(questions[step].id, e.target.value)}
                                />
                            )}

                            {questions[step].type === 'radio' && (
                                <div className="grid grid-cols-1 gap-3">
                                    {(questions[step].options || []).map((opt, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleAnswerChange(questions[step].id, opt)}
                                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${pitchData.answers[questions[step].id] === opt ? 'bg-[#EAEEFE] border-[#001E80]/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <span className={`font-bold ${pitchData.answers[questions[step].id] === opt ? 'text-[#001E80]' : 'text-gray-600'}`}>{opt}</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${pitchData.answers[questions[step].id] === opt ? 'border-[#001E80]' : 'border-gray-200 group-hover:border-gray-300'}`}>
                                                {pitchData.answers[questions[step].id] === opt && <div className="w-2.5 h-2.5 bg-[#001E80] rounded-full" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {questions[step].type === 'checkbox' && (
                                <div className="grid grid-cols-1 gap-3">
                                    {(questions[step].options || []).map((opt, idx) => {
                                        const isChecked = (pitchData.answers[questions[step].id] || []).includes(opt);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => handleCheckboxChange(questions[step].id, opt, !isChecked)}
                                                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${isChecked ? 'bg-[#EAEEFE] border-[#001E80]/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <span className={`font-bold ${isChecked ? 'text-[#001E80]' : 'text-gray-600'}`}>{opt}</span>
                                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${isChecked ? 'bg-[#001E80] border-[#001E80]' : 'border-gray-200 group-hover:border-gray-300'}`}>
                                                    {isChecked && <span>✓</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className={`flex items-center gap-2 font-bold transition-all ${step === 0 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                disabled={step === 0}
                            >
                                <FaChevronLeft /> Back
                            </button>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        const nextCatIdx = categories.findIndex(c => c.id === activeCategory.id) + 1;
                                        if (nextCatIdx < categories.length) {
                                            setActiveCategory(categories[nextCatIdx]);
                                            setStep(0);
                                        } else {
                                            if (config.rolesEnabled) {
                                                setStep('roles');
                                                setActiveCategory({ id: 'roles', label: 'Project Roles' });
                                            } else {
                                                setStep(questions.length); // Final step
                                            }
                                        }
                                    }}
                                    className="text-gray-400 font-bold hover:text-[#001E80] text-sm"
                                >
                                    Skip Category
                                </button>
                                <button
                                    onClick={() => {
                                        if (step === questions.length - 1) {
                                            if (config.rolesEnabled) {
                                                setStep('roles');
                                                setActiveCategory({ id: 'roles', label: 'Project Roles' });
                                            } else {
                                                setStep(s => s + 1);
                                            }
                                        } else {
                                            setStep(s => s + 1);
                                        }
                                    }}
                                    disabled={questions[step].required && (!pitchData.answers[questions[step].id] || (questions[step].type === 'checkbox' && pitchData.answers[questions[step].id].length === 0))}
                                    className="bg-[#001E80] hover:bg-blue-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-50 transition-all active:scale-[0.97] disabled:opacity-20"
                                >
                                    Continue <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-16 text-center space-y-6">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                            <FaCheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-800">All set!</h2>
                        <p className="text-gray-400 font-medium">Your pitch is ready. Review your answers if needed or broadcast now.</p>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full max-w-sm bg-[#001E80] hover:bg-blue-900 text-white py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : <><FaRocket /> Broadcast to Hub</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PitchForm;
