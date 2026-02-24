import React from "react";
import { Link } from "react-router-dom";
import { LiquidButton } from "../components/LiquidButton";
import { motion } from "framer-motion";
import { FaBookOpen, FaUsers, FaChevronRight } from "react-icons/fa";

export const CallToAction = () => {
  return (
    <section className="relative w-full bg-[#FAFAFA] py-16 px-4 md:py-32 overflow-hidden">
      {/* Background Layers */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-50/20 rounded-full blur-[140px] -translate-y-1/2 pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gray-200/20 rounded-full blur-[140px] translate-y-1/2 pointer-events-none z-0" />

      {/* SVG Rays */}
      {/* SVG Rays */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-multiply">
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
              <feGaussianBlur stdDeviation="1.25" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,30,128,0)" />
              <stop offset="50%" stopColor="rgba(0,30,128,0.22)" />
              <stop offset="100%" stopColor="rgba(0,30,128,0)" />
            </linearGradient>
          </defs>

          {[...Array(8)].map((_, i) => (
            <motion.g
              key={i}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [0, 18, 0],
                y: [0, -10, 0],
                opacity: [0, 1, 0.8],
              }}
              transition={{
                duration: 9 + i * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.path
                d={`M${-200 + i * 250} ${100 + i * 50}
      Q ${400 + i * 100} ${400 - i * 50}
      ${1600} ${700 - i * 30}`}
                stroke="url(#rayGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#softGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 0.25],
                  opacity: [0, 0.5, 0.15],
                }}
                transition={{
                  duration: 6 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.g>
          ))}
        </svg>
      </div>

      <div className="max-w-[85rem] mx-auto relative z-10">
        {/* Header Section - Tighter Gap */}
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <div className="relative group p-[1.5px] rounded-xl overflow-hidden mb-4">
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
                <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="currentColor" />
              </svg>
              <span className="font-bold text-sm text-[#010D3E]">Start for free</span>
            </div>
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-[48px] font-bold tracking-tight bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text leading-tight uppercase text-center"
            style={{ fontFamily: "Zuume-Bold", letterSpacing: "0.2px" }}
          >
            Ready to find your success?
          </h2>
        </div>

        {/* Glass Card Container with Interior Button */}
        <div className="relative max-w-[70rem] mx-auto">
          <div className="relative grid grid-cols-1 md:grid-cols-2 bg-gradient-to-b from-white/70 to-white/30 backdrop-blur-2xl rounded-[40px] border border-white/40 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] overflow-hidden">

            {/* Left Column: Resources */}
            <motion.div
              whileHover={{ y: -2 }}
              className="relative p-8 md:p-12 flex flex-col items-center md:items-start group transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#001E80] transition-transform duration-500 group-hover:rotate-6">
                  <FaBookOpen size={20} />
                </div>
                <h3 className="text-2xl font-bold text-[#011440] uppercase tracking-wide" style={{ fontFamily: "Zuume-Bold" }}>Resources</h3>
              </div>

              <p className="text-lg text-[#010D3E]/70 leading-relaxed font-medium text-center md:text-left">
                Find the material to prepare efficiently for your exams from earlier tests and through the contribution of others' journeys.{' '}
                <Link to="/resources" className="inline-flex items-center text-[#001E80] hover:translate-x-1 transition-transform align-middle">
                  <FaChevronRight size={14} className="ml-1" />
                </Link>
              </p>
            </motion.div>

            {/* Mid Divider */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px bg-[#010D3E]/10 h-[60%] z-20" />

            {/* Right Column: Partners */}
            <motion.div
              whileHover={{ y: -2 }}
              className="relative p-8 md:p-12 border-t md:border-t-0 border-[#010D3E]/5 flex flex-col items-center md:items-start group transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#001E80] transition-transform duration-500 group-hover:-rotate-6">
                  <FaUsers size={20} />
                </div>
                <h3 className="text-2xl font-bold text-[#011440] uppercase tracking-wide" style={{ fontFamily: "Zuume-Bold" }}>Partners</h3>
              </div>

              <p className="text-lg text-[#010D3E]/70 leading-relaxed font-medium text-center md:text-left">
                Find someone to help you out or be the one to help others. Share and gain knowledge with your peers.{' '}
                <Link to="/partners" className="inline-flex items-center text-[#001E80] hover:translate-x-1 transition-transform align-middle">
                  <FaChevronRight size={14} className="ml-1" />
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Primary CTA Button Row - Centered below cards but within main container */}
          <div className="flex justify-center mt-12 pb-10">
            <LiquidButton
              to="/register"
              text="Register for free"
              className="shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
