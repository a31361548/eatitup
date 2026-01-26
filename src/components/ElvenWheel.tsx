import React, { useEffect, useRef, useState } from 'react';

interface Props {
  options: string[];
  isSpinning: boolean;
  onSpinEnd: (result: string) => void;
}

export const ElvenWheel: React.FC<Props> = ({ options, isSpinning, onSpinEnd }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

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
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="relative aspect-square overflow-hidden rounded-[40px] border border-white/10 bg-black/30 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        {/* Reactor glow */}
        <div className="pointer-events-none absolute inset-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_65%)] blur-3xl" aria-hidden />

        <div className="relative flex h-full w-full items-center justify-center">
          {/* Rotating Tech Ring (kept within safe bounds) */}
          <div className="pointer-events-none absolute inset-2 rounded-full border border-samurai-blue/20 opacity-70">
            <div className="absolute inset-0 flex items-center justify-center animate-spin-reverse select-none">
              <svg viewBox="0 0 100 100" className="h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] p-2">
                <path id="rune-curve" d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="transparent" />
                <text width="500">
                  <textPath xlinkHref="#rune-curve" className="text-[4px] fill-samurai-blue font-tech tracking-[2px]">
                    系統初始化中 // 掃描區域 // 計算機率 // SAMURAI 核心上線 //
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/* Pointer kept inside container */}
          <div className="absolute top-4 left-1/2 z-30 -translate-x-1/2 filter drop-shadow-[0_0_15px_rgba(244,63,94,0.7)]" aria-hidden>
            <div className="flex h-16 w-6 items-start justify-center rounded-b-full bg-gradient-to-b from-white via-samurai-red to-transparent [clip-path:polygon(50%_100%,_0%_0%,_100%_0%)] pt-1 md:h-20 md:w-8">
              <div className="h-8 w-1 rounded-full bg-white/80 blur-[1px] md:h-12" />
            </div>
          </div>

          {/* Main Wheel */}
          <div
            ref={wheelRef}
            className="relative aspect-square w-full max-w-[420px] rounded-full border-[8px] border-samurai-dark bg-samurai-dim shadow-[0_0_40px_rgba(244,63,94,0.18)] md:border-[12px]"

            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 6s cubic-bezier(0.2, 0, 0.1, 1)' : 'none'
            }}
          >
            <svg viewBox="-1 -1 2 2" className="h-full w-full -rotate-90">
              {options.map((opt, index) => {
                const startAngle = index / options.length;
                const endAngle = (index + 1) / options.length;
                const [startX, startY] = getCoordinatesForPercent(startAngle);
                const [endX, endY] = getCoordinatesForPercent(endAngle);

                const largeArcFlag = options.length === 1 ? 1 : 0;
                const pathData =
                  options.length === 1
                    ? `M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0`
                    : `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

                const isAccent = index % 2 === 0;

                return (
                  <g key={index}>
                    <path
                      d={pathData}
                      fill={isAccent ? 'rgba(59, 130, 246, 0.1)' : 'rgba(244, 63, 94, 0.1)'}
                      stroke={isAccent ? 'var(--color-samurai-blue)' : 'var(--color-samurai-red)'}
                      strokeWidth="0.01"
                      className="transition-all duration-300"
                    />

                    {/* Text */}
                    <text
                      x="0.65"
                      y="0"
                      fill={isAccent ? '#ffffff' : 'var(--color-samurai-red)'}
                      fontSize="0.07"
                      fontWeight="bold"
                      fontFamily="Rajdhani"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${(index + 0.5) * (360 / options.length)})`}
                      style={{ textShadow: isAccent ? '0 0 5px rgba(59,130,246,0.5)' : '0 0 5px rgba(244,63,94,0.5)' }}
                    >
                      {opt.length > 15 ? `${opt.substring(0, 12)}...` : opt}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center Reactor */}
            <div className="absolute top-1/2 left-1/2 flex h-[25%] w-[25%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-samurai-red bg-samurai-dark shadow-[0_0_30px_rgba(244,63,94,0.3)] md:border-4">
              <div className={`flex h-[70%] w-[70%] items-center justify-center rounded-full border-2 border-dashed border-samurai-red/50 ${isSpinning ? 'animate-spin' : ''}`}>
                <div className="h-3 w-3 rounded-full bg-samurai-red shadow-[0_0_20px_rgba(244,63,94,0.7)] md:h-4 md:w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
