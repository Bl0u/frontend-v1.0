import React, { useLayoutEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Centralized Resources",
    points: [
      "Access university-specific threads and educational context easily.",
      "Find professor-specific past exams and weekly lecture notes.",
      "Dedicated sections for IELTS, TOEFL, and internship experiences.",
      "Stay updated with anything related to your college or university.",
    ],
    lottieSrc:
      "https://lottie.host/37a092d5-4119-417c-93cc-9b90aa613d03/5ruDWwNrNb.lottie",
    color: "#ffffff",
    textColor: "#010D3E",
    isReversed: false,
  },
  {
    title: "Partnership",
    points: [
      "Join the Partnership Pool to find collaborators with matching skills.",
      "Post specific project needs, like a graduation project MVP in 5 weeks.",
      "Find study buddies for specific programming languages or subjects.",
      "Browse profiles to find partners who share your exact interests.",
    ],
    lottieSrc:
      "https://lottie.host/e0164715-5f37-4b7d-afbb-724b5b60addc/5p9vgoA7NI.lottie",
    color: "#F8F9FF",
    textColor: "#010D3E",
    isReversed: true,
  },
  {
    title: "Mentorship",
    points: [
      "Access raw, experience-based advice from those who've reached your goals.",
      "Structured guidance for career roadmaps and technical excellence.",
      "Mock interviews, portfolio reviews, and seasoned perspectives.",
      "Efficiently find mentors who are exactly where you want to be.",
    ],
    lottieSrc:
      "https://lottie.host/0de53125-14f7-431e-b1f8-2334708b6e49/cIYILQexyA.lottie",
    color: "#f0f2ff",
    textColor: "#010D3E",
    isReversed: false,
  },
  {
    title: "Chatting",
    points: [
      "Real-time communication directly with your project partners.",
      "Direct messaging with mentors for instant feedback and guidance.",
      "Integrated file sharing and organized project channels.",
      "Stay synchronized with every member of your academic team.",
    ],
    lottieSrc:
      "https://lottie.host/ad64e9fd-131f-4a0c-90d4-fd09a0b7689f/KGtz7770Y4.lottie",
    color: "#ffffff",
    textColor: "#010D3E",
    isReversed: true,
  },
  {
    title: "AI Discovery Assistant",
    points: [
      "Smart matching logic to find best mentors, partners, and resources.",
      "Share your specific requirements and get precise recommendations.",
      "Interactive assistant acts as your academic and professional co-pilot.",
      "Bridge the gap between your needs and the platform's vast ecosystem.",
    ],
    lottieSrc:
      "https://lottie.host/7771dde5-66df-4a0f-9e35-21a40e1d198b/LtPEHK4x1o.lottie",
    color: "#ffffff",
    textColor: "#010D3E",
    isReversed: false,
    isAI: true,
  },
];

