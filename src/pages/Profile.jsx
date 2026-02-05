import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import StudentProfileForm from '../components/StudentProfileForm';
import MentorProfileForm from '../components/MentorProfileForm';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const res = await axios.get(`http://localhost:5000/api/users/${user._id}`, config);
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
    if (loading) return <p className="text-center mt-10">Loading profile...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md my-10">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Edit Profile</h2>

            {user.role === 'student' ? (
                <StudentProfileForm
                    user={user}
                    initialData={profileData}
                    refreshProfile={fetchProfile}
                />
            ) : (
                <MentorProfileForm
                    user={user}
                    initialData={profileData}
                    refreshProfile={fetchProfile}
                />
            )}
        </div>
    );
};

export default Profile;
