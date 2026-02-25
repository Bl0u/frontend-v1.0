import { motion } from 'framer-motion';

export const LogoTicker = () => {
    const logos = [
        { src: '/assets/logos/AIU_Official_Logo_2.png', alt: 'AIU Logo' },
        { src: '/assets/logos/Arab_Academy_for_Science_and_Technology_and_Maritime_Transport.jpg', alt: 'AASTMT Logo' },
        { src: '/assets/logos/BUE_final_logo.jfif', alt: 'BUE Logo' },
        { src: '/assets/logos/British_University_in_Egypt.png', alt: 'British University Logo' },
        { src: '/assets/logos/Cairo_university.jpg', alt: 'Cairo University Logo' },
        { src: '/assets/logos/E-JUST_logo.png', alt: 'E-JUST Logo' },
        { src: '/assets/logos/German_University_in_Cairo_Logo.jpg', alt: 'GUC Logo' },
        { src: '/assets/logos/Nile_University_Logo.png', alt: 'Nile University Logo' },
    ];

    return (
        <section className="py-8 md:py-7 bg-white relative overflow-hidden">
            {/* Top Fade Gradient */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-0 flex flex-col items-center">

                {/* Premium Badge */}
                <div className="relative group p-[1.5px] rounded-xl overflow-hidden mb-8">
                    {/* Animated Border Background */}
                    <motion.div
                        className="absolute inset-[-150%] opacity-60"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{
                            background: 'conic-gradient(from 0deg, transparent 20%, #001E80 50%, transparent 80%)'
                        }}
                    />

                    <div className="relative inline-flex items-center gap-2 border border-[#222]/10 px-4 py-1.5 rounded-[11px] tracking-tight shadow-sm bg-white/80 backdrop-blur-xl group-hover:bg-white transition-colors duration-300">
                        <svg className="w-3.5 h-3.5 text-[#001E80]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.4 8.4L21 9.6L16.2 14.4L17.4 21L12 17.4L6.6 21L7.8 14.4L3 9.6L9.6 8.4L12 2Z" fill="currentColor" />
                        </svg>
                        <span className="font-bold text-sm text-[#010D3E]">Trusted by 10+ universities</span>
                    </div>
                </div>

                {/* Ticker Container - 70% Width */}
                <div className="w-[85%] md:w-[70%] relative">
                    {/* Ticker with Horizontal Fade Mask */}
                    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                        <motion.div
                            className="flex gap-14 flex-none pr-14 items-center"
                            animate={{
                                translateX: '-50%',
                            }}
                            transition={{
                                duration: 30, // Slower for better visibility
                                repeat: Infinity,
                                ease: 'linear',
                                repeatType: 'loop',
                            }}
                        >
                            {[...logos, ...logos].map((logo, index) => (
                                <img
                                    key={index}
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-12 w-auto object-contain"
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Fade Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
        </section>
    );
};
