import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUserGraduate, FaChalkboardTeacher, FaHandshake, FaBookOpen, FaArrowRight, FaRocket, FaLightbulb, FaStar } from 'react-icons/fa';
import Footer from '../components/Footer';
import MorphingCTA from '../components/MorphingCTA';

const Home = () => {
    const { user } = useContext(AuthContext);

    // Scroll reveal animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Hero Section */}
            <section className="relative text-white pt-24 pb-28 overflow-hidden rounded-t-3xl mt-5" style={{ background: 'linear-gradient(135deg, rgba(89, 13, 34, 0.95) 0%, rgba(164, 19, 60, 0.9) 50%, rgba(201, 24, 74, 0.85) 100%)' }}>
                {/* Decorative elements with floating animation */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff4d6d] opacity-10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#ffccd5] opacity-20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                {/* Diagonal Rose Decorations */}
                <svg className="absolute top-10 left-10 opacity-10" width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-25deg)' }}>
                    <g>
                        <ellipse cx="75" cy="50" rx="12" ry="18" fill="#ffccd5" opacity="0.8" />
                        <ellipse cx="60" cy="60" rx="15" ry="20" fill="#ffb3c1" opacity="0.7" />
                        <ellipse cx="90" cy="60" rx="15" ry="20" fill="#ffb3c1" opacity="0.7" />
                        <ellipse cx="75" cy="70" rx="18" ry="22" fill="#ff8fa3" opacity="0.6" />
                        <ellipse cx="75" cy="85" rx="20" ry="25" fill="#ff758f" opacity="0.5" />
                        <circle cx="75" cy="75" r="8" fill="#ff4d6d" />
                        <path d="M 75 95 Q 70 110 68 130 Q 75 115 75 95 Q 80 115 82 130 Q 80 110 75 95" fill="#2d5016" opacity="0.6" />
                    </g>
                </svg>
                <svg className="absolute top-40 right-20 opacity-8" width="120" height="120" viewBox="0 0 150 150" style={{ transform: 'rotate(45deg)' }}>
                    <g>
                        <ellipse cx="75" cy="50" rx="12" ry="18" fill="#ffccd5" opacity="0.8" />
                        <ellipse cx="60" cy="60" rx="15" ry="20" fill="#ffb3c1" opacity="0.7" />
                        <ellipse cx="90" cy="60" rx="15" ry="20" fill="#ffb3c1" opacity="0.7" />
                        <ellipse cx="75" cy="70" rx="18" ry="22" fill="#ff8fa3" opacity="0.6" />
                        <ellipse cx="75" cy="85" rx="20" ry="25" fill="#ff758f" opacity="0.5" />
                        <circle cx="75" cy="75" r="8" fill="#ff4d6d" />
                        <path d="M 75 95 Q 70 110 68 130 Q 75 115 75 95 Q 80 115 82 130 Q 80 110 75 95" fill="#2d5016" opacity="0.6" />
                    </g>
                </svg>
                <svg className="absolute bottom-20 right-40 opacity-10" width="130" height="130" viewBox="0 0 150 150" style={{ transform: 'rotate(-15deg)' }}>
                    <g>
                        <ellipse cx="75" cy="50" rx="12" ry="18" fill="#ffccd5" opacity="0.8" />
                        <ellipse cx="60" cy="60" rx="15" ry="20" fill="#ffb3c1" opacity="0.7" />
                        <ellipse cx="90" cy="60" rx="15" ry="20" fill="#ffb3c1" opacity="0.7" />
                        <ellipse cx="75" cy="70" rx="18" ry="22" fill="#ff8fa3" opacity="0.6" />
                        <ellipse cx="75" cy="85" rx="20" ry="25" fill="#ff758f" opacity="0.5" />
                        <circle cx="75" cy="75" r="8" fill="#ff4d6d" />
                        <path d="M 75 95 Q 70 110 68 130 Q 75 115 75 95 Q 80 115 82 130 Q 80 110 75 95" fill="#2d5016" opacity="0.6" />
                    </g>
                </svg>
                <svg className="absolute bottom-10 left-32 opacity-8" width="110" height="110" viewBox="0 0 150 150" style={{ transform: 'rotate(30deg)' }}>
                    <g>
                        <ellipse cx="75" cy="50" rx="12" ry="18" fill="#ffccd5" opacity="0.8" />
                        <ellipse cx="60" cy="60" rx="15" ry="20" fill="#ffb3c1" opacity="0.7" />
                        <ellipse cx="90" cy="60" rx="15" ry="20" fill="#ffb3c1" opacity="0.7" />
                        <ellipse cx="75" cy="70" rx="18" ry="22" fill="#ff8fa3" opacity="0.6" />
                        <ellipse cx="75" cy="85" rx="20" ry="25" fill="#ff758f" opacity="0.5" />
                        <circle cx="75" cy="75" r="8" fill="#ff4d6d" />
                        <path d="M 75 95 Q 70 110 68 130 Q 75 115 75 95 Q 80 115 82 130 Q 80 110 75 95" fill="#2d5016" opacity="0.6" />
                    </g>
                </svg>

                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Build Your Dream Project with<br />
                        <span className="text-[#ffccd5]">LearnCrew</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-10 text-[#ffb3c1] max-w-3xl mx-auto font-light leading-relaxed">
                        The ultimate platform for students to find partners, connect with mentors,
                        and access premium resources to turn graduation projects into reality.
                    </p>
                    {!user && (
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link
                                to="/register"
                                className="group bg-white text-[#a4133c] font-bold py-5 px-12 rounded-full shadow-2xl hover:shadow-[#a4133c]/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 flex items-center gap-3 text-lg animate-glow-pulse"
                            >
                                Get Started Free
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="bg-transparent border-2 border-[#ffccd5] text-[#ffccd5] font-bold py-5 px-12 rounded-full hover:bg-[#ffccd5] hover:text-[#590d22] transition-all duration-300 text-lg"
                            >
                                Login
                            </Link>
                        </div>
                    )}
                    {user && (
                        <div className="text-4xl font-semibold text-[#ffccd5]">
                            Welcome back, {user.name}! 🎉
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="scroll-reveal bg-white/20 backdrop-blur-lg backdrop-saturate-150 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                            <div className="text-6xl font-black text-[#a4133c] mb-3">500+</div>
                            <div className="text-gray-700 font-semibold text-lg">Active Students</div>
                        </div>
                        <div className="scroll-reveal bg-white/20 backdrop-blur-lg backdrop-saturate-150 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                            <div className="text-6xl font-black text-[#c9184a] mb-3">150+</div>
                            <div className="text-gray-700 font-semibold text-lg">Expert Mentors</div>
                        </div>
                        <div className="scroll-reveal bg-white/20 backdrop-blur-lg backdrop-saturate-150 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                            <div className="text-6xl font-black text-[#ff4d6d] mb-3">200+</div>
                            <div className="text-gray-700 font-semibold text-lg">Projects Completed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Pool Section - Left Content, Right Visual */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="scroll-reveal">
                            <div className="flex items-center gap-3 mb-6 scroll-reveal">
                                <FaHandshake className="text-5xl text-[#ff4d6d]" />
                                <h2 className="text-5xl font-bold text-[#590d22]">Partner Pool</h2>
                            </div>
                            <p className="text-xl text-gray-700 mb-8 leading-relaxed scroll-reveal">
                                Finding the right partner is crucial for project success. Browse through hundreds of talented students,
                                filter by skills, interests, and availability, then connect with those who share your vision.
                            </p>
                            <ul className="space-y-4 mb-10 scroll-reveal">
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#ff4d6d] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Advanced search filters by major, skills, and project interests</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#ff4d6d] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Direct messaging to discuss ideas before committing</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#ff4d6d] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Profile showcases with portfolios and past projects</span>
                                </li>
                            </ul>
                            <Link
                                to="/partners"
                                className="scroll-reveal group inline-flex items-center gap-3 bg-[#ff4d6d] text-white font-bold py-4 px-8 rounded-full hover:bg-[#a4133c] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
                            >
                                Find Your Partner
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="scroll-reveal">
                            <div className="bg-white/10 backdrop-blur-xl backdrop-saturate-150 rounded-3xl p-16 shadow-2xl shadow-bubblegum/20 hover:shadow-bubblegum/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover-lift">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-6 hover:bg-white transition-all duration-300">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-[#ffccd5] rounded-full"></div>
                                        <div>
                                            <div className="font-bold text-lg text-[#590d22]">Sarah Johnson</div>
                                            <div className="text-sm text-gray-600">Computer Science • AI Enthusiast</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm">Looking for partner for ML project...</p>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:bg-white transition-all duration-300">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-[#ffccd5] rounded-full"></div>
                                        <div>
                                            <div className="font-bold text-lg text-[#590d22]">Ahmed Hassan</div>
                                            <div className="text-sm text-gray-600">Software Engineering • Backend</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm">Seeking frontend developer for startup idea...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Decorative Divider with Rose */}
            <div className="flex items-center justify-center py-8 relative">
                <svg className="absolute opacity-5" width="120" height="120" viewBox="0 0 120 120">
                    <path d="M60,30 Q50,40 60,50 Q70,40 60,30 M60,50 Q50,60 60,70 Q70,60 60,50 M50,50 Q40,60 50,70 Q40,70 40,80 M70,50 Q80,60 70,70 Q80,70 80,80 M60,70 Q50,80 60,90 Q70,80 60,70" fill="#590d22" stroke="#590d22" strokeWidth="1" />
                    <circle cx="60" cy="60" r="3" fill="#a4133c" />
                </svg>
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#ff4d6d]/30 to-transparent rounded-full"></div>
            </div>

            {/* Mentor Support Section - Right Content, Left Visual */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="scroll-reveal order-2 md:order-1">
                            <div className="bg-white/10 backdrop-blur-xl backdrop-saturate-150 rounded-3xl p-16 shadow-2xl shadow-rosewood/20 hover:shadow-rosewood/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover-lift">
                                <div className="text-center text-[#590d22]">
                                    <FaChalkboardTeacher className="text-7xl mx-auto mb-6 text-[#c9184a] hover:rotate-12 transition-transform duration-300" />
                                    <h3 className="text-3xl font-bold mb-3">Expert Guidance</h3>
                                    <p className="text-lg mb-6 text-gray-700">Connect with industry professionals</p>
                                    <div className="bg-gradient-to-br from-[#c9184a] to-[#ff758f] backdrop-blur-sm rounded-xl p-6 text-white">
                                        <div className="text-5xl font-black mb-2">1:1</div>
                                        <div className="text-sm">Personalized Sessions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="scroll-reveal order-1 md:order-2">
                            <div className="flex items-center gap-3 mb-6 scroll-reveal">
                                <FaChalkboardTeacher className="text-5xl text-[#c9184a]" />
                                <h2 className="text-5xl font-bold text-[#590d22]">Mentor Support</h2>
                            </div>
                            <p className="text-xl text-gray-700 mb-8 leading-relaxed scroll-reveal">
                                Get personalized guidance from experienced professionals. Our mentors have years of industry
                                experience and are passionate about helping students succeed.
                            </p>
                            <ul className="space-y-4 mb-10 scroll-reveal">
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#c9184a] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">One-on-one video sessions with industry experts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#c9184a] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Code reviews and architecture feedback</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#c9184a] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Career advice and networking opportunities</span>
                                </li>
                            </ul>
                            <Link
                                to="/mentors"
                                className="scroll-reveal group inline-flex items-center gap-3 bg-[#c9184a] text-white font-bold py-4 px-8 rounded-full hover:bg-[#800f2f] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
                            >
                                Find a Mentor
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Decorative Divider with Rose */}
            <div className="flex items-center justify-center py-8 relative">
                <svg className="absolute opacity-5" width="120" height="120" viewBox="0 0 120 120">
                    <path d="M60,30 Q50,40 60,50 Q70,40 60,30 M60,50 Q50,60 60,70 Q70,60 60,50 M50,50 Q40,60 50,70 Q40,70 40,80 M70,50 Q80,60 70,70 Q80,70 80,80 M60,70 Q50,80 60,90 Q70,80 60,70" fill="#590d22" stroke="#590d22" strokeWidth="1" />
                    <circle cx="60" cy="60" r="3" fill="#c9184a" />
                </svg>
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#c9184a]/30 to-transparent rounded-full"></div>
            </div>

            {/* Resources Hub Section - Left Content, Right Visual */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="scroll-reveal">
                            <div className="flex items-center gap-3 mb-6 scroll-reveal">
                                <FaBookOpen className="text-5xl text-[#a4133c]" />
                                <h2 className="text-5xl font-bold text-[#590d22]">Resources Hub</h2>
                            </div>
                            <p className="text-xl text-gray-700 mb-8 leading-relaxed scroll-reveal">
                                Access a curated library of guides, templates, code samples, and community discussions.
                                Learn from others' experiences and share your own knowledge.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#a4133c] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Premium content from successful project teams</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#a4133c] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Templates for documentation, presentations, and reports</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#a4133c] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Community discussions and Q&A forums</span>
                                </li>
                            </ul>
                            <Link
                                to="/resources"
                                className="scroll-reveal group inline-flex items-center gap-3 bg-[#a4133c] text-white font-bold py-4 px-8 rounded-full hover:bg-[#590d22] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
                            >
                                Browse Resources
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="scroll-reveal">
                            <div className="bg-white/10 backdrop-blur-xl backdrop-saturate-150 rounded-3xl p-16 shadow-2xl shadow-cherry-rose/20 hover:shadow-cherry-rose/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover-lift">
                                <div className="space-y-4">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                        <div className="w-12 h-12 bg-[#ffccd5] rounded-lg flex items-center justify-center">
                                            <FaLightbulb className="text-[#a4133c] text-xl" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-[#590d22]">ML Project Guide</div>
                                            <div className="text-sm text-gray-600">⭐ Premium • 50 Stars</div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#ffccd5] rounded-lg flex items-center justify-center">
                                            <FaRocket className="text-[#a4133c] text-xl" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-[#590d22]">Deployment Checklist</div>
                                            <div className="text-sm text-gray-600">Free Resource</div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#ffccd5] rounded-lg flex items-center justify-center">
                                            <FaBookOpen className="text-[#a4133c] text-xl" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-[#590d22]">API Design Best Practices</div>
                                            <div className="text-sm text-gray-600">Free Resource</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Decorative Divider with Rose */}
            <div className="flex items-center justify-center py-8 relative">
                <svg className="absolute opacity-5" width="120" height="120" viewBox="0 0 120 120">
                    <path d="M60,30 Q50,40 60,50 Q70,40 60,30 M60,50 Q50,60 60,70 Q70,60 60,50 M50,50 Q40,60 50,70 Q40,70 40,80 M70,50 Q80,60 70,70 Q80,70 80,80 M60,70 Q50,80 60,90 Q70,80 60,70" fill="#590d22" stroke="#590d22" strokeWidth="1" />
                    <circle cx="60" cy="60" r="3" fill="#ff4d6d" />
                </svg>
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#a4133c]/30 to-transparent rounded-full"></div>
            </div>

            {/* Pro-bono Mentorship Section - Right Content, Left Visual */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="scroll-reveal order-2 md:order-1">
                            <div className="bg-white/10 backdrop-blur-xl backdrop-saturate-150 rounded-3xl p-16 shadow-2xl shadow-cotton-candy/20 hover:shadow-cotton-candy/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover-lift text-center">
                                <FaUserGraduate className="text-7xl text-[#ff8fa3] mx-auto mb-6 hover:scale-110 transition-transform duration-300" />
                                <h3 className="text-3xl font-bold text-[#590d22] mb-4">Pitch Your Project</h3>
                                <p className="text-gray-700 mb-8">Submit your idea and get expert review completely free</p>
                                <div className="bg-gradient-to-br from-[#ff8fa3] to-[#ffb3c1] rounded-xl p-6">
                                    <div className="text-4xl font-black text-white mb-2">100%</div>
                                    <div className="text-white font-medium">Free Mentorship</div>
                                </div>
                            </div>
                        </div>
                        <div className="scroll-reveal order-1 md:order-2">
                            <div className="flex items-center gap-3 mb-6 scroll-reveal">
                                <FaUserGraduate className="text-5xl text-[#ff8fa3]" />
                                <h2 className="text-5xl font-bold text-[#590d22]">Pro-bono Mentorship</h2>
                            </div>
                            <p className="text-xl text-gray-700 mb-8 leading-relaxed scroll-reveal">
                                Submit your project pitch to our mentorship hub and receive dedicated, personalized assistance
                                from experienced professionals—completely free.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#ff8fa3] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Free expert review of your project proposal</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#ff8fa3] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Dedicated mentor assigned to guide you</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaStar className="text-[#ff8fa3] mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">Regular check-ins and milestone reviews</span>
                                </li>
                            </ul>
                            <Link
                                to={user?.role === 'student' || !user ? "/mentorship-request" : "/mentorship-requests"}
                                className="scroll-reveal group inline-flex items-center gap-3 bg-[#ff8fa3] text-white font-bold py-4 px-8 rounded-full hover:bg-[#ff4d6d] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
                            >
                                {user?.role === 'mentor' ? 'Review Projects' : 'Submit Your Pitch'}
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            {/* Final CTA Section - Replaced with Morphing Animation */}
            <MorphingCTA />

            {/* Footer - Separated from content */}
            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
};

export default Home;
