import React, { useEffect, useRef, useState } from 'react';

interface Props {
  options: string[];
  isSpinning: boolean;
  onSpinEnd: (result: string) => void;
}

export const ElvenWheel: React.FC<Props> = ({ options, isSpinning, onSpinEnd }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  
  // Forge Palette: Alternating Dark Iron and Bronze
  const colors = ['#2a1a15', '#3e2723', '#4e342e', '#1a0f0a'];

  useEffect(() => {
    if (isSpinning) {
      // Randomize spin: At least 5 full spins (1800deg) + random offset
      const newRotation = rotation + 1800 + Math.random() * 360; 
      setRotation(newRotation);
      
      // Calculate winner ahead of time based on final rotation
      setTimeout(() => {
        const normalizedRotation = newRotation % 360;
        // The pointer is at 90deg (top), but CSS rotation is clockwise.
        // We need to calculate which slice ends up at the top.
        // SVG correction: -90deg rotation applied to container
        const effectiveAngle = (360 - normalizedRotation) % 360; 
        const sliceAngle = 360 / options.length;
        const winnerIndex = Math.floor(effectiveAngle / sliceAngle);
        onSpinEnd(options[winnerIndex]);
      }, 6000); // 6s duration matches CSS transition
    }
  }, [isSpinning]);

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
      
      {/* 1. Background Glow (Molten Core) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-forge-glow/20 blur-[60px] md:blur-[100px] rounded-full"></div>

      {/* 2. Rotating Rune Ring (Counter-Spin) */}
      <div className="absolute inset-[-20px] md:inset-[-40px] rounded-full border border-forge-gold/20 flex items-center justify-center animate-spin-reverse opacity-60 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <path id="curve" d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="transparent" />
            <text width="500">
              <textPath xlinkHref="#curve" className="text-[4px] fill-forge-gold font-rune tracking-[2px]">
                ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ
              </textPath>
            </text>
          </svg>
      </div>

      {/* 3. The Pointer (Crystal Spike) */}
      <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_0_15px_#ffb300]">
         <div className="w-6 md:w-8 h-16 md:h-20 bg-gradient-to-b from-white via-forge-gold to-forge-glow [clip-path:polygon(50%_100%,_0%_0%,_100%_0%)] flex items-start justify-center pt-1">
            <div className="w-1 h-8 md:h-12 bg-white/80 rounded-full blur-[1px]"></div>
         </div>
      </div>

      {/* 4. The Main Wheel */}
      <div 
        ref={wheelRef}
        className="w-full h-full rounded-full relative shadow-[0_0_30px_rgba(0,0,0,1)] border-[8px] md:border-[12px] border-[#1a100c]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 6s cubic-bezier(0.2, 0, 0.1, 1)' : 'none' // Ease-out quint-ish
        }}
      >
        <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
          {options.map((opt, index) => {
            const startAngle = index / options.length;
            const endAngle = (index + 1) / options.length;
            const [startX, startY] = getCoordinatesForPercent(startAngle);
            const [endX, endY] = getCoordinatesForPercent(endAngle);
            
            const largeArcFlag = options.length === 1 ? 1 : 0; 
            const pathData = options.length === 1 
              ? `M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0`
              : `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

            return (
              <g key={index}>
                <path 
                  d={pathData} 
                  fill={colors[index % colors.length]}
                  stroke="#5d4037" 
                  strokeWidth="0.015"
                />
                
                {/* Text */}
                <text
                  x="0.65"
                  y="0"
                  fill={index % 2 === 0 ? "#ffe082" : "#d4af37"}
                  fontSize="0.07"
                  fontWeight="bold"
                  fontFamily="Cinzel Decorative"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${(index + 0.5) * (360 / options.length)})`}
                  style={{ textShadow: '0 0 2px rgba(0,0,0,0.8)' }}
                >
                  {opt.length > 15 ? opt.substring(0,12) + '...' : opt}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 5. Center Hub (Mechanical) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] rounded-full shadow-[0_5px_15px_black] flex items-center justify-center border-2 md:border-4 border-[#5d4037] bg-gradient-to-br from-[#3e2723] to-[#1a0f0a]">
           {/* Inner rotating part */}
           <div className={`w-[70%] h-[70%] border-2 border-dashed border-forge-gold/50 rounded-full flex items-center justify-center ${isSpinning ? 'animate-spin' : ''}`}>
              <div className="w-3 md:w-4 h-3 md:h-4 bg-forge-glow rounded-full shadow-[0_0_20px_#ff6f00] animate-pulse"></div>
           </div>
        </div>
      </div>
    </div>
  );
};