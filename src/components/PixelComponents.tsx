import React, { ReactNode } from 'react'

type PixelCardProps = {
  children: ReactNode
  className?: string
  title?: string
  glow?: 'gold' | 'blue' | 'red' | 'none'
  onClick?: () => void
}

export const PixelCard: React.FC<PixelCardProps> = ({ children, className = '', title, glow = 'blue', onClick }) => {
  const tone = {
    gold: { 
      border: 'border-samurai-yellow/30', 
      glow: 'shadow-[0_0_30px_rgba(250,204,21,0.15)]', 
      accent: 'text-samurai-yellow' 
    },
    blue: { 
      border: 'border-samurai-blue/30', 
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]', 
      accent: 'text-samurai-blue' 
    },
    red: { 
      border: 'border-samurai-red/30', 
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]', 
      accent: 'text-samurai-red' 
    },
    none: { 
      border: 'border-white/10', 
      glow: '', 
      accent: 'text-samurai-text' 
    },
  }[glow]

  return (
    <div
      onClick={onClick}
      className={`
        relative depth-control rounded-2xl overflow-hidden
        ${tone.border} ${tone.glow} 
        transition-all duration-300
        ${className} 
        ${onClick ? 'cursor-pointer hover:border-samurai-red/50 hover:shadow-[0_0_40px_rgba(244,63,94,0.25)]' : ''}
      `}
    >
      {/* Top Gradient Line */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50`} />

      {title && (
        <div className="relative pt-6 px-8 pb-2">
          <h3 className={`font-header text-xl tracking-widest uppercase holo-text-glow ${tone.accent}`}>
            {title}
          </h3>
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
      
      {/* Decorative corner accents - Samurai Style */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t border-l ${tone.border} rounded-tl-2xl pointer-events-none opacity-50`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b border-r ${tone.border} rounded-br-2xl pointer-events-none opacity-50`} />
    </div>
  )
}

type PixelButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  fullWidth?: boolean
}

export const PixelButton: React.FC<PixelButtonProps> = ({ children, variant = 'primary', fullWidth = false, className = '', ...props }) => {
  const base = 'relative font-tech text-base uppercase tracking-wider px-8 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group samurai-glitch active:scale-95'
  const width = fullWidth ? 'w-full' : ''
  let tone = ''

  switch (variant) {
    case 'primary':
      tone = 'bg-samurai-red/10 border border-samurai-red/50 text-samurai-red hover:bg-samurai-red/20 hover:border-samurai-red hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:text-white'
      break
    case 'secondary':
      tone = 'bg-transparent border border-samurai-blue/30 text-samurai-blue hover:border-samurai-blue/60 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
      break
    case 'danger':
      tone = 'bg-samurai-red/10 border border-samurai-red/50 text-samurai-red hover:bg-samurai-red/20 hover:border-samurai-red hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]'
      break
    case 'success':
      tone = 'bg-samurai-yellow/10 border border-samurai-yellow/50 text-samurai-yellow hover:bg-samurai-yellow/20 hover:border-samurai-yellow hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]'
      break
  }

  return (
    <button className={`${base} ${tone} ${width} ${className}`} {...props}>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
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
    <label className="flex flex-col gap-2 font-tech text-sm uppercase tracking-wider text-samurai-text/60">
      {label}
      <div className="relative group">
        <input
          className={`
            w-full bg-samurai-dim/50 border border-white/10 rounded-lg 
            px-5 py-3 font-tech text-lg text-white 
            placeholder-white/20 
            focus:outline-none focus:border-samurai-red focus:bg-samurai-dark/90 focus:shadow-[0_0_25px_rgba(244,63,94,0.3)]
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {/* Animated bottom line - Red for Samurai */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-transparent group-focus-within:bg-samurai-red/50 transition-colors duration-300 mx-1" />
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
        className="absolute inset-0 bg-samurai-dark/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-xl animate-float depth-overlay rounded-2xl">
        <PixelCard title={title} glow="blue" className="!bg-transparent !border-0 !shadow-none">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
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
