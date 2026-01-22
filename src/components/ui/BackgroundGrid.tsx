
export function BackgroundGrid() {
  return (
    <>
      <div className="fixed inset-0 bg-samurai-dark -z-50" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(244,63,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-40" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-samurai-dark/50 to-samurai-dark pointer-events-none -z-30" />
      
      {/* Central Axis */}
      <div className="fixed top-0 bottom-0 left-1/2 w-px bg-samurai-red/10 pointer-events-none -z-20" />
    </>
  )
}
