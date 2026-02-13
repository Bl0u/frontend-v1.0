import React, { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { FaStar } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export const Pricing = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const tiers = [
    {
      title: "Star Pack",
      price: "$5",
      cta: "Buy 500 Stars",
      highlight: false,
      theme: "light",
      perks: [
        "500 Stars balance",
        "Unlock 5 premium resources",
        "Prioritize requests",
        "Support creators",
      ],
    },
    {
      title: "Pro Bundle",
      price: "$10",
      cta: "Buy 1200 Stars",
      highlight: true,
      theme: "dark",
      perks: [
        "1200 Stars (20% bonus)",
        "Unlock 12 premium resources",
        "Book 1 expert session",
        "Verified student badge",
        "Priority support",
      ],
    },
    {
      title: "Mentor Pass",
      price: "Earn",
      cta: "Apply Now",
      highlight: false,
      theme: "light",
      perks: [
        "Monetize your expertise",
        "Set your own rates",
        "Cash out earnings",
        "Mentor dashboard",
        "Top rated badge",
      ],
    },
  ];

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      // --- scroll budget ---
      // Total experience ~ 3 screens: 1 screen visible + 2 screens scroll
      const totalScroll = window.innerHeight * 2;

      // --- layout targets ---
      const positions = [18, 50, 82]; // left/center/right
      const rotations = [-12, 0, 12];

      // Base set: cards are centered; GSAP manages transform
      gsap.set(cards, {
        left: "50%",
        top: "45%",        // Raised from 46%
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        transformOrigin: "50% 50%",
        willChange: "transform,left",
      });

      // Extra vertical offsets (all slightly up, black one more up)
      cards.forEach((card, i) => {
        const isBlack = i === 1; // Middle tier (Pro Bundle)
        gsap.set(card, { y: isBlack ? -70 : -35 });
      });

      // Pin section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      // Spread cards during first viewport scroll
      cards.forEach((card, i) => {
        gsap.to(card, {
          left: `${positions[i]}%`,
          rotation: rotations[i],
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${window.innerHeight}`, // first screen: spread
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });

      // Flip sequentially (staggered)
      cards.forEach((card, i) => {
        const cover = card.querySelector(".pricing-cover");
        const details = card.querySelector(".pricing-details");
        if (!cover || !details) return;

        // Start state: show cover, hide details
        gsap.set(cover, { rotationY: 0, transformStyle: "preserve-3d" });
        gsap.set(details, { rotationY: 180, transformStyle: "preserve-3d" });

        // Staggered flip window inside pinned duration
        const startPx = window.innerHeight * (0.65 + i * 0.18);
        const endPx = startPx + window.innerHeight * 0.8;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top top+=${startPx}`,
            end: `top top+=${endPx}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Cover rotates away, details rotate in
        tl.to(cover, { rotationY: -180, ease: "none" }, 0)
          .to(details, { rotationY: 0, ease: "none" }, 0)
          // straighten the card while flipping (nice “snap to clean” feeling)
          .to(card, { rotation: 0, ease: "none" }, 0);
      });

      // one refresh after setup
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden">
      {/* Minimal CSS for 3D flip — keep it scoped */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .pricing-stage {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            z-index: 10;
          }
          .pricing-card {
            position: absolute;
            width: 320px;
            height: 520px;
            perspective: 1400px;
            transform-style: preserve-3d;
          }
          .pricing-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
          }
          .pricing-face {
            position: absolute;
            inset: 0;
            backface-visibility: hidden;
            transform-style: preserve-3d;
            border-radius: 28px;
            overflow: hidden;
          }
          .pricing-float {
            width: 100%;
            height: 100%;
            animation: pricingFloat 3.2s ease-in-out infinite;
            will-change: transform;
          }
          @keyframes pricingFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-16px); }
          }
          @media (max-height: 720px) {
            .pricing-card { transform: scale(0.9) !important; transform-origin: center; }
          }
          @media (max-height: 650px) {
            .pricing-card { transform: scale(0.8) !important; }
          }
          @media (prefers-reduced-motion: reduce) {
            .pricing-float { animation: none !important; }
          }
          .drop-shadow-glow {
            filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4));
          }
        `,
        }}
      />

      {/* Heading */}
      <div className="container mx-auto px-4 pt-8 relative z-20">
        <div className="max-w-[820px] mx-auto text-center">
          <h2 style={{ fontFamily: "Zuume-Bold" }} className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text uppercase Zuume-Bold">
            Unlock more with Stars
          </h2>
          <p className="text-xl md:text-2xl text-[#010D3E] mt-4 opacity-80">
            Top up instantly. Unlock premium resources. Keep momentum.
          </p>
        </div>
      </div>

      {/* Pinned stage */}
      <div className="pricing-stage">
        {tiers.map((t, i) => (
          <div
            key={t.title}
            ref={(el) => (cardsRef.current[i] = el)}
            className="pricing-card"
          >
            <div
              className="pricing-float"
              style={{ animationDelay: `${i * 0.18}s` }}
            >
              <div className="pricing-inner">
                {/* COVER (initially visible) */}
                <div
                  className={clsx(
                    "pricing-face pricing-cover flex flex-col items-center justify-center p-10 border",
                    t.theme === "dark"
                      ? "bg-[#001E80] text-white border-white/10"
                      : "bg-white text-black border-black/10"
                  )}
                >
                  <div
                    className={clsx(
                      "w-20 h-20 rounded-full flex items-center justify-center border",
                      t.theme === "dark"
                        ? "bg-white/5 border-white/10"
                        : "bg-black/5 border-black/10"
                    )}
                  >
                    <FaStar className={clsx("text-4xl", t.theme === "dark" ? "text-yellow-300" : "text-yellow-500")} />
                  </div>

                  <h3 className="mt-6 text-4xl font-black tracking-tight uppercase">
                    {t.title}
                  </h3>

                  <div
                    className={clsx(
                      "mt-8 px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase border",
                      t.theme === "dark"
                        ? "text-white/60 border-white/10 bg-white/5"
                        : "text-black/50 border-black/10 bg-black/5"
                    )}
                  >
                    Scroll to flip
                  </div>
                </div>

                {/* DETAILS (flips in) */}
                <div
                  className={clsx(
                    "pricing-face pricing-details p-10 border flex flex-col shadow-2xl",
                    t.theme === "dark"
                      ? "bg-black text-white border-white/10"
                      : "bg-white text-black border-black/10"
                  )}
                >
                  {/* Tag */}
                  <div className="flex items-center justify-between">
                    <h3
                      className={clsx(
                        "text-xl font-black uppercase tracking-wide",
                        t.theme === "dark" ? "text-white" : "text-[#001E80]"
                      )}
                    >
                      {t.title}
                    </h3>

                    {t.highlight && (
                      <div className="text-[10px] px-3 py-1 rounded-full border border-white/15 bg-white/10 uppercase tracking-widest shadow-glow">
                        <motion.span
                          animate={{ backgroundPositionX: '100%' }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] [background-size:200%] text-transparent bg-clip-text font-bold"
                        >
                          Best Value
                        </motion.span>
                      </div>
                    )}
                  </div>

                  <div className="mt-10 text-6xl font-black tracking-tight">
                    {t.price}
                    {t.price !== "Earn" && <span className="text-lg font-semibold opacity-60"> / mo</span>}
                  </div>

                  <button
                    className={clsx(
                      "mt-10 w-full py-4 rounded-2xl font-black transition-transform duration-300 hover:scale-[1.02]",
                      t.theme === "dark"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    )}
                  >
                    {t.cta}
                  </button>

                  <ul className="mt-10 space-y-5">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm leading-relaxed">
                        <FaStar className={clsx("mt-1", t.theme === "dark" ? "text-yellow-300" : "text-yellow-500")} />
                        <span className="opacity-90 font-medium">{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8 text-xs opacity-50">
                    Secure checkout • Cancel anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
