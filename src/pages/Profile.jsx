import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

import StudentProfileForm from '../components/StudentProfileForm';
import RoleBadge from '../components/RoleBadge';

const Profile = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const res = await axios.get(`${API_BASE_URL}/api/users/${user._id}`, config);
            setProfileData(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Could not fetch profile');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    if (!user) return <p>Please login.</p>;
    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#001E80]/20 border-t-[#001E80] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* LP-themed Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1
                            className="text-3xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-1"
                            style={{ fontFamily: 'Zuume-Bold', letterSpacing: '0.5px' }}
                        >
                            Profile
                        </h1>
                        <RoleBadge role={user.roles?.[0] || user.role} university={profileData?.university} />
                    </div>
                    <p className="text-[#010D3E]/50 text-sm font-medium mt-1">Manage your identity and academic details</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <StudentProfileForm
                    user={user}
                    initialData={profileData}
                    refreshProfile={fetchProfile}
                    refreshUser={refreshUser}
                />
            </div>
        </div>
    );
};

export default Profile;
