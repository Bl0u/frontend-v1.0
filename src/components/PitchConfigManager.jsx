import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave, FaFolderPlus, FaCheckCircle, FaExclamationCircle, FaListUl, FaCheckSquare, FaFont } from 'react-icons/fa';
import adminService from '../features/admin/adminService';
import { toast } from 'react-toastify';

const PitchConfigManager = ({ user }) => {
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [rolesEnabled, setRolesEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await adminService.getPitchConfig(user.token);
                setCategories(data.categories || []);
                setQuestions(data.questions || []);
                setRolesEnabled(data.rolesEnabled || false);
            } catch (error) {
                toast.error('Failed to load pitch hub configuration');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [user.token]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminService.updatePitchConfig(user.token, { categories, questions, rolesEnabled });
            toast.success('Pitch Hub configuration saved!');
        } catch (error) {
            toast.error('Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    // Category Actions
    const addCategory = () => {
        const id = `cat_${Date.now()}`;
        setCategories([...categories, { id, label: 'New Category' }]);
    };

    const updateCategory = (id, label) => {
        setCategories(categories.map(c => c.id === id ? { ...c, label } : c));
    };

    const removeCategory = (id) => {
        setCategories(categories.filter(c => c.id !== id));
        setQuestions(questions.filter(q => q.categoryId !== id));
    };

    // Question Actions
    const addQuestion = (categoryId) => {
        const id = `q_${Date.now()}`;
        setQuestions([...questions, {
            id,
            label: '',
            type: 'text',
            required: false,
            categoryId,
            options: []
        }]);
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const addOption = (qId) => {
        setQuestions(questions.map(q => q.id === qId ? { ...q, options: [...q.options, ''] } : q));
    };

    const updateOption = (qId, oIdx, value) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                const newOptions = [...q.options];
                newOptions[oIdx] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const removeOption = (qId, oIdx) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                const newOptions = [...q.options];
                newOptions.splice(oIdx, 1);
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Configuration...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-800">Pitch Hub Setup</h2>
                    <p className="text-sm text-gray-500 font-medium">Configure categories and questions for the universal Pitch Hub form.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={addCategory}
                        className="bg-white border border-gray-200 hover:border-[#001E80]/30 text-[#001E80] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                    >
                        <FaFolderPlus /> Add Category
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#001E80] hover:bg-blue-900 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-100 flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                </div>
            </div>

            <div className="bg-[#001E80]/5 p-8 rounded-[40px] border border-[#001E80]/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#001E80] shadow-sm border border-[#001E80]/10">
                        <FaListUl size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-800">Projects Roles System</h3>
                        <p className="text-sm text-gray-500 font-medium">When enabled, users must define specific roles (Teammates/Mentors) for their projects.</p>
                    </div>
                </div>
                <div
                    onClick={() => setRolesEnabled(!rolesEnabled)}
                    className={`w-20 h-10 rounded-full p-1 cursor-pointer transition-all duration-300 flex items-center ${rolesEnabled ? 'bg-[#001E80] justify-end' : 'bg-gray-200 justify-start'}`}
                >
                    <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                        {rolesEnabled ? <FaCheckCircle className="text-[#001E80]" size={14} /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                    </div>
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <FaExclamationCircle className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-400">No categories defined yet.</h3>
                    <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">Start by adding a category to organize your pitch questions.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                            <div className="p-6 bg-[#EAEEFE]/30 border-b border-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-4 flex-1 max-w-md">
                                    <FaCheckCircle className="text-[#001E80]" />
                                    <input
                                        type="text"
                                        value={cat.label}
                                        onChange={(e) => updateCategory(cat.id, e.target.value)}
                                        className="bg-transparent border-none text-xl font-extrabold text-gray-800 focus:ring-0 w-full"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => addQuestion(cat.id)}
                                        className="text-[10px] font-black text-[#001E80] uppercase tracking-widest flex items-center gap-1 hover:opacity-70"
                                    >
                                        <FaPlus size={8} /> Add Question
                                    </button>
                                    <button
                                        onClick={() => removeCategory(cat.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                {questions.filter(q => q.categoryId === cat.id).length === 0 && (
                                    <p className="text-center text-sm text-gray-400 italic">No questions in this category.</p>
                                )}
                                {questions.filter(q => q.categoryId === cat.id).map((q) => (
                                    <div key={q.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative group">
                                        <button
                                            onClick={() => removeQuestion(q.id)}
                                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <FaTrash size={12} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                            <div className="md:col-span-6">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-2">Question Label</label>
                                                <input
                                                    type="text"
                                                    value={q.label}
                                                    onChange={(e) => updateQuestion(q.id, 'label', e.target.value)}
                                                    placeholder="e.g. What is your project goal?"
                                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#001E80]/30 outline-none text-sm font-medium"
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#001E80] mb-2">Type</label>
                                                <select
                                                    value={q.type}
                                                    onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#001E80]/30 outline-none text-sm font-bold text-gray-700"
                                                >
                                                    <option value="text">Text Area</option>
                                                    <option value="radio">Radio Box</option>
                                                    <option value="checkbox">Check Box</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-3 flex items-end pb-1">
                                                <div
                                                    onClick={() => updateQuestion(q.id, 'required', !q.required)}
                                                    className={`flex items-center gap-2 cursor-pointer p-3 rounded-2xl border transition-all w-full justify-center ${q.required ? 'bg-[#001E80] border-[#001E80] text-white' : 'bg-white border-gray-100 text-gray-400'}`}
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{q.required ? 'Required' : 'Optional'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {['radio', 'checkbox'].includes(q.type) && (
                                            <div className="mt-6 pl-4 border-l-2 border-[#001E80]/15 space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                                    {q.type === 'radio' ? <FaListUl /> : <FaCheckSquare />} Options
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={opt}
                                                                onChange={(e) => updateOption(q.id, oIdx, e.target.value)}
                                                                placeholder={`Option ${oIdx + 1}`}
                                                                className="flex-grow px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#001E80]/20"
                                                            />
                                                            <button onClick={() => removeOption(q.id, oIdx)} className="text-gray-300 hover:text-red-500">
                                                                <FaTrash size={10} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => addOption(q.id)}
                                                        className="h-9 border-2 border-dashed border-gray-100 rounded-xl text-[10px] font-bold text-gray-300 hover:text-[#001E80] hover:border-[#001E80]/20 flex items-center justify-center gap-1 transition-all"
                                                    >
                                                        <FaPlus size={8} /> New Option
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PitchConfigManager;
