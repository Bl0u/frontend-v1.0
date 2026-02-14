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
                url += '&lookingForPartner=true'; // Default: only looking for partner
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
        <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Partner Pool</h1>
            <p className="text-gray-600 mb-4">Find a teammate for your graduation project.</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2 max-w-md">
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, university, skills, major..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all font-medium text-sm"
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95">
                    Search
                </button>
            </form>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : partners.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {partners.map((user) => (
                        <UserCard key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-600">No partners found.</h3>
                    {!searchTerm && <p className="text-gray-500">Be the first to enable "Looking for partner"!</p>}
                    {searchTerm && <p className="text-gray-500">Try a different search term.</p>}
                </div>
            )}
        </div>
    );
};

export default Partners;
