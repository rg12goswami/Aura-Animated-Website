import {
  Component,
  useEffect,
  useRef,
  useState,
} from "react";

import { Canvas } from "@react-three/fiber";

class CanvasErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("3D scene could not initialize:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="adaptive-canvas-fallback" role="status">
          <span>3D preview is unavailable</span>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdaptiveCanvas({
  children,
  className = "",
  ...canvasProps
}) {
  const hostRef = useRef(null);
  const [inRange, setInRange] = useState(false);

  useEffect(() => {
    const element = hostRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setInRange(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInRange(entry.isIntersecting);
      },
      {
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className={`adaptive-canvas-host ${className}`}
    >
      {inRange ? (
        <CanvasErrorBoundary>
          <Canvas {...canvasProps}>{children}</Canvas>
        </CanvasErrorBoundary>
      ) : (
        <div
          className="adaptive-canvas-placeholder"
          aria-hidden="true"
        />
      )}
    </div>
  );
}