import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

import UserCard from '../components/UserCard';
import { FaSearch } from 'react-icons/fa';

const Partners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPartners = async (search = '') => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/users?role=student`;
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            } else {
                url += '&lookingForPartner=true';
            }
            const res = await axios.get(url);
            setPartners(res.data);
        } catch (error) {
            console.error('Error fetching partners', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPartners(searchTerm);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* LP-themed Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h1
                        className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1"
                        style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                    >
                        Partner Pool
                    </h1>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1">Find a teammate for your graduation project</p>
                </div>

                <button
                    onClick={() => toast.info('Partnership archives coming soon in your personal dashboard!')}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest text-gray-500 hover:text-[#001E80] hover:border-[#001E80]/20 transition-all shadow-sm"
                >
                    📜 Partnership History
                </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-4 top-3.5 text-gray-300" size={14} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, university, skills, major..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#001E80]/15 focus:border-[#001E80]/20 outline-none transition-all font-medium text-sm"
                    />
                </div>
                <button type="submit" className="bg-[#001E80] hover:bg-[#001E80]/85 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#001E80]/10 transition-all active:scale-[0.97]">
                    Search
                </button>
            </form>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
                </div>
            ) : partners.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {partners.map((user) => (
                        <UserCard key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-600">No partners found.</h3>
                    {!searchTerm && <p className="text-gray-400 text-sm mt-1">Be the first to enable "Looking for partner"!</p>}
                    {searchTerm && <p className="text-gray-400 text-sm mt-1">Try a different search term.</p>}
                </div>
            )}
        </div>
    );
};

export default Partners;
