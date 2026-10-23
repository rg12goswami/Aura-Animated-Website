import { useId } from "react";

export default function FlowingLine() {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      className="flowing-line"
      viewBox="0 0 700 500"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`line-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D94F38" />
          <stop offset="100%" stopColor="#F18A68" />
        </linearGradient>
      </defs>
      <path
        className="flow-path"
        d="M 28 342 C 65 205, 116 58, 238 75 S 352 245, 445 251 S 593 154, 656 93 C 694 56, 663 291, 512 350 S 223 445, 147 365 S 104 270, 28 342"
        stroke={`url(#line-${id})`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle className="flow-dot" cx="28" cy="342" r="5.5" fill="#D94F38" />
    </svg>
  );
}
