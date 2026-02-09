
import { FaCheck, FaStar } from 'react-icons/fa';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const Pricing = () => {
    const pricingTiers = [
        {
            title: 'Star Pack',
            monthlyPrice: '$5',
            buttonText: 'Buy 500 Stars',
            popular: false,
            inverse: false,
            features: [
                '500 Stars Balance',
                'Unlock 5 Premium Resources',
                'Prioritize your Requests',
                'Support Creator Community',
            ],
        },
        {
            title: 'Pro Bundle',
            monthlyPrice: '$10',
            buttonText: 'Buy 1200 Stars',
            popular: true,
            inverse: true,
            features: [
                '1200 Stars Balance (20% Bonus)',
                'Unlock 12 Premium Resources',
                'Book 1 Expert Session',
                'Verified Student Badge',
                'Priority Support',
            ],
        },
        {
            title: 'Mentor Pass',
            monthlyPrice: 'Earn',
            buttonText: 'Apply Now',
            popular: false,
            inverse: false,
            features: [
                'Monetize your expertise',
                'Set your own rates',
                'Cash out earnings',
                'Mentor Dashboard',
                'Top Rated Badge',
            ],
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-[540px] mx-auto">
                    <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text">
                        Unlock more with Stars
                    </h2>
                    <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
                        Get the resources you need to succeed. Top up instantly.
                    </p>
                </div>

                <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
                    {pricingTiers.map(
                        ({ title, monthlyPrice, buttonText, popular, inverse, features }, index) => (
                            <div
                                key={title}
                                className={clsx(
                                    'card',
                                    inverse === true && 'border-black bg-black text-white',
                                    'p-10 border border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full'
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    <h3
                                        className={clsx(
                                            'text-lg font-bold text-black/50',
                                            inverse === true && 'text-white/60'
                                        )}
                                    >
                                        {title}
                                    </h3>
                                    {popular && (
                                        <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                                            <motion.span
                                                animate={{
                                                    backgroundPositionX: '100%',
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: 'linear',
                                                    repeatType: 'loop',
                                                }}
                                                className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] [background-size:200%] text-transparent bg-clip-text font-medium"
                                            >
                                                Best Value
                                            </motion.span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-1 mt-[30px]">
                                    <span className="text-4xl font-bold tracking-tighter leading-none">
                                        {monthlyPrice}
                                    </span>
                                </div>
                                <button
                                    className={clsx(
                                        'btn w-full mt-[30px]',
                                        inverse === true ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90',
                                        'px-4 py-2 rounded-lg font-medium tracking-tight transition-colors'
                                    )}
                                >
                                    {buttonText}
                                </button>
                                <ul className="flex flex-col gap-5 mt-8">
                                    {features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="text-sm flex items-center gap-4">
                                            {title === 'Mentor Pass' ? <FaCheck className="h-4 w-4 flex-shrink-0" /> : <FaStar className={clsx("h-4 w-4 flex-shrink-0", inverse ? "text-yellow-300" : "text-yellow-400")} />}
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};
