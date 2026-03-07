import React from 'react';
import StudentLeads from '../sections/StudentLeads';
import MentorRecruitment from '../sections/MentorRecruitment';
import { Footer } from '../sections/Footer';
import Header from '../components/Header';

const WorkWithUs = () => {
    return (
        <div className="pt-20 bg-white">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                <h1
                    className="text-6xl md:text-8xl font-black bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent pb-4"
                    style={{ fontFamily: 'Zuume-Bold', letterSpacing: '1px' }}
                >
                    WORK WITH THE HUB
                </h1>
                <p className="text-[#010D3E]/50 text-xl font-medium max-w-2xl mx-auto mt-4">
                    Join an elite ecosystem of student leaders and industry experts shaping the future of academic collaboration.
                </p>
            </div>

            <StudentLeads />
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <MentorRecruitment />

            <Footer />
        </div>
    );
};

export default WorkWithUs;
