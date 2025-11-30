import React, { useEffect, useRef, useState } from 'react';

interface Props {
  options: string[];
  isSpinning: boolean;
  onSpinEnd: (result: string) => void;
}

export const ElvenWheel: React.FC<Props> = ({ options, isSpinning, onSpinEnd }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  
  // Tech Palette: Cyan, Blue, Teal, Dark
  const colors = ['#0a1020', '#114242', '#041C1C', '#00f0ff'];

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
    <div className="relative w-[80vmin] h-[80vmin] max-w-[500px] max-h-[500px] lg:max-w-[600px] lg:max-h-[600px]">
      
      {/* 1. Background Glow (Reactor Core) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-aether-cyan/10 blur-[60px] md:blur-[100px] rounded-full"></div>

      {/* 2. Rotating Tech Ring (Counter-Spin) */}
      <div className="absolute inset-[-20px] md:inset-[-40px] rounded-full border border-aether-cyan/20 flex items-center justify-center animate-spin-reverse opacity-60 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <path id="rune-curve" d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="transparent" />
            <text width="500">
              <textPath xlinkHref="#rune-curve" className="text-[4px] fill-aether-cyan font-tech tracking-[2px]">
                SYSTEM INITIALIZING // SCANNING SECTORS // CALCULATING PROBABILITY // AETHER CORE ONLINE //
              </textPath>
            </text>
          </svg>
      </div>

      {/* 3. The Pointer (Laser Spike) */}
      <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_0_15px_#00f0ff]">
         <div className="w-6 md:w-8 h-16 md:h-20 bg-gradient-to-b from-white via-aether-cyan to-transparent [clip-path:polygon(50%_100%,_0%_0%,_100%_0%)] flex items-start justify-center pt-1">
            <div className="w-1 h-8 md:h-12 bg-white/80 rounded-full blur-[1px]"></div>
         </div>
      </div>

      {/* 4. The Main Wheel */}
      <div 
        ref={wheelRef}
        className="w-full h-full rounded-full relative shadow-[0_0_30px_rgba(0,240,255,0.2)] border-[8px] md:border-[12px] border-aether-dark"
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

            const isCyan = index % 2 === 0;

            return (
              <g key={index}>
                <path 
                  d={pathData} 
                  fill={isCyan ? 'rgba(0, 240, 255, 0.1)' : 'rgba(10, 16, 32, 0.8)'}
                  stroke="#00f0ff" 
                  strokeWidth="0.01"
                  className="transition-all duration-300"
                />
                
                {/* Text */}
                <text
                  x="0.65"
                  y="0"
                  fill={isCyan ? "#ffffff" : "#00f0ff"}
                  fontSize="0.07"
                  fontWeight="bold"
                  fontFamily="Rajdhani"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${(index + 0.5) * (360 / options.length)})`}
                  style={{ textShadow: '0 0 5px rgba(0,240,255,0.5)' }}
                >
                  {opt.length > 15 ? opt.substring(0,12) + '...' : opt}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 5. Center Hub (Reactor) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] rounded-full shadow-[0_0_30px_rgba(0,240,255,0.3)] flex items-center justify-center border-2 md:border-4 border-aether-cyan bg-aether-dark">
           {/* Inner rotating part */}
           <div className={`w-[70%] h-[70%] border-2 border-dashed border-aether-cyan/50 rounded-full flex items-center justify-center ${isSpinning ? 'animate-spin' : ''}`}>
              <div className="w-3 md:w-4 h-3 md:h-4 bg-aether-cyan rounded-full shadow-[0_0_20px_#00f0ff] animate-pulse"></div>
           </div>
        </div>
      </div>
    </div>
  );
};
 
