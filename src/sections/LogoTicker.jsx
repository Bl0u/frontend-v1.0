import { motion } from 'framer-motion';

export const LogoTicker = () => {
    const logos = [
        { src: '/assets/logo-acme.png', alt: 'Acme Logo' },
        { src: '/assets/logo-quantum.png', alt: 'Quantum Logo' },
        { src: '/assets/logo-echo.png', alt: 'Echo Logo' },
        { src: '/assets/logo-celestial.png', alt: 'Celestial Logo' },
        { src: '/assets/logo-pulse.png', alt: 'Pulse Logo' },
        { src: '/assets/logo-apex.png', alt: 'Apex Logo' },
    ];

    return (
        <div className="py-8 md:py-12 bg-gradient-to-r from-white via-blue-50 to-white border-y border-black/5">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
                    <motion.div
                        className="flex gap-14 flex-none pr-14"
                        animate={{
                            translateX: '-50%',
                        }}
                        transition={{
                            duration: 20,
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
                                className="h-8 w-auto"
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
