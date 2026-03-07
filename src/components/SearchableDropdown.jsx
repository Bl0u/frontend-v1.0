import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

const SearchableDropdown = ({ value, onChange, options, placeholder, label, required = false, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#001E80]/20 focus:border-[#001E80] outline-none text-sm font-bold transition-all cursor-pointer";
    const labelClass = "text-[10px] font-black text-[#001E80] uppercase ml-2";

    return (
        <div className="space-y-1 relative" ref={dropdownRef}>
            {label && <label className={labelClass}>{label} {required && '*'}</label>}
            <div
                className={`${inputClass} flex items-center justify-between`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? "text-gray-900" : "text-gray-400"}>
                    {value || placeholder || "Choose an option..."}
                </span>
                <FaChevronDown className={`transition-transform duration-300 text-gray-300 ${isOpen ? 'rotate-180' : ''}`} size={10} />
            </div>

            {isOpen && (
                <div className="absolute z-[60] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                        <FaSearch size={10} className="text-gray-300" />
                        <input
                            type="text"
                            className="w-full bg-transparent outline-none text-[11px] font-bold uppercase tracking-widest text-[#001E80] placeholder:text-gray-300"
                            placeholder="Type to search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, i) => (
                                <div
                                    key={i}
                                    className="px-5 py-3 hover:bg-[#EAEEFE]/50 cursor-pointer text-xs font-bold text-gray-500 hover:text-[#001E80] transition-colors flex items-center justify-between group"
                                    onClick={() => {
                                        onChange({ target: { name, value: opt } });
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                >
                                    <span>{opt}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#001E80] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))
                        ) : (
                            <div
                                className="px-5 py-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center italic"
                                onClick={() => {
                                    if (search) {
                                        onChange({ target: { name, value: search } });
                                        setIsOpen(false);
                                        setSearch('');
                                    }
                                }}
                            >
                                Use "{search}" as custom parameter
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
