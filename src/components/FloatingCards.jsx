
import { useRef } from "react";
import { ArrowUpRight, Clock3, HeartPulse } from "lucide-react";
import gsap from "gsap";

export default function FloatingCards() {
  const cardRef = useRef(null);

  function moveCard(event) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 12,
      rotateX: y * -10,
      x: x * 7,
      y: y * 7,
      transformPerspective: 1000,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  function resetCard() {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  }

  return (
    <div className="floating-card-scene">
      <div className="orbit-decoration orbit-one" />
      <div className="orbit-decoration orbit-two" />

      <article
        ref={cardRef}
        onMouseMove={moveCard}
        onMouseLeave={resetCard}
        className="consultation-card"
      >
        <div className="card-topline">
          <span className="card-eyebrow">A little closer to better care</span>
          <span className="card-icon">
            <HeartPulse size={22} />
          </span>
        </div>

        <h3>Your health, your pace.</h3>

        <p>
          Find the right specialist, explore your options, and take your next
          step with confidence.
        </p>

        <div className="card-divider" />

        <div className="card-footer">
          <span className="availability">
            <Clock3 size={14} />
            Made around you
          </span>

          <a href="#doctors" aria-label="Explore doctors">
            <ArrowUpRight size={20} />
          </a>
        </div>
      </article>

      <div className="floating-note">
        <span className="sage-dot" />
        Care, made personal
      </div>
    </div>
  );
}
