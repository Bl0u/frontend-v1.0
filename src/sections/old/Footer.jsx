
import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPinterest } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-black text-[#BCBCBC] text-sm py-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-4 gap-8">

                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:blur before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute mb-4">
                            <img src="/assets/logosaas.png" alt="LearnCrew Logo" height={40} className="relative h-10 w-auto" />
                        </div>
                        <p className="mt-4 text-[#BCBCBC]/80 leading-relaxed">
                            Your trusted platform to find partners, connect with mentors, and access premium resources for your graduation project success.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <FaTwitter className="text-white h-5 w-5 hover:text-white/80 transition-colors cursor-pointer" />
                            <FaInstagram className="text-white h-5 w-5 hover:text-white/80 transition-colors cursor-pointer" />
                            <FaLinkedin className="text-white h-5 w-5 hover:text-white/80 transition-colors cursor-pointer" />
                        </div>
                    </div>

                    {/* Platform Column */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Platform</h3>
                        <nav className="flex flex-col gap-3">
                            <Link to="/partners" className="hover:text-white transition-colors">Find Partners</Link>
                            <Link to="/mentors" className="hover:text-white transition-colors">Browse Mentors</Link>
                            <Link to="/resources" className="hover:text-white transition-colors">Resources Hub</Link>
                            <Link to="/mentorship-request" className="hover:text-white transition-colors">Pitch Hub</Link>
                            <Link to="/top-up" className="hover:text-white transition-colors">Top Up Stars</Link>
                        </nav>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Resources</h3>
                        <nav className="flex flex-col gap-3">
                            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                            <Link to="/guides" className="hover:text-white transition-colors">Guides</Link>
                            <Link to="/templates" className="hover:text-white transition-colors">Templates</Link>
                            <Link to="/success-stories" className="hover:text-white transition-colors">Success Stories</Link>
                            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
                        </nav>
                    </div>

                    {/* Company & Legal Column */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Company</h3>
                        <nav className="flex flex-col gap-3">
                            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link to="/code-of-conduct" className="hover:text-white transition-colors">Code of Conduct</Link>
                        </nav>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; 2026 LearnCrew. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
