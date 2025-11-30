import Link from 'next/link'
import { TechButton } from '@/components/ui/TechButton'
import { TODO_STATUS_LABEL, type Todo } from '@/types/todo'
import clsx from 'clsx'

interface MissionControlWidgetProps {
  todos: Todo[]
}

export function MissionControlWidget({ todos }: MissionControlWidgetProps) {
  return (
    <div className="relative h-full w-full bg-aether-dark/80 p-6 clip-path-angle-sm border-r-4 border-aether-teal flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-aether-teal rounded-sm animate-ping" />
            MISSION CONTROL
        </h3>
        <Link href="/dashboard/todos" className="text-xs font-tech text-aether-teal hover:text-white transition-colors">
            VIEW_ALL &gt;&gt;
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {todos.length > 0 ? (
            todos.map(todo => (
                <div key={todo.id} className="group relative p-3 bg-aether-cyan/5 border border-aether-cyan/10 hover:border-aether-cyan/50 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-heading text-sm text-white group-hover:text-aether-cyan transition-colors">{todo.title}</h4>
                            <p className="text-[10px] font-tech text-aether-mint/50 mt-1">
                                T-MINUS: {new Date(todo.endAt).toLocaleDateString()}
                            </p>
                        </div>
                        <span className={clsx(
                            'text-[10px] px-2 py-0.5 border font-tech uppercase',
                            todo.status === 'COMPLETED' ? 'border-green-500 text-green-500' : 
                            todo.status === 'IN_PROGRESS' ? 'border-aether-gold text-aether-gold' : 
                            'border-aether-cyan text-aether-cyan'
                        )}>
                            {TODO_STATUS_LABEL[todo.status]}
                        </span>
                    </div>
                    {/* Hover Action */}
                    <div className="absolute inset-0 bg-aether-dark/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                        <Link href={`/dashboard/todos/${todo.id}`}>
                            <TechButton variant="secondary" className="!py-1 !px-4 !text-xs">INITIATE</TechButton>
                        </Link>
                    </div>
                </div>
            ))
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-aether-mint/30 gap-2 border-2 border-dashed border-aether-cyan/10 rounded">
                <span className="text-2xl">⚠</span>
                <span className="font-tech text-xs tracking-widest">NO ACTIVE MISSIONS</span>
            </div>
        )}
      </div>
    </div>
  )
}
