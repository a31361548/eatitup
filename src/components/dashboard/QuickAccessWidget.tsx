import Link from 'next/link'

const ACTIONS = [
    { label: '新建任務', sub: 'NEW_TASK', href: '/dashboard/todos', icon: '⚡', color: 'border-aether-gold text-aether-gold' },
    { label: '隨機演算', sub: 'PROBABILITY', href: '/modes/wheel', icon: '◎', color: 'border-aether-cyan text-aether-cyan' },
    { label: '記事本', sub: 'DATA_LOG', href: '/dashboard/notes', icon: '≡', color: 'border-aether-teal text-aether-teal' },
    { label: '演算法庫', sub: 'ALGORITHMS', href: '/dashboard/lists', icon: '▤', color: 'border-aether-mint text-aether-mint' },
]

export function QuickAccessWidget() {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
        {ACTIONS.map(action => (
            <Link 
                key={action.sub} 
                href={action.href}
                className={`relative group bg-aether-dark/80 p-4 border ${action.color} border-opacity-30 hover:border-opacity-100 transition-all clip-path-angle-sm flex flex-col justify-between hover:bg-white/5`}
            >
                <div className="text-2xl opacity-80 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                <div>
                    <div className="text-lg font-heading font-bold">{action.label}</div>
                    <div className="text-[10px] font-tech opacity-50 tracking-widest">{action.sub}</div>
                </div>
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-current opacity-50" />
            </Link>
        ))}
    </div>
  )
}
