import { useState, useEffect } from 'react';
import adminService from '../features/admin/adminService';
import { toast } from 'react-toastify';
import { FaTrash, FaExternalLinkAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PitchModuleManager = ({ token }) => {
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPitches = async () => {
        setLoading(true);
        try {
            const data = await adminService.getPitches(token);
            setPitches(data);
        } catch (error) {
            toast.error('Failed to load pitches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPitches();
    }, [token]);

    const handleDelete = async (pitchId) => {
        if (!window.confirm('Are you sure you want to delete this project pitch? This action cannot be undone.')) return;

        try {
            await adminService.deletePitch(token, pitchId);
            toast.success('Pitch deleted successfully');
            fetchPitches();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete pitch');
        }
    };

    const filteredPitches = pitches.filter(pitch =>
        pitch.pitch?.Hook?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pitch.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pitch.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search pitches by hook, user, or content..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#001E80]/10 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#EAEEFE] text-[#001E80] rounded-xl text-xs font-black uppercase tracking-widest">
                    <FaFilter size={12} /> {filteredPitches.length} Pitches Total
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredPitches.length > 0 ? (
                    filteredPitches.map((pitch) => (
                        <div key={pitch._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#001E80]/10 transition-all flex items-center justify-between gap-6 group">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-[#EAEEFE] flex items-center justify-center text-lg font-black text-[#001E80] shrink-0">
                                    {pitch.sender?.name?.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate">
                                        {pitch.pitch?.Hook || pitch.pitch?.['The Hook (Short summary)'] || pitch.message}
                                    </h4>
                                    <p className="text-xs text-gray-400 font-medium">
                                        By {pitch.sender?.name} (@{pitch.sender?.username}) • {new Date(pitch.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    to="/pitch-hub"
                                    className="p-2.5 bg-gray-50 text-gray-500 hover:text-[#001E80] hover:bg-[#EAEEFE] rounded-xl transition-all"
                                    title="View on Hub"
                                >
                                    <FaExternalLinkAlt size={14} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(pitch._id)}
                                    className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                                    title="Delete Pitch"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No pitches found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PitchModuleManager;
