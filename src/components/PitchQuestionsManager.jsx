import { useState } from 'react';
import { FaPlus, FaTrash, FaSave, FaExclamationCircle, FaListUl, FaCheckSquare, FaAlignLeft } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';


const PitchQuestionsManager = ({ user, initialQuestions, onUpdate }) => {
    const [questions, setQuestions] = useState(initialQuestions || []);
    const [loading, setLoading] = useState(false);

    const addQuestion = () => {
        setQuestions([...questions, {
            questionType: 'text',
            questionText: '',
            options: []
        }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const handleSave = async () => {
        // Validation
        const invalid = questions.some(q => !q.questionText.trim() || (['mcq', 'checkbox'].includes(q.questionType) && q.options.length < 2));
        if (invalid) {
            toast.error('Please complete all questions and ensure MCQ/Checkboxes have at least 2 options.');
            return;
        }

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.put(`${API_BASE_URL}/api/users/profile`, { pitchQuestions: questions }, config);
            toast.success('Pitch questions updated successfully');
            if (onUpdate) onUpdate(res.data.pitchQuestions);
        } catch (error) {
            toast.error('Failed to update questions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-extrabold text-gray-800">Custom Pitch Questions</h3>
                    <p className="text-sm text-gray-500 font-medium">Define what students must answer when booking a mentorship with you.</p>
                </div>
                <button
                    onClick={addQuestion}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                    <FaPlus /> Add Question
                </button>
            </div>

            <div className="p-8 space-y-8">
                {questions.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                        <FaExclamationCircle className="mx-auto text-gray-300 mb-4" size={32} />
                        <p className="text-gray-400 font-mediumitalic">No custom questions set. Default pitch hub questions will be used.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {questions.map((q, qIdx) => (
                            <div key={qIdx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative group">
                                <button
                                    onClick={() => removeQuestion(qIdx)}
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <FaTrash size={14} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Question Text</label>
                                        <input
                                            type="text"
                                            value={q.questionText}
                                            onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                                            placeholder="e.g. Describe your current project goal..."
                                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Response Type</label>
                                        <select
                                            value={q.questionType}
                                            onChange={(e) => updateQuestion(qIdx, 'questionType', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-gray-700"
                                        >
                                            <option value="text">Text Response</option>
                                            <option value="mcq">Multiple Choice (Single Answer)</option>
                                            <option value="checkbox">Multiple Answers (Checkboxes)</option>
                                        </select>
                                    </div>
                                </div>

                                {['mcq', 'checkbox'].includes(q.questionType) && (
                                    <div className="mt-6 pl-4 border-l-2 border-indigo-100 space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                            {q.questionType === 'mcq' ? <FaListUl /> : <FaCheckSquare />} Options
                                        </label>
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                                    placeholder={`Option ${oIdx + 1}`}
                                                    className="flex-grow px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-100"
                                                />
                                                <button onClick={() => removeOption(qIdx, oIdx)} className="text-gray-300 hover:text-red-500">
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addOption(qIdx)}
                                            className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-wider flex items-center gap-1"
                                        >
                                            <FaPlus size={8} /> Add Option
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-6">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? 'Saving Changes...' : <><FaSave /> Deploy Questions</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PitchQuestionsManager;
