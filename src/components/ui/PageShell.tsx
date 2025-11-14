import { ReactNode } from 'react'
import clsx from 'clsx'

type PageShellProps = {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps): React.ReactElement {
  return (
    <section className={clsx('mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:pt-32', className)}>
      {children}
    </section>
  )
}
