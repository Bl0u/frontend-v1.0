import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import { API_BASE_URL } from '../config';


const TopUp = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const packages = [
        { stars: 100, price: 50, popular: false },
        { stars: 250, price: 100, popular: true },
        { stars: 600, price: 200, popular: false },
        { stars: 1500, price: 500, popular: false },
        { stars: 3500, price: 1000, popular: false }
    ];

    const handlePurchase = async (stars, price) => {
        if (!user) {
            toast.error('Please login to top up');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(
                `${API_BASE_URL}/api/users/topup`,
                { amount: stars },
                config
            );

            // Update user in localStorage
            const updatedUser = { ...user, stars: res.data.stars };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Trigger storage event to update header/context
            window.dispatchEvent(new Event('storage'));

            toast.success(`🎉 Successfully added ${stars} stars!`);
        } catch (error) {
            console.error('Top up error:', error);
            toast.error(error.response?.data?.message || 'Failed to top up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold transition-colors"
                >
                    <FaArrowLeft /> Back
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <FaStar className="text-6xl text-amber-500 animate-pulse" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4">Top Up Stars</h1>
                    <p className="text-lg text-gray-600 font-medium">
                        Unlock premium intelligence and support content creators
                    </p>
                </div>

                {/* Current Balance */}
                {user && (
                    <div className="max-w-md mx-auto mb-12 bg-white rounded-2xl p-6 shadow-xl border-2 border-amber-200">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">Current Balance</p>
                        <div className="flex items-center gap-3">
                            <FaStar className="text-3xl text-amber-500" />
                            <span className="text-4xl font-black text-amber-700">{user.stars || 0}</span>
                            <span className="text-lg text-gray-400 font-bold">Stars</span>
                        </div>
                    </div>
                )}

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.stars}
                            className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:scale-105 hover:shadow-2xl ${pkg.popular
                                ? 'border-amber-500 shadow-xl shadow-amber-100'
                                : 'border-gray-200 hover:border-amber-300'
                                }`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <FaStar className="text-4xl text-amber-500" />
                                    <span className="text-5xl font-black text-gray-900">{pkg.stars}</span>
                                </div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Stars</p>
                            </div>

                            <div className="text-center mb-6">
                                <span className="text-3xl font-black text-amber-600">{pkg.price} LE</span>
                            </div>

                            <button
                                onClick={() => handlePurchase(pkg.stars, pkg.price)}
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${pkg.popular
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xl shadow-amber-200 hover:shadow-2xl'
                                    : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Processing...' : 'Buy Now'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-16 text-center text-gray-500 text-sm">
                    <p className="font-medium">
                        💡 <strong>Demo Mode:</strong> Stars are credited instantly for showcase purposes
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TopUp;
