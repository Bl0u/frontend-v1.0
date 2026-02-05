import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const TagInput = ({ tags, setTags, suggestions = [], placeholder = "Add a tag..." }) => {
    const [input, setInput] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (value.trim()) {
            setFilteredSuggestions(suggestions.filter(s =>
                s.toLowerCase().includes(value.toLowerCase()) && !tags.includes(s)
            ));
        } else {
            setFilteredSuggestions([]);
        }
    };

    const addTag = (tag) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setInput('');
            setFilteredSuggestions([]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(input.trim());
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                            <FaTimes />
                        </button>
                    </span>
                ))}
            </div>
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                {filteredSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => addTag(suggestion)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter to add.</p>
        </div>
    );
};

export default TagInput;
