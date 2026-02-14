import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./MorphingCTA.css";
import "../styles/MaskAnimations.css";

gsap.registerPlugin(ScrollTrigger);

const MorphingCTA = ({ skipAnimation = false }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    let removeListeners = () => { };

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(containerRef);

      const featuresWrap = q(".morph-features")[0];
      const searchBar = q(".morph-search-bar")[0];
      const successText = q(".morph-success-text")[0];

      const featureEls = q(".morph-feature");
      const bgEls = q(".morph-feature-bg");
      const contentEls = q(".morph-feature-content");

      const buttonTextItems = q(
        ".morph-search-bar .mas, .morph-search-bar .mask-btn-urban"
      );
      const extraContent = q(".morph-extra-content")[0];
      const lottieWrap = q(".morph-lottie-container")[0];

      if (!featuresWrap || !searchBar || featureEls.length === 0) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Responsive helper: recalculate rem/px on the fly if needed
      const getSizes = () => {
        const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        return {
          rem: remPx,
          circle: 3 * remPx,
          buttonH: 5 * remPx,
          finalWidth: (window.innerWidth < 640 ? 18 : 22) * remPx
        };
      };

      // Start positions (percent inside .morph-features box)
      const startPos = [
        { top: 25, left: 15 },
        { top: 15, left: 50 },
        { top: 25, left: 85 },
        { top: 65, left: 20 },
        { top: 75, left: 75 },
      ];

      const setFinalState = () => {
        const sizes = getSizes();
        gsap.set(featureEls, { autoAlpha: 0, visibility: "hidden" });
        gsap.set(searchBar, {
          autoAlpha: 1,
          visibility: "visible",
          pointerEvents: "auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          width: sizes.finalWidth,
          height: sizes.buttonH,
          y: 100,
          background: "transparent",
          boxShadow: "none",
        });
        gsap.set(buttonTextItems, { autoAlpha: 1 });
        if (successText) gsap.set(successText, { autoAlpha: 1 });
        if (extraContent) gsap.set(extraContent, { autoAlpha: 1, y: 0 });
        if (lottieWrap) gsap.set(lottieWrap, { autoAlpha: 1, scale: 1 });
      };

      if (skipAnimation || prefersReducedMotion) {
        setFinalState();
        return;
      }

      // ---------- INITIAL STATE ----------
      gsap.set(featureEls, {
        position: "absolute",
        autoAlpha: 1,
        visibility: "visible",
        xPercent: -50,
        yPercent: -50,
      });

      featureEls.forEach((el, i) => {
        if (startPos[i]) {
          gsap.set(el, {
            top: `${startPos[i].top}%`,
            left: `${startPos[i].left}%`,
          });
        }
      });

      gsap.set(searchBar, {
        autoAlpha: 0,
        visibility: "visible",
        position: "absolute",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        width: "3rem",
        height: "3rem",
        y: 0,
        pointerEvents: "none",
        background: "var(--gradient-button)", // Reset background
      });

      if (successText) gsap.set(successText, { autoAlpha: 0 });
      gsap.set(buttonTextItems, { autoAlpha: 0 });
      if (extraContent) gsap.set(extraContent, { autoAlpha: 0, y: 20 });
      if (lottieWrap) gsap.set(lottieWrap, { autoAlpha: 0, scale: 0.8 });

      // ---------- AUTONOMOUS TIMELINE ----------
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
        invalidateOnRefresh: true,
      });

      tl.to(featureEls, {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        duration: 0.24,
        stagger: 0.015,
        ease: "none",
      }, 0);

      tl.to(bgEls, {
        width: () => getSizes().circle,
        height: () => getSizes().circle,
        borderRadius: 999,
        borderWidth: () => 0.35 * getSizes().rem,
        duration: 0.24,
        stagger: 0.015,
        ease: "none",
      }, 0);

      tl.to(contentEls, { autoAlpha: 0, duration: 0.05, stagger: 0.006, ease: "none" }, 0.03);
      tl.to(featureEls, { autoAlpha: 0, duration: 0.08, ease: "none" }, 0.18);
      tl.to(searchBar, { autoAlpha: 1, pointerEvents: "auto", duration: 0.07, ease: "none" }, 0.18);

      tl.to(searchBar, {
        width: () => getSizes().finalWidth,
        height: () => getSizes().buttonH,
        y: 100,
        duration: 0.28,
        ease: "power4.inOut",
        immediateRender: false,
      }, 0.23);

      tl.to(buttonTextItems, { autoAlpha: 1, duration: 0.06, ease: "power2.out" }, ">-=0.02");
      tl.to(searchBar, { background: "transparent", boxShadow: "none", duration: 0.03 }, "<");

      if (successText) tl.to(successText, { autoAlpha: 1, duration: 0.13 }, "<");
      if (extraContent) tl.to(extraContent, { autoAlpha: 1, y: 0, duration: 0.13 }, "<+=0.03");
      if (lottieWrap) tl.to(lottieWrap, { autoAlpha: 1, scale: 1, duration: 0.21 }, "<");
      tl.to({}, { duration: 0.1 });

      // ---------- PIN + TRIGGER ----------
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=50%", // Reduced from 100% to release faster after animation
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        // pinReparent removed to fix "white blank" issue
        invalidateOnRefresh: true,

        onEnter: () => {
          // Play once automatically on entry
          if (tl.progress() === 0) tl.play(0);
        },

        onLeave: () => {
          tl.progress(1);
        },

        onLeaveBack: () => {
          // No reset here: allow the animation to stay in its final state
          // This prevents the section from "rolling back" to the bubbles when scrolling up
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);

      removeListeners = () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
        st?.kill();
      };
    }, containerRef);

    return () => {
      removeListeners();
      ctx.revert();
    };
  }, [skipAnimation]);

  return (
    <section className="morph-cta-container" ref={containerRef}>
      {/* --- 3D Decorative Objects (Star & Spring) --- */}
      <motion.img
        src="/assets/star.png"
        alt="Star 3D"
        width={360}
        className="absolute hidden md:block"
        style={{
          left: "5%",
          top: "5%",
          position: "absolute",
          pointerEvents: "none",
          opacity: 0.9,
        }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src="/assets/spring.png"
        alt="Spring 3D"
        width={360}
        className="absolute hidden md:block"
        style={{
          right: "5%",
          bottom: "10%",
          position: "absolute",
          pointerEvents: "none",
          opacity: 0.9,
        }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* --- Lottie Animation (Revealed after morph) --- */}
      <div className="morph-lottie-container">
        <DotLottieReact
          src="https://lottie.host/5f9926e9-1817-4421-8b72-707662e1984a/VvIJVUf9g5.lottie"
          loop
          autoplay
        />
      </div>

      {/* Header Text */}
      <div className="morph-header">
        <h2
          className="text-center text-4xl md:text-6xl font-bold bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text drop-shadow-sm mb-4"
          style={{ fontFamily: "Zuume-Bold", letterSpacing: "0.5px" }}
        >
          Ready to find your...{" "}
          <span className="morph-success-text" style={{ opacity: 0 }}>
            Success
          </span>
        </h2>
      </div>

      <div className="morph-features">
        <div className="morph-feature">
          <div className="morph-feature-bg"></div>
          <div className="morph-feature-content">
            <p>MENTOR</p>
          </div>
        </div>

        <div className="morph-feature">
          <div className="morph-feature-bg"></div>
          <div className="morph-feature-content">
            <p>PARTNER</p>
          </div>
        </div>

        <div className="morph-feature">
          <div className="morph-feature-bg"></div>
          <div className="morph-feature-content">
            <p>RESOURCES</p>
          </div>
        </div>

        <div className="morph-feature">
          <div className="morph-feature-bg"></div>
          <div className="morph-feature-content">
            <p>PRO-BONO MENTORSHIPS</p>
          </div>
        </div>

        <div className="morph-feature">
          <div className="morph-feature-bg"></div>
          <div className="morph-feature-content">
            <p>AI ASSISTANT</p>
          </div>
        </div>

        {/* Morph target */}
        <div className="morph-search-bar mask-container-urban">
          <span className="mas">Sign up for free</span>
          <Link to="/register" className="mask-btn-urban">
            Sign up for free
          </Link>
        </div>

        {/* Extra content */}
        <div className="morph-extra-content">
          <p>Join thousands of students and build your future.</p>
        </div>
      </div>
    </section>
  );
};

export default MorphingCTA;
