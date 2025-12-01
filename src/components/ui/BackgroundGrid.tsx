import React from 'react'

export function BackgroundGrid() {
  return (
    <>
      <div className="fixed inset-0 bg-[#041C1C] -z-50" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(103,232,249,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-40" />
      <div className="fixed inset-0 bg-gradient-to-b from-[#041C1C] via-transparent to-[#041C1C] pointer-events-none -z-30" />
      <div className="fixed top-0 bottom-0 left-1/2 w-px bg-aether-cyan/5 pointer-events-none -z-20" />
    </>
  )
}
