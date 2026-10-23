import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CalendarDays,
  HeartPulse,
  Search,
  Video,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    no: "01",
    label: "DISCOVER",
    title: "Find your person.",
    text: "Explore specialists who fit your needs, preferences, and everyday life.",
    note: "Care starts here",
    Icon: Search,
  },
  {
    no: "02",
    label: "BOOK",
    title: "Make time for you.",
    text: "Choose an appointment that works with your schedule, not against it.",
    note: "Your time matters",
    Icon: CalendarDays,
  },
  {
    no: "03",
    label: "CONNECT",
    title: "Talk it through.",
    text: "Meet your doctor in person or online, with the details close at hand.",
    note: "A more human visit",
    Icon: Video,
  },
  {
    no: "04",
    label: "KEEP GOING",
    title: "Feel supported.",
    text: "Keep your next steps clear, from follow-up questions to future visits.",
    note: "Care beyond one visit",
    Icon: HeartPulse,
  },
];

export default function ScrollCards() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const stage = section.querySelector(".journey-stage");
      const cards = gsap.utils.toArray(".journey-card", section);
      const path = section.querySelector(".journey-line-path");
      const dot = section.querySelector(".journey-line-dot");

      if (!stage || !cards.length || !path || !dot) return;

      const pathLength = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });
      gsap.set(dot, { autoAlpha: 0 });

      const isMobile = () =>
        window.matchMedia("(max-width: 760px)").matches;

      // Start with a compact, overlapping fan of cards.
      cards.forEach((card, index) => {
        const desktopX = [-112, -38, 38, 112];
        const mobileX = [-48, -16, 16, 48];
        const desktopY = [18, -17, -17, 18];
        const mobileY = [10, -8, -8, 10];
        const rotations = [-13, -5, 5, 13];

        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: isMobile() ? mobileX[index] : desktopX[index],
          y: isMobile() ? mobileY[index] : desktopY[index],
          rotation: rotations[index],
          scale: index === 0 || index === 3 ? 0.94 : 0.98,
          transformOrigin: "50% 70%",
          zIndex: index + 1,
        });
      });

      const progress = { value: 0 };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // 1. Ivory turns to crimson-orange.
      timeline.to(
        stage,
        {
          backgroundColor: "#D94F38",
          duration: 0.55,
          ease: "none",
        },
        0.02
      );

      // 2. The headline is pulled in opposite directions.
      timeline.to(
        ".journey-title-line--one",
        {
          x: () => -window.innerWidth * 0.72,
          y: "-7vh",
          rotation: -8,
          opacity: 0,
          duration: 0.45,
          ease: "none",
        },
        0.03
      );

      timeline.to(
        ".journey-title-line--two",
        {
          x: () => window.innerWidth * 0.72,
          y: "8vh",
          rotation: 7,
          opacity: 0,
          duration: 0.45,
          ease: "none",
        },
        0.06
      );

      timeline.to(
        ".journey-description",
        { y: -22, opacity: 0, duration: 0.25 },
        0.06
      );

      timeline.to(
        ".journey-eyebrow",
        { color: "rgba(255,255,255,0.78)", duration: 0.3 },
        0.08
      );

      // Oversized background type emerges behind the cards.
      timeline.to(
        ".journey-watermark",
        { y: "-5vh", scale: 1.04, autoAlpha: 1, duration: 0.45 },
        0.12
      );

      // 3. Draw the line and move its dot along the actual SVG path.
      timeline.to(path, { strokeDashoffset: 0, duration: 0.9 }, 0.16);

      timeline.to(
        progress,
        {
          value: 1,
          duration: 0.9,
          onUpdate: () => {
            const point = path.getPointAtLength(
              progress.value * pathLength
            );

            dot.setAttribute("cx", point.x);
            dot.setAttribute("cy", point.y);
            dot.setAttribute(
              "opacity",
              String(Math.min(1, progress.value * 5))
            );
          },
        },
        0.16
      );

      // 4. Fan the cards out, one after another.
      cards.forEach((card, index) => {
        timeline.to(
          card,
          {
            x: () => {
              if (isMobile()) {
                return index % 2 === 0
                  ? -window.innerWidth * 0.225
                  : window.innerWidth * 0.225;
              }

              const spacing = Math.min(
                300,
                (window.innerWidth * 0.88) / 4
              );

              return (index - 1.5) * spacing;
            },

            y: () => {
              if (!isMobile()) return 0;
              return index < 2 ? -104 : 104;
            },

            rotation: 0,
            scale: 1,
            duration: 0.66,
            ease: "power2.out",
          },
          0.24 + index * 0.055
        );
      });

      timeline.to(
        ".journey-footer",
        { y: 0, opacity: 1, duration: 0.25 },
        0.74
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="care-journey"
      className="journey-section"
      aria-label="How care works"
    >
      <div className="journey-stage">
        <div className="journey-topline">
          <span className="journey-eyebrow">
            <i /> CARE, IN A BETTER FLOW
          </span>
          <span className="journey-counter">AURA </span>
        </div>

        <div className="journey-heading-wrap">
          <h2 className="journey-heading">
            <span className="journey-title-line journey-title-line--one">
              CARE,
            </span>
            <span className="journey-title-line journey-title-line--two">
              IN MOTION.
            </span>
          </h2>

          <p className="journey-description">
            A better care journey is made of small steps that feel effortless.
          </p>
        </div>

        <div className="journey-watermark" aria-hidden="true">
          CARE
          <br />
          IN MOTION
        </div>

        <svg
          className="journey-line"
          viewBox="0 0 1440 720"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="journey-line-path"
            d="M -50 430 C 105 230, 180 205, 310 325 S 500 545, 650 395 S 825 120, 965 250 S 1140 515, 1290 385 S 1390 255, 1490 190"
            stroke="#FFF8EF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            className="journey-line-dot"
            cx="-50"
            cy="430"
            r="7"
            fill="#FFF8EF"
          />
        </svg>

        <div className="journey-card-deck">
          {steps.map(({ no, label, title, text, note, Icon }) => (
            <article className="journey-card" key={no}>
              <div className="journey-card-top">
                <span className="journey-card-number">{no} / 04</span>
                <span className="journey-card-icon">
                  <Icon size={21} strokeWidth={1.8} />
                </span>
              </div>

              <span className="journey-card-label">{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>

              <div className="journey-card-bottom">
                <span>{note}</span>
                <a
                  href="#doctors"
                  aria-label={`Explore ${label.toLowerCase()}`}
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="journey-footer">
          <span>GOOD CARE IS A JOURNEY, NOT A CHORE.</span>
          <span>SCROLL TO CONNECT THE STEPS ↓</span>
        </div>
      </div>
    </section>
  );
}