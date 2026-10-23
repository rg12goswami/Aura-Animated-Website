
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function KineticText() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".kinetic-heading", {
        yPercent: 70,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      gsap.to(".kinetic-track", {
        xPercent: -22,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="kinetic-text"
      className="kinetic-section"
    >
      <div className="kinetic-intro">
        <span className="section-eyebrow">CARE SHOULD FEEL DIFFERENT</span>
        <h2 className="kinetic-heading">
          More human.
          <br />
          <span>Less complicated.</span>
        </h2>
      </div>

      <div className="kinetic-marquee" aria-hidden="true">
        <div className="kinetic-track">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              CARE FIRST <i>✳</i> PEOPLE ALWAYS <i>✳</i>
            </span>
          ))}
        </div>
      </div>

      <p className="kinetic-description">
        Finding care should feel like a beginning, not another obstacle.
        We're making the journey simpler, more personal, and more human.
      </p>
    </section>
  );
}
