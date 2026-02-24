import React from "react";
import { Link } from "react-router-dom";
import { LiquidButton } from "../components/LiquidButton";

export const CallToAction = () => {
    return (
        <section className="relative w-full bg-white py-16 px-4 md:py-24">
            {/* Floating Card Content */}
            <div
                className="relative mx-auto w-full max-w-[85rem] rounded-[48px] overflow-hidden p-8 md:p-16 lg:p-20"
                style={{
                    backgroundColor: "#F3F3F5", // Semi-light shade as requested
                    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
                }}
            >
                {/* Subtle Background Elements */}
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-white/40 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#001E80]/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                    {/* Row 1: Hook (Spanning 2 columns) */}
                    <div className="md:col-span-2 text-center md:text-left">
                        <h2
                            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text leading-tight uppercase"
                            style={{ fontFamily: "Zuume-Bold", letterSpacing: "0.5px" }}
                        >
                            Ready to find your success?
                        </h2>
                    </div>

                    {/* Row 2, Col 1: Resources Focus */}
                    <div className="flex flex-col justify-between h-full">
                        <p className="text-[18px] md:text-[20px] text-[#010D3E]/80 leading-relaxed font-medium">
                            Find the material to prepare efficiently for your exams from earlier tests and through the contribution of others' journeys.
                            <Link
                                to="/resources"
                                className="ml-2 text-[#001E80] font-bold underline decoration-2 underline-offset-4 hover:text-[#001E80]/70 transition-colors"
                            >
                                Explore resources
                            </Link>
                        </p>
                    </div>

                    {/* Row 2, Col 2: Partner Pool Focus */}
                    <div className="flex flex-col justify-between h-full">
                        <p className="text-[18px] md:text-[20px] text-[#010D3E]/80 leading-relaxed font-medium">
                            Find someone to help you out or be the one to help others. Share and gain knowledge with your peers.
                            <Link
                                to="/partners"
                                className="ml-2 text-[#001E80] font-bold underline decoration-2 underline-offset-4 hover:text-[#001E80]/70 transition-colors"
                            >
                                Enter partner pool
                            </Link>
                        </p>
                    </div>

                    {/* Bottom: Register Button */}
                    <div className="md:col-span-2 flex justify-center mt-8">
                        <LiquidButton
                            to="/register"
                            text="Register for free"
                            className="scale-110"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
