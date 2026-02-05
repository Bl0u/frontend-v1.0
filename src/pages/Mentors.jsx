import { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from '../components/UserCard';
import { FaSearch } from 'react-icons/fa';

const Mentors = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMentors = async (search = '') => {
        setLoading(true);
        try {
            let url = 'http://localhost:5000/api/users?role=mentor';
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            } else {
                url += '&lookingForMentee=true'; // Default: only open mentors
            }
            const res = await axios.get(url);
            setMentors(res.data);
        } catch (error) {
            console.error('Error fetching mentors', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentors();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMentors(searchTerm);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Mentor Pool</h1>
            <p className="text-gray-600 mb-4">Connect with experienced mentors for guidance.</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2 max-w-md">
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, university, skills, major..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all font-medium text-sm"
                    />
                </div>
                <button type="submit" className="bg-purple-600 text-white px-8 py-3 rounded-2xl hover:bg-purple-700 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-100 active:scale-95">
                    Search
                </button>
            </form>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : mentors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mentors.map((user) => (
                        <UserCard key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-600">No mentors found.</h3>
                    {searchTerm && <p className="text-gray-500">Try a different search term.</p>}
                </div>
            )}
        </div>
    );
};

export default Mentors;
