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
    // Columns distribution for responsive layout
    const firstColumn = testimonials.slice(0, 3);
    const secondColumn = testimonials.slice(3, 6);
    const thirdColumn = testimonials.slice(0, 3); // Reusing for 3rd col demo

    return (
        <section className="bg-white py-0 md:py-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-center">
                    <div className="inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-sm bg-white/30 backdrop-blur gap-1 mb-5">
                        <span className="font-bold text-sm">Testimonials</span>
                    </div>
                </div>
                <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
                    What our users say
                </h2>
                <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5 max-w-lg mx-auto">
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
