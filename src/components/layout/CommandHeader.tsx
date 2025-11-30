export function CommandHeader() {
  const now = new Date()
  const date = now.toLocaleDateString('zh-TW')
  const time = now.toLocaleTimeString('en-US', { hour12: false })

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-20 w-full px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-3 rounded-3xl border border-white/10 bg-white/5/30 px-4 py-3 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-tech uppercase tracking-[0.4em] text-white/60">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            <p className="tracking-[0.5em]">PIXEL TEMPLE ONLINE</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>{date}</span>
            <span>{time}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-tech uppercase tracking-[0.6em] text-white/50">Aether Ritual Network</p>
            <p className="font-pixel text-pixel-base uppercase tracking-[0.45em]">聖殿通道 v3.0</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-tech uppercase tracking-[0.4em] text-white/60">
            <span>Encryption AES-256</span>
            <span>Latency &lt; 1ms</span>
            <span>Secure Link</span>
          </div>
        </div>
      </div>
    </div>
  )
}
