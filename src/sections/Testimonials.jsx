import { motion } from 'framer-motion';
import { Fragment, useRef } from 'react';

const testimonials = [
    {
        text: 'This app has completely transformed how I manage my projects and deadlines.',
        imageSrc: '/assets/avatar-1.png',
        name: 'Jamie Rivera',
        username: '@jamietechguru00',
    },
    {
        text: 'I was amazed at how quickly we were able to integrate this app into our workflow.',
        imageSrc: '/assets/avatar-2.png',
        name: 'Josh Smith',
        username: '@jjsmith',
    },
    {
        text: 'Planning and executing events has never been easier. This app helps me keep track of all the moving parts, ensuring nothing slips through the cracks.',
        imageSrc: '/assets/avatar-3.png',
        name: 'Morgan Lee',
        username: '@morganleewhiz',
    },
    {
        text: 'The variability and flexibility are remarkable. It fits perfectly into our diverse needs.',
        imageSrc: '/assets/avatar-4.png',
        name: 'Casey Jordan',
        username: '@caseyj',
    },
    {
        text: 'Adopting this app for our team has streamlined our project management and improved communication across the board.',
        imageSrc: '/assets/avatar-5.png',
        name: 'Taylor Kim',
        username: '@taylorkimm',
    },
    {
        text: 'With this app, we can easily assign tasks, track progress, and manage documents all in one place.',
        imageSrc: '/assets/avatar-6.png',
        name: 'Riley Smith',
        username: '@rileysmith1',
    },
];

const TestimonialsColumn = ({ className, testimonials, duration }) => (
    <div className={className}>
        <motion.div
            animate={{
                translateY: '-50%',
            }}
            transition={{
                duration: duration || 10,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop',
            }}
            className="flex flex-col gap-6 pb-6"
        >
            {[...testimonials, ...testimonials].map(({ text, imageSrc, name, username }, index) => (
                <div key={index} className="card p-10 border border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full bg-white">
                    <div>{text}</div>
                    <div className="flex items-center gap-2 mt-5">
                        <img src={imageSrc} alt={name} className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col">
                            <div className="font-medium tracking-tight leading-5">{name}</div>
                            <div className="leading-5 tracking-tight text-[#010D3E]">{username}</div>
                        </div>
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
);

export const Testimonials = () => {
    const testimonialsRef = useRef(null);
    // Columns distribution for responsive layout
    const firstColumn = testimonials.slice(0, 3);
    const secondColumn = testimonials.slice(3, 6);
    const thirdColumn = testimonials.slice(0, 3); // Reusing for 3rd col demo

    return (
        <section ref={testimonialsRef} className="relative bg-gradient-to-b from-white via-[#F3F3F5] to-white py-0 md:py-10 overflow-hidden -mt-20">
            {/* Subtle animated gradient blobs */}
            <motion.div
                className="absolute -top-20 left-1/3 w-[400px] h-[400px] opacity-25 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(190, 190, 200, 0.25) 0%, rgba(180, 180, 195, 0.15) 100%)',
                    filter: 'blur(60px)',
                    borderRadius: '40% 60% 70% 30% / 60% 30% 70% 40%',
                }}
                animate={{
                    x: [0, 50, -30, 0],
                    y: [0, -40, 30, 0],
                    rotate: [0, 10, -10, 0],
                }}
                transition={{
                    duration: 20,
                    ease: 'easeInOut',
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="absolute bottom-0 -right-32 w-[500px] h-[500px] opacity-20 pointer-events-none"
                style={{
                    background: 'linear-gradient(225deg, rgba(200, 200, 210, 0.2) 0%, rgba(210, 210, 215, 0.15) 100%)',
                    filter: 'blur(65px)',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                }}
                animate={{
                    x: [0, -60, 40, 0],
                    y: [0, 50, -40, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                    duration: 25,
                    ease: 'easeInOut',
                    repeat: Infinity,
                }}
            />
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex justify-center">
                    <div className="inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-sm bg-white/30 backdrop-blur gap-1 mb-5">
                        <span className="font-bold text-sm">Testimonials</span>
                    </div>
                </div>
                <h2 style={{
                    fontFamily: "Zuume-Bold",
                    letterSpacing: "0.5px",
                }} className="text-center text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5 fjalla-one-regular">
                    What our users say
                </h2>
                <p className="text-center text-[16px] text-[#010D3E] mt-5 max-w-lg mx-auto">
                    From intuitive design to powerful features, our app has become an essential tool for users around the world.
                </p>

                <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
            </div>
        </section>
    );
};
