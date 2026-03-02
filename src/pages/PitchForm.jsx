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
        isPublic: true,
        teamSize: 1,
        mentorNeeded: false,
        isProBono: false
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;
            try {
                const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
                const res = await axios.get(`${API_BASE_URL}/api/users/${currentUser._id}`, config);
                setProfile(res.data);

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

            await axios.post(`${API_BASE_URL}/api/requests`, {
                pitch: pitchData.pitch,
                message: `Project Pitch by ${currentUser.name}`,
                isPublic: true,
                teamSize: pitchData.teamSize,
                mentorNeeded: pitchData.mentorNeeded,
                isProBono: pitchData.isProBono
            }, config);

            toast.success('Your project pitch is now live in the Hub!');
            navigate('/pitch-hub');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post pitch');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(questions.length + 1, s + 1));
    const prevStep = () => setStep(s => Math.max(0, s - 1));

    if (!profile) return (
        <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EAEEFE] text-[#001E80] rounded-3xl mb-6">
                    <FaLightbulb size={28} />
                </div>
                <h1
                    className="text-4xl md:text-5xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1 leading-tight"
                    style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                >
                    Pitch Your Mission
                </h1>
                <p className="text-[#010D3E]/50 text-base font-medium mt-2 max-w-md mx-auto">
                    Fill out the details of your project to attract the perfect collaborator or expert partner.
                </p>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-[#001E80]/5 overflow-hidden">
                {/* Progress Bar */}
                <div className="h-2 bg-gray-50 w-full">
                    <div
                        className="h-full bg-[#001E80] transition-all duration-500"
                        style={{ width: `${Math.min(100, ((step + 1) / (questions.length + 2)) * 100)}%` }}
                    />
                </div>

                <div className="p-10 md:p-16">
                    {step < questions.length ? (
                        <div className="space-y-8">
                            <div>
                                <span className="text-xs font-black uppercase tracking-widest text-[#001E80] mb-2 block">Step {step + 1} of {questions.length + 1}</span>
                                <h2 className="text-2xl font-extrabold text-gray-800">{questions[step]}</h2>
                            </div>
                            <textarea
                                className="w-full h-48 p-6 bg-gray-50 border-2 border-transparent focus:border-[#001E80]/30 focus:bg-white focus:ring-2 focus:ring-[#001E80]/10 rounded-3xl outline-none transition-all text-lg resize-none"
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
                                    className="bg-[#001E80] hover:bg-[#001E80]/85 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#001E80]/10 transition-all active:scale-[0.97]"
                                >
                                    Next Question <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    ) : step === questions.length ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <span className="text-xs font-black uppercase tracking-widest text-[#001E80] mb-2 block">Step {questions.length + 1} of {questions.length + 1}</span>
                                <h2 className="text-2xl font-extrabold text-gray-800">Mission Requirements</h2>
                                <p className="text-sm text-gray-400 mt-1 font-medium">Fine-tune the collaboration parameters.</p>
                            </div>

                            <div className="space-y-6">
                                {/* Team Size */}
                                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-4 block">How many teammates do you need?</label>
                                    <div className="flex items-center gap-6">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={pitchData.teamSize}
                                            onChange={(e) => setPitchData(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
                                            className="flex-1 accent-[#001E80]"
                                        />
                                        <span className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-[#001E80] shadow-sm border border-gray-100">{pitchData.teamSize}</span>
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPitchData(prev => ({ ...prev, mentorNeeded: !prev.mentorNeeded }))}
                                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${pitchData.mentorNeeded ? 'bg-[#EAEEFE] border-[#001E80]/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl">🎓</span>
                                            <div className={`w-4 h-4 rounded-full border-2 ${pitchData.mentorNeeded ? 'bg-[#001E80] border-[#001E80]' : 'border-gray-200'}`} />
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-sm">Need a Mentor</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">Looking for expert guidance.</p>
                                    </div>

                                    <div
                                        onClick={() => setPitchData(prev => ({ ...prev, isProBono: !prev.isProBono }))}
                                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${pitchData.isProBono ? 'bg-[#EAEEFE] border-[#001E80]/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl">❤️</span>
                                            <div className={`w-4 h-4 rounded-full border-2 ${pitchData.isProBono ? 'bg-[#001E80] border-[#001E80]' : 'border-gray-200'}`} />
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-sm">Pro-Bono Mission</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">Volunteer project for impact.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <button onClick={prevStep} className="text-gray-400 font-bold hover:text-gray-600 flex items-center gap-2">
                                    <FaChevronLeft /> Previous
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="bg-[#001E80] hover:bg-[#001E80]/85 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#001E80]/10 transition-all active:scale-[0.97]"
                                >
                                    Review Pitch <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-4">
                                <FaCheckCircle size={40} />
                            </div>
                            <h2
                                className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent"
                                style={{ fontFamily: 'Zuume-Bold' }}
                            >
                                Ready to Launch!
                            </h2>
                            <p className="text-[#010D3E]/50 font-medium">Your project pitch is complete. Click broadcast to send it to the public Hub.</p>

                            <div className="pt-8 flex flex-col gap-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-[#001E80] hover:bg-[#001E80]/85 text-white py-5 rounded-3xl font-black text-lg uppercase tracking-widest shadow-xl shadow-[#001E80]/10 transition-all disabled:opacity-50 active:scale-[0.97]"
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
