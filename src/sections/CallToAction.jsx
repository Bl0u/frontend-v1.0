import React from "react";
import { Link } from "react-router-dom";
import { LiquidButton } from "../components/LiquidButton";
import { motion } from "framer-motion";

export const CallToAction = () => {
    return (
        <section className="relative w-full bg-[#FAFAFA] py-16 px-4 md:py-32 overflow-hidden">
            {/* Background 1: Grain Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Background 2: Volumetric Light Diffusion Blurs */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-50/20 rounded-full blur-[140px] -translate-y-1/2 pointer-events-none z-0" />
            <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gray-200/20 rounded-full blur-[140px] translate-y-1/2 pointer-events-none z-0" />
            <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-white rounded-full blur-[120px] -translate-y-1/2 pointer-events-none z-0" />

            {/* Background 3: SVG Light Scatter / Refracted Rays */}
{/* Background 3: SVG Light Scatter / Refracted Rays */}
<div className="absolute inset-0 pointer-events-none z-0 opacity-70
  bg-[radial-gradient(circle_at_center,rgba(0,30,128,0.08),transparent_60%)]"
/>
<div className="absolute inset-0 z-0 pointer-events-none opacity-90 mix-blend-multiply">
  <svg
    className="w-full h-full"
    viewBox="0 0 1440 800"
    fill="none"
    preserveAspectRatio="none"
    style={{ overflow: "visible" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {[...Array(8)].map((_, i) => (
      <motion.g
        key={i}
        animate={{ x: [0, 25, 0], y: [0, -12, 0] }}
        transition={{ duration: 8 + i * 1.2, repeat: Infinity, ease: "easeInOut" }}
        opacity={0.9}
      >
        <motion.path
          d={`M${-100 + i * 220} ${120 + i * 40} Q ${420 + i * 90} ${420 - i * 40} 1540 ${680 - i * 25}`}
          stroke="rgba(0,30,128,0.22)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#softGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0.2],
            opacity: [0, 0.55, 0.15],
          }}
          transition={{
            duration: 6 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.g>
    ))}
  </svg>
</div>

            <div className="max-w-[85rem] mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-16">
                    {/* Tag Label - Hero Style (Normal case as requested) */}
                    <div className="inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-sm bg-white/30 backdrop-blur-md mb-6">
                        <span className="font-bold text-sm text-[#010D3E]">Start for free</span>
                    </div>

                    <h2
                        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text leading-tight uppercase text-center"
                        style={{ fontFamily: "Zuume-Bold", letterSpacing: "0.5px" }}
                    >
                        Ready to find your success?
                    </h2>
                </div>

                {/* Split-Card Content Section (Refracted Cards) */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 max-w-[70rem] mx-auto group">
                    {/* Left Card: Top, Bottom, Left borders with refraction blur */}
                    <div className="relative p-8 md:p-12 border-t border-b md:border-l border-black/10 rounded-t-[30px] md:rounded-tr-none md:rounded-l-[30px] bg-white/40 backdrop-blur-xl text-center md:text-left transition-all duration-500 hover:bg-white/60">
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

                    {/* Right Card: Top, Bottom, Right borders with refraction blur */}
                    <div className="relative p-8 md:p-12 border-b md:border-t md:border-r border-black/10 rounded-b-[30px] md:rounded-bl-none md:rounded-r-[30px] bg-white/40 backdrop-blur-xl text-center md:text-left transition-all duration-500 hover:bg-white/60">
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
