import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { API_BASE_URL } from '../config';

import requestService from '../features/requests/requestService';
import { toast } from 'react-toastify';
import { FaRocket, FaShieldAlt, FaQuestionCircle, FaGlobe } from 'react-icons/fa';

const RequestMentorshipForm = () => {
    const { mentorId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);

    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPublic, setIsPublic] = useState(false);
    const [pitch, setPitch] = useState({});

    const defaultQuestions = [
        { key: 'Hook', label: 'The Hook', placeholder: 'What exactly is your solution in one sentence?', questionType: 'text' },
        { key: 'Problem', label: 'The Problem', placeholder: 'What core problem are you solving, and for whom?', questionType: 'text' },
        { key: 'Why a Mentor?', label: 'Why a Mentor?', placeholder: 'How can a mentor specifically accelerate your progress right now?', questionType: 'text' },
        { key: 'Core Feature', label: 'Core Feature', placeholder: 'What is the one core feature that makes this work?', questionType: 'text' },
        { key: '30-Day Goal', label: '30-Day Goal', placeholder: 'What does success look like after 30 days of mentorship?', questionType: 'text' },
        { key: 'Current Challenge', label: 'Current Challenge', placeholder: 'What is the hardest part of execution today?', questionType: 'text' },
        { key: 'Mentorship Mode', label: 'Preferred Mode', questionType: 'select', options: ['Online', 'In-person', 'Hybrid'] },
        { key: 'Interaction Type', label: 'Interaction Type', questionType: 'select', options: ['1-on-1', 'Small Group'] },
        { key: 'Commitment', label: 'The Commitment', placeholder: 'Why is this project worth a mentor\'s limited time and expertise?', questionType: 'text' }
    ];

    const [questions, setQuestions] = useState(defaultQuestions);

    useEffect(() => {
        if (!currentUser) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }

        if (mentorId) {
            const fetchMentor = async () => {
                try {
                    const res = await axios.get(`${API_BASE_URL}/api/users/${mentorId}`);
                    setMentor(res.data);
                    if (res.data.pitchQuestions && res.data.pitchQuestions.length > 0) {
                        const customQs = res.data.pitchQuestions.map((q, idx) => ({
                            key: `q_${idx}`,
                            label: q.questionText,
                            questionType: q.questionType,
                            options: q.options
                        }));
                        setQuestions(customQs);
                    }
                } catch (error) {
                    console.error('Error fetching mentor', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMentor();
        } else {
            setLoading(false);
            setIsPublic(true); // If no mentorId, default to public hub
        }
    }, [mentorId, currentUser, navigate]);

    const handleInputChange = (key, value) => {
        setPitch(prev => ({ ...prev, [key]: value }));
    };

    const handleCheckboxChange = (key, option, checked) => {
        setPitch(prev => {
            const current = prev[key] || [];
            if (checked) {
                return { ...prev, [key]: [...current, option] };
            } else {
                return { ...prev, [key]: current.filter(o => o !== option) };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error('Please login to submit the request');
            return;
        }

        // Validate all required fields are filled
        const missingFields = questions.filter(q => {
            const answer = pitch[q.key];
            if (q.questionType === 'checkbox') {
                return !answer || !Array.isArray(answer) || answer.length === 0;
            }
            return !answer || (typeof answer === 'string' && answer.trim() === '');
        });

        if (missingFields.length > 0) {
            toast.error('Please answer all questions before submitting.');
            return;
        }

        // Ensure MCQ answers are strings and checkbox answers are arrays
        const validatedPitch = { ...pitch };
        questions.forEach(q => {
            if (q.questionType === 'mcq' && Array.isArray(validatedPitch[q.key])) {
                validatedPitch[q.key] = validatedPitch[q.key][0]; // Take first element if accidentally array
            } else if (q.questionType === 'checkbox' && !Array.isArray(validatedPitch[q.key])) {
                validatedPitch[q.key] = [validatedPitch[q.key]]; // Wrap in array if not already
            }
        });

        try {
            await requestService.sendRequest(
                mentorId || null,
                'mentorship',
                validatedPitch[questions[0].key] || 'Mentorship Request',
                currentUser.token,
                validatedPitch,
                isPublic
            );
            toast.success('Mentorship request sent successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error('Failed to submit request. Please try again.');
        }
    };

    if (loading) return <div className="text-center py-20">Loading project details...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 px-8 py-10 text-white text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                        <FaRocket size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold mb-2">Project Pitch</h1>
                    <p className="text-indigo-100 max-w-lg mx-auto">
                        {mentor
                            ? `Convince ${mentor.name} that your project is ready for their expertise.`
                            : 'Post your project to the Mental Hub and find a mentor for pro-bono guidance.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Visibility Toggle if mentorId is present */}
                    {mentorId && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-800 flex items-center gap-2">
                                    <FaShieldAlt className="text-indigo-500" /> Private Request
                                </p>
                                <p className="text-xs text-gray-400">This pitch will only be seen by {mentor.name}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-gray-500">Public Hub?</span>
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {!mentorId && (
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-4">
                            <FaGlobe className="text-blue-500 mt-1" />
                            <div>
                                <p className="text-sm font-bold text-blue-800 uppercase tracking-wider">Public Pitch Hub</p>
                                <p className="text-xs text-blue-600 leading-relaxed">Your pitch will be visible to all mentors on the platform. High-signal pitches are much more likely to be claimed for pro-bono help.</p>
                            </div>
                        </div>
                    )}

                    {/* Pitch Questions */}
                    <div className="space-y-6">
                        {questions.map((q, idx) => (
                            <div key={idx} className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">
                                    <span className="w-5 h-5 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg text-[10px]">{idx + 1}</span>
                                    {q.label}
                                </label>

                                {q.questionType === 'select' || q.questionType === 'mcq' ? (
                                    <div className="space-y-2">
                                        {q.questionType === 'select' ? (
                                            <select
                                                className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 outline-none"
                                                value={pitch[q.key] || ''}
                                                onChange={(e) => handleInputChange(q.key, e.target.value)}
                                                required
                                            >
                                                <option value="">Select an option</option>
                                                {q.options.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {q.options.map(opt => (
                                                    <div
                                                        key={opt}
                                                        onClick={() => handleInputChange(q.key, opt)}
                                                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${pitch[q.key] === opt ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={q.key}
                                                            value={opt}
                                                            checked={pitch[q.key] === opt}
                                                            onChange={() => handleInputChange(q.key, opt)}
                                                            className="w-4 h-4 accent-indigo-600 pointer-events-none"
                                                            required
                                                        />
                                                        <span className="text-sm font-medium">{opt}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : q.questionType === 'checkbox' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map(opt => (
                                            <label key={opt} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${(pitch[q.key] || []).includes(opt) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={(pitch[q.key] || []).includes(opt)}
                                                    onChange={(e) => handleCheckboxChange(q.key, opt, e.target.checked)}
                                                    className="w-4 h-4 accent-indigo-600 rounded"
                                                />
                                                <span className="text-sm font-medium">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 placeholder:text-gray-300 min-h-[100px]"
                                        placeholder={q.placeholder || 'Type your answer here...'}
                                        value={pitch[q.key] || ''}
                                        onChange={(e) => handleInputChange(q.key, e.target.value)}
                                        required
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <FaRocket /> {isPublic ? 'Post to Pitch Hub' : `Send Pitch to ${mentor?.name}`}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                            <FaQuestionCircle /> Mentors receive high volumes of requests. High quality answers increase success rates.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestMentorshipForm;
