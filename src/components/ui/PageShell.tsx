import { ReactNode } from 'react'
import clsx from 'clsx'

type PageShellProps = {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps): React.ReactElement {
  return (
    <section className={clsx('relative mx-auto w-full max-w-[1920px] px-4 py-12 text-aether-mint md:px-6', className)}>
      <div className="pointer-events-none absolute inset-0 pixel-grid opacity-20" />
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}
