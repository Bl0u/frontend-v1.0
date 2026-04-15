import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import resourceService from '../features/resources/resourceService';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FaSearch, FaChevronRight,
    FaBook, FaUsers, FaGraduationCap, FaBuilding, FaChalkboardTeacher, FaBookOpen, FaPenNib
} from 'react-icons/fa';
import { FilterBar } from '../components/FilterBar';
import SearchableDropdown from '../components/SearchableDropdown';

// Fixed Lists for Suggestions to control naming conventions
const SUGGESTION_LISTS = {
    University: [
        'Cairo University', 'Alexandria University', 'Ain Shams University', 'Assiut University', 'Mansoura University',
        'Zagazig University', 'Helwan University', 'Suez Canal University', '6th of October University',
        'Misr University for Science and Technology', 'German University in Cairo (GUC)', 'American University in Cairo (AUC)',
        'Al Alamein International University', 'Delta University for Science and Technology', 'British University in Egypt (BUE)'
    ],
    College: [
        'Engineering', 'Medicine', 'Pharmacy', 'Commerce', 'Arts', 'Law', 'Science',
        'Computer and Information', 'Agriculture', 'Dentistry', 'Nursing', 'Education',
        'Economics and Political Science', 'Al-Alsun (Languages)', 'Mass Communication',
        'Fine Arts', 'Applied Arts'
    ],
    AcademicLevel: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Graduated'],
    Professor: [
        'Dr. John Doe', 'Dr. Ahmed', 'Dr. Hesham', 'Dr. Sarah', 'Dr. Ibrahim'
    ],
    Subject: [
        'DSA', 'Algorithms', 'OS', 'Networking', 'Databases', 'Software Engineering', 'AI', 'ML', 'Computer Vision', 'Cybersecurity',
        'Web Development', 'Cloud Computing', 'Embedded Systems', 'HCI', 'Discrete Math', 'Logic Design', 'Parallel Processing'
    ],
    Company: [
        'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Instabug', 'Valeo', 'Vodafone', 'IBM', 'Intel'
    ],
    Position: [
        'Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'Mobile Developer', 'DevOps Engineer',
        'Data Scientist', 'ML Engineer', 'Cybersecurity Analyst', 'UI/UX Designer', 'Product Manager',
        'QA Engineer', 'Embedded Systems Engineer', 'Solution Architect'
    ]
};

const FILTER_TYPES = [
    { id: 'University', icon: FaGraduationCap, placeholder: 'Search University...' },
    { id: 'Professor', icon: FaChalkboardTeacher, placeholder: 'Search Professor...' },
    { id: 'Subject', icon: FaBookOpen, placeholder: 'Search Subject...' },
    { id: 'Company', icon: FaBuilding, placeholder: 'Search Company...' },
    { id: 'Position', icon: FaUsers, placeholder: 'Search Position...' }
];

