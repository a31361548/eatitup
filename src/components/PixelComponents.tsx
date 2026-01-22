import React, { ReactNode } from 'react'

type PixelCardProps = {
  children: ReactNode
  className?: string
  title?: string
  glow?: 'gold' | 'blue' | 'none'
  onClick?: () => void
}

export const PixelCard: React.FC<PixelCardProps> = ({ children, className = '', title, glow = 'gold', onClick }) => {
  const tone = {
    gold: { border: 'border-aether-teal', corner: 'bg-aether-teal', accent: 'text-aether-gold' },
    blue: { border: 'border-aether-cyan', corner: 'bg-aether-cyan', accent: 'text-aether-cyan' },
    none: { border: 'border-aether-dim', corner: 'bg-aether-dim', accent: 'text-aether-mint' },
  }[glow]

  return (
    <div
      onClick={onClick}
      className={`relative bg-aether-dark border-4 ${tone.border} shadow-[8px_8px_0px_0px_rgba(17,66,66,0.8)] ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute top-0 left-0 w-2 h-2 ${tone.corner}`} />
      <div className={`absolute top-0 right-0 w-2 h-2 ${tone.corner}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 ${tone.corner}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 ${tone.corner}`} />

      {title && (
        <div className={`absolute -top-7 left-4 border-2 ${tone.border} bg-aether-dark px-4 py-1`}>
          <h3 className={`font-header text-header-base tracking-pixel-wider ${tone.accent}`}>{title}</h3>
        </div>
      )}

      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  )
}

type PixelButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  fullWidth?: boolean
}

export const PixelButton: React.FC<PixelButtonProps> = ({ children, variant = 'primary', fullWidth = false, className = '', ...props }) => {
  const base = 'font-pixel text-pixel-base uppercase tracking-pixel-wider px-8 py-4 border-4 shadow-[4px_4px_0px_0px_rgba(4,28,28,0.8)] transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(4,28,28,0.8)] disabled:opacity-50 disabled:cursor-not-allowed'
  const width = fullWidth ? 'w-full' : ''
  let tone = ''

  switch (variant) {
    case 'primary':
      tone = 'bg-aether-teal text-aether-dark border-aether-dark hover:bg-aether-cyan'
      break
    case 'secondary':
      tone = 'bg-transparent text-aether-cyan border-aether-cyan hover:bg-aether-dim/30'
      break
    case 'danger':
      tone = 'bg-aether-alert text-white border-aether-alert/80 hover:brightness-110'
      break
    case 'success':
      tone = 'bg-aether-gold text-aether-dark border-aether-dark hover:bg-aether-gold/80'

      break
  }

  return (
    <button className={`${base} ${tone} ${width} ${className}`} {...props}>
      {children}
    </button>
  )
}

type PixelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export const PixelInput: React.FC<PixelInputProps> = ({ label, className = '', ...props }) => {
  return (
    <label className="flex flex-col gap-2 font-pixel text-pixel-sm uppercase tracking-pixel-wider text-aether-mint/70">
      {label}
      <input
        className={`bg-aether-dark border-2 border-aether-teal text-aether-cyan px-5 py-4 font-pixel text-pixel-lg placeholder-aether-teal/40 focus:outline-none focus:border-aether-cyan focus:bg-aether-dim transition ${className}`}

        {...props}
      />
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
      <div className="absolute inset-0 bg-aether-dark/90 backdrop-blur" onClick={onClose} />
      <div className="relative w-full max-w-xl animate-float">
        <PixelCard title={title} glow="blue">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-aether-cyan hover:text-white text-xl font-header"
          >
            ✕
          </button>
          {children}
        </PixelCard>
      </div>
    </div>
  )
}
