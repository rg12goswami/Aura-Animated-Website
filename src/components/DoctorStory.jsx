import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import AdaptiveCanvas from "./AdaptiveCanvas";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  HeartPulse,
  MessageCircle,
  Stethoscope,
} from "lucide-react";

import "../styles/doctor-story.css";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    number: "01",
    eyebrow: "FIRST, WE LISTEN",
    lineOne: "Someone who",
    lineTwo: "really listens.",
    description:
      "Good care starts with understanding the person behind the symptoms.",
    tag: "BE HEARD",
  },
  {
    number: "02",
    eyebrow: "THEN, WE CONNECT",
    lineOne: "Make room for",
    lineTwo: "the conversation.",
    description:
      "More space for your questions. More clarity about what comes next.",
    tag: "FEEL UNDERSTOOD",
  },
  {
    number: "03",
    eyebrow: "CARE KEEPS GOING",
    lineOne: "Support that",
    lineTwo: "stays with you.",
    description:
      "From your first appointment to your next step, your journey keeps moving.",
    tag: "MOVE FORWARD",
  },
];

function smoothStep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

// A soft gesture that rises and falls during each animation cycle.
function gesturePulse(phase, start, end) {
  if (phase <= start || phase >= end) return 0;

  const t = (phase - start) / (end - start);
  return Math.sin(t * Math.PI);
}

/* =========================================
   PATIENT
========================================= */

