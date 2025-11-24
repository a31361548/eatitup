import React, { useState } from 'react';
import { ElvenWheel } from './components/ElvenWheel';

const DEFAULT_OPTIONS = [
  "Dragon's Hoard",
  "Kingslayer",
  "Phoenix Fire",
  "Void Walker",
  "Divine Smite",
  "Iron Will"
];

function App() {
  const [input, setInput] = useState(DEFAULT_OPTIONS.join('\n'));
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden bg-forge-gradient relative selection:bg-forge-gold selection:text-forge-dark">
      
      {/* Decorative Border Frame (Responsive) */}
      <div className="fixed inset-0 border-[12px] md:border-[20px] border-forge-brown pointer-events-none z-50 opacity-80" style={{borderImage: 'linear-gradient(to bottom, #2a1a15, #0f0500) 1'}}></div>
      <div className="fixed inset-2 md:inset-4 border border-forge-gold/20 pointer-events-none z-50"></div>

      {/* Main Container */}
      <div className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 h-full py-8 lg:py-0">
        
        {/* LEFT PANEL: The Wheel (Visual Centerpiece) */}
        <div className="lg:col-span-7 order-1 flex flex-col items-center justify-center relative min-h-[400px] lg:min-h-[800px]">
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
                   
                   <div className="text-forge-glow font-rune text-lg md:text-xl tracking-[0.5em] mb-4 uppercase">Destiny Forged</div>
                   <h2 className="text-4xl md:text-6xl lg:text-7xl font-scroll font-bold text-white mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,1)] bg-clip-text text-transparent bg-gradient-to-b from-white via-forge-light to-forge-gold">
                     {winner}
                   </h2>
                   <div className="text-xs text-forge-bronze font-rune tracking-widest border-t border-forge-brown pt-4 mt-2 hover:text-forge-gold transition-colors">
                     Click to accept fate
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* RIGHT PANEL: Controls (Archive Scroll) */}
        <div className="lg:col-span-5 order-2 flex flex-col h-full animate-[fadeIn_1s_ease-out_0.5s] relative z-20 px-4 lg:px-0">
          
          {/* Scroll Container */}
          <div className="relative bg-[#1a100c] rounded-t-[40px] md:rounded-t-[100px] rounded-b-[20px] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-x-2 border-b-2 border-[#3e2723] group ring-1 ring-white/5">
             {/* Glowing Top Edge */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-forge-gold to-transparent shadow-[0_0_15px_#ffb300]"></div>
             
             {/* Header */}
             <div className="text-center mb-6 mt-2">
               <h1 className="text-3xl md:text-5xl font-rune text-forge-gold font-bold drop-shadow-md tracking-wide">
                 Archive
               </h1>
               <div className="flex items-center justify-center gap-4 mt-3 opacity-60">
                  <div className="h-[1px] w-8 md:w-12 bg-forge-bronze"></div>
                  <div className="w-2 h-2 rotate-45 bg-forge-gold"></div>
                  <div className="h-[1px] w-8 md:w-12 bg-forge-bronze"></div>
               </div>
             </div>

             {/* Input Area */}
             <div className="relative mb-6 bg-[#0f0500] rounded-xl border border-[#3e2723] shadow-inner overflow-hidden group-hover:border-[#5d4037] transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-forge-glow/20 to-transparent"></div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isSpinning}
                  className="w-full h-64 md:h-80 bg-transparent p-6 font-scroll text-xl md:text-2xl text-forge-light focus:outline-none focus:bg-[#1a120f] transition-all resize-none forge-scroll leading-loose tracking-wide placeholder-white/20"
                  placeholder="Inscribe destinies here..."
                />
             </div>

             {/* Action Button (The Hammer) */}
             <button
               onClick={handleSpinStart}
               disabled={isSpinning || options.length < 2}
               className="w-full relative h-16 md:h-20 group/btn overflow-hidden rounded-sm bg-forge-brown border border-forge-gold/30 hover:border-forge-gold transition-all shadow-[0_5px_0_#1a0f0a] active:shadow-none active:translate-y-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {/* Molten Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-forge-dark via-forge-brown to-forge-dark"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-forge-glow/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10 flex items-center justify-center gap-3">
                    <span className="font-rune text-forge-light text-xl md:text-2xl tracking-[0.2em] uppercase group-hover/btn:text-white group-hover/btn:drop-shadow-[0_0_8px_#ffb300] transition-all">
                      {isSpinning ? 'Forging...' : 'Strike Fate'}
                    </span>
                </div>
             </button>
             
             {options.length < 2 && (
               <p className="text-center text-forge-ember font-scroll mt-4 text-sm italic animate-pulse">
                 * Requires at least 2 materials to forge
               </p>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;