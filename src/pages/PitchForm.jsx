import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { toast } from 'react-toastify';
import { FaRocket, FaChevronRight, FaChevronLeft, FaCheckCircle, FaLightbulb } from 'react-icons/fa';

const PitchForm = () => {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    const [pitchData, setPitchData] = useState({
        pitch: {},
        message: '',
        isPublic: true
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;
            try {
                const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
                const res = await axios.get(`${API_BASE_URL}/api/users/${currentUser._id}`, config);
                setProfile(res.data);

                // Initialize pitch fields from user's pitch questions if they exist
                const initialPitch = {};
                (res.data.pitchQuestions || []).forEach(q => {
                    initialPitch[q] = '';
                });
                setPitchData(prev => ({ ...prev, pitch: initialPitch }));
            } catch (error) {
                console.error('Error fetching profile', error);
            }
        };
        fetchProfile();
    }, [currentUser]);

    const questions = profile?.pitchQuestions?.length > 0
        ? profile.pitchQuestions
        : ['The Hook (Short summary)', 'The Problem', 'The Solution', 'Why Collaborate with me?'];

    const handleInputChange = (field, value) => {
        setPitchData(prev => ({
            ...prev,
            pitch: { ...prev.pitch, [field]: value }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };

            // In the new model, a public pitch is essentially a Request with no recipient
            await axios.post(`${API_BASE_URL}/api/requests/public-pitch`, {
                pitch: pitchData.pitch,
                message: `Project Pitch by ${currentUser.name}`
            }, config);

            toast.success('Your project pitch is now live in the Hub!');
            navigate('/pitch-hub');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post pitch');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(questions.length, s + 1));
    const prevStep = () => setStep(s => Math.max(0, s - 1));

    if (!profile) return <div className="text-center py-20">Loading requirements...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-3xl mb-6">
                    <FaLightbulb size={28} />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4">Pitch Your Mission</h1>
                <p className="text-gray-500 max-w-md mx-auto">
                    Fill out the details of your project to attract the perfect collaborator or expert partner.
                </p>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-indigo-100/50 overflow-hidden">
                {/* Progress Bar */}
                <div className="h-2 bg-gray-50 w-full">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${((step + 1) / (questions.length + 1)) * 100}%` }}
                    />
                </div>

                <div className="p-10 md:p-16">
                    {step < questions.length ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 block">Step {step + 1} of {questions.length}</span>
                                <h2 className="text-2xl font-extrabold text-gray-800">{questions[step]}</h2>
                            </div>
                            <textarea
                                className="w-full h-48 p-6 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-3xl outline-none transition-all text-lg resize-none"
                                placeholder="Details go here..."
                                value={pitchData.pitch[questions[step]] || ''}
                                onChange={(e) => handleInputChange(questions[step], e.target.value)}
                            />
                            <div className="flex justify-between items-center pt-4">
                                <button
                                    onClick={prevStep}
                                    disabled={step === 0}
                                    className={`flex items-center gap-2 font-bold transition-all ${step === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <FaChevronLeft /> Previous
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                >
                                    Next Question <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-4">
                                <FaCheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900">Ready to Launch!</h2>
                            <p className="text-gray-500">Your project pitch is complete. Click broadcast to send it to the public Hub.</p>

                            <div className="pt-8 flex flex-col gap-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? 'Broadcasting...' : 'Broadcast to Hub'}
                                </button>
                                <button
                                    onClick={prevStep}
                                    className="text-gray-400 font-bold hover:text-gray-600 transition-colors"
                                >
                                    Go Back & Edit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PitchForm;
