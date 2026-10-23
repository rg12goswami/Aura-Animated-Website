import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight,BookOpen } from "lucide-react";
import "../styles/depth-journey.css";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { first: "Find", second: "your person.", color: "coral" },
  { first: "Make", second: "space to talk.", color: "sage" },
  { first: "Feel", second: "understood.", color: "lilac" },
  { first: "Keep", second: "moving forward.", color: "amber" },
];

const palette = [
  ["#FF514E", "#B93042"],
  ["#D9E6EE", "#91A7B6"],
  ["#25252D", "#111117"],
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
    bottom: 2 + ((i * 19) % 42),
    delay: -((i * 7) % 36) / 10,
    duration: 2.3 + ((i * 11) % 24) / 10,
    drift: ((i * 17) % 71) - 35,
    rotation: ((i * 37) % 160) - 80,
  };
});

export default function DepthJourney() {
  const sectionRef = useRef(null);
  const particleMotionRef = useRef(null);
const homeTransitionRef = useRef(null);
const homeTransitionLock = useRef(false);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const stage = section.querySelector(".depth-stage");
      const staircase = section.querySelector(".depth-staircase");
      const cards = gsap.utils.toArray(".depth-step", section);
      const contents = gsap.utils.toArray(
        ".depth-step-content",
        section
      );
      const fragments = gsap.utils.toArray(
        ".depth-paper-piece",
        section
      );
      const headline = section.querySelector(".depth-final-message");
      const cardHeader = section.querySelector(".depth-topline");
      const cardFooter = section.querySelector(".depth-footer");
      const log = section.querySelector(".depth-letter-target");

      const cta = section.querySelector(".depth-cta-layer");
      const ctaText = gsap.utils.toArray(
        ".depth-cta-eyebrow, .depth-cta-heading, .depth-cta-copy, .depth-cta-link",
        section
      );
      const particleNodes = gsap.utils.toArray(
        ".depth-cta-particle",
        section
      );
      const particleField = section.querySelector(
        ".depth-cta-particle-field"
      );

      if (
        !stage ||
        !staircase ||
        cards.length !== 4 ||
        fragments.length !== 80 ||
        !headline ||
        !cta ||
        !particleField
      ) {
        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reducedMotion) {
        gsap.set(cards, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotationY: 0,
        });
        gsap.set(headline, { autoAlpha: 1, y: 0 });
        gsap.set(cta, { autoAlpha: 1 });
        gsap.set(ctaText, { autoAlpha: 1, y: 0 });
        gsap.set(particleNodes, { autoAlpha: 1, scale: 1 });
        return;
      }

      gsap.set(cards, {
        autoAlpha: 0,
        x: (i) => (i % 2 === 0 ? -45 : 45),
        y: 24,
        scale: 0.96,
        rotation: (i) => (i % 2 === 0 ? -3 : 3),
        transformOrigin: "50% 50%",
      });

      gsap.set(contents, { autoAlpha: 1 });

      gsap.set(fragments, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        scale: 1,
      });

      gsap.set(headline, {
        autoAlpha: 0,
        y: 32,
      });

      gsap.set(cta, {
        autoAlpha: 0,
      });

      gsap.set(ctaText, {
        autoAlpha: 0,
        y: 35,
      });

      gsap.set(particleNodes, {
        autoAlpha: 0,
        scale: 0.15,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      });

      // PHASE 1 — cards enter sequentially.
      tl.to(
        stage,
        {
          backgroundColor: "#EAE1D5",
          duration: 0.2,
          ease: "none",
        },
        0
      );

      tl.to(
        cards,
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.34,
          stagger: 0.17,
          ease: "power3.out",
        },
        0.08
      );

      // PHASE 2 — the main message appears BELOW the cards.
      tl.to(
        headline,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.25,
          ease: "power3.out",
        },
        0.77
      );

      // Briefly hold the complete composition before it breaks apart.
      tl.to(
        cardHeader,
        { autoAlpha: 1, duration: 0.12 },
        0.8
      );
      tl.to(
  cardHeader,
  { autoAlpha: 0, duration: 0.12 },
  1.46
);
      // PHASE 3 — the paper shatter begins.
      tl.to(
        headline,
        {
          autoAlpha: 0,
          y: 16,
          duration: 0.12,
          ease: "power2.in",
        },
        1.46
      );

      if (cardFooter) {
        tl.to(
          cardFooter,
          { autoAlpha: 0, duration: 0.1 },
          1.46
        );
      }

      if (log) {
        tl.to(
          log,
          { autoAlpha: 0, scale: 0.7, duration: 0.12 },
          1.46
        );
      }

      tl.to(
        contents,
        {
          autoAlpha: 0,
          scale: 0.94,
          duration: 0.13,
          ease: "power2.in",
        },
        1.49
      );

      // Remove the card surfaces so only the fragments remain.
      tl.to(
        cards,
        {
          backgroundColor: "rgba(248,246,240,0)",
          borderColor: "rgba(255,255,255,0)",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          duration: 0.13,
          ease: "none",
        },
        1.49
      );

      tl.set(
        fragments,
        {
          autoAlpha: 1,
        },
        1.61
      );

      // Each piece flies along its own trajectory from its card.
      tl.to(
        fragments,
        {
          x: (i) => {
            const piece = i % 20;
            const col = piece % 4;
            return (col - 1.5) * 95 + (((i * 37) % 81) - 40);
          },
          y: (i) => {
            const piece = i % 20;
            const row = Math.floor(piece / 4);
            const vertical = row - 2;
            return vertical * 80 + (((i * 23) % 91) - 45);
          },
          z: (i) => -180 + ((i * 31) % 360),
          rotation: (i) =>
            (i % 2 === 0 ? 1 : -1) *
            (75 + ((i * 23) % 180)),
          scale: (i) => 0.12 + ((i * 7) % 20) / 100,
          autoAlpha: 0,
          duration: 0.68,
          stagger: {
            each: 0.003,
            from: "random",
          },
          ease: "power2.in",
        },
        1.62
      );

      // PHASE 4 — the CTA background emerges BEHIND the fragments.
      tl.to(
        cta,
        {
          autoAlpha: 1,
          duration: 0.4,
          ease: "none",
        },
        1.75
      );

      tl.to(
        stage,
        {
          backgroundColor: "#202522",
          duration: 0.42,
          ease: "none",
        },
        1.75
      );

      // Hide the empty card frames once their pieces have scattered.
      tl.to(
        staircase,
        {
          autoAlpha: 0,
          duration: 0.12,
        },
        2.55
      );

      tl.to(
        particleNodes,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.34,
          stagger: {
            each: 0.005,
            from: "random",
          },
          ease: "back.out(1.55)",
        },
        2.0
      );

      // PHASE 5 — the colorful, interactive closing CTA.
      tl.to(
        ctaText,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: "power3.out",
        },
        2.25
      );

      // Hold the final CTA so users can see and interact with it.
      const hold = { progress: 0 };
      tl.to(
        hold,
        {
          progress: 1,
          duration: 0.55,
        },
        2.7
      );
    }, section);

    const field = section.querySelector(".depth-cta-particle-field");

    if (field) {
      particleMotionRef.current = {
        xTo: gsap.quickTo(field, "x", {
          duration: 0.65,
          ease: "power3.out",
        }),
        yTo: gsap.quickTo(field, "y", {
          duration: 0.65,
          ease: "power3.out",
        }),
        rotateTo: gsap.quickTo(field, "rotation", {
          duration: 0.65,
          ease: "power3.out",
        }),
      };
    }

    return () => {
      ctx.revert();
      particleMotionRef.current = null;
    };
  }, []);

  function handlePointerMove(event) {
    const section = sectionRef.current;
    const motion = particleMotionRef.current;
    if (!section || !motion) return;

    const rect = section.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    motion.xTo(x * 18);
    motion.yTo(y * 11);
    motion.rotateTo(x * 1.5);
  }

  function handlePointerLeave() {
    const motion = particleMotionRef.current;
    if (!motion) return;
    motion.xTo(0);
    motion.yTo(0);
    motion.rotateTo(0);
  }
