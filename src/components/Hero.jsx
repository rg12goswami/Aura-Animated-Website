import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Scene3D from "./Scene3D";
import FlowingLine from "./FlowingLine";
import FloatingCards from "./FloatingCards";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .from(".hero-kicker", { y: 18, opacity: 0, duration: 0.65 })
        .from(
          ".hero-title-line",
          { yPercent: 120, x: -18, rotate: 2, duration: 1.05, stagger: 0.14 },
          "-=0.2"
        )
        .from(
          ".hero-copy, .hero-actions",
          { y: 22, opacity: 0, duration: 0.7, stagger: 0.1 },
          "-=0.48"
        )
        .from(
          ".scene3d, .consultation-card, .floating-note",
          { y: 48, x: 20, rotate: 4, scale: 0.92, opacity: 0, duration: 1, stagger: 0.12 },
          "-=0.68"
        )
        .from(".hero-scroll", { y: 12, opacity: 0, duration: 0.5 }, "-=0.45");

      // The hero becomes a short, scroll-controlled motion sequence.
      // The stage stays in view while the headline and visual are swept away.
      const path = root.querySelector(".flow-path");
      const dot = root.querySelector(".flow-dot");
      const pathLength = path?.getTotalLength() ?? 1;
      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      gsap.set(dot, { autoAlpha: 0 });

      const progress = { value: 0 };
      const scrollMotion = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      scrollMotion
        .to(".hero-title-wrap", { x: "-4vw", y: "-8vh", scale: 0.88, ease: "none" }, 0)
        .to(".hero-title-mask:nth-child(1) .hero-title-line", { x: "-23vw", y: "-17vh", rotate: -7, ease: "none" }, 0)
        .to(".hero-title-mask:nth-child(2) .hero-title-line", { x: "21vw", y: "-25vh", rotate: 7, ease: "none" }, 0)
        .to(".hero-kicker, .hero-copy, .hero-actions", { x: "-7vw", y: -36, opacity: 0, ease: "none" }, 0.05)
        .to(".hero-visual", { x: "10vw", y: "-25vh", scale: 1.12, rotate: 4, ease: "none" }, 0)
        .to(".consultation-card", { x: "18vw", y: "-13vh", rotate: 10, scale: 0.86, ease: "none" }, 0.12)
        .to(".floating-note", { x: "10vw", y: "-22vh", rotate: -8, opacity: 0, ease: "none" }, 0.08)
        .to(".hero-scroll", { y: 20, opacity: 0, ease: "none" }, 0)
        .to(path, { strokeDashoffset: 0, ease: "none" }, 0)
        .to(progress, {
          value: 1,
          duration: 1,
          ease: "none",
          onUpdate: () => {
            if (!path || !dot) return;
            const point = path.getPointAtLength(progress.value * pathLength);
            dot.setAttribute("cx", point.x);
            dot.setAttribute("cy", point.y);
            dot.setAttribute("opacity", String(Math.min(1, progress.value * 4)));
          },
        }, 0);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={heroRef} className="hero-section">
      <div className="hero-stage">
        <div className="hero-layout">
          <div className="hero-content">
            <div className="hero-kicker">
              <span className="crimson-dot" />
              HEALTHCARE, WITH A HUMAN TOUCH
            </div>

            <div className="hero-title-wrap">
              <h1 className="hero-title">
                <span className="hero-title-mask">
                  <span className="hero-title-line">BETTER CARE.</span>
                </span>
                <span className="hero-title-mask">
                  <span className="hero-title-line hero-title-accent">LESS WAIT.</span>
                </span>
              </h1>
              <p className="hero-title-aside">A better kind<br />of health journey.</p>
            </div>

            <p className="hero-copy">
              Good healthcare starts with finding the right person. Less
              searching, more time for what matters.
            </p>

            <div className="hero-actions">
              <a className="primary-cta" href="#doctors">
                Find your doctor <ArrowUpRight size={18} />
              </a>
              <span className="hero-side-note">A more human way to find care.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="scene3d-wrap"><Scene3D /></div>
            <FlowingLine />
            <FloatingCards />
            <div className="hero-index" aria-hidden="true"><span>01</span><i /> HUMAN FIRST</div>
          </div>
        </div>

        <a href="#kinetic-text" className="hero-scroll">
          <span className="hero-scroll-icon"><ArrowDown size={16} /></span>
          SCROLL TO FEEL THE DIFFERENCE
        </a>
        <span className="hero-edge-note" aria-hidden="true">CARE, IN A NEW DIRECTION ↘</span>
      </div>
    </section>
  );
}
