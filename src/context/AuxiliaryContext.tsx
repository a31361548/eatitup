'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type AuxView = 'SYSTEM_STATUS' | 'QUICK_NOTE' | 'WHEEL_PREVIEW' | 'NONE'

interface AuxiliaryContextType {
  currentView: AuxView
  setView: (view: AuxView) => void
  data: unknown
  setData: (data: unknown) => void
  toggleView: (view: AuxView, data?: unknown) => void
  isMobileOpen: boolean
  toggleMobileMenu: () => void
}

const AuxiliaryContext = createContext<AuxiliaryContextType | undefined>(undefined)

export function AuxiliaryProvider({ children }: { children: ReactNode }) {
  const [currentView, setView] = useState<AuxView>('SYSTEM_STATUS')
  const [data, setData] = useState<unknown>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileOpen(prev => !prev)

  const toggleView = (view: AuxView, newData?: unknown) => {
    if (currentView === view && !newData) {
      // Toggle off if same view and no new data
      setView('SYSTEM_STATUS')
    } else {
      setView(view)
      if (newData) setData(newData)
      // Auto open mobile menu when view changes explicitly
      setIsMobileOpen(true)
    }
  }

  return (
    <AuxiliaryContext.Provider value={{ currentView, setView, data, setData, toggleView, isMobileOpen, toggleMobileMenu }}>
      {children}
    </AuxiliaryContext.Provider>
  )
}



export function useAuxiliary() {
  const context = useContext(AuxiliaryContext)
  if (context === undefined) {
    throw new Error('useAuxiliary must be used within an AuxiliaryProvider')
  }
  return context
}
