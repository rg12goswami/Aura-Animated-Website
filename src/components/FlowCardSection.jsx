import { useEffect, useRef, useId } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  HeartPulse,
  Video,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FlowCardSection() {
  const sectionRef = useRef(null);
  const pathId = useId().replace(/:/g, "");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const stage = section.querySelector(".flow-entry-stage");
      const line = section.querySelector(".flow-entry-line-path");
      const dot = section.querySelector(".flow-entry-dot");
      const card = section.querySelector(".flow-entry-card");
      const textPath = section.querySelector(".flow-entry-text-path");
      const titleOne = section.querySelector(".flow-title-row--one");
      const titleTwo = section.querySelector(".flow-title-row--two");
      const copy = section.querySelector(".flow-entry-copy");

      if (!stage || !line || !dot || !card || !textPath) return;

      const pathLength = line.getTotalLength();

      gsap.set(line, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.set(dot, { autoAlpha: 0 });

      gsap.set(textPath, {
        attr: { startOffset: "-8%" },
      });

      // Card begins on the right, partially outside the visual center.
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x: () =>
          window.innerWidth *
          (window.innerWidth < 760 ? 0.27 : 0.34),
        y: () => window.innerHeight * 0.035,
        rotation: 8,
        scale: 0.82,
        transformOrigin: "50% 50%",
        width: () =>
          Math.min(
            window.innerWidth *
              (window.innerWidth < 760 ? 0.82 : 0.32),
            360
          ),
      });

      // Intro text reveals when the section enters the viewport.
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        })
        .from(section.querySelector(".flow-entry-kicker"), {
          y: 14,
          opacity: 0,
          duration: 0.65,
        })
        .from(
          [titleOne, titleTwo],
          {
            yPercent: 115,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
          },
          "-=0.25"
        )
        .from(
          copy,
          { y: 18, opacity: 0, duration: 0.6 },
          "-=0.42"
        );

      const lineProgress = { value: 0 };
      const textProgress = { value: 0 };

      const scrollTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      });

      // 1. Ivory changes into crimson-orange.
      scrollTl.to(
        stage,
        {
          backgroundColor: "#D94F38",
          duration: 0.48,
        },
        0.03
      );

      scrollTl.to(
        section.querySelector(".flow-entry-kicker"),
        {
          color: "rgba(255,248,239,0.72)",
          duration: 0.35,
        },
        0.08
      );

      // 2. Headline gets swept in opposite directions.
      scrollTl.to(
        titleOne,
        {
          x: () => -window.innerWidth * 0.78,
          y: "-10vh",
          rotation: -7,
          opacity: 0,
          duration: 0.42,
        },
        0.06
      );

      scrollTl.to(
        titleTwo,
        {
          x: () => window.innerWidth * 0.76,
          y: "8vh",
          rotation: 6,
          opacity: 0,
          duration: 0.45,
        },
        0.09
      );

      scrollTl.to(
        copy,
        {
          x: -70,
          y: -18,
          opacity: 0,
          duration: 0.25,
        },
        0.08
      );

      // 3. Draw the line and move the dot along its real SVG path.
      scrollTl.to(
        line,
        { strokeDashoffset: 0, duration: 0.82 },
        0.12
      );

      scrollTl.to(
        lineProgress,
        {
          value: 1,
          duration: 0.82,
          onUpdate: () => {
            const point = line.getPointAtLength(
              lineProgress.value * pathLength
            );

            dot.setAttribute("cx", point.x);
            dot.setAttribute("cy", point.y);
            dot.setAttribute(
              "opacity",
              String(Math.min(1, lineProgress.value * 5))
            );
          },
        },
        0.12
      );

      // 4. Typography travels along a parallel curved path.
      scrollTl.to(
        textProgress,
        {
          value: 1,
          duration: 0.82,
          onUpdate: () => {
            textPath.setAttribute(
              "startOffset",
              `${-8 + textProgress.value * 48}%`
            );
          },
        },
        0.16
      );

      // 5. Card lifts out from the side, reaches the center,
      // straightens, and expands to become the primary focal point.
      scrollTl.to(
        card,
        {
          x: 0,
          y: () => (window.innerWidth < 760 ? -8 : -16),
          rotation: 0,
          scale: 1,
          width: () =>
            Math.min(
              window.innerWidth *
                (window.innerWidth < 760 ? 0.88 : 0.68),
              window.innerWidth < 760 ? 430 : 660
            ),
          duration: 0.74,
          ease: "power2.out",
        },
        0.23
      );

      scrollTl.to(
        section.querySelector(".flow-entry-card-orbit"),
        {
          rotation: 28,
          scale: 1.12,
          opacity: 0.75,
          duration: 0.74,
        },
        0.23
      );

      scrollTl.to(
        section.querySelector(".flow-entry-card-caption"),
        { y: 0, opacity: 1, duration: 0.2 },
        0.74
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flow-entry-section"
      id="care-flow"
      aria-label="A more human way to find care"
    >
      <div className="flow-entry-stage">
        <div className="flow-entry-topline">
          <span className="flow-entry-kicker">
            <i /> CARE SHOULD FEEL CLOSER
          </span>
          <span className="flow-entry-index">AURA / 02</span>
        </div>

        <div className="flow-entry-heading">
          <h2>
            <span className="flow-title-mask">
              <span className="flow-title-row flow-title-row--one">
                CARE THAT
              </span>
            </span>
            <span className="flow-title-mask">
              <span className="flow-title-row flow-title-row--two">
                FOLLOWS YOU.
              </span>
            </span>
          </h2>

          <p className="flow-entry-copy">
            Less friction. More human moments. A care journey that moves
            at your pace.
          </p>
        </div>

        <div className="flow-entry-watermark" aria-hidden="true">
          MADE AROUND YOU.
        </div>

        {/* Flowing line + moving typography */}
        <svg
          className="flow-entry-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="flow-entry-line-path"
            d="M -70 640 C 90 430, 180 455, 300 565 S 485 735, 590 540 S 700 220, 850 355 S 1040 665, 1155 505 S 1320 265, 1510 350"
            stroke="#FFF8EF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          <circle
            className="flow-entry-dot"
            cx="-70"
            cy="640"
            r="6"
            fill="#FFF8EF"
          />

          <path
            id={`flow-entry-type-path-${pathId}`}
            d="M -70 612 C 90 402, 180 427, 300 537 S 485 707, 590 512 S 700 192, 850 327 S 1040 637, 1155 477 S 1320 237, 1510 322"
            fill="none"
          />

          <text className="flow-entry-path-type">
            <textPath
              className="flow-entry-text-path"
              href={`#flow-entry-type-path-${pathId}`}
              startOffset="-8%"
            >
              CARE THAT FOLLOWS YOU · BETTER CARE, LESS WAIT · CARE THAT
              FOLLOWS YOU ·
            </textPath>
          </text>
        </svg>

        <div className="flow-entry-card-orbit" aria-hidden="true" />

        {/* The single card that travels from side to center */}
        <article className="flow-entry-card">
          <div className="flow-card-top">
            <span className="flow-card-label">
              <HeartPulse size={15} /> YOUR NEXT STEP
            </span>
          
          </div>

          <div className="flow-card-main">
            <div className="flow-card-copy-block">
              <span className="flow-card-overline">
                A LITTLE MORE YOU-TIME
              </span>

              <h3>Meet care on your terms.</h3>

              <p>
                Find the right person, choose your time, and feel ready
                for what comes next.
              </p>
            </div>

            <div className="flow-appointment-preview">
              <div className="flow-doctor-row">
                <div className="flow-doctor-avatar">AM</div>

                <div>
                  <strong>Dr. Anika Mehta</strong>
                  <span>Family physician</span>
                </div>

                <span
                  className="flow-doctor-status"
                  aria-label="Demo availability indicator"
                />
              </div>

              <div className="flow-appointment-details">
                <span>
                  <CalendarDays size={15} /> Tue, 10:30 AM
                </span>
                <span>
                  <Video size={15} /> Online visit
                </span>
              </div>

              <a className="flow-card-cta" href="#doctors">
                Explore care <ArrowUpRight size={17} />
              </a>
            </div>
          </div>

          <div className="flow-card-bottom">
            <span>
              <Clock3 size={14} /> Built around real life
            </span>
            <span>CARE, MADE PERSONAL ↗</span>
          </div>
        </article>

        <div className="flow-entry-card-caption">
          <span>
            ONE GOOD STEP CAN CHANGE THE FEELING OF THE WHOLE JOURNEY.
          </span>
          <span>KEEP GOING ↓</span>
        </div>
      </div>
    </section>
  );
}