function handleBackHome() {
  const overlay = homeTransitionRef.current;

  if (!overlay || homeTransitionLock.current) return;

  homeTransitionLock.current = true;

  const pages = gsap.utils.toArray(
    ".home-page-leaf",
    overlay
  );

  const label = overlay.querySelector(
    ".home-page-transition-label"
  );

  const previousScrollBehavior =
    document.documentElement.style.scrollBehavior;

  // Cover the screen, then instantly return the page underneath
  // to its original hero section.
  gsap.set(overlay, {
    autoAlpha: 1,
    pointerEvents: "auto",
  });

  gsap.set(pages, {
    rotationY: 0,
    xPercent: 0,
    z: 0,
  });

  gsap.set(label, {
    autoAlpha: 0,
    y: 15,
  });

  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);

 const timeline = gsap.timeline({
  onComplete: () => {
    gsap.set(overlay, {
      autoAlpha: 0,
      pointerEvents: "none",
    });

    document.documentElement.style.scrollBehavior =
      previousScrollBehavior;

    homeTransitionLock.current = false;
  },
});

// Start with every sheet stacked together at the spine.
gsap.set(pages, {
  rotationY: 0,
  rotationZ: 0,
  xPercent: 0,
  z: 0,
  transformOrigin: "left center",
  transformPerspective: 1800,
  backfaceVisibility: "hidden",
});

