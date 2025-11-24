"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/ui/PageShell';
import { ElvenWheel } from '@/components/ElvenWheel';
import { ForgeArchive } from '@/components/ForgeArchive';
import { Embers } from '@/components/Embers';

const DEFAULT_OPTIONS = [
  '龍息寶庫',
  '弒君審判',
  '鳳凰之焰',
  '虛空旅者',
  '聖耀裁決',
  '鋼鐵意志',
];

export default function WheelPage() {
  const sp = useSearchParams();
  const itemsParam = sp.get('items');
  
  const [input, setInput] = useState(DEFAULT_OPTIONS.join('\n'));
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (itemsParam) {
      const list = itemsParam.split(',').map((item) => item.trim()).filter(Boolean);
      if (list.length > 0) {
        setInput(list.join('\n'));
      }
    }
  }, [itemsParam]);

  const options = input.split('\n').filter(line => line.trim().length > 0);

  const handleSpinStart = () => {
    if (options.length < 2) return;
    setIsSpinning(true);
    setWinner(null);
  };

  const handleSpinEnd = (result: string) => {
    setIsSpinning(false);
    setWinner(result);
  };

  return (
    <PageShell className="!p-0 !max-w-none h-[calc(100vh-64px)] overflow-hidden bg-forge-gradient relative selection:bg-forge-gold selection:text-forge-dark">
      <Embers />
      
      {/* Decorative Border Frame (Responsive) */}
      <div className="absolute inset-0 border-[12px] md:border-[20px] border-forge-brown pointer-events-none z-40 opacity-80" style={{borderImage: 'linear-gradient(to bottom, #2a1a15, #0f0500) 1'}}></div>
      <div className="absolute inset-2 md:inset-4 border border-forge-gold/20 pointer-events-none z-40"></div>

      {/* Main Container */}
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 py-20 lg:py-0 px-8 lg:px-12">
        
        {/* LEFT PANEL: The Wheel (Visual Centerpiece) */}
        <div className="lg:col-span-7 order-1 flex flex-col items-center justify-center relative h-full">
           {/* Magic Circle Floor */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none">
              <div className="absolute inset-0 bg-radial-gradient from-forge-glow/10 to-transparent blur-3xl"></div>
              {/* Rotating Runes Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-forge-gold/5 rounded-full animate-spin-slow opacity-30 border-dashed"></div>
           </div>

           <div className="relative z-10 scale-90 md:scale-100 lg:scale-110 transition-transform duration-500">
             <ElvenWheel 
                options={options} 
                isSpinning={isSpinning} 
                onSpinEnd={handleSpinEnd} 
             />
           </div>

           {/* Winner Announcement Overlay */}
           {winner && !isSpinning && (
             <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="bg-[#0f0500]/95 backdrop-blur-md p-8 md:p-12 rounded-sm border-y-4 border-forge-gold text-center animate-[float_4s_ease-in-out_infinite] shadow-[0_0_100px_#ff6f00] pointer-events-auto max-w-2xl mx-4 relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => setWinner(null)}>
                   {/* Light streaks */}
                   <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[ember-rise_3s_infinite]"></div>
                   
                  <div className="text-forge-glow font-rune text-lg md:text-xl tracking-[0.5em] mb-4 uppercase">命運鑄成</div>
                   <h2 className="text-4xl md:text-6xl lg:text-7xl font-scroll font-bold text-white mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,1)] bg-clip-text text-transparent bg-gradient-to-b from-white via-forge-light to-forge-gold">
                     {winner}
                   </h2>
                  <div className="text-xs text-forge-bronze font-rune tracking-widest border-t border-forge-brown pt-4 mt-2 hover:text-forge-gold transition-colors">
                    點擊接受命運
                  </div>
                </div>
             </div>
           )}
        </div>

        {/* RIGHT PANEL: Controls (Archive Scroll) */}
        <div className="lg:col-span-5 order-2 flex flex-col justify-center h-full animate-[fadeIn_1s_ease-out_0.5s] relative z-20">
          <ForgeArchive 
             input={input}
             setInput={setInput}
             isSpinning={isSpinning}
             onSpin={handleSpinStart}
             optionsCount={options.length}
          />
        </div>

      </div>
    </PageShell>
  );
}
