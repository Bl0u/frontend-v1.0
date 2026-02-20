import React, { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { FaStar } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export const Pricing = ({ skipAnimation = false }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const tiers = [
    {
      title: "Star Pack",
      price: "250 LE",
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
      price: "500 LE",
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
      title: "Star Vault",
      price: "1,000 LE",
      cta: "Buy 3000 Stars",
      highlight: false,
      theme: "light",
      perks: [
        "3000 Stars (50% bonus)",
        "Unlock 30 premium resources",
        "Book 3 expert sessions",
        "Verified student badge",
        "Priority support",
      ],
    },
  ];

  useLayoutEffect(() => {
    // If animations are skipped, ensure all existing ScrollTriggers for this section are killed
    if (skipAnimation) {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === sectionRef.current) st.kill();
      });
      return;
    }

    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      const totalScroll = window.innerHeight * 3;
      const positions = [25, 50, 75];
      const rotations = [-12, 0, 12];

      gsap.set(cards, {
        left: "50%",
        top: "38%",
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        transformOrigin: "50% 50%",
        willChange: "transform,left",
      });

      cards.forEach((card, i) => {
        const isMiddle = i === 1;
        gsap.set(card, {
          y: isMiddle ? -20 : 0,
          zIndex: isMiddle ? 100 : 1
        });
      });



      cards.forEach((card) => {
        const cover = card.querySelector(".pricing-cover");
        const details = card.querySelector(".pricing-details");
        if (!cover || !details) return;
        gsap.set(cover, { rotationY: 0, transformStyle: "preserve-3d" });
        gsap.set(details, { rotationY: 180, transformStyle: "preserve-3d" });
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" }
      });

      // Spread phase
      cards.forEach((card, i) => {
        tl.to(card, {
          left: `${positions[i]}%`,
          rotation: rotations[i],
          duration: 0.8
        }, 0);
      });

      // Flip phase
      cards.forEach((card, i) => {
        const cover = card.querySelector(".pricing-cover");
        const details = card.querySelector(".pricing-details");
        if (!cover || !details) return;

        tl.to(cover, { rotationY: -180, duration: 0.6 }, 0.5 + i * 0.1)
          .to(details, { rotationY: 0, duration: 0.6 }, 0.5 + i * 0.1)
          .to(card, { rotation: 0, duration: 0.6 }, 0.5 + i * 0.1);
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400", // Reduced from 1200 (approx 50% faster release)
        pin: true,
        pinSpacing: true,
        onEnter: () => tl.play(),
        // Replay if user scrolls back up and down
        onEnterBack: () => tl.play(),
        invalidateOnRefresh: true,
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [skipAnimation]);

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .pricing-stage {
            position: relative;
            width: 100%;
            height: ${skipAnimation ? 'auto' : '100vh'};
            overflow: ${skipAnimation ? 'visible' : 'hidden'};
            z-index: 10;
            margin-top: -3rem;
            ${skipAnimation ? 'display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; padding: 4rem 0 8rem 0;' : ''}
          }

          .pricing-card {
            position: ${skipAnimation ? 'relative' : 'absolute'};
            width: 320px;
            height: 450px;
            perspective: 1200px;
            transform-style: preserve-3d;
            ${skipAnimation ? 'left: auto !important; top: auto !important; flex-shrink: 0;' : ''}
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
            animation: pricingFloat 3.0s ease-in-out infinite;
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

      <div className="container mx-auto px-4 pt-2 relative z-20">
        <div className="max-w-[820px] mx-auto text-center">
          <h2
            style={{ fontFamily: "Zuume-Bold", letterSpacing: "0.5px" }}
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text uppercase Zuume-Bold"
          >
            Unlock more with Stars
          </h2>
          <p className="text-[16px] text-[#010D3E] mt-4 opacity-80">
            Top up instantly. Unlock premium resources. Keep momentum.
          </p>
        </div>
      </div>

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
                {!skipAnimation && (
                  <div
                    className={clsx(
                      "pricing-face pricing-cover flex flex-col items-center justify-center p-8 border",
                      t.theme === "dark"
                        ? "bg-[#1A1A1A] text-white border-white/10"
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
                      <FaStar
                        className={clsx(
                          "text-4xl",
                          t.theme === "dark" ? "text-yellow-300" : "text-yellow-500"
                        )}
                      />
                    </div>

                    <h3 className="mt-4 text-4xl font-black tracking-tight uppercase">
                      {t.title}
                    </h3>

                    <div
                      className={clsx(
                        "mt-4 px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase border",
                        t.theme === "dark"
                          ? "text-white/60 border-white/10 bg-white/5"
                          : "text-black/50 border-black/10 bg-black/5"
                      )}
                    >
                      Scroll to flip
                    </div>
                  </div>
                )}

                <div
                  className={clsx(
                    "pricing-face pricing-details p-8 border flex flex-col shadow-2xl",
                    t.theme === "dark"
                      ? "bg-black text-white border-white/10"
                      : "bg-white text-black border-black/10"
                  )}
                  style={skipAnimation ? { transform: 'rotateY(0deg)', position: 'relative' } : {}}
                >
                  <div className="flex items-center justify-between relative">
                    <h3
                      className={clsx(
                        "text-[18px] font-black uppercase tracking-wide whitespace-nowrap",
                        t.theme === "dark" ? "text-white" : "text-[#001E80]"
                      )}
                    >
                      {t.title}
                    </h3>

                    {t.highlight && (
                      <div className="text-[10px] px-3 py-1 rounded-full border border-white/15 bg-white/10 uppercase tracking-widest shadow-glow absolute -right-4 top-1/2 -translate-y-1/2 shrink-0">
                        <motion.span
                          animate={{ backgroundPositionX: "100%" }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] [background-size:200%] text-transparent bg-clip-text font-bold"
                        >
                          Best Value
                        </motion.span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-[34px] font-black tracking-tight">
                    {t.price}
                  </div>

                  <button
                    className={clsx(
                      "mt-4 w-full py-4 rounded-2xl text-[16px] font-black transition-transform duration-300 hover:scale-[1.02] whitespace-nowrap",
                      t.theme === "dark"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    )}
                  >
                    {t.cta}
                  </button>

                  <ul className="mt-4 space-y-2">
                    {t.perks.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-3 text-[14px] leading-relaxed"
                      >
                        <FaStar
                          className={clsx(
                            "mt-1 shrink-0",
                            t.theme === "dark"
                              ? "text-yellow-300"
                              : "text-yellow-500"
                          )}
                        />
                        <span className="opacity-90 font-medium">{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-2 text-[12px] opacity-50">
                    Secure checkout • Cancel anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section >
  );
};
