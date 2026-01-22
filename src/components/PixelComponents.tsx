import React, { ReactNode } from 'react'

type PixelCardProps = {
  children: ReactNode
  className?: string
  title?: string
  glow?: 'gold' | 'blue' | 'none'
  onClick?: () => void
}

export const PixelCard: React.FC<PixelCardProps> = ({ children, className = '', title, glow = 'blue', onClick }) => {
  const tone = {
    gold: { border: 'border-aether-gold/30', glow: 'shadow-[0_0_30px_rgba(253,224,71,0.15)]', accent: 'text-aether-gold' },
    blue: { border: 'border-aether-cyan/30', glow: 'shadow-[0_0_30px_rgba(94,234,212,0.15)]', accent: 'text-aether-cyan' },
    none: { border: 'border-white/10', glow: '', accent: 'text-aether-mint' },
  }[glow]

  return (
    <div
      onClick={onClick}
      className={`
        relative holo-panel rounded-2xl overflow-hidden
        ${tone.border} ${tone.glow} 
        transition-all duration-300
        ${className} 
        ${onClick ? 'cursor-pointer hover:border-aether-cyan/50 hover:shadow-[0_0_40px_rgba(94,234,212,0.25)]' : ''}
      `}
    >
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-aether-cyan/50 to-transparent opacity-50" />

      {title && (
        <div className="relative pt-6 px-8 pb-2">
          <h3 className={`font-header text-xl tracking-widest uppercase holo-text-glow ${tone.accent}`}>
            {title}
          </h3>
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-aether-cyan/20 to-transparent" />
        </div>
      )}

      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
      
      {/* Decorative corner accents - minimal */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-aether-cyan/20 rounded-tl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-aether-cyan/20 rounded-br-2xl pointer-events-none" />
    </div>
  )
}

type PixelButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  fullWidth?: boolean
}

export const PixelButton: React.FC<PixelButtonProps> = ({ children, variant = 'primary', fullWidth = false, className = '', ...props }) => {
  const base = 'relative font-tech text-base uppercase tracking-wider px-8 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group'
  const width = fullWidth ? 'w-full' : ''
  let tone = ''

  switch (variant) {
    case 'primary':
      tone = 'bg-aether-cyan/10 border border-aether-cyan/50 text-aether-cyan hover:bg-aether-cyan/20 hover:border-aether-cyan hover:shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:text-white'
      break
    case 'secondary':
      tone = 'bg-transparent border border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
      break
    case 'danger':
      tone = 'bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
      break
    case 'success':
      tone = 'bg-aether-gold/10 border border-aether-gold/50 text-aether-gold hover:bg-aether-gold/20 hover:border-aether-gold hover:shadow-[0_0_20px_rgba(253,224,71,0.4)]'
      break
  }

  return (
    <button className={`${base} ${tone} ${width} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
      {/* Shine effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out" />
    </button>
  )
}

type PixelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export const PixelInput: React.FC<PixelInputProps> = ({ label, className = '', ...props }) => {
  return (
    <label className="flex flex-col gap-2 font-tech text-sm uppercase tracking-wider text-aether-cyan/60">
      {label}
      <div className="relative group">
        <input
          className={`
            w-full bg-slate-950/50 border border-aether-cyan/20 rounded-lg 
            px-5 py-3 font-tech text-lg text-white 
            placeholder-slate-600 
            focus:outline-none focus:border-aether-cyan/80 focus:bg-slate-900/80 focus:shadow-[0_0_15px_rgba(94,234,212,0.15)]
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {/* Animated bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-aether-cyan/0 group-focus-within:bg-aether-cyan/50 transition-colors duration-300 mx-1" />
      </div>
    </label>
  )
}

type PixelModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export const PixelModal: React.FC<PixelModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-xl animate-float">
        <PixelCard title={title} glow="blue">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-aether-cyan/50 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {children}
        </PixelCard>
      </div>
    </div>
  )
}
