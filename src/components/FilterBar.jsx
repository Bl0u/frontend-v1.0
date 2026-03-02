import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFilter, FaSearch, FaChevronDown,
    FaGraduationCap, FaChalkboardTeacher,
    FaBookOpen, FaBuilding, FaBriefcase, FaTimes
} from 'react-icons/fa';

const FILTER_TYPES = [
    { id: 'University', icon: FaGraduationCap, placeholder: 'Search University...' },
    { id: 'Professor', icon: FaChalkboardTeacher, placeholder: 'Search Professor...' },
    { id: 'Subject', icon: FaBookOpen, placeholder: 'Search Subject...' },
    { id: 'Company', icon: FaBuilding, placeholder: 'Search Company...' },
    { id: 'Position', icon: FaBriefcase, placeholder: 'Search Role (e.g. Frontend)...' }
];

export const FilterBar = ({ activeFilters, onFilterChange, suggestionLists }) => {
    const [activeFilterType, setActiveFilterType] = useState(null);
    const [search, setSearch] = useState('');
    const filterContainerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
                setActiveFilterType(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const removeFilter = (type) => {
        const newFilters = { ...activeFilters };
        delete newFilters[type];
        onFilterChange(newFilters);
    };

    const handleApplyFilter = (type, value) => {
        onFilterChange({ ...activeFilters, [type]: value });
        setActiveFilterType(null);
        setSearch('');
    };

    return (
        <div ref={filterContainerRef} className="space-y-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 items-center">
                <div className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm mr-2">
                    <FaFilter size={12} className="text-[#001E80]" />
                </div>

                {FILTER_TYPES.map((type) => {
                    const isActive = activeFilters[type.id];
                    const isOpen = activeFilterType === type.id;
                    const Icon = type.icon;

                    return (
                        <div key={type.id} className="relative">
                            <button
                                onClick={() => {
                                    setActiveFilterType(isOpen ? null : type.id);
                                    setSearch('');
                                }}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 font-bold text-xs uppercase tracking-widest ${isActive
                                    ? 'bg-[#001E80] text-white border-[#001E80] shadow-md shadow-[#001E80]/15 scale-[1.02]'
                                    : 'bg-white text-gray-400 border-gray-50 hover:border-[#001E80]/20 hover:text-gray-600'}`}
                            >
                                <Icon size={12} />
                                {isActive ? (
                                    <span className="flex items-center gap-2">
                                        {activeFilters[type.id]}
                                        <FaTimes
                                            className="hover:scale-125 transition-transform"
                                            onClick={(e) => { e.stopPropagation(); removeFilter(type.id); }}
                                        />
                                    </span>
                                ) : (
                                    <span>{type.id}</span>
                                )}
                                {!isActive && <FaChevronDown size={8} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute z-40 top-full mt-3 left-0 w-64 bg-white rounded-[1.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden"
                                    >
                                        <div className="p-3 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                                            <FaSearch size={10} className="text-gray-300" />
                                            <input
                                                type="text"
                                                placeholder={type.placeholder}
                                                className="w-full bg-transparent outline-none text-[11px] font-bold uppercase tracking-widest text-[#001E80] placeholder:text-gray-300"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto custom-scrollbar bg-white">
                                            {(suggestionLists[type.id] || [])
                                                .filter(s => s.toLowerCase().includes(search.toLowerCase()))
                                                .map((suggest, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleApplyFilter(type.id, suggest)}
                                                        className="px-5 py-3 hover:bg-[#EAEEFE]/50 cursor-pointer text-xs font-bold text-gray-500 hover:text-[#001E80] transition-colors flex items-center justify-between group"
                                                    >
                                                        <span>{suggest}</span>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#001E80] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                            {search && !(suggestionLists[type.id] || []).some(s => s.toLowerCase() === search.toLowerCase()) && (
                                                <div
                                                    onClick={() => handleApplyFilter(type.id, search)}
                                                    className="px-5 py-3 hover:bg-[#EAEEFE]/50 cursor-pointer text-xs font-bold text-[#001E80] transition-colors"
                                                >
                                                    Use "{search}" as parameter
                                                </div>
                                            )}
                                            {(!suggestionLists[type.id] || suggestionLists[type.id].length === 0) && !search && (
                                                <div className="px-5 py-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center italic">Type to search...</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Active Filters Clear All */}
            {Object.keys(activeFilters).length > 0 && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Active intelligence:</span>
                    <button
                        onClick={() => onFilterChange({})}
                        className="text-[9px] font-black uppercase tracking-widest text-[#001E80] hover:underline"
                    >
                        Clear Deployment Parameters
                    </button>
                </div>
            )}
        </div>
    );
};
