import React, { ReactNode } from 'react';

// --- Card ---
interface FantasyCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  glow?: 'gold' | 'blue' | 'none';
  onClick?: () => void;
}

export const PixelCard: React.FC<FantasyCardProps> = ({ children, className = '', title, glow = 'gold', onClick }) => {
  const glowClass = glow === 'gold' ? 'shadow-glow-gold border-gold-500/30' : 
                    glow === 'blue' ? 'shadow-glow-blue border-cyan-500/30' : 'border-white/10';

  return (
    <div onClick={onClick} className={`relative bg-void-800/80 backdrop-blur-md border ${glowClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}>
      {/* Tech/Magical Corners */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${glow === 'blue' ? 'border-cyan-400' : 'border-gold-500'}`}></div>
      <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${glow === 'blue' ? 'border-cyan-400' : 'border-gold-500'}`}></div>
      <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${glow === 'blue' ? 'border-cyan-400' : 'border-gold-500'}`}></div>
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${glow === 'blue' ? 'border-cyan-400' : 'border-gold-500'}`}></div>
      
      {title && (
        <div className="relative">
             <div className={`absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent ${glow === 'blue' ? 'via-cyan-500' : 'via-gold-500'} to-transparent`}></div>
             <h3 className={`text-2xl font-heading text-center py-3 uppercase tracking-[0.2em] ${glow === 'blue' ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-gold-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]'}`}>
                {title}
             </h3>
        </div>
      )}
      <div className="p-6 relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

// --- Button ---
interface FantasyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const PixelButton: React.FC<FantasyButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2 font-tech text-lg font-bold tracking-widest uppercase transition-all duration-300 clip-path-slant relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyle = "";
  // Using clip-path for sci-fi feel
  const slantStyle = { clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' };

  switch(variant) {
    case 'primary':
      variantStyle = "bg-gold-500/10 text-gold-300 border border-gold-500/50 hover:bg-gold-500 hover:text-void-900 hover:shadow-glow-gold";
      break;
    case 'secondary':
      variantStyle = "bg-mythril-200/5 text-mythril-300 border border-mythril-200/30 hover:bg-mythril-200/20";
      break;
    case 'danger':
      variantStyle = "bg-red-900/20 text-red-400 border border-red-500/50 hover:bg-red-600 hover:text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]";
      break;
    case 'success':
      variantStyle = "bg-cyan-900/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-600 hover:text-white hover:shadow-glow-blue";
      break;
  }

  return (
    <button 
        style={slantStyle}
        className={`${baseStyle} ${variantStyle} ${className}`} 
        {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

// --- Input ---
interface FantasyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PixelInput: React.FC<FantasyInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 mb-6 group w-full">
      {label && <label className="text-gold-500/80 font-heading text-sm uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">{label}</label>}
      <div className="relative w-full">
          <input 
            className={`w-full bg-void-900/50 border-b border-gold-500/30 p-2 text-xl text-mythril-100 font-tech focus:outline-none focus:border-cyan-400 focus:bg-void-900/80 transition-all placeholder-white/10 ${className}`}
            {...props}
          />
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-cyan-400 group-focus-within:w-full transition-all duration-500"></div>
      </div>
    </div>
  );
};

// --- Modal ---
interface PixelModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export const PixelModal: React.FC<PixelModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-void-900/90 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl animate-float">
                 <PixelCard title={title} glow="blue" className="bg-void-900 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-cyan-500 hover:text-white text-2xl"
                    >
                        ✖
                    </button>
                    {children}
                 </PixelCard>
            </div>
        </div>
    );
};
