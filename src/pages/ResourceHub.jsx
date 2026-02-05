import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import resourceService from '../features/resources/resourceService';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaSearch, FaPlus, FaFire, FaGlobe, FaTag, FaComment, FaArrowUp, FaChevronRight } from 'react-icons/fa';

const ResourceHub = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('curated'); // 'curated' or 'community'

    // Create Thread Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createStep, setCreateStep] = useState(1);
    const [createData, setCreateData] = useState({
        title: '',
        tags: '',
        category: 'college',
        university: '',
        college: '',
        professor: '',
        subject: '',
        company: '',
        position: ''
    });

    const UNIVERSITIES = [
        'Cairo University', 'Alexandria University', 'Ain Shams University', 'Assiut University', 'Mansoura University',
        'Zagazig University', 'Helwan University', 'Suez Canal University', '6th of October University',
        'Misr University for Science and Technology', 'German University in Cairo (GUC)', 'American University in Cairo (AUC)',
        'Al Alamein International University', 'Delta University for Science and Technology', 'British University in Egypt (BUE)'
    ];
    const MAJORS = [
        'Higher Technological Institute', 'Alexandria Higher Institute of Engineering and Technology',
        'Higher Institute of Computers and Business Administration', 'Higher Institute of Tourism and Hotels',
        'Ismailia Higher Institute of Tourism and Hotels', 'Higher Institute for Qualitative Studies',
        'Higher Institute of Social Service', 'Pharaohs Higher Institute for Computers, Information Systems & Management',
        'Delta Higher Institute for Administrative and Accounting Information Systems', 'Taiba Higher Institute for Computers and Administrative Sciences'
    ];

    const fetchThreads = async () => {
        setLoading(true);
        try {
            const data = await resourceService.getThreads({
                curated: activeTab === 'curated',
                search: searchTerm
            });
            setThreads(data);
        } catch (error) {
            toast.error('Failed to load intelligence');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchThreads();
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [activeTab, searchTerm]);

    const handleCreateThread = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', createData.title);

            // Build tags based on category metadata (Automated Tagging)
            let autoTags = [];
            if (createData.category === 'college') {
                if (createData.university) autoTags.push(`#${createData.university.replace(/\s+/g, '')}`);
                if (createData.college) autoTags.push(`#${createData.college.replace(/\s+/g, '')}`);
                if (createData.professor) autoTags.push(`#Prof${createData.professor.replace(/\s+/g, '')}`);
                if (createData.subject) autoTags.push(`#${createData.subject.replace(/\s+/g, '')}`);
            } else if (createData.category === 'interview') {
                if (createData.company) autoTags.push(`#${createData.company.replace(/\s+/g, '')}`);
                if (createData.position) autoTags.push(`#${createData.position.replace(/\s+/g, '')}`);
                autoTags.push('#Interview');
            } else if (createData.category === 'specific') {
                autoTags.push('#SpecificSubject');
            }

            const userTags = createData.tags.split(',').map(tag => {
                const trimmed = tag.trim();
                if (!trimmed) return null;
                return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
            }).filter(t => t !== null);

            const finalTags = [...new Set([...autoTags, ...userTags])];

            formData.append('tags', JSON.stringify(finalTags));
            formData.append('type', createData.category);

            await resourceService.createThread(formData, user.token);
            toast.success('Mission Briefing Synced');
            setShowCreateModal(false);
            setCreateStep(1);
            setCreateData({ title: '', tags: '', category: 'general', university: '', college: '', professor: '', subject: '', company: '', position: '' });
            fetchThreads();
        } catch (error) {
            console.error('Thread Creation Error:', error);
            toast.error(error.response?.data?.message || 'Failed to sync briefing');
        }
    };

    const renderStep = () => {
        if (createStep === 1) {
            return (
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Select Briefing Category</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { id: 'college', label: 'College Related', icon: '🎓' },
                            { id: 'interview', label: 'Interview Prep', icon: '💼' },
                            { id: 'specific', label: 'Specific Subject', icon: '📝' }
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => { setCreateData({ ...createData, category: cat.id }); setCreateStep(2); }}
                                className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-indigo-600 group ${createData.category === cat.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'}`}
                            >
                                <span className="text-2xl mb-2 block">{cat.icon}</span>
                                <span className="text-sm font-black text-gray-900 block group-hover:text-indigo-600">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (createStep === 2) {
            return (
                <div className="space-y-5">
                    <h3 className="text-xl font-black text-gray-900 mb-2"> Intelligence Context</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Define the parameters of your mission briefing</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {createData.category === 'college' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">University</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        value={createData.university}
                                        onChange={(e) => setCreateData({ ...createData, university: e.target.value })}
                                    >
                                        <option value="">Select University</option>
                                        {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Major / Institute</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        value={createData.college}
                                        onChange={(e) => setCreateData({ ...createData, college: e.target.value })}
                                    >
                                        <option value="">Select Major</option>
                                        {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Professor (Automated Tag)</label>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="Professor Name"
                                        value={createData.professor}
                                        onChange={(e) => setCreateData({ ...createData, professor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Subject (Automated Tag)</label>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="Subject Name (e.g. CS101)"
                                        value={createData.subject}
                                        onChange={(e) => setCreateData({ ...createData, subject: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        {createData.category === 'interview' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Company (Automated Tag)</label>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="Company Name"
                                        value={createData.company}
                                        onChange={(e) => setCreateData({ ...createData, company: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Position (Automated Tag)</label>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="Position (e.g. Software Intern)"
                                        value={createData.position}
                                        onChange={(e) => setCreateData({ ...createData, position: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Briefing Title</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="Accept Mission Title..."
                            value={createData.title}
                            onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Mission Tags</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="Keywords (comma separated)"
                            value={createData.tags}
                            onChange={(e) => setCreateData({ ...createData, tags: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setCreateStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-200">Back</button>
                        <button type="button" onClick={handleCreateThread} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700">Sync Mission briefing</button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* Simple Header */}
            <div className="mb-12 border-b border-gray-100 pb-10">
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Resource Hub</h1>
                <p className="text-gray-500 font-medium">Verified mission intelligence and community knowledge stream.</p>
            </div>

            {/* Navigation & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div className="flex p-1 bg-gray-100 rounded-xl w-full md:w-fit">
                    <button
                        onClick={() => setActiveTab('curated')}
                        className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'curated' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Guides
                    </button>
                    <button
                        onClick={() => setActiveTab('community')}
                        className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'community' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Community
                    </button>
                </div>

                <div className="relative flex-1 max-w-md w-full">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search topics or #tags..."
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {user && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-indigo-100"
                    >
                        <FaPlus /> New Discussion
                    </button>
                )}
            </div>

            {/* Content List */}
            {loading ? (
                <div className="py-20 text-center">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                </div>
            ) : threads.length > 0 ? (
                <div className="space-y-4">
                    {threads.map((thread) => (
                        <div
                            key={thread._id}
                            onClick={() => navigate(`/resources/thread/${thread._id}`)}
                            className="block bg-white rounded-2xl border border-gray-100 p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all group cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {thread.tags?.map((tag, idx) => (
                                            <span key={idx} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors mb-4">{thread.title}</h2>
                                </div>
                                <div className="shrink-0 flex items-center gap-6 text-gray-300 text-[10px] font-bold uppercase tracking-widest border-l border-gray-50 pl-6 hidden md:flex">
                                    <div className="text-center">
                                        <p className="text-gray-900 font-black text-sm">{thread.upvoteCount || 0}</p>
                                        <p>Votes</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-900 font-black text-sm">{thread.postCount || 0}</p>
                                        <p>Hub</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                <Link
                                    to={`/u/${thread.author?.username}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                                >
                                    <div className="w-6 h-6 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center text-[10px] font-bold">
                                        {thread.author?.name?.charAt(0)}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                        {thread.author?.name} · {new Date(thread.createdAt).toLocaleDateString()}
                                    </span>
                                </Link>
                                <FaChevronRight className="text-gray-200 group-hover:text-indigo-400 transition-colors" size={12} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No results found.</p>
                </div>
            )}

            {/* Create Thread Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-gray-900 px-10 py-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                                <h2 className="text-white text-lg font-black uppercase tracking-widest">Construct Mission Briefing</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">Step {createStep}/2</span>
                                <button onClick={() => { setShowCreateModal(false); setCreateStep(1); }} className="text-white/40 hover:text-white transition-colors">✕</button>
                            </div>
                        </div>
                        <div className="p-10 max-h-[80vh] overflow-y-auto">
                            {renderStep()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceHub;
