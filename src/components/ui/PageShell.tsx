import { ReactNode } from 'react'
import clsx from 'clsx'

type PageShellProps = {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps): React.ReactElement {
  return (
    <section className={clsx('relative mx-auto w-full max-w-[1920px] px-4 py-10 text-white sm:px-6 lg:px-10', className)}>
      <div className="pointer-events-none absolute inset-0 rounded-[48px] border border-cyan-500/10 bg-gradient-to-br from-white/5 via-transparent to-white/0 opacity-70 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute inset-0 rounded-[48px] border border-white/5" />
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(103,232,249,0.15), transparent 45%), radial-gradient(circle at 80% 10%, rgba(250,204,21,0.15), transparent 50%)' }} />
      <div className="relative z-10">{children}</div>
    </section>
  )
}
