export default function AshokaMark({ size = 48, showText = false, light = false }) {
  const primary = light ? '#FFFFFF' : '#183B63';
  const accent = '#E87519';

  return (
    <div className="inline-flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Digital Police Portal civic pillar symbol"
      >
        <circle cx="50" cy="17" r="12" stroke={accent} strokeWidth="3" />
        <circle cx="50" cy="17" r="3" fill={accent} />

        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={50 + Math.cos(angle) * 4}
              y1={17 + Math.sin(angle) * 4}
              x2={50 + Math.cos(angle) * 9}
              y2={17 + Math.sin(angle) * 9}
              stroke={accent}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}

        <path d="M29 39 Q50 25 71 39 L66 47 H34 Z" fill={primary} />
        <path d="M35 37 Q50 29 65 37" stroke={accent} strokeWidth="2.5" />
        <path d="M38 48 H62 L59 79 H41 Z" fill={primary} />
        <path d="M44 52 V74 M50 52 V74 M56 52 V74"
          stroke={light ? '#FFFFFF' : '#EAF0F6'} strokeWidth="2" />
        <path d="M35 79 H65 L70 86 H30 Z" fill={accent} />
        <path d="M25 89 H75" stroke={primary} strokeWidth="4" strokeLinecap="round" />
        <path d="M20 94 H80" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      </svg>

      {showText && (
        <span className="flex flex-col leading-tight">
          <span className={`text-base font-extrabold tracking-wide ${light ? 'text-white' : 'text-[#183B63]'}`}>
            DIGITAL POLICE
          </span>
          <span className={`text-xs font-semibold tracking-[0.18em] ${light ? 'text-white/80' : 'text-[#E87519]'}`}>
            PORTAL
          </span>
        </span>
      )}
    </div>
  );
}
