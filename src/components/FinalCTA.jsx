import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import "../styles/final-cta.css";

gsap.registerPlugin(ScrollTrigger);

const palette = [
  ["#FF514E", "#B93042"],
  ["#D9E6EE", "#91A7B6"],
  ["#25252D", "#111117"],
  ["#B8C7D3", "#7B919F"],
  ["#B6FF00", "#7EBC00"],
  ["#D2A1F5", "#8A44C9"],
  ["#B9DCCB", "#659681"],
  ["#F0CA7F", "#B98437"],
  ["#F7F5F0", "#BAC4C8"],
];

const particleTypes = [
  "orb",
  "diamond",
  "triangle",
  "ring",
  "hexagon",
  "orb",
  "blob",
];

const particles = Array.from({ length: 76 }, (_, i) => {
  const color = palette[(i * 5 + 2) % palette.length];

  return {
    id: i,
    type: particleTypes[i % particleTypes.length],
    color: color[0],
    shadow: color[1],
    size: 9 + ((i * 13) % 27),
    left: (i * 47) % 100,
    bottom: -10 + ((i * 19) % 48),
    delay: -((i * 7) % 36) / 10,
    duration: 2.3 + ((i * 11) % 24) / 10,
    drift: ((i * 17) % 71) - 35,
    rotation: ((i * 37) % 160) - 80,
  };
});

export default function FinalCTA() {
  const sectionRef = useRef(null);
  const particleFieldRef = useRef(null);
  const motionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const field = particleFieldRef.current;

    if (!section || !field) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const xTo = gsap.quickTo(field, "x", {
      duration: 0.7,
      ease: "power3.out",
    });

    const yTo = gsap.quickTo(field, "y", {
      duration: 0.7,
      ease: "power3.out",
    });

    const rotateTo = gsap.quickTo(field, "rotation", {
      duration: 0.7,
      ease: "power3.out",
    });

    motionRef.current = { xTo, yTo, rotateTo };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".final-cta-eyebrow, .final-cta-heading, .final-cta-copy, .final-cta-link, .final-cta-footnote",
        {
          y: 32,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        }
      );

      // Bring the entire colourful field up into view on entry.
      gsap.fromTo(
        field,
        {
          y: 150,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".final-cta-particle",
        {
          scale: 0.15,
          autoAlpha: 0,
        },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.65,
          stagger: {
            amount: 0.8,
            from: "random",
          },
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true,
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
      motionRef.current = null;
    };
  }, []);

  function handlePointerMove(event) {
    const section = sectionRef.current;
    const motion = motionRef.current;

    if (!section || !motion) return;

    const rect = section.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    motion.xTo(x * 18);
    motion.yTo(y * 11);
    motion.rotateTo(x * 1.5);
  }

  function handlePointerLeave() {
    const motion = motionRef.current;
    if (!motion) return;

    motion.xTo(0);
    motion.yTo(0);
    motion.rotateTo(0);
  }

  return (
    <section
      ref={sectionRef}
      className="final-cta-section"
      id="final-cta"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label="Start your care journey"
    >
      <header className="final-cta-topline">
        <span>AURA / HEALTH</span>
        <span>THE NEXT CHAPTER STARTS HERE</span>
       
      </header>

      <div className="final-cta-content">
        <p className="final-cta-eyebrow">
          <i />
          GOOD CARE CHANGES EVERYTHING
        </p>

        <h2 className="final-cta-heading">
          Let's make
          <br />
          <span>care human.</span>
        </h2>

        <p className="final-cta-copy">
          Your next step towards a more thoughtful,
          connected healthcare experience starts here.
        </p>

        <a
          href="#doctor-story"
          className="final-cta-link"
        >
          Explore your care journey
          <span>
            <ArrowUpRight size={17} />
          </span>
        </a>
      </div>

      {/* Many independently bouncing shapes, behind the CTA text. */}
      <div
        ref={particleFieldRef}
        className="final-cta-particle-field"
        aria-hidden="true"
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`final-cta-particle final-cta-particle--${particle.type}`}
            style={{
              left: `${particle.left}%`,
              bottom: `${particle.bottom}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              "--particle-color": particle.color,
              "--particle-shadow": particle.shadow,
              "--particle-drift": `${particle.drift}px`,
              "--particle-rotation": `${particle.rotation}deg`,
            }}
          />
        ))}
      </div>

      <footer className="final-cta-bottom">
        <span>MADE AROUND PEOPLE. BUILT FOR REAL LIFE.</span>
        <span>
          KEEP MOVING <ArrowDown size={13} />
        </span>
      </footer>
    </section>
  );
}