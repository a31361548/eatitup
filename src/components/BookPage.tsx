'use client';

import React from 'react';
import { BookBorder, PageTexture, CornerGuard } from './BookConstants';

interface BookPageProps {
  index: number;
  isFlipped: boolean;
  zIndex: number;
  onFlip: () => void;
  width: number;
  height: number;
  frontChildren?: React.ReactNode;
  backChildren?: React.ReactNode;
  type?: 'cover' | 'back-cover' | 'content';
  title?: string;
  subtitle?: string;
  isEditable?: boolean;
  onTitleChange?: (title: string) => void;
}

export const BookPage: React.FC<BookPageProps> = ({
  isFlipped,
  zIndex,
  onFlip,
  width,
  height,
  frontChildren,
  backChildren,
  type = 'content',
  title,
  subtitle,
  isEditable,
  onTitleChange
}) => {
  // Rotate -180 when flipped (left side), 0 when not flipped (right side)
  const rotation = isFlipped ? 'rotate-y-minus-180' : 'rotate-y-0';
  
  // Dynamic styling for the 3D flip wrapper
  const style: React.CSSProperties = {
    zIndex,
    width: `${width}px`,
    height: `${height}px`,
    transition: 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000)',
    transformOrigin: 'left center', // Critical for book flipping
    position: 'absolute',
    top: 0,
    right: 0, // Pages are anchored to the right side of the spine initially
  };

  return (
    <div
      className={`preserve-3d cursor-pointer group ${rotation}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onFlip();
      }}
    >
      {/* FRONT FACE (Visible when page is on the Right) */}
      <div 
        className="absolute inset-0 backface-hidden bg-[#f3e9d2] shadow-xl overflow-hidden rounded-r-md border-l border-neutral-300"
        style={{ transform: 'rotateY(0deg)' }}
      >
        {type === 'cover' ? (
           <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-leather relative overflow-hidden border-4 border-amber-600/30 rounded-r-md">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-overlay"></div>
             <div className="border-4 border-double border-amber-500/50 p-8 w-full h-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
               {isEditable ? (
                 <input
                   type="text"
                   value={title}
                   onChange={(e) => onTitleChange?.(e.target.value)}
                   onClick={(e) => e.stopPropagation()}
                   placeholder="Enter Title..."
                   className="font-serif font-black text-2xl md:text-3xl text-amber-500 text-center mb-4 tracking-widest drop-shadow-md uppercase bg-transparent border-b border-amber-500/50 focus:outline-none w-full placeholder-amber-500/30"
                 />
               ) : (
                 <h1 className="font-serif font-black text-2xl md:text-3xl text-amber-500 text-center mb-4 tracking-widest drop-shadow-md uppercase">
                   {title || 'Grimoire'}
                 </h1>
               )}
               <div className="w-16 h-1 bg-amber-500/50 mb-4 rounded-full"></div>
               <p className="font-serif text-amber-200/80 text-xl tracking-wide uppercase">{subtitle || 'The Book of Shadows'}</p>
             </div>
             <CornerGuard className="absolute top-2 left-2 w-16 h-16 text-amber-500 rotate-180" />
             <CornerGuard className="absolute bottom-2 left-2 w-16 h-16 text-amber-500 -rotate-90" />
             <CornerGuard className="absolute top-2 right-2 w-16 h-16 text-amber-500 rotate-90" />
             <CornerGuard className="absolute bottom-2 right-2 w-16 h-16 text-amber-500 rotate-0" />
           </div>
        ) : type === 'back-cover' ? (
           <div className="h-full w-full bg-leather relative border-l-2 border-amber-900/50">
              <div className="absolute inset-0 opacity-30 flex items-center justify-center">
                 <span className="text-amber-700 font-serif text-xs tracking-[0.5em]">FINIS</span>
              </div>
           </div>
        ) : (
           <>
             <PageTexture />
             <BookBorder />
             <div className="h-full w-full p-8 relative z-10">
                {frontChildren}
             </div>
           </>
        )}
        
        {/* Shine/Shadow effect on flip */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* BACK FACE (Visible when page is on the Left) */}
      <div 
        className="absolute inset-0 backface-hidden bg-[#f3e9d2] shadow-xl overflow-hidden rounded-l-md border-r border-neutral-300"
        style={{ transform: 'rotateY(180deg)' }}
      >
        <PageTexture />
        <BookBorder />
        
        {/* Back Content */}
        <div className="h-full w-full p-8 relative z-10">
           {backChildren || (
             <div className="h-full w-full flex flex-col justify-center items-center opacity-30">
                <span className="font-serif text-amber-900/50 text-2xl">§</span>
             </div>
           )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

