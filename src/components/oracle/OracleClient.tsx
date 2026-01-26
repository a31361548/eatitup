'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TechButton } from '@/components/ui/TechButton'
import { ElvenWheel } from '@/components/ElvenWheel'
import { ForgeArchive } from '@/components/ForgeArchive'
import type { List, Item } from '@prisma/client'

type OracleList = List & { items: Item[] }

interface OracleClientProps {
  initialLists: OracleList[]
}

export function OracleClient({ initialLists }: OracleClientProps) {
  const searchParams = useSearchParams()
  const [selectedList, setSelectedList] = useState<OracleList | null>(null)
  const [customInput, setCustomInput] = useState('')
  const [mode, setMode] = useState<'SELECT' | 'CUSTOM'>('SELECT') // SELECT from lists or CUSTOM input
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  useEffect(() => {
    const items = searchParams.get('items')
    if (items) {
      const decoded = decodeURIComponent(items)
      setCustomInput(decoded.split(',').join('\n'))
      setMode('CUSTOM')
    }
  }, [searchParams])
  
  // Derived options
  const options = mode === 'SELECT' && selectedList
    ? selectedList.items.flatMap(item => Array(item.weight).fill(item.label))
    : customInput.split('\n').filter(s => s.trim().length > 0)

  const handleListSelect = (list: OracleList) => {
    setSelectedList(list)
    setMode('SELECT')
    setWinner(null)
  }

  const handleSpinStart = () => {
    if (options.length < 2) return
    setIsSpinning(true)
    setWinner(null)
  }

  const handleSpinEnd = (result: string) => {
    setIsSpinning(false)
    setWinner(result)
  }

  return (
    <div className="grid h-[calc(100vh-140px)] gap-6 lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr]">
      {/* Left Panel: Protocol Selector */}
      <section className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-samurai-dim/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        <header>
           <h2 className="font-pixel text-lg text-samurai-blue uppercase tracking-widest">資料來源選擇</h2>
           <p className="text-xs text-white/50 font-tech tracking-wider mt-1">步驟 1：選擇資料來源</p>
        </header>

        <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
           <button 
             onClick={() => setMode('SELECT')}
             className={`flex-1 py-2 text-xs font-tech tracking-wider rounded transition-colors ${mode === 'SELECT' ? 'bg-samurai-blue/20 text-samurai-blue' : 'text-white/40 hover:text-white'}`}
           >
             資料庫
           </button>
           <button 
             onClick={() => setMode('CUSTOM')}
             className={`flex-1 py-2 text-xs font-tech tracking-wider rounded transition-colors ${mode === 'CUSTOM' ? 'bg-samurai-yellow/20 text-samurai-yellow' : 'text-white/40 hover:text-white'}`}
           >
             手動輸入
           </button>
        </div>


        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
           {mode === 'SELECT' ? (
             initialLists.map(list => (
               <button
                 key={list.id}
                 onClick={() => handleListSelect(list)}
                 className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${
                   selectedList?.id === list.id 
                     ? 'bg-samurai-blue/10 border-samurai-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                     : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'
                 }`}
               >
                 <div className="flex justify-between items-start">
                    <span className="font-heading text-sm">{list.title}</span>
                    <span className="text-[10px] font-mono opacity-50">{list.items.length} 筆</span>
                 </div>
                 <div className="mt-2 flex flex-wrap gap-1">
                   {list.items.slice(0, 3).map(item => (
                     <span key={item.id} className="text-[10px] bg-black/30 px-2 py-0.5 rounded text-white/40">
                       {item.label}
                     </span>
                   ))}
                 </div>
               </button>
             ))
           ) : (
             <div className="h-full">
               <ForgeArchive 
                 input={customInput} 
                 setInput={setCustomInput} 
                 isSpinning={isSpinning} 
                 onSpin={handleSpinStart} // ForgeArchive calls this, but we hide its button usually? 
                 optionsCount={options.length}
               />
               {/* Note: ForgeArchive includes a Spin button. We might want to control it externally or let it be. */}
             </div>
           )}
        </div>
      </section>

      {/* Right Panel: The Wheel */}
      <section className="relative flex flex-col items-center justify-center rounded-[40px] border border-white/10 bg-gradient-to-b from-samurai-dim to-black p-8 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
         {/* Background Grid */}
         <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(244,63,94,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
         
         {/* Title or Status */}
         <div className="absolute top-8 left-8 z-20">
            <div className="flex items-center gap-3">
               <div className={`w-3 h-3 rounded-full ${isSpinning ? 'bg-samurai-yellow animate-ping' : 'bg-samurai-red'}`} />
                <span className="font-tech text-xs tracking-[0.3em] text-white/60">
                  {isSpinning ? '步驟 3：運轉中...' : '步驟 2：準備資料'}
                </span>
            </div>
         </div>

         {/* The Wheel */}
         <div className="w-full max-w-2xl relative z-10">
             <ElvenWheel options={options.length > 0 ? options : ['等待資料', '請選擇來源']} isSpinning={isSpinning} onSpinEnd={handleSpinEnd} />
         </div>

         {/* Control Deck */}
         <div className="absolute bottom-8 z-20 flex flex-col items-center gap-4">
            {winner ? (
              <div className="animate-in zoom-in duration-300 flex flex-col items-center gap-4">
                 <div className="px-12 py-6 bg-black/90 border-2 border-samurai-blue rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.5)] text-center backdrop-blur-xl">
                     <p className="font-tech text-xs text-samurai-blue tracking-[0.5em] mb-2">結果已確認</p>
                     <h1 className="font-heading text-4xl md:text-5xl text-white">{winner}</h1>
                  </div>
                  <TechButton variant="primary" onClick={() => setWinner(null)}>
                    重新啟動
                  </TechButton>
              </div>
            ) : (
              <TechButton 
                variant="primary" 
                onClick={handleSpinStart}
                disabled={isSpinning || options.length < 2}
                className="min-w-[200px]"
              >
                {isSpinning ? '運轉中...' : '啟動輪盤'}
              </TechButton>
            )}
         </div>
      </section>
    </div>
  )
}
