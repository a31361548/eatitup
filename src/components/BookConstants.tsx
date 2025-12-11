

// SVG Components for styling
export const CornerGuard = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M0 0 L100 0 L100 20 L40 20 C30 20 20 30 20 40 L20 100 L0 100 Z" />
    <circle cx="25" cy="25" r="5" fill="#1a1a1a" opacity="0.5" />
  </svg>
);

export const BookBorder = () => (
  <div className="absolute inset-4 border-2 border-double border-amber-900/40 pointer-events-none rounded-sm" />
);

export const PageTexture = () => (
  <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-30 bg-parchment rounded-r-md" />
);