const ResourceHub = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const filterContainerRef = useRef(null);

    // Core state
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Navigation / Filtering state
    const activeTab = searchParams.get('tab') || 'curated'; // 'curated' | 'community'
    const [activeFilterType, setActiveFilterType] = useState(null); // Which pill is open
    const [activeFilters, setActiveFilters] = useState({}); // e.g. { University: 'Cairo University', Subject: 'DSA' }
    const [uniqueTags, setUniqueTags] = useState([]); // Fetched unique tags
    const [metadata, setMetadata] = useState({ companies: [], positions: [] });

    // Modal state for Submitting Contribution
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createStep, setCreateStep] = useState(1);
    const [createData, setCreateData] = useState({
        title: '', tags: '', category: 'college', university: '', college: '', academicLevel: '',
        professor: '', subject: '', company: '', position: '', isPaid: false, price: 0
    });

    // Formatting rules to match backend auto-tag generation
    const formatFilterValueToTag = (type, value) => {
        const cleanVal = value.replace(/\s+/g, '').replace(/ \(.*?\)/g, ''); // Removes spaces and e.g. "(BUE)"
        if (type === 'Professor') return `Prof${cleanVal}`;
        if (type === 'Subject') return `Subj${cleanVal}`;
        if (type === 'Company') return `Comp${cleanVal}`;
        if (type === 'Position') return cleanVal; // Positions are searched directly as tags (e.g. #FrontendEngineer)
        return cleanVal;
    };

    const fetchThreads = async () => {
        setLoading(true);
        try {
            // Convert activeFilters object to comma-separated tags array string
            const tagFilters = Object.entries(activeFilters).map(([type, val]) => {
                return formatFilterValueToTag(type, val);
            }).join(',');

            const data = await resourceService.getThreads({
                curated: activeTab === 'curated',
                search: searchTerm,
                tags: tagFilters || undefined, // Multi-tag query from the newly updated backend
                company: activeFilters.Company,
                position: activeFilters.Position
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
    }, [activeTab, searchTerm, activeFilters]);

    // Fetch unique metadata on mount
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [tags, meta] = await Promise.all([
                    resourceService.getUniqueTags(),
                    resourceService.getResourceMetadata()
                ]);
                setUniqueTags(tags);
                setMetadata(meta);
            } catch (error) {
                console.error("Failed to load metadata", error);
            }
        };
        fetchMeta();
    }, []);

    // Close suggestions if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
                setActiveFilterType(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync activeFilters with URL query parameters
    useEffect(() => {
        const uniParam = searchParams.get('university');
        const subjParam = searchParams.get('subject');
        const profParam = searchParams.get('professor');
        const compParam = searchParams.get('company');
        const posParam = searchParams.get('position');

        const newFilters = {};
        if (uniParam) newFilters.University = uniParam;
        if (subjParam) newFilters.Subject = subjParam;
        if (profParam) newFilters.Professor = profParam;
        if (compParam) newFilters.Company = compParam;
        if (posParam) newFilters.Position = posParam;

        if (Object.keys(newFilters).length > 0) {
            setActiveFilters(newFilters);
        }
    }, [searchParams]);

    const handleTabChange = (tab) => {
        setSearchParams({ tab });
        setActiveFilters({});
        setSearchTerm('');
    };

    const handleApplyFilter = (type, value) => {
        setActiveFilters(prev => ({ ...prev, [type]: value }));
        setActiveFilterType(null);
    };

    const removeFilter = (type) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[type];
            return newFilters;
        });
    };

    // View Mode: Table is now always preferred for all intel exploration.
    const viewMode = 'table';

    // Get dynamically filtered options based on db tags
    const dynamicSuggestions = {
        University: SUGGESTION_LISTS.University.filter(u => uniqueTags.includes(`#${u.replace(/\s+/g, '')}`)),
        Professor: uniqueTags.filter(t => t.startsWith('#Prof')).map(t => t.replace('#Prof', '')),
        Subject: uniqueTags.filter(t => t.startsWith('#Subj')).map(t => t.replace('#Subj', '')),
        Company: metadata.companies,
        Position: metadata.positions
    };

    // Thread Creation
    const handleCreateThread = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', createData.title);
            let autoTags = [];
            if (createData.category === 'college') {
                if (createData.university) autoTags.push(`#${createData.university.replace(/\s+/g, '')}`);
                if (createData.college) autoTags.push(`#${createData.college.replace(/\s+/g, '')}`);
                if (createData.professor) autoTags.push(`#Prof${createData.professor.replace(/\s+/g, '')}`);
                if (createData.subject) autoTags.push(`#Subj${createData.subject.replace(/\s+/g, '')}`);
            } else if (createData.category === 'interview') {
                if (createData.company) autoTags.push(`#Comp${createData.company.replace(/\s+/g, '')}`);
                if (createData.position) autoTags.push(`#${createData.position.replace(/\s+/g, '')}`);
                autoTags.push('#Interview');
            } else if (createData.category === 'specific') {
                autoTags.push('#SpecificSubject');
            }
            const userTags = createData.tags.split(',').map(tag => {
                const trimmed = tag.trim();
                return trimmed ? (trimmed.startsWith('#') ? trimmed : `#${trimmed}`) : null;
            }).filter(Boolean);
            formData.append('tags', JSON.stringify([...new Set([...autoTags, ...userTags])]));
            formData.append('type', createData.category);
            formData.append('isPaid', createData.isPaid);
            if (createData.isPaid) formData.append('price', createData.price);
            if (createData.university) formData.append('university', createData.university);
            if (createData.college) formData.append('college', createData.college);
            if (createData.academicLevel) formData.append('academicLevel', createData.academicLevel);
            if (createData.company) formData.append('company', createData.company);
            if (createData.position) formData.append('position', createData.position);

            await resourceService.createThread(formData, user.token);
            toast.success('Mission Briefing Synced');
            setShowCreateModal(false);
            setCreateStep(1);
            setCreateData({ title: '', tags: '', category: 'college', university: '', college: '', academicLevel: '', professor: '', subject: '', company: '', position: '', isPaid: false, price: 0 })
            fetchThreads();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create thread');
        }
    };

    // Render Modals inside main file
    const renderCreateStep = () => {
        if (createStep === 1) {
            return (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Select Briefing Category</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { id: 'college', label: 'College Related', icon: '🎓' },
                            { id: 'interview', label: 'Interview Prep', icon: '💼' },
                            { id: 'specific', label: 'Specific Subject', icon: '📝' }
                        ].map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => { setCreateData({ ...createData, category: cat.id }); setCreateStep(2); }}
                                className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-[#001E80]/50 group ${createData.category === cat.id ? 'border-[#001E80] bg-[#EAEEFE]' : 'border-gray-100'}`}
                            >
                                <span className="text-2xl mb-2 block">{cat.icon}</span>
                                <span className="text-sm font-black text-gray-900 block group-hover:text-[#001E80]">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (createStep === 2) {
            return (
                <form onSubmit={handleCreateThread} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Intelligence Context</h3>
                    <p className="text-xs text-[#001E80]/40 font-bold uppercase tracking-widest mb-6">Define the parameters of your mission</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {createData.category === 'college' && (
                            <>
                                <SearchableDropdown
                                    label="University"
                                    value={createData.university}
                                    onChange={(e) => setCreateData({ ...createData, university: e.target.value })}
                                    options={SUGGESTION_LISTS.University}
                                    placeholder="Select University"
                                    name="university"
                                />
                                <SearchableDropdown
                                    label="College"
                                    value={createData.college}
                                    onChange={(e) => setCreateData({ ...createData, college: e.target.value })}
                                    options={SUGGESTION_LISTS.College}
                                    placeholder="Select College"
                                    name="college"
                                />
                                <SearchableDropdown
                                    label="Academic Level"
                                    value={createData.academicLevel}
                                    onChange={(e) => setCreateData({ ...createData, academicLevel: e.target.value })}
                                    options={SUGGESTION_LISTS.AcademicLevel}
                                    placeholder="Select Level"
                                    name="academicLevel"
                                />
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#001E80] uppercase ml-2">Professor</label>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#001E80]/20 focus:border-[#001E80] transition-all"
                                        placeholder="Professor Name"
                                        value={createData.professor}
                                        onChange={(e) => setCreateData({ ...createData, professor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <SearchableDropdown
                                        label="Subject"
                                        value={createData.subject}
                                        onChange={(e) => setCreateData({ ...createData, subject: e.target.value })}
                                        options={SUGGESTION_LISTS.Subject}
                                        placeholder="Subject Name (e.g. Data Structures)"
                                        name="subject"
                                    />
                                </div>
                            </>
                        )}

                        {createData.category === 'interview' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#001E80] uppercase ml-2">Company</label>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#001E80]/20 focus:border-[#001E80] transition-all"
                                        placeholder="Company Name (e.g. Google, Valu)"
                                        value={createData.company}
                                        onChange={(e) => setCreateData({ ...createData, company: e.target.value })}
                                    />
                                </div>
                                <SearchableDropdown
                                    label="Position"
                                    value={createData.position}
                                    onChange={(e) => setCreateData({ ...createData, position: e.target.value })}
                                    options={[...new Set([...SUGGESTION_LISTS.Position, ...metadata.positions])]}
                                    placeholder="Software Engineer"
                                    name="position"
                                />
                            </>
                        )}
                    </div>

                    <div className="space-y-1 pt-2">
                        <label className="text-[10px] font-black text-[#001E80] uppercase ml-2">Briefing Title *</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#001E80]/20 focus:border-[#001E80] transition-all"
                            placeholder="Descriptive Title..."
                            value={createData.title}
                            onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#001E80] uppercase ml-2">Extra Tags</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#001E80]/20 focus:border-[#001E80] transition-all"
                            placeholder="comma, separated"
                            value={createData.tags}
                            onChange={(e) => setCreateData({ ...createData, tags: e.target.value })}
                        />
                    </div>

                    {/* V2.0: Monetization Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <label className="text-[10px] font-black text-amber-500 uppercase ml-2">💰 Monetization</label>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setCreateData({ ...createData, isPaid: false, price: 0 })}
                                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${!createData.isPaid
                                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                    : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                🆓 Free
                            </button>
                            <button
                                type="button"
                                onClick={() => setCreateData({ ...createData, isPaid: true })}
                                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${createData.isPaid
                                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                                    : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                ⭐ Premium
                            </button>
                        </div>
                        {createData.isPaid && (
                            <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                                <label className="text-[10px] font-black text-amber-400 uppercase ml-2">Price in Stars</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-amber-900"
                                    placeholder="Enter star price"
                                    value={createData.price}
                                    onChange={(e) => setCreateData({ ...createData, price: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={() => setCreateStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-200">Back</button>
                        <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-[#001E80] to-[#010D3E] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#001E80]/20 transition-all hover:scale-[1.02] active:scale-[0.98]">Publish Resource</button>
                    </div>
                </form>
            );
        }
        return null;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10">
            {/* Header & Submit Button */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h1
                        className="text-4xl md:text-5xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1 leading-tight"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        Resource Hub
                    </h1>
                    <p className="text-[#010D3E]/50 text-base font-medium mt-2 max-w-xl">
                        Uncover verified intelligence, study guides, and high-impact discussions.
                    </p>
                </div>
                {user && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-[#001E80] to-[#010D3E] hover:from-[#010D3E] hover:to-[#001E80] text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#001E80]/10 transition-all active:scale-[0.97] flex items-center justify-center gap-3 shrink-0"
                    >
                        <FaPenNib size={14} /> Contribute Thread
                    </button>
                )}
            </div>

            {/* Controls Row: Tabs & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex p-1 bg-gray-100 rounded-xl w-full md:w-fit">
                    <button
                        onClick={() => handleTabChange('curated')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'curated' ? 'bg-white text-[#001E80] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <FaBook /> Guides
                    </button>
                    <button
                        onClick={() => handleTabChange('community')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'community' ? 'bg-white text-[#001E80] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <FaUsers /> Community
                    </button>
                </div>

                <div className="relative flex-1 w-full max-w-xl">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search general titles or topics..."
                        className="w-full bg-white border border-gray-100 shadow-sm rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#001E80]/10 focus:border-[#001E80]/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <FilterBar
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
                suggestionLists={dynamicSuggestions}
                filterTypes={FILTER_TYPES}
            />


            {/* Body: Grid vs Table */}
            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
                </div>
            ) : (
                /* Compact Table View */
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
                    <h2 className="px-8 py-6 text-xl font-black text-gray-900 tracking-tight border-b border-gray-100">
                        {activeTab === 'curated' ? 'Verified Intelligence' : 'Community Intelligence'}
                    </h2>
                    {threads.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        <th className="py-3 px-5 uppercase">Thread info & Title</th>
                                        <th className="py-3 px-5">Creator</th>
                                        <th className="py-3 px-5">Context Tags</th>
                                        <th className="py-3 px-5 text-center">Metrics</th>
                                        <th className="py-3 px-5 rounded-tr-3xl text-right">View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {threads.map((thread) => (
                                        <tr
                                            key={thread._id}
                                            onClick={() => navigate(`/resources/thread/${thread._id}`)}
                                            className="border-b border-gray-50 hover:bg-[#EAEEFE]/20 cursor-pointer transition-colors group"
                                        >
                                            {/* Condensed Title & Type */}
                                            <td className="py-3 px-5 max-w-sm">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    {thread.isCurated ? (
                                                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[8px] font-black uppercase tracking-widest">Guide</span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-black uppercase tracking-widest">Community</span>
                                                    )}
                                                    {thread.isPaid && (
                                                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-0.5">
                                                            ⭐ {thread.price}
                                                        </span>
                                                    )}
                                                    {thread.earningsConfig?.enabled && (
                                                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-0.5"
                                                            title="This thread shares revenue with contributors">
                                                            💰 Revenue
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#001E80] transition-colors pr-4">{thread.title}</h3>
                                            </td>

                                            {/* Compact Owner */}
                                            <td className="py-3 px-5 whitespace-nowrap">
                                                <div className="flex items-center gap-2 block">
                                                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#001E80] to-[#010D3E] text-white flex items-center justify-center text-[10px] font-bold shadow-sm shrink-0">
                                                        {thread.author?.avatar ? <img src={thread.author.avatar} alt="" className="w-full h-full rounded-md object-cover" /> : thread.author?.name?.charAt(0)}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-bold text-gray-900 truncate">{thread.author?.name}</p>
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-[#001E80]/40 mt-0.5 truncate">{new Date(thread.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Hover Expandable Tags */}
                                            <td className="py-3 px-5">
                                                <div className="flex flex-wrap gap-1 max-w-[150px] relative">
                                                    {thread.tags?.slice(0, 2).map((tag, idx) => (
                                                        <span key={idx} className="px-1.5 py-0.5 bg-[#001E80]/5 text-[#001E80] rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                                                            {tag.replace(/^#(Subj|Comp|Prof)/, '#')}
                                                        </span>
                                                    ))}
                                                    {thread.tags?.length > 2 && (
                                                        <div className="group/tags relative">
                                                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase tracking-wider cursor-help">
                                                                +{thread.tags.length - 2}
                                                            </span>
                                                            <div className="absolute hidden group-hover/tags:flex z-10 bottom-full left-0 mb-1 w-max max-w-[200px] flex-wrap gap-1 p-2 bg-white border border-gray-100 shadow-xl rounded-lg">
                                                                {thread.tags.map((tag, idx) => (
                                                                    <span key={idx} className="px-1.5 py-0.5 bg-[#EAEEFE] text-[#001E80] rounded text-[9px] font-bold uppercase tracking-wider">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Comprehensive Stats */}
                                            <td className="py-3 px-5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1 group-hover:text-[#001E80]/70 transition-colors" title="Upvotes">
                                                        <span className="text-gray-900 text-xs">{thread.upvoteCount || 0}</span> Votes
                                                    </span>
                                                    <span className="flex items-center gap-1 group-hover:text-[#001E80]/70 transition-colors" title="Replies">
                                                        <span className="text-gray-900 text-xs">{thread.postCount || 0}</span> Reps
                                                    </span>
                                                    {thread.isPaid && (
                                                        <span className="flex items-center gap-1 text-amber-500 group-hover:text-amber-600 transition-colors bg-amber-50 px-1 rounded" title="Purchases">
                                                            <span className="text-amber-700 text-xs">{thread.purchasesCount || 0}</span> Sold
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Action View */}
                                            <td className="py-3 px-5 text-right">
                                                <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center ml-auto group-hover:bg-[#001E80] group-hover:text-white group-hover:border-[#001E80] transition-all shadow-sm">
                                                    <FaChevronRight size={10} className="text-gray-400 group-hover:text-white" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 px-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100 shadow-sm">
                                <FaSearch className="text-gray-300" size={18} />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1 tracking-tight">No Threads Matches Filters</h3>
                            <p className="text-xs font-medium text-gray-400 mb-5">Adjust your logic parameters to find intel.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setActiveFilters({}); setActiveFilterType(null); }}
                                className="bg-white border text-[#001E80] border-[#001E80]/10 hover:bg-[#EAEEFE]/50 px-5 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                Clear All Parameters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Create Thread Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="bg-gradient-to-r from-[#001E80] to-[#010D3E] px-8 py-5 flex items-center justify-between">
                            <h2 className="text-white text-base font-black uppercase tracking-widest">Initialize Mission</h2>
                            <div className="flex items-center gap-4">
                                <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">Phase {createStep}/2</span>
                                <button onClick={() => { setShowCreateModal(false); setCreateStep(1); }} className="text-white/40 hover:text-white transition-colors">✕</button>
                            </div>
                        </div>
                        <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            {renderCreateStep()}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ResourceHub;
