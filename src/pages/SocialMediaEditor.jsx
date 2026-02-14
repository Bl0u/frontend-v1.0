import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

import SocialLinksManager from '../components/SocialLinksManager';
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const SocialMediaEditor = () => {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
                const res = await axios.get(`${API_BASE_URL}/api/users/${currentUser._id}`, config);
                setLinks(res.data.socialLinks || []);
            } catch (error) {
                toast.error('Failed to load social links');
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) fetchLinks();
    }, [currentUser]);

    const handleSave = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            await axios.put(`${API_BASE_URL}/api/users/profile`, { socialLinks: links }, config);
            toast.success('Social links updated!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to save links');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors"
            >
                <FaArrowLeft /> Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Professional Profiles</h1>
                    <p className="text-gray-400 mb-8 font-medium">Manage your external links to build credibility with the community.</p>

                    <SocialLinksManager links={links} onChange={setLinks} />

                    <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <FaShieldAlt /> Publicly Visible
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            </div>
        </div>
    );
};

export default SocialMediaEditor;
