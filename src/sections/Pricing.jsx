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
    if (!sectionRef.current || skipAnimation) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      // Inspired by the example: longer pinned duration + progress-mapped flip
      const totalScroll = window.innerHeight * 3;

      // Layout targets (left/center/right) + slight fan rotations
      const positions = [18, 50, 82];
      const rotations = [-12, 0, 12];

      // Base placement: all cards start centered
      gsap.set(cards, {
        left: "50%",
        top: "45%",
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        transformOrigin: "50% 50%",
        willChange: "transform,left",
      });

      // Raise all cards a bit, raise middle more
      cards.forEach((card, i) => {
        const isMiddle = i === 1;
        gsap.set(card, { y: isMiddle ? -70 : -35 });
      });

      // Initial 3D state: COVER visible first, DETAILS hidden behind
      cards.forEach((card) => {
        const cover = card.querySelector(".pricing-cover");
        const details = card.querySelector(".pricing-details");
        if (!cover || !details) return;

        gsap.set(cover, { rotationY: 0, transformStyle: "preserve-3d" });
        gsap.set(details, { rotationY: 180, transformStyle: "preserve-3d" });
      });

      // Pin the entire section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      // Spread cards in the first viewport scroll
      cards.forEach((card, i) => {
        gsap.to(card, {
          left: `${positions[i]}%`,
          rotation: rotations[i],
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${window.innerHeight}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });

      // Flip to DETAILS (cover -> away, details -> in) with staggered timing
      cards.forEach((card, i) => {
        const cover = card.querySelector(".pricing-cover");
        const details = card.querySelector(".pricing-details");
        if (!cover || !details) return;

        // Example-style stagger windows (tweak as needed)
        const staggerOffset = i * 0.08;
        const startOffset = 1 / 3 + staggerOffset;
        const endOffset = 2 / 3 + staggerOffset;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            if (progress < startOffset) {
              // Before flip: show COVER
              cover.style.transform = `rotateY(0deg)`;
              details.style.transform = `rotateY(180deg)`;
              gsap.set(card, { rotation: rotations[i] });
              return;
            }

            if (progress > endOffset) {
              // After flip: show DETAILS
              cover.style.transform = `rotateY(-180deg)`;
              details.style.transform = `rotateY(0deg)`;
              gsap.set(card, { rotation: 0 });
              return;
            }

            // During flip window
            const t = (progress - startOffset) / (endOffset - startOffset); // 0..1

            // COVER 0 -> -180 (away)
            // DETAILS 180 -> 0 (in)
            const coverRot = -180 * t;
            const detailsRot = 180 - 180 * t;

            // Straighten while flipping
            const cardRot = rotations[i] * (1 - t);

            cover.style.transform = `rotateY(${coverRot}deg)`;
            details.style.transform = `rotateY(${detailsRot}deg)`;
            gsap.set(card, { rotation: cardRot });
          },
        });
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden">
      {/* Scoped CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .pricing-stage {
            position: relative;
            width: 100%;
            height: ${skipAnimation ? 'auto' : '100vh'};
            overflow: ${skipAnimation ? 'visible' : 'hidden'};
            z-index: 10;
            ${skipAnimation ? 'display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; padding: 4rem 0;' : ''}
          }

          .pricing-card {
            position: ${skipAnimation ? 'relative' : 'absolute'};
            width: 320px;
            height: 520px;
            perspective: 1200px;
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

      {/* Heading */}
      <div className="container mx-auto px-4 pt-8 relative z-20">
        <div className="max-w-[820px] mx-auto text-center">
          <h2
            style={{ fontFamily: "Zuume-Bold" }}
            className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text uppercase Zuume-Bold"
          >
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
                {/* COVER (visible first) */}
                {!skipAnimation && (
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
                      <FaStar
                        className={clsx(
                          "text-4xl",
                          t.theme === "dark" ? "text-yellow-300" : "text-yellow-500"
                        )}
                      />
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
                )}

                {/* DETAILS (revealed on scroll) */}
                <div
                  className={clsx(
                    "pricing-face pricing-details p-10 border flex flex-col shadow-2xl",
                    t.theme === "dark"
                      ? "bg-black text-white border-white/10"
                      : "bg-white text-black border-black/10"
                  )}
                  style={skipAnimation ? { transform: 'rotateY(0deg)', position: 'relative' } : {}}
                >
                  <div className="flex items-center justify-between relative">
                    <h3
                      className={clsx(
                        "text-xl font-black uppercase tracking-wide whitespace-nowrap",
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

                  <div className="mt-10 text-6xl font-black tracking-tight">
                    {t.price}
                    {t.price !== "Earn" && (
                      <span className="text-lg font-semibold opacity-60">
                        {" "}
                        / mo
                      </span>
                    )}
                  </div>

                  <button
                    className={clsx(
                      "mt-10 w-full py-4 rounded-2xl font-black transition-transform duration-300 hover:scale-[1.02] whitespace-nowrap",
                      t.theme === "dark"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    )}
                  >
                    {t.cta}
                  </button>

                  <ul className="mt-10 space-y-5">
                    {t.perks.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-3 text-sm leading-relaxed"
                      >
                        <FaStar
                          className={clsx(
                            "mt-1",
                            t.theme === "dark"
                              ? "text-yellow-300"
                              : "text-yellow-500"
                          )}
                        />
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
