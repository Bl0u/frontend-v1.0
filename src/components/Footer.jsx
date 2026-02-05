import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-[#590d22] via-[#800f2f] to-[#590d22] text-white py-16">
            <div className="container mx-auto px-6">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-5 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#ff4d6d] via-[#ff758f] to-[#ffb3c1] bg-clip-text text-transparent">
                            LearnCrew
                        </h3>
                        <p className="text-[#ffccd5] leading-relaxed mb-6">
                            Your trusted platform to find partners, connect with mentors, and access premium resources for your graduation project success.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ff4d6d] transition-all duration-300">
                                <FaFacebook className="text-lg" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ff4d6d] transition-all duration-300">
                                <FaInstagram className="text-lg" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ff4d6d] transition-all duration-300">
                                <FaTwitter className="text-lg" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ff4d6d] transition-all duration-300">
                                <FaLinkedin className="text-lg" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ff4d6d] transition-all duration-300">
                                <FaYoutube className="text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-[#ffb3c1]">Platform</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/partners" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Find Partners
                                </Link>
                            </li>
                            <li>
                                <Link to="/mentors" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Browse Mentors
                                </Link>
                            </li>
                            <li>
                                <Link to="/resources" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Resources Hub
                                </Link>
                            </li>
                            <li>
                                <Link to="/mentorship-request" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Pitch Hub
                                </Link>
                            </li>
                            <li>
                                <Link to="/top-up" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Top Up Stars
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-[#ffb3c1]">Resources</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Guides
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Templates
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Success Stories
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-[#ffb3c1]">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                                    Code of Conduct
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#ffccd5] text-sm">
                        © {new Date().getFullYear()} LearnCrew. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                            Privacy
                        </a>
                        <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                            Terms
                        </a>
                        <a href="#" className="text-[#ffccd5] hover:text-white transition-colors">
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
