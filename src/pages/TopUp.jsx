import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar, FaArrowLeft, FaWallet, FaMobileAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const TopUp = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('select');        // select | phone | result
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [walletPhone, setWalletPhone] = useState('');
    const [paymentResult, setPaymentResult] = useState(null); // success | failed

    const packages = [
        { stars: 100, price: 50, popular: false },
        { stars: 250, price: 100, popular: true },
        { stars: 600, price: 200, popular: false },
        { stars: 1500, price: 500, popular: false },
        { stars: 3500, price: 1000, popular: false }
    ];

    // ── Detect return from Paymob ──
    useEffect(() => {
        const success = searchParams.get('success');
        const pending = searchParams.get('pending');

        if (success !== null) {
            if (success === 'true' && pending !== 'true') {
                setPaymentResult('success');
                setStep('result');
                toast.success('🎉 Payment successful! Stars have been added.');
                // Refresh user data
                if (user?.token) {
                    axios.get(`${API_BASE_URL}/api/users/${user._id}`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    }).then(res => {
                        updateUser({ stars: res.data.stars });
                    }).catch(() => { });
                }
            } else {
                setPaymentResult('failed');
                setStep('result');
                toast.error('Payment was not completed.');
            }
        }
    }, [searchParams]);

    // ── Initiate Paymob Payment ──
    const handlePurchase = async () => {
        if (!user) {
            toast.error('Please login to top up');
            navigate('/login');
            return;
        }
        if (!selectedPkg) return;

        // Validate phone
        const phoneRegex = /^01[0-9]{9}$/;
        if (!phoneRegex.test(walletPhone)) {
            toast.error('Enter a valid Egyptian phone number (01XXXXXXXXX)');
            return;
        }

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(
                `${API_BASE_URL}/api/payments/initiate`,
                { stars: selectedPkg.stars, walletPhone },
                config
            );

            // Redirect to Paymob Unified Checkout
            window.location.href = res.data.redirectUrl;

        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    // ── RESULT SCREEN ──
    if (step === 'result') {
        const isSuccess = paymentResult === 'success';
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#EAEEFE] to-white py-12 px-4">
                <div className="max-w-lg mx-auto text-center">
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isSuccess
                            ? <FaCheckCircle className="text-5xl text-green-500" />
                            : <FaTimesCircle className="text-5xl text-red-500" />
                        }
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-3">
                        {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                    </h1>
                    <p className="text-gray-600 text-lg mb-8">
                        {isSuccess
                            ? 'Your stars have been credited to your account.'
                            : 'Something went wrong. Please try again.'}
                    </p>
                    {isSuccess && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#001E80]/10 mb-8 inline-block">
                            <div className="flex items-center gap-3">
                                <FaStar className="text-3xl text-[#001E80]" />
                                <span className="text-4xl font-black text-[#010D3E]">{user?.stars || 0}</span>
                                <span className="text-lg text-gray-400 font-bold">Stars</span>
                            </div>
                        </div>
                    )}
                    <div>
                        <button
                            onClick={() => { setStep('select'); setPaymentResult(null); navigate('/top-up', { replace: true }); }}
                            className="px-8 py-3 bg-[#001E80] text-white font-bold rounded-xl hover:bg-[#010D3E] transition-all"
                        >
                            {isSuccess ? 'Buy More' : 'Try Again'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EAEEFE] to-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => step === 'phone' ? setStep('select') : navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold transition-colors"
                >
                    <FaArrowLeft /> {step === 'phone' ? 'Back to Packages' : 'Back'}
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <FaStar className="text-6xl text-[#001E80] animate-pulse" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4">Top Up Stars</h1>
                    <p className="text-lg text-gray-600 font-medium">
                        {step === 'select'
                            ? 'Choose your star package'
                            : 'Enter your Vodafone Cash number'}
                    </p>
                </div>

                {/* Current Balance */}
                {user && (
                    <div className="max-w-md mx-auto mb-12 bg-white rounded-2xl p-6 shadow-xl border-2 border-[#001E80]/10">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">Current Balance</p>
                        <div className="flex items-center gap-3">
                            <FaStar className="text-3xl text-[#001E80]" />
                            <span className="text-4xl font-black text-[#010D3E]">{user.stars || 0}</span>
                            <span className="text-lg text-gray-400 font-bold">Stars</span>
                        </div>
                    </div>
                )}

                {/* ── STEP 1: Package Selection ── */}
                {step === 'select' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.stars}
                                onClick={() => { setSelectedPkg(pkg); setStep('phone'); }}
                                className={`relative bg-white rounded-3xl p-8 border-2 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl ${pkg.popular
                                        ? 'border-[#001E80] shadow-xl shadow-[#001E80]/20'
                                        : 'border-gray-200 hover:border-[#001E80]/30'
                                    }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#001E80] text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                        Most Popular
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <FaStar className="text-4xl text-[#001E80]" />
                                        <span className="text-5xl font-black text-gray-900">{pkg.stars}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Stars</p>
                                </div>
                                <div className="text-center mb-6">
                                    <span className="text-3xl font-black text-[#001E80]">{pkg.price} LE</span>
                                </div>
                                <div className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm text-center transition-all ${pkg.popular
                                        ? 'bg-[#001E80] text-white shadow-xl shadow-[#001E80]/20'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    Select
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── STEP 2: Phone Number Input ── */}
                {step === 'phone' && selectedPkg && (
                    <div className="max-w-lg mx-auto">
                        {/* Selected Package Summary */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#001E80]/10 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FaStar className="text-2xl text-[#001E80]" />
                                    <span className="text-2xl font-black text-gray-900">{selectedPkg.stars} Stars</span>
                                </div>
                                <span className="text-2xl font-black text-[#001E80]">{selectedPkg.price} LE</span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                                    <FaWallet className="text-white text-lg" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Vodafone Cash</p>
                                    <p className="text-xs text-gray-500">Mobile Wallet Payment</p>
                                </div>
                            </div>

                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <FaMobileAlt className="inline mr-1" /> Wallet Phone Number
                            </label>
                            <input
                                type="tel"
                                value={walletPhone}
                                onChange={(e) => setWalletPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                placeholder="01XXXXXXXXX"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-bold focus:border-[#001E80] focus:outline-none transition-colors"
                                maxLength={11}
                                dir="ltr"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Enter the number linked to your Vodafone Cash wallet
                            </p>
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={handlePurchase}
                            disabled={loading || walletPhone.length !== 11}
                            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${loading || walletPhone.length !== 11
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#001E80] text-white shadow-xl shadow-[#001E80]/20 hover:bg-[#010D3E] hover:shadow-2xl active:scale-[0.98]'
                                }`}
                        >
                            {loading ? 'Redirecting to payment...' : `Pay ${selectedPkg.price} LE`}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            🔒 Secured by Paymob. You'll be redirected to complete payment.
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-16 text-center text-gray-500 text-sm">
                    <p className="font-medium">
                        💳 Payments processed securely via <strong>Paymob</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TopUp;
