import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import AdaptiveCanvas from "./AdaptiveCanvas";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight, ArrowUpRight, Play } from "lucide-react";
import { DoctorPatientScene } from "./DoctorStory";
import PortalNextChapter from "./PortalNextChapter";
import "../styles/immersive-care.css";

gsap.registerPlugin(ScrollTrigger);

function PortalCamera({ progress }) {
  const { camera } = useThree();

  useFrame(() => {
    const zoom = Math.max(
      0,
      Math.min(1, (progress.current.value - 0.12) / 0.82)
    );

    const eased = zoom * zoom * (3 - 2 * zoom);

    // A gentle camera push makes the scene feel like a world,
    // not merely a card being enlarged.
    camera.position.z = 6.6 - eased * 2.05;
    camera.position.y = 0.1 + eased * 0.08;
    camera.lookAt(0, 0.05, 0);
  });

  return null;
}

export default function ImmersiveCare() {
  const sectionRef = useRef(null);
  const progress = useRef({ value: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
  const transitionSection = section.querySelector(
  ".portal-transition-section"
);

if (!transitionSection) return;
    const ctx = gsap.context(() => {
      const stage = section.querySelector(".portal-stage");
      const titleOne = section.querySelector(".portal-title-one");
      const titleTwo = section.querySelector(".portal-title-two");
      const titleThree = section.querySelector(".portal-title-three");
      const copy = section.querySelector(".portal-intro-copy");
      const eyebrow = section.querySelector(".portal-eyebrow");
      const card = section.querySelector(".portal-zoom-card");
      const chrome = section.querySelector(".portal-card-chrome");
      const sceneMessage = section.querySelector(".portal-scene-message");
      const scrollHint = section.querySelector(".portal-scroll-hint");

      if (
        !stage ||
        !card ||
        !titleOne ||
        !titleTwo ||
        !titleThree ||
        !sceneMessage
      ) {
        return;
      }

      // A compact, framed scene sits beneath the editorial introduction.
      gsap.set(card, {
        position: "absolute",
        left: "53%",
        top: "70%",
        xPercent: -50,
        yPercent: -50,
        width: () => Math.min(window.innerWidth * 0.66, 850),
        height: () => Math.min(window.innerHeight * 0.49, 500),
        borderRadius: 14,
        rotation: 2.5,
        scale: 0.94,
        transformOrigin: "50% 50%",
      });

      gsap.set(sceneMessage, {
        autoAlpha: 0,
        y: 45,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: transitionSection,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      });

      // 1. The editorial opening arrives with opposing movement.
      timeline.fromTo(
        titleOne,
        { x: -42, y: 26, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 0.1,
          ease: "power3.out",
        },
        0
      );

      timeline.fromTo(
        titleTwo,
        { x: 55, y: 28, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 0.11,
          ease: "power3.out",
        },
        0.025
      );

      timeline.fromTo(
        titleThree,
        { x: -32, y: 26, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 0.1,
          ease: "power3.out",
        },
        0.05
      );

      timeline.fromTo(
        [eyebrow, copy, scrollHint],
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.12,
          stagger: 0.025,
          ease: "power2.out",
        },
        0.045
      );

      // 2. Text is pulled away from the center of the screen.
      // The opposing directions create a cinematic transition.
      timeline.to(
        titleOne,
        {
          x: () => -window.innerWidth * 0.65,
          y: -65,
          rotation: -5,
          autoAlpha: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        0.17
      );

      timeline.to(
        titleTwo,
        {
          x: () => window.innerWidth * 0.68,
          y: -15,
          rotation: 4,
          autoAlpha: 0,
          duration: 0.21,
          ease: "power2.in",
        },
        0.18
      );

      timeline.to(
        titleThree,
        {
          x: () => -window.innerWidth * 0.55,
          y: 45,
          rotation: -3,
          autoAlpha: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        0.2
      );

      timeline.to(
        [eyebrow, copy, scrollHint],
        {
          x: 85,
          y: -25,
          autoAlpha: 0,
          duration: 0.15,
          ease: "power2.in",
        },
        0.16
      );

      // 3. Card lifts toward the viewer and expands to fill
      // the viewport. Its canvas expands with it.
      timeline.to(
        card,
        {
          left: "50%",
          top: "50%",
          width: () => window.innerWidth,
          height: () => window.innerHeight,
          borderRadius: 0,
          rotation: 0,
          scale: 1,
          duration: 0.73,
          ease: "power2.inOut",
        },
        0.2
      );

      // Push the 3D camera forward in sync with the card.
      timeline.to(
        progress.current,
        {
          value: 1,
          duration: 0.73,
          ease: "none",
        },
        0.2
      );

      // The card's browser-like frame disappears as we enter.
      timeline.to(
        chrome,
        {
          autoAlpha: 0,
          y: -22,
          duration: 0.14,
          ease: "power2.in",
        },
        0.49
      );

      // 4. We are now inside the immersive scene.
      timeline.to(
        sceneMessage,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.18,
          ease: "power3.out",
        },
        0.75
      );

      timeline.to(
        stage,
        {
          backgroundColor: "#202522",
          duration: 0.2,
          ease: "none",
        },
        0.48
      );

      // A small next-section cue becomes visible at the end.
      timeline.to(
        section.querySelector(".portal-enter-label"),
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.1,
        },
        0.86
      );

      // Simple reveal for the next section, below the pinned scene.
      
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="portal-experience">
      <section
       
        className="portal-transition-section"
        id="care-world"
        aria-label="Enter a more human care experience"
      >
        <div className="portal-stage">
          <header className="portal-topbar">
            <span className="portal-brand">AURA / HEALTH</span>
            <span className="portal-topbar-note">
              A DIFFERENT KIND OF CARE
            </span>
           
          </header>

          <div className="portal-intro-row">
            <div className="portal-heading-group">
              <p className="portal-eyebrow">
                BEYOND THE APPOINTMENT
              </p>

              <h2 className="portal-heading">
                <span className="portal-title-one">Care,</span>
                <span className="portal-title-two">
                  beyond the
                </span>
                <span className="portal-title-three">
                  ordinary.
                </span>
              </h2>
            </div>

            <div className="portal-intro-copy">
              <p>
                Healthcare should feel like a conversation,
                not another task on your to-do list.
              </p>

              <span className="portal-scroll-hint">
                <ArrowDownRight size={15} />
                SCROLL TO STEP INSIDE
              </span>
            </div>
          </div>

          {/* This framed card becomes the immersive world. */}
          <div className="portal-zoom-card">
            <div className="portal-scene-canvas">
              <AdaptiveCanvas
                camera={{
                  position: [0, 0.1, 6.6],
                  fov: 37,
                }}
                dpr={[1, 1.5]}
                gl={{
                  alpha: false,
                  antialias: true,
                }}
              >
                <color attach="background" args={["#202522"]} />

                <PortalCamera progress={progress} />

                <DoctorPatientScene storyProgress={progress} />
              </AdaptiveCanvas>
            </div>

            {/* This frame is visible before zooming in. */}
            <div className="portal-card-chrome">
              <div className="portal-card-top">
                <span>
               
                  A MORE HUMAN EXPERIENCE
                </span>

                <span>LIVE CARE / 001</span>
              </div>

              <div className="portal-card-bottom">
                <span>LISTEN. CONNECT. CONTINUE.</span>

                <span className="portal-play-button">
                  <Play size={15} fill="currentColor" />
                </span>
              </div>
            </div>

            {/* This message appears after the card fills the screen. */}
            <div className="portal-scene-message">
              <span>CARE, IN A NEW LIGHT</span>
              <h2>
                Step into
                <br />
                a more human world.
              </h2>
              <p>Because every conversation should move us forward.</p>
              <span className="portal-enter-label">
                KEEP EXPLORING <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Continuous dark background makes this feel like the next
          chapter emerging from inside the expanding card. */}
     <PortalNextChapter />
   </div>
  );
}