const Card = React.forwardRef(function Card(
  { i, title, points, lottieSrc, color, textColor, isReversed, skipAnimation },
  ref
) {
  return (
    <div
      ref={ref}
      className={
        skipAnimation
          ? "relative my-8 flex items-start justify-center w-full"
          : "absolute top-0 left-0 w-full flex items-start justify-center"
      }
      style={{ zIndex: 10 + i }}
    >
      <div
        className="relative h-[550px] w-[90%] md:w-[85%] lg:w-[75%] rounded-[40px] p-8 md:p-12 lg:p-16 origin-top shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/20"
        style={{
          backgroundColor: color,
          // Stack offset (visual depth) — NOT the header spacing
          top: skipAnimation ? "0px" : `calc(18px + ${i * 14}px)`,
        }}
      >
        <div
          className={`flex flex-col ${
            isReversed ? "md:flex-row-reverse" : "md:flex-row"
          } items-center h-full gap-8 md:gap-12 relative z-10`}
        >
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
            <h3
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 pb-2"
              style={{ fontFamily: "Zuume-Bold", color: textColor }}
            >
              {title}
            </h3>

            <ul className="space-y-4">
              {points.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-lg md:text-xl opacity-90 leading-tight"
                  style={{ color: textColor }}
                >
                  <span
                    className={`mt-2 h-2 w-2 rounded-full shrink-0 ${
                      textColor === "#ffffff" ? "bg-white" : "bg-[#010D3E]"
                    }`}
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-1/2 h-full flex items-center justify-center relative">
            <div className="w-full max-w-[450px] aspect-square">
              <DotLottieReact src={lottieSrc} loop autoplay />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const SolutionSection = ({ skipAnimation = false }) => {
  const container = useRef(null);
  const stageRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    if (skipAnimation) return;
    if (!container.current || !stageRef.current || !headerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      if (!cards.length) return;

      // Measure header and push stage down automatically
      const headerH = headerRef.current.offsetHeight;

      // Set stage top offset (so cards don't start under header)
      gsap.set(stageRef.current, {
        paddingTop: headerH + 16, // extra breathing room
      });

      // Use "available height" below header for the pinned viewport stage
      const availableH = Math.max(window.innerHeight - headerH, 400);
      gsap.set(stageRef.current, { height: availableH });

      // Base states
      gsap.set(cards, { transformOrigin: "50% 0%" });
      gsap.set(cards, { yPercent: 110, autoAlpha: 0, scale: 1 });
      gsap.set(cards[0], { yPercent: 0, autoAlpha: 1 });

      const STACK_SCALE_STEP = 0.05;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${cards.length * 520}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "power2.out" },
      });

      for (let i = 1; i < cards.length; i++) {
        const card = cards[i];

        tl.to(card, { yPercent: 0, autoAlpha: 1, duration: 1 }, `+=0.18`);

        for (let j = 0; j < i; j++) {
          const prev = cards[j];
          const scaleValue = 1 - (i - j) * STACK_SCALE_STEP;
          tl.to(prev, { scale: scaleValue, duration: 1 }, "<");
        }
      }

      // Recalculate on refresh (responsive / fonts / lotties)
      ScrollTrigger.addEventListener("refreshInit", () => {
        const h = headerRef.current?.offsetHeight ?? 0;
        gsap.set(stageRef.current, { paddingTop: h + 16 });
        gsap.set(stageRef.current, {
          height: Math.max(window.innerHeight - h, 400),
        });
      });

      ScrollTrigger.refresh();
    }, container);

    return () => ctx.revert();
  }, [skipAnimation]);

  return (
    <section
      ref={container}
      className={`relative bg-[#EAEEFE] overflow-hidden isolate ${
        skipAnimation ? "py-20" : "min-h-screen"
      }`}
    >
      {/* Background blobs (tamed + behind) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-12%] left-[-15%] w-[720px] h-[720px] bg-blue-200/20 rounded-full blur-[90px]" />
        <div className="absolute bottom-[-12%] right-[-15%] w-[720px] h-[720px] bg-purple-200/18 rounded-full blur-[90px]" />
      </div>

      {/* Header (now reserves real space, no overlap) */}
      <div
        ref={headerRef}
        className={`relative z-40 pt-6 pb-4 flex flex-col items-center justify-center text-center bg-[#EAEEFE]/70 backdrop-blur-sm`}
      >
        <div className="px-6 pointer-events-auto">
          <h2
            className="text-5xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text leading-tight"
            style={{ fontFamily: "Zuume-Bold" }}
          >
            What we offer
          </h2>

          <p className="text-base md:text-lg text-[#010D3E]/80 max-w-2xl mx-auto mt-1">
            A complete ecosystem designed to empower your academic journey and
            professional growth.
          </p>
        </div>
      </div>

      {/* Stage (pinned by GSAP, starts below header automatically) */}
      <div ref={stageRef} className={`${skipAnimation ? "" : "relative"}`}>
        {features.map((feature, i) => (
          <Card
            key={`f_${i}`}
            i={i}
            {...feature}
            ref={(el) => (cardsRef.current[i] = el)}
            skipAnimation={skipAnimation}
          />
        ))}
      </div>
    </section>
  );
};
