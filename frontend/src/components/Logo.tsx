import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-10 w-auto sm:h-12 md:h-14" }: LogoProps) {
  const [useImage, setUseImage] = React.useState(true);

  // Wrap the image/svg in an inline-flex container so height utility classes
  // (e.g. `h-10`, `sm:h-12`, `md:h-14`) applied via `className` control the
  // rendered height while the graphic itself keeps `w-auto` and maintains aspect ratio.
  const wrapperClass = `${className} inline-flex transition-all duration-300`;

  if (useImage) {
    return (
      <span className={wrapperClass}>
        <img
          src="/logo.png"
          alt="Pixel AICore & Nexbot Logo"
          className="h-full w-auto block"
          onError={() => setUseImage(false)}
        />
      </span>
    );
  }

  return (
    <span className={wrapperClass}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 900 380" 
        className="h-full w-auto"
        aria-label="Pixel AICore & Nexbot Logo"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
      >
      {/* Letter P */}
      {/* Detached cyan highlight pixel/square at the base */}
      <rect 
        x="130" 
        y="307" 
        width="32" 
        height="32" 
        rx="5" 
        fill="#8adeff" 
      />
      {/* Main stem of P */}
      <rect 
        x="130" 
        y="112" 
        width="32" 
        height="183" 
        rx="5" 
        fill="#21a6e5" 
      />
      {/* Transparent outer loop ring of P using evenodd fill rule */}
      <path 
        d="M 200,110 A 70,70 0 1,1 199.9,110 Z M 200,142 A 38,38 0 1,0 199.9,142 Z" 
        fill="#21a6e5" 
        fillRule="evenodd" 
      />

      {/* Letter i */}
      {/* Red corporate pixel/dot */}
      <rect 
        x="325" 
        y="50" 
        width="32" 
        height="32" 
        rx="5" 
        fill="#f4222a" 
      />
      {/* Main stem of i */}
      <rect 
        x="325" 
        y="110" 
        width="32" 
        height="140" 
        rx="5" 
        fill="#21a6e5" 
      />

      {/* Letter x */}
      <path 
        d="M 406,126 L 482,234 M 482,126 L 406,234" 
        stroke="#21a6e5" 
        strokeWidth="32" 
        strokeLinecap="butt" 
      />

      {/* Letter e */}
      <path 
        d="M 528,180 H 636 A 54,54 0 1,0 617,221" 
        stroke="#21a6e5" 
        strokeWidth="32" 
        strokeLinecap="butt" 
        strokeLinejoin="round" 
        fill="none" 
      />
      {/* Grey corporate-highlight square */}
      <rect 
        x="612" 
        y="218" 
        width="32" 
        height="32" 
        rx="5" 
        fill="#7f7f7f" 
      />

      {/* Letter l */}
      <path 
        d="M 696,50 V 198 A 36,36 0 0,0 732,234 H 750" 
        stroke="#21a6e5" 
        strokeWidth="32" 
        strokeLinecap="butt" 
        fill="none" 
      />

      {/* Subtitle - Left aligned with 'i' and perfectly fitting under 'ixel' */}
      <text 
        x="325" 
        y="312" 
        fill="#94a3b8" 
        fontFamily="var(--font-display), 'Space Grotesk', sans-serif" 
        fontSize="32" 
        fontWeight="700" 
        letterSpacing="0.05em"
        textLength="425"
        lengthAdjust="spacing"
      >
        AICORE & NEXBOT
      </text>
    </svg>
      </span>
  );
}
