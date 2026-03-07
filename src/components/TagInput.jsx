import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';

const TagInput = ({ tags, setTags, suggestions = [], placeholder = "Add a tag..." }) => {
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Show filtered suggestions or all suggestions if input is empty
    const filteredSuggestions = suggestions.filter(s =>
        s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setInput('');
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.trim()) addTag(input);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="w-full space-y-3" ref={containerRef}>
            {/* Selected Tags Pills */}
            <div className="flex flex-wrap gap-2 min-h-[32px]">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-[#EAEEFE] text-[#001E80] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-[#001E80]/10 shadow-sm transition-all hover:bg-[#001E80]/5"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-[#001E80]/40 hover:text-red-500 transition-colors"
                        >
                            <FaTimes size={10} />
                        </button>
                    </span>
                ))}
            </div>

            <div className="relative">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setIsOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#001E80]/20 focus:border-[#001E80]/30 outline-none text-sm font-medium transition-all pr-10"
                    />
                    <FaChevronDown
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 pointer-events-none ${isOpen ? 'rotate-180' : ''}`}
                        size={12}
                    />
                </div>

                {/* Dropdown Scroll List */}
                {isOpen && (filteredSuggestions.length > 0) && (
                    <ul className="absolute z-50 w-full bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[24px] mt-2 max-h-56 overflow-y-auto shadow-2xl py-2 custom-scrollbar">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => addTag(suggestion)}
                                className="px-5 py-3 hover:bg-[#EAEEFE]/50 text-gray-700 text-sm font-semibold cursor-pointer transition-colors flex items-center justify-between group"
                            >
                                {suggestion}
                                <span className="opacity-0 group-hover:opacity-100 text-[#001E80] text-[10px] font-black uppercase tracking-widest transition-opacity">Add +</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-1">
                {input.trim() ? "Press Enter to add custom tag" : "Type to filter or choose from the list"}
            </p>
        </div>
    );
};

export default TagInput;