gsap.set(label, {
  autoAlpha: 0,
  y: 20,
  scale: 0.96,
});

// The book title appears as the first pages begin turning.
timeline.to(
  label,
  {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 0.45,
    ease: "power3.out",
  },
  0.1
);

// Flip 18 individual pages in sequence.
// Each one turns slightly after the previous page.
timeline.to(
  pages,
  {
    rotationY: -178,
    rotationZ: (index) => (index % 2 === 0 ? -1.2 : 1.2),
    xPercent: -8,
    z: (index) => -index * 2,
    duration: 1.15,
    stagger: 0.085,
    ease: "power3.inOut",
    transformOrigin: "left center",
  },
  0.08
);

// The title fades as the final pages complete their turn.
timeline.to(
  label,
  {
    autoAlpha: 0,
    y: -12,
    duration: 0.25,
    ease: "power2.in",
  },
  1.5
);
}
  return (
    <section
      ref={sectionRef}
      className="depth-journey-section"
      id="care-steps"
      aria-label="The journey, step by step"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="depth-stage">
        <header className="depth-topline">
          <span>THE JOURNEY, STEP BY STEP</span>
          <span>AURA / 05</span>
        </header>

        <div className="depth-staircase">
          {steps.map((step) => (
            <article
              className={`depth-step depth-step--${step.color}`}
              key={step.color}
            >
              <h2 className="depth-step-content">
                {step.first}
                <br />
                <span>{step.second}</span>
              </h2>

              <div className="depth-step-tile" aria-hidden="true">
                <span />
              </div>

              <div className="depth-paper-fragments" aria-hidden="true">
                {Array.from({ length: 20 }, (_, index) => (
                  <span
                    className={`depth-paper-piece depth-paper-piece--${index % 5}`}
                    key={index}
                    style={{
                      left: `${(index % 4) * 25}%`,
                      top: `${Math.floor(index / 4) * 20}%`,
                      width: "25%",
                      height: "20%",
                    }}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="depth-final-message">
          <span>YOUR NEXT CHAPTER</span>
          <h2>
            Every step
            <br />
            brings you closer.
          </h2>
          <p>Let's make the next one count.</p>
        </div>

        {/* Keep this target: the previous section's wooden letter lands here. */}
        <div className="depth-letter-target" aria-hidden="true" />

        <footer className="depth-footer">
          <span>ONE STEP AT A TIME</span>
          <ArrowDown size={15} />
        </footer>

        {/* The final CTA is revealed behind the exploding paper fragments. */}
        <div className="depth-cta-layer">
          <header className="depth-cta-topline">
            <span>AURA / HEALTH</span>
            <span>THE NEXT CHAPTER STARTS HERE</span>
           
          </header>

          <div className="depth-cta-content">
            <p className="depth-cta-eyebrow">
              <i />
              GOOD CARE CHANGES EVERYTHING
            </p>

            <h2 className="depth-cta-heading">
              Let's make
              <br />
              <span>care human.</span>
            </h2>

            <p className="depth-cta-copy">
              Your next step towards a more thoughtful,
              connected healthcare experience starts here.
            </p>
<div className="depth-cta-actions">
  <a href="#doctor-story" className="depth-cta-link">
    Explore your care journey
    <span>
      <ArrowUpRight size={18} />
    </span>
  </a>

  <button
    type="button"
    className="depth-cta-home"
    onClick={handleBackHome}
  >
    <BookOpen size={17} />
    <span>Back to home</span>
    <ArrowUpRight size={16} />
  </button>
</div>
          </div>

          <div className="depth-cta-particle-field" aria-hidden="true">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className={`depth-cta-particle depth-cta-particle--${particle.type}`}
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

          <footer className="depth-cta-bottom">
            <span>MADE AROUND PEOPLE. BUILT FOR REAL LIFE.</span>
            <span>KEEP MOVING ↓</span>
          </footer>
        </div>
      </div>
      <div
  ref={homeTransitionRef}
  className="home-page-transition"
  aria-hidden="true"
>
  <div className="home-book-spine" />

  {Array.from({ length: 18 }, (_, index) => (
    <div
      key={index}
      className={`home-page-leaf home-page-leaf--${index % 4}`}
      style={{
        zIndex: 50 - index,
        "--page-index": index,
      }}
    />
  ))}

  <div className="home-page-transition-label">
    <span>TURNING BACK TO THE BEGINNING</span>
    <strong>AURA / HOME</strong>
  </div>
</div>
    </section>
  );
}