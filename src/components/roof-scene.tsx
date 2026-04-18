export function RoofScene() {
  return (
    <div aria-hidden="true" className="roof-scene">
      <svg
        viewBox="0 0 980 700"
        className="roof-scene__svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="roof-scene-base" x1="128" y1="182" x2="794" y2="530">
            <stop offset="0" stopColor="#151814" />
            <stop offset="0.55" stopColor="#0c0e0c" />
            <stop offset="1" stopColor="#060606" />
          </linearGradient>
          <linearGradient id="roof-scene-clean" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(155, 183, 118, 0)" />
            <stop offset="0.12" stopColor="rgba(175, 203, 138, 0.48)" />
            <stop offset="0.62" stopColor="rgba(135, 155, 112, 0.18)" />
            <stop offset="1" stopColor="rgba(0, 0, 0, 0)" />
          </linearGradient>
          <linearGradient id="roof-scene-spray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(225, 245, 255, 0)" />
            <stop offset="0.4" stopColor="rgba(225, 245, 255, 0.42)" />
            <stop offset="1" stopColor="rgba(225, 245, 255, 0)" />
          </linearGradient>
          <clipPath id="roof-scene-clip">
            <polygon points="128,420 450,224 842,338 518,548" />
          </clipPath>
          <filter id="roof-scene-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        <ellipse cx="520" cy="608" rx="322" ry="62" fill="rgba(0,0,0,0.42)" />

        <g clipPath="url(#roof-scene-clip)">
          <rect x="92" y="186" width="780" height="400" fill="url(#roof-scene-base)" />

          <path
            d="M146 420L470 224"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          <path
            d="M214 442L536 246"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
          />
          <path
            d="M286 463L606 266"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2"
          />
          <path
            d="M364 486L682 288"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2"
          />
          <path
            d="M448 510L758 313"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2"
          />

          <ellipse cx="270" cy="392" rx="88" ry="62" fill="rgba(82,112,61,0.46)" />
          <ellipse cx="378" cy="334" rx="120" ry="74" fill="rgba(98,132,72,0.42)" />
          <ellipse cx="532" cy="400" rx="116" ry="84" fill="rgba(86,118,60,0.44)" />
          <ellipse cx="690" cy="344" rx="102" ry="64" fill="rgba(106,138,76,0.4)" />
          <ellipse cx="646" cy="466" rx="92" ry="56" fill="rgba(76,103,56,0.36)" />

          <g>
            <rect x="-340" y="138" width="336" height="520" fill="url(#roof-scene-clean)">
              <animate
                attributeName="x"
                values="-340;790;790;-340"
                dur="11s"
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x="-390"
              y="118"
              width="126"
              height="560"
              fill="url(#roof-scene-spray)"
              filter="url(#roof-scene-blur)"
            >
              <animate
                attributeName="x"
                values="-390;742;742;-390"
                dur="11s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
        </g>

        <polygon
          points="128,420 450,224 842,338 518,548"
          stroke="rgba(212,226,188,0.22)"
          strokeWidth="3"
        />
        <path
          d="M450 224L842 338"
          stroke="rgba(182,204,150,0.2)"
          strokeWidth="3"
        />
        <path
          d="M128 420L518 548"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
        />

        <g>
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="160 132; 628 98; 628 98; 160 132"
              dur="11s"
              repeatCount="indefinite"
            />
            <ellipse cx="0" cy="56" rx="48" ry="12" fill="rgba(0,0,0,0.22)" />
            <path
              d="M16 42L68 196L-8 200L-30 74Z"
              fill="rgba(192,229,255,0.15)"
            />
            <rect x="-34" y="6" width="76" height="20" rx="10" fill="#dce7de" />
            <rect x="-8" y="0" width="24" height="12" rx="6" fill="#96B478" />
            <path d="M-58 14H-16M24 14H66M-12 -8V38M20 -8V38" stroke="#dce7de" strokeWidth="4" strokeLinecap="round" />
            <circle cx="-58" cy="14" r="9" fill="#dce7de" />
            <circle cx="66" cy="14" r="9" fill="#dce7de" />
            <circle cx="-12" cy="-8" r="9" fill="#dce7de" />
            <circle cx="20" cy="-8" r="9" fill="#dce7de" />
          </g>
        </g>
      </svg>
    </div>
  );
}
