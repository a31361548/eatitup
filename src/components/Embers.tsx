import React, { useEffect, useRef } from 'react';

export const Embers: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      const e = document.createElement('div');
      e.className = 'ember';
      const left = Math.random() * 100;
      const size = 2 + Math.random() * 4;
      const dur = 5 + Math.random() * 10;
      
      e.style.left = `${left}%`;
      e.style.width = `${size}px`;
      e.style.height = `${size}px`;
      e.style.animationDuration = `${dur}s`;
      e.style.animationDelay = `-${Math.random() * 10}s`;
      e.style.opacity = Math.random().toString();
      
      container.appendChild(e);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0"></div>
      <div className="vignette"></div>
    </>
  );
};
