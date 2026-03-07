import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaSun } from 'react-icons/fa';
import { LiquidButton } from '../components/LiquidButton';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Products', path: '/products' },
        { name: 'Solutions', path: '/solutions' },
        { name: 'Ecosystem', path: '/ecosystem' },
        { name: 'Community', path: '/community' },
        { name: 'Resources', path: '/resources' },
        { name: 'Blog', path: '/blog' },
    ];

    return (
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
            >
                <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-3">
                    {/* Logo: El-Zatona with Sun Icon */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-orange-400 to-pink-500 p-1.5 rounded-lg shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <FaSun className="text-white text-lg" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800">El-Zatona</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm font-medium text-slate-700 hover:text-black transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <LiquidButton
                            to="/register"
                            text="Join"
                            className="hidden md:block"
                        />

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-slate-800 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/20 overflow-hidden bg-white/40 backdrop-blur-xl rounded-b-2xl"
                        >
                            <div className="flex flex-col p-4 gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-slate-800 font-medium text-sm hover:translate-x-1 transition-transform"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="h-px bg-slate-200/50 my-2"></div>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="bg-black text-white text-center py-3 rounded-xl font-medium shadow-md"
                                >
                                    Register
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    );
};
