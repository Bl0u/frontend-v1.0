import { useState } from 'react';
import { FaLinkedin, FaGithub, FaGlobe, FaTwitter, FaTrash, FaPlus, FaLink, FaExternalLinkAlt } from 'react-icons/fa';

const SocialLinksManager = ({ links, onChange }) => {
    const platforms = [
        { name: 'LinkedIn', icon: <FaLinkedin /> },
        { name: 'GitHub', icon: <FaGithub /> },
        { name: 'Portfolio', icon: <FaGlobe /> },
        { name: 'Twitter', icon: <FaTwitter /> },
        { name: 'Other', icon: <FaLink /> }
    ];

    const [newLink, setNewLink] = useState({ platform: 'LinkedIn', url: '' });

    const addLink = () => {
        if (!newLink.url.trim()) return;
        if (!newLink.url.startsWith('http')) {
            alert('Please enter a valid URL starting with http:// or https://');
            return;
        }
        onChange([...links, newLink]);
        setNewLink({ platform: 'LinkedIn', url: '' });
    };

    const removeLink = (index) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        onChange(updatedLinks);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
                <select
                    value={newLink.platform}
                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    {platforms.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                </select>
                <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                    type="button"
                    onClick={addLink}
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                    <FaPlus /> Add
                </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
                {links.map((link, index) => {
                    const platformIcon = platforms.find(p => p.name === link.platform)?.icon || <FaLink />;
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm group hover:border-indigo-200 transition-all"
                        >
                            <span className="text-indigo-600">{platformIcon}</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{link.platform}</span>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 flex items-center gap-1 leading-none"
                                >
                                    View <FaExternalLinkAlt size={10} />
                                </a>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeLink(index)}
                                className="ml-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>
            {links.length === 0 && (
                <p className="text-xs text-gray-400 italic">No social links added yet. Add your professional profiles to increase trust.</p>
            )}
        </div>
    );
};

export default SocialLinksManager;