function Patient({ storyProgress }) {
  const root = useRef(null);
  const head = useRef(null);
  const torso = useRef(null);
  const responseArm = useRef(null);

  useFrame(({ clock, pointer }) => {
    if (!root.current || !head.current || !torso.current) return;

    const time = clock.elapsedTime;
    const phase = (time % 9) / 9;
    const progress = storyProgress.current.value;

    const listening = gesturePulse(phase, 0.02, 0.4);
    const responding = gesturePulse(phase, 0.4, 0.69);

    const storyConnection =
      smoothStep((progress - 0.28) / 0.16) *
      (1 - smoothStep((progress - 0.68) / 0.16));

    // The patient shifts in the chair instead of remaining static.
    root.current.position.x =
      -0.92 +
      Math.sin(time * 0.58) * 0.11 +
      responding * 0.055;

    root.current.position.y =
      -0.43 +
      Math.sin(time * 1.25) * 0.018;

    root.current.position.z =
      0.08 + Math.sin(time * 0.42) * 0.045;

    root.current.rotation.y =
      0.12 +
      Math.sin(time * 0.4) * 0.035 +
      pointer.x * 0.025;

    // Natural breathing.
    torso.current.position.y =
      0.05 + Math.sin(time * 1.3) * 0.022;

    torso.current.rotation.z =
      Math.sin(time * 0.48) * 0.018;

    // Listening nod, glance, and reaction.
    head.current.rotation.x =
      -0.015 +
      listening * Math.sin(time * 2.5) * 0.075 +
      responding * 0.025;

    head.current.rotation.y =
      Math.sin(time * 0.48) * 0.06 +
      pointer.x * 0.02;

    head.current.rotation.z =
      Math.sin(time * 0.8) * 0.035 -
      responding * 0.035;

    // The patient raises a hand while responding.
    if (responseArm.current) {
      responseArm.current.rotation.z =
        0.04 +
        responding * (0.65 + storyConnection * 0.2) +
        Math.sin(time * 1.7) * 0.035;

      responseArm.current.rotation.x =
        Math.sin(time * 1.2) * 0.035;
    }
  });

  return (
    <group
      ref={root}
      position={[-0.92, -0.43, 0.08]}
      scale={0.86}
    >
      {/* Chair back */}
      <RoundedBox
        args={[0.78, 0.83, 0.12]}
        radius={0.09}
        smoothness={4}
        position={[0, 0.03, -0.3]}
      >
        <meshStandardMaterial color="#D9CCBA" roughness={0.82} />
      </RoundedBox>

      {/* Seat */}
      <RoundedBox
        args={[0.82, 0.13, 0.4]}
        radius={0.045}
        smoothness={4}
        position={[0, -0.24, -0.02]}
      >
        <meshStandardMaterial color="#B9A38E" roughness={0.8} />
      </RoundedBox>

      {/* Legs */}
      {[-0.18, 0.18].map((x) => (
        <group key={x}>
          <RoundedBox
            args={[0.22, 0.43, 0.25]}
            radius={0.07}
            smoothness={4}
            position={[x, -0.42, 0.12]}
            rotation={[0.12, 0, x < 0 ? -0.12 : 0.12]}
          >
            <meshStandardMaterial color="#65756C" roughness={0.85} />
          </RoundedBox>

          <RoundedBox
            args={[0.25, 0.12, 0.34]}
            radius={0.055}
            smoothness={4}
            position={[x + 0.025, -0.66, 0.19]}
          >
            <meshStandardMaterial color="#454946" roughness={0.75} />
          </RoundedBox>
        </group>
      ))}

      {/* Torso */}
      <RoundedBox
        ref={torso}
        args={[0.65, 0.7, 0.37]}
        radius={0.15}
        smoothness={5}
        position={[0, 0.05, 0]}
      >
        <meshStandardMaterial color="#B9DCCB" roughness={0.72} />
      </RoundedBox>

      {/* Neck */}
      <mesh position={[0, 0.43, 0.02]}>
        <cylinderGeometry args={[0.105, 0.12, 0.22, 20]} />
        <meshStandardMaterial color="#C89170" roughness={0.78} />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 0.69, 0.02]}>
        <mesh scale={[0.29, 0.34, 0.27]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#D6A080" roughness={0.8} />
        </mesh>

        {/* Hair */}
        <mesh
          position={[-0.015, 0.19, -0.015]}
          scale={[0.29, 0.18, 0.27]}
        >
          <sphereGeometry args={[1, 28, 24]} />
          <meshStandardMaterial color="#493B35" roughness={0.92} />
        </mesh>

        {/* Eyes */}
        {[-0.09, 0.09].map((x) => (
          <mesh
            key={x}
            position={[x, 0.015, 0.245]}
            scale={[1, 1.2, 0.7]}
          >
            <sphereGeometry args={[0.027, 16, 16]} />
            <meshStandardMaterial color="#382F2A" />
          </mesh>
        ))}

        {/* Nose */}
        <mesh
          position={[0, -0.045, 0.268]}
          scale={[0.065, 0.09, 0.055]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#C89170" />
        </mesh>

        {/* Smile */}
        <mesh
          position={[0.005, -0.13, 0.244]}
          scale={[0.06, 0.012, 0.012]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#8E574B" />
        </mesh>
      </group>

      {/* Arms; the right arm gestures toward the doctor */}
      {[-1, 1].map((side) => (
        <group
          key={side}
          ref={side === 1 ? responseArm : undefined}
          position={[side * 0.32, 0.19, 0.015]}
        >
          <mesh
            position={[side * 0.045, -0.19, 0]}
            rotation={[0, 0, side * -0.12]}
          >
            <capsuleGeometry args={[0.095, 0.28, 4, 12]} />
            <meshStandardMaterial color="#B9DCCB" roughness={0.78} />
          </mesh>

          <mesh position={[side * 0.07, -0.37, 0.015]}>
            <sphereGeometry args={[0.085, 20, 20]} />
            <meshStandardMaterial color="#D6A080" roughness={0.78} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* =========================================
   DOCTOR
========================================= */

function Doctor({ storyProgress }) {
  const root = useRef(null);
  const head = useRef(null);
  const torso = useRef(null);
  const gestureArm = useRef(null);
  const freeArm = useRef(null);

  useFrame(({ clock, pointer }) => {
    if (!root.current || !head.current || !torso.current) return;

    const time = clock.elapsedTime;
    const phase = (time % 9) / 9;
    const progress = storyProgress.current.value;

    const speaking = gesturePulse(phase, 0.1, 0.39);
    const listening = gesturePulse(phase, 0.41, 0.69);

    const connecting =
      smoothStep((progress - 0.22) / 0.14) *
      (1 - smoothStep((progress - 0.68) / 0.12));

    // Lean toward and away from the patient during conversation.
    root.current.position.x =
      0.77 -
      Math.sin(time * 0.58) * 0.09 -
      speaking * 0.055;

    root.current.position.y =
      -0.38 + Math.sin(time * 1.45 + 0.6) * 0.018;

    root.current.position.z =
      -0.05 + Math.sin(time * 0.38 + 1) * 0.04;

    root.current.rotation.y =
      -0.12 +
      Math.sin(time * 0.33) * 0.03 -
      pointer.x * 0.025;

    // Breathing and body lean.
    torso.current.position.y =
      0.02 + Math.sin(time * 1.45 + 0.6) * 0.022;

    torso.current.rotation.z =
      Math.sin(time * 0.5 + 0.5) * 0.018 -
      speaking * 0.025;

    // Doctor nods, turns their head and maintains attention.
    head.current.rotation.x =
      Math.sin(time * 0.9) * 0.026 +
      speaking * Math.sin(time * 2.2) * 0.055 -
      listening * 0.025;

    head.current.rotation.y =
      -0.14 + Math.sin(time * 0.55) * 0.04;

    head.current.rotation.z =
      Math.sin(time * 0.65) * 0.025;

    // Repeated explanatory hand gestures.
    if (gestureArm.current) {
      gestureArm.current.rotation.z =
        -0.18 -
        speaking * (0.38 + connecting * 0.25) -
        Math.sin(time * 1.45) * 0.035;

      gestureArm.current.rotation.x =
        Math.sin(time * 1.25) * 0.035;
    }

    if (freeArm.current) {
      freeArm.current.rotation.z =
        Math.sin(time * 1.4 + 1) * 0.035 +
        listening * 0.04;

      freeArm.current.rotation.x =
        Math.sin(time * 0.85) * 0.02;
    }
  });

  return (
    <group
      ref={root}
      position={[0.77, -0.38, -0.05]}
    >
      {/* Legs */}
      {[-0.18, 0.18].map((x) => (
        <group key={x}>
          <RoundedBox
            args={[0.22, 0.61, 0.24]}
            radius={0.065}
            smoothness={4}
            position={[x, -0.47, 0]}
          >
            <meshStandardMaterial color="#59646A" roughness={0.82} />
          </RoundedBox>

          <RoundedBox
            args={[0.28, 0.13, 0.38]}
            radius={0.055}
            smoothness={4}
            position={[x, -0.79, 0.07]}
          >
            <meshStandardMaterial color="#3C3E3C" roughness={0.72} />
          </RoundedBox>
        </group>
      ))}

      {/* Doctor's coat */}
      <RoundedBox
        ref={torso}
        args={[0.73, 0.93, 0.38]}
        radius={0.12}
        smoothness={5}
        position={[0, 0.02, 0]}
      >
        <meshStandardMaterial color="#FBF8F0" roughness={0.68} />
      </RoundedBox>

      {/* Shirt */}
      <RoundedBox
        args={[0.23, 0.54, 0.035]}
        radius={0.025}
        smoothness={3}
        position={[0, 0.08, 0.207]}
      >
        <meshStandardMaterial color="#B9DCCB" roughness={0.72} />
      </RoundedBox>

      {/* Buttons */}
      {[-0.09, 0.05, 0.19].map((y) => (
        <mesh
          key={y}
          position={[0.125, y, 0.231]}
          scale={0.016}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#C8BEB0" />
        </mesh>
      ))}

      {/* Neck */}
      <mesh position={[0, 0.53, 0]}>
        <cylinderGeometry args={[0.105, 0.115, 0.19, 20]} />
        <meshStandardMaterial color="#C48B68" roughness={0.8} />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 0.78, 0.015]}>
        <mesh scale={[0.29, 0.34, 0.27]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#C99170" roughness={0.78} />
        </mesh>

        {/* Hair */}
        <mesh
          position={[0, 0.18, -0.02]}
          scale={[0.3, 0.18, 0.28]}
        >
          <sphereGeometry args={[1, 28, 24]} />
          <meshStandardMaterial color="#47352D" roughness={0.92} />
        </mesh>

        <mesh
          position={[-0.13, 0.12, 0.17]}
          scale={[0.15, 0.11, 0.12]}
        >
          <sphereGeometry args={[1, 20, 18]} />
          <meshStandardMaterial color="#47352D" roughness={0.92} />
        </mesh>

        {/* Eyes */}
        {[-0.09, 0.09].map((x) => (
          <mesh
            key={x}
            position={[x, 0.01, 0.244]}
            scale={[1, 1.2, 0.7]}
          >
            <sphereGeometry args={[0.027, 16, 16]} />
            <meshStandardMaterial color="#342B27" />
          </mesh>
        ))}

        {/* Nose and smile */}
        <mesh
          position={[0, -0.05, 0.268]}
          scale={[0.06, 0.08, 0.05]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#C48B68" />
        </mesh>

        <mesh
          position={[0.005, -0.13, 0.244]}
          scale={[0.06, 0.012, 0.012]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#865344" />
        </mesh>
      </group>

      {/* Resting arm */}
      <group
        ref={freeArm}
        position={[0.4, 0.37, 0]}
      >
        <mesh
          position={[0.08, -0.23, 0]}
          rotation={[0, 0, -0.25]}
        >
          <capsuleGeometry args={[0.105, 0.42, 4, 12]} />
          <meshStandardMaterial color="#FBF8F0" />
        </mesh>

        <mesh position={[0.14, -0.46, 0.02]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshStandardMaterial color="#C99170" roughness={0.78} />
        </mesh>
      </group>

      {/* Gesture arm */}
      <group
        ref={gestureArm}
        position={[-0.4, 0.38, 0.015]}
      >
        <mesh
          position={[-0.13, -0.22, 0]}
          rotation={[0, 0, -0.24]}
        >
          <capsuleGeometry args={[0.105, 0.42, 4, 12]} />
          <meshStandardMaterial color="#FBF8F0" roughness={0.7} />
        </mesh>

        <mesh position={[-0.23, -0.44, 0.02]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshStandardMaterial color="#C99170" roughness={0.78} />
        </mesh>
      </group>

      {/* Stethoscope */}
      <mesh
        position={[0.13, 0.13, 0.231]}
        rotation={[0.1, 0, 0.15]}
      >
        <torusGeometry args={[0.085, 0.014, 8, 30]} />
        <meshStandardMaterial color="#78958A" roughness={0.55} />
      </mesh>

      <mesh position={[0.13, 0.035, 0.235]}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshStandardMaterial
          color="#78958A"
          metalness={0.15}
          roughness={0.45}
        />
      </mesh>
    </group>
  );
}

/* =========================================
   3D ENVIRONMENT
   No flowing line, no decorative orbit.
========================================= */

export function DoctorPatientScene({ storyProgress }) {
  return (
    <>
      <ambientLight intensity={1.65} />

      <hemisphereLight
        args={["#FFF8EF", "#B7A694", 1.1]}
      />

      <directionalLight
        position={[3, 5, 5]}
        intensity={2.4}
        color="#FFF6E8"
      />

      <directionalLight
        position={[-4, 2, 2]}
        intensity={1.1}
        color="#E8B4A0"
      />

      <Patient storyProgress={storyProgress} />
      <Doctor storyProgress={storyProgress} />

      <ContactShadows
        position={[0, -1.24, 0]}
        scale={4.8}
        blur={2.4}
        opacity={0.23}
        far={3.5}
        color="#574438"
      />
    </>
  );
}

/* =========================================
   SCROLL STORY SECTION
========================================= */

export default function DoctorStory() {
  const sectionRef = useRef(null);
  const storyProgress = useRef({ value: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const stage = section.querySelector(".doctor-story-stage");

      const beats = gsap.utils.toArray(
        ".doctor-story-beat",
        section
      );

      if (!stage || beats.length !== 3) return;

      gsap.set(beats, { autoAlpha: 0 });

      beats.forEach((beat) => {
        gsap.set(
          beat.querySelectorAll(".doctor-story-headline-line"),
          {
            clipPath: "inset(0 100% 0 0)",
            x: 0,
          }
        );
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      });

      // The section shifts between soft editorial colors.
      timeline.to(
        stage,
        {
          backgroundColor: "#E4EAE2",
          duration: 0.16,
          ease: "none",
        },
        0.34
      );

      timeline.to(
        stage,
        {
          backgroundColor: "#EAD9D1",
          duration: 0.16,
          ease: "none",
        },
        0.66
      );

      const starts = [0.025, 0.355, 0.68];
      const exits = [0.29, 0.615, 0.945];

      beats.forEach((beat, index) => {
        const start = starts[index];
        const exit = exits[index];

        const lineOne = beat.querySelector(
          ".doctor-story-headline-line--one"
        );

        const lineTwo = beat.querySelector(
          ".doctor-story-headline-line--two"
        );

        const paragraph = beat.querySelector(
          ".doctor-story-description"
        );

        const meta = beat.querySelector(
          ".doctor-story-beat-meta"
        );

        const incomingOneX = index === 1 ? 22 : -22;
        const incomingTwoX = -incomingOneX;

        timeline.set(beat, { autoAlpha: 1 }, start);

        timeline.fromTo(
          lineOne,
          {
            xPercent: incomingOneX,
            yPercent: 24,
            clipPath: "inset(0 100% 0 0)",
          },
          {
            xPercent: 0,
            yPercent: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.115,
            ease: "power3.out",
          },
          start
        );

        timeline.fromTo(
          lineTwo,
          {
            xPercent: incomingTwoX,
            yPercent: 24,
            clipPath: "inset(0 0 0 100%)",
          },
          {
            xPercent: 0,
            yPercent: 0,
            clipPath: "inset(0 0 0 0)",
            duration: 0.12,
            ease: "power3.out",
          },
          start + 0.035
        );

        timeline.fromTo(
          meta,
          { y: 15, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.08,
            ease: "power2.out",
          },
          start + 0.035
        );

        timeline.fromTo(
          paragraph,
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.09,
            ease: "power2.out",
          },
          start + 0.075
        );

        // Each chapter is swept away in the opposite direction.
        if (index < 2) {
          timeline.to(
            lineOne,
            {
              xPercent: index === 0 ? -36 : 34,
              yPercent: -18,
              autoAlpha: 0,
              duration: 0.095,
              ease: "power2.in",
            },
            exit - 0.07
          );

          timeline.to(
            lineTwo,
            {
              xPercent: index === 0 ? 34 : -36,
              yPercent: -8,
              autoAlpha: 0,
              duration: 0.095,
              ease: "power2.in",
            },
            exit - 0.055
          );

          timeline.to(
            [paragraph, meta],
            {
              y: -12,
              autoAlpha: 0,
              duration: 0.06,
            },
            exit - 0.045
          );

          timeline.set(beat, { autoAlpha: 0 }, exit + 0.04);
        }
      });

      timeline.eventCallback("onUpdate", () => {
        storyProgress.current.value = timeline.progress();
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="doctor-story-section"
      id="doctor-story"
      aria-label="A more human care journey"
    >
      <div className="doctor-story-stage">
        <header className="doctor-story-topline">
          <span className="doctor-story-eyebrow">
            <i />
            A MORE HUMAN KIND OF CARE
          </span>

        
        </header>

        <div className="doctor-story-layout">
          {/* Changing editorial story */}
          <div className="doctor-story-copy-column">
            {chapters.map((chapter) => (
              <article
                className="doctor-story-beat"
                key={chapter.number}
              >
                <div className="doctor-story-beat-meta">
                  <span className="doctor-story-number">
                    {chapter.number}
                  </span>
                  <span>{chapter.eyebrow}</span>
                </div>

                <h2 className="doctor-story-heading">
                  <span className="doctor-story-heading-mask">
                    <span className="doctor-story-headline-line doctor-story-headline-line--one">
                      {chapter.lineOne}
                    </span>
                  </span>

                  <span className="doctor-story-heading-mask">
                    <span className="doctor-story-headline-line doctor-story-headline-line--two">
                      {chapter.lineTwo}
                    </span>
                  </span>
                </h2>

                <p className="doctor-story-description">
                  {chapter.description}
                </p>

                <div className="doctor-story-tag">
                  <span>{chapter.tag}</span>
                  <ArrowUpRight size={16} />
                </div>
              </article>
            ))}
          </div>

          {/* Characters remain animated while the text changes */}
          <div className="doctor-story-scene-wrap">
            <div className="doctor-story-scene-label">
              <Stethoscope size={14} />
              <span>THE HUMAN SIDE OF HEALTHCARE</span>
            </div>

            <div className="doctor-story-canvas">
              <AdaptiveCanvas
                camera={{
                  position: [0, 0.1, 6.6],
                  fov: 37,
                }}
                dpr={[1, 1.5]}
                gl={{
                  alpha: true,
                  antialias: true,
                }}
              >
                <DoctorPatientScene
                  storyProgress={storyProgress}
                />
              </AdaptiveCanvas>
            </div>

            <div className="doctor-story-scene-note">
              <div className="doctor-story-note-icon">
                <MessageCircle size={16} />
              </div>

              <div>
                <strong>Every person has a story.</strong>
                <span>Start with a conversation.</span>
              </div>

              <HeartPulse
                size={20}
                className="doctor-story-note-heart"
              />
            </div>
          </div>
        </div>

        <footer className="doctor-story-footer">
          <span>CARE IS MORE THAN AN APPOINTMENT.</span>
          <span>KEEP MOVING ↓</span>
        </footer>
      </div>
    </section>
  );
}