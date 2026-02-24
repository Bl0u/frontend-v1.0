import React from "react";
import { Link } from "react-router-dom";
import { LiquidButton } from "../components/LiquidButton";

export const CallToAction = () => {
    return (
        <section className="relative w-full bg-white py-16 px-4 md:py-32">
            <div className="max-w-[85rem] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-16">
                    {/* Tag Label - Hero Style */}
                    <div className="inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-sm bg-white/30 backdrop-blur mb-6">
                        <span className="font-bold text-sm text-[#010D3E] uppercase" style={{ letterSpacing: "0.5px" }}>Start for free</span>
                    </div>

                    <h2
                        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text leading-tight uppercase text-center"
                        style={{ fontFamily: "Zuume-Bold", letterSpacing: "0.5px" }}
                    >
                        Ready to find your success?
                    </h2>
                </div>

                {/* Split-Card Content Section */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 max-w-[70rem] mx-auto">
                    {/* Left Card: Top, Bottom, Left borders */}
                    <div className="relative p-8 md:p-12 border-t border-b md:border-l border-black/10 rounded-t-[30px] md:rounded-tr-none md:rounded-l-[30px] bg-white text-center md:text-left">
                        <p className="text-[18px] text-[#010D3E]/80 leading-relaxed font-medium">
                            Find the material to prepare efficiently for your exams from earlier tests and through the contribution of others' journeys.
                            <Link
                                to="/resources"
                                className="ml-2 text-[#001E80] font-bold underline decoration-2 underline-offset-4 hover:text-[#001E80]/70 transition-colors inline-block md:inline"
                            >
                                Explore resources
                            </Link>
                        </p>
                    </div>

                    {/* Vertical Divider - Long but less than card height */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px bg-black/15 h-[60%] z-20" />

                    {/* Right Card: Top, Bottom, Right borders */}
                    <div className="relative p-8 md:p-12 border-b md:border-t md:border-r border-black/10 rounded-b-[30px] md:rounded-bl-none md:rounded-r-[30px] bg-white text-center md:text-left">
                        <p className="text-[18px] text-[#010D3E]/80 leading-relaxed font-medium">
                            Find someone to help you out or be the one to help others. Share and gain knowledge with your peers.
                            <Link
                                to="/partners"
                                className="ml-2 text-[#001E80] font-bold underline decoration-2 underline-offset-4 hover:text-[#001E80]/70 transition-colors inline-block md:inline"
                            >
                                Enter partner pool
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom: Register Button */}
                <div className="flex justify-center mt-12 w-full">
                    <LiquidButton
                        to="/register"
                        text="Register for free"
                        className="scale-110"
                    />
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
