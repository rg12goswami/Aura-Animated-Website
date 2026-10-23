import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import "../styles/portal-next-chapter.css";

gsap.registerPlugin(ScrollTrigger);

export default function PortalNextChapter() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const source = section?.querySelector(".portal-letter-source");
    const targetSection = document.querySelector("#care-steps");
    const landing = targetSection?.querySelector(".depth-letter-target");

    if (!section || !source || !targetSection || !landing) return;

    const flight = document.createElement("span");
    flight.className = "portal-letter-flight";
    flight.textContent = "l";
    flight.setAttribute("aria-hidden", "true");
    document.body.appendChild(flight);

    let start = null;
    const startAt = 0.37;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const lerp = (a, b, t) => a + (b - a) * t;

    const ctx = gsap.context(() => {
      const eyebrow = section.querySelector(".portal-build-eyebrow");
      const heading = section.querySelector(".portal-build-heading");
      const copy = section.querySelector(".portal-build-copy");
      const cta = section.querySelector(".portal-build-cta");

      gsap.fromTo(
        [eyebrow, heading],
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.13,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        [copy, cta],
        { y: 25, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            once: true,
          },
        }
      );

      // The flight spans the current section and the beginning
      // of the next section, so the log crosses the boundary.
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        endTrigger: targetSection,
        end: "top top",
        scrub: 0.8,
        invalidateOnRefresh: true,

        onRefresh() {
          start = null;
        },

        onUpdate(self) {
          const progress = self.progress;

          if (progress < startAt) {
            source.style.visibility = "";
            flight.style.opacity = "0";
            flight.classList.remove("is-log");
            landing.classList.remove("is-landed");
            start = null;
            return;
          }

          // Capture the source letter's position once it detaches.
          if (!start) {
            const rect = source.getBoundingClientRect();
            const computed = getComputedStyle(source);

            start = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
              width: rect.width,
              height: rect.height,
            };

            flight.style.fontFamily = computed.fontFamily;
            flight.style.fontSize = computed.fontSize;
            flight.style.fontWeight = computed.fontWeight;
            flight.style.lineHeight = computed.lineHeight;
            flight.style.letterSpacing = computed.letterSpacing;
          }

          const t = clamp((progress - startAt) / (1 - startAt));
          const eased = t * t * (3 - 2 * t);
          const targetRect = landing.getBoundingClientRect();

          // The target moves upward as the next section enters view.
          const endX = targetRect.left + targetRect.width / 2;
          const endY = targetRect.top + targetRect.height / 2;

          // The extra downward arc gives the letter a falling motion.
          const x = lerp(start.x, endX, eased);
          const y =
            lerp(start.y, endY, eased) +
            Math.sin(t * Math.PI) * 60;

          const morph = clamp((t - 0.25) / 0.4);
          const width = lerp(start.width, 84, morph);
          const height = lerp(start.height, 19, morph);
          const rotation = t * 540;

          source.style.visibility = "hidden";
          landing.classList.remove("is-landed");
          flight.classList.toggle("is-log", morph > 0.28);

          flight.style.width = `${width}px`;
          flight.style.height = `${height}px`;
          flight.style.left = `${x - width / 2}px`;
          flight.style.top = `${y - height / 2}px`;
          flight.style.transform =
            `rotate(${rotation}deg) scale(${1 - t * 0.04})`;
          flight.style.opacity = "1";

          if (progress >= 0.995) {
            flight.style.opacity = "0";
            landing.classList.add("is-landed");
          }
        },
      });
    }, section);

    return () => {
      ctx.revert();
      flight.remove();
      source.style.visibility = "";
      landing.classList.remove("is-landed");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="portal-build-section"
      aria-label="Healthcare that moves with real life"
    >
      <div className="portal-build-inner">
        <header className="portal-build-topline">
          <span>AURA / HEALTH</span>
          <span>THE EXPERIENCE CONTINUES </span>
          <span>ONE STEP AT A TIME</span>
        </header>

        <p className="portal-build-eyebrow">
          THE NEXT CHAPTER OF CARE
        </p>

        <h2 className="portal-build-heading">
          <span className="portal-build-line">
            <span>Hea</span>
            <span className="portal-letter-slot">
              <span className="portal-letter-source">l</span>
              <span className="portal-letter-placeholder" aria-hidden="true">
                l
              </span>
            </span>
            <span>thcare</span>
          </span>

          <span className="portal-build-line portal-build-line--two">
            that moves with
            <br />
            real life.
          </span>
        </h2>

        <div className="portal-build-bottom">
          <p className="portal-build-copy">
            Find your doctor. Make space for the conversation.
            Keep your care journey moving.
          </p>

          <a href="#doctors" className="portal-build-cta">
            Find your care
            <span>
              <ArrowUpRight size={18} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}