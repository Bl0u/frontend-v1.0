import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaUserFriends, FaChalkboardTeacher, FaLayerGroup, FaCheckCircle } from 'react-icons/fa';

export const ProductShowcase = () => {
    const sectionRef = useRef(null);

    return (
        <section ref={sectionRef} className="bg-slate-50 py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">What we offer</h2>
                    <p className="mt-4 text-base sm:text-lg leading-7 text-slate-600">
                        LearnCrew provides a complete ecosystem for your academic success. From forming the perfect team to finalizing your project with expert advice.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 lg:gap-8 lg:grid-cols-3">
                    {/* Featured Card - Centralized Resources */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6 sm:p-8"
                    >
                        <div className="flex flex-col md:flex-row gap-6 md:items-center h-full">
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                                    Core feature
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900">Centralized Resources</h3>
                                <p className="text-base leading-7 text-slate-600">
                                    Access a repository of past projects, code snippets, and study materials. Share your own resources and earn Stars.
                                </p>
                                <ul className="space-y-2 text-base text-slate-600 mt-4">
                                    <li className="flex items-center gap-2">
                                        <FaCheckCircle className="text-indigo-600 h-5 w-5 flex-shrink-0" />
                                        <span>Access past graduation projects</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaCheckCircle className="text-indigo-600 h-5 w-5 flex-shrink-0" />
                                        <span>Download ready-to-use code snippets</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaCheckCircle className="text-indigo-600 h-5 w-5 flex-shrink-0" />
                                        <span>Share resources to earn Stars</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="md:w-64 shrink-0 self-center md:self-stretch flex items-center justify-center">
                                <div className="aspect-square w-full rounded-2xl bg-indigo-50 ring-1 ring-slate-200 flex items-center justify-center p-6">
                                    <FaLayerGroup className="w-1/2 h-1/2 text-indigo-600 opacity-80" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Supporting Card 1 - Mentorship */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6 sm:p-8 flex flex-col"
                    >
                        <div className="h-12 w-12 rounded-lg bg-fuchsia-50 flex items-center justify-center mb-6 ring-1 ring-fuchsia-100">
                            <FaChalkboardTeacher className="w-6 h-6 text-fuchsia-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">Expert Mentorship</h3>
                        <p className="mt-2 text-base leading-7 text-slate-600 flex-grow">
                            Get guidance from experienced mentors to refine your pitch and project.
                        </p>
                        <ul className="mt-6 space-y-2 text-base text-slate-600">
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                <span>Book 1-on-1 sessions</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                <span>Get pitch feedback</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                <span>Industry insights</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Supporting Card 2 - Partner Matching */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6 sm:p-8 flex flex-col"
                    >
                        <div className="h-12 w-12 rounded-lg bg-pink-50 flex items-center justify-center mb-6 ring-1 ring-pink-100">
                            <FaUserFriends className="w-6 h-6 text-pink-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">Partner Matching</h3>
                        <p className="mt-2 text-base leading-7 text-slate-600 flex-grow">
                            Find students with complementary skills for your graduation projects.
                        </p>
                        <ul className="mt-6 space-y-2 text-base text-slate-600">
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                <span>Swipe & connect</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                <span>Filter by skills</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                <span>Build your team</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
