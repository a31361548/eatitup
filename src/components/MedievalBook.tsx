'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TiptapEditor } from './TiptapEditor'

interface MedievalBookProps {
  isOpen: boolean
  onClose: () => void
  noteId: string | null
  initialTitle?: string
  onSave: (title: string, content: string) => Promise<void>
  onDelete?: () => Promise<void>
}

type PagesContent = Record<number, string>

const MAX_PAGES = 5

export function MedievalBook({
  isOpen,
  onClose,
  noteId,
  initialTitle = '',
  onSave,
  onDelete
}: MedievalBookProps) {
  const [pageState, setPageState] = useState<'cover' | 'content'>('cover')
  const [title, setTitle] = useState(initialTitle)
  const [pages, setPages] = useState<PagesContent>({ 1: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      if (noteId) {
        setPageState('content')
        fetchNoteContent()
      } else {
        setPageState('cover')
        setTitle('')
        setPages({ 1: '' })
        setCurrentPage(1)
      }
    }
  }, [isOpen, noteId])

  const fetchNoteContent = async () => {
    if (!noteId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/notes/${noteId}`)
      if (res.ok) {
        const data = await res.json()
        setTitle(data.note.title)
        
        // Try to parse as JSON for multi-page, fallback to single string
        try {
          const parsedContent = JSON.parse(data.note.content)
          if (typeof parsedContent === 'object' && parsedContent !== null) {
            setPages(parsedContent)
          } else {
            setPages({ 1: data.note.content })
          }
        } catch {
          // Not JSON, assume old format (single page)
          setPages({ 1: data.note.content })
        }
        setCurrentPage(1)
      }
    } catch (error) {
      console.error('Failed to load note', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      // Serialize pages to JSON
      const contentToSave = JSON.stringify(pages)
      await onSave(title, contentToSave)
      
      if (pageState === 'cover') {
        setPageState('content')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setPageState('cover')
      setCurrentPage(1)
    }, 500)
  }

  const handleCancelCreate = () => {
    handleClose()
  }

  const updateCurrentPageContent = (content: string) => {
    setPages(prev => ({
      ...prev,
      [currentPage]: content
    }))
  }

  const changePage = (delta: number) => {
    const newPage = currentPage + delta
    if (newPage >= 1 && newPage <= MAX_PAGES) {
      setCurrentPage(newPage)
    }
  }

  const bookVariants = {
    closed: { rotateY: 0, rotateX: 0, scale: 0.8, opacity: 0 },
    open: { rotateY: 0, rotateX: 0, scale: 1, opacity: 1, transition: { duration: 0.5 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } }
  }

  const coverVariants = {
    closed: { rotateY: 0 },
    open: { rotateY: -180, transition: { duration: 0.8, ease: "easeInOut" } }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 perspective-1000">
          <motion.div
            initial="closed"
            animate="open"
            exit="exit"
            variants={bookVariants}
            className="relative h-[85vh] w-full max-w-4xl perspective-1000"
          >
            {/* Book Container */}
            <div className={`relative h-full w-full transition-all duration-700 transform-style-3d ${pageState === 'content' ? 'rotate-y-0' : ''}`}>
              
              {/* Back Cover (Static base) */}
              <div className="absolute inset-0 rounded-r-2xl bg-[#3e2723] shadow-2xl border-l-4 border-[#2d1b16]">
                {/* Metal Corners (Back) */}
                <div className="absolute -top-2 -right-2 w-16 h-16 border-t-4 border-r-4 border-[#d4af37] rounded-tr-lg bg-gradient-to-br from-[#ffd700] to-[#b8860b] clip-corner shadow-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-4 border-r-4 border-[#d4af37] rounded-br-lg bg-gradient-to-br from-[#ffd700] to-[#b8860b] clip-corner shadow-lg"></div>
              </div>

              {/* Pages (Content) */}
              <div className="absolute inset-y-2 right-2 left-4 rounded-r-xl bg-[#f4e4bc] shadow-inner overflow-hidden flex flex-col"
                   style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
                     backgroundBlendMode: 'multiply'
                   }}>
                
                {/* Header / Toolbar */}
                <div className="flex items-center justify-between border-b border-[#d7c69c] bg-[#e8d5a8]/80 px-6 py-3 backdrop-blur-sm">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="手札標題..."
                    className="bg-transparent text-2xl font-serif font-bold text-[#2d1b16] placeholder-[#2d1b16]/40 focus:outline-none w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-full bg-[#2d1b16] px-4 py-1 text-sm font-semibold text-[#f4e4bc] hover:bg-[#4e342e] disabled:opacity-50 shadow-md"
                    >
                      {saving ? '紀錄中...' : '紀錄'}
                    </button>
                    {noteId && onDelete && (
                      <button
                        onClick={onDelete}
                        className="rounded-full border border-[#5d4037] px-4 py-1 text-sm font-semibold text-[#5d4037] hover:bg-[#d7ccc8]"
                      >
                        撕毀
                      </button>
                    )}
                    <button
                      onClick={handleClose}
                      className="rounded-full p-1 text-[#5d4037] hover:bg-[#d7ccc8]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 overflow-y-auto p-6 font-serif text-[#2d1b16] custom-scrollbar relative">
                  {loading ? (
                    <div className="flex h-full items-center justify-center text-[#8d6e63]">
                      翻閱中...
                    </div>
                  ) : (
                    // Key by currentPage to force re-render when page changes, ensuring content updates
                    <div className="prose prose-p:text-[#2d1b16] prose-headings:text-[#2d1b16] max-w-none">
                       <TiptapEditor 
                        key={currentPage}
                        content={pages[currentPage] || ''} 
                        onChange={updateCurrentPageContent} 
                        editable={true}
                        darkControls={true} // We'll need to add this prop to TiptapEditor
                      />
                    </div>
                  )}
                </div>
                
                {/* Footer / Pagination */}
                <div className="border-t border-[#d7c69c] bg-[#e8d5a8]/80 px-6 py-3 flex items-center justify-between text-[#5d4037] font-serif backdrop-blur-sm">
                  <button 
                    onClick={() => changePage(-1)}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-1 px-3 py-1 rounded hover:bg-[#d7ccc8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    上一頁
                  </button>
                  
                  <span className="font-bold tracking-widest">
                    - 第 {currentPage} 頁 / 共 {MAX_PAGES} 頁 -
                  </span>

                  <button 
                    onClick={() => changePage(1)}
                    disabled={currentPage >= MAX_PAGES}
                    className="flex items-center gap-1 px-3 py-1 rounded hover:bg-[#d7ccc8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    下一頁
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Front Cover (Animated) */}
              <motion.div
                initial={false}
                animate={pageState === 'content' ? 'open' : 'closed'}
                variants={coverVariants}
                className="absolute inset-y-0 left-0 w-full origin-left rounded-r-2xl bg-[#4e342e] shadow-2xl backface-hidden flex items-center justify-center border-l-4 border-[#3e2723]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Metal Corners (Front) */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#d4af37] rounded-tr-xl bg-gradient-to-br from-[#ffd700] via-[#b8860b] to-[#8b4513] shadow-lg" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}>
                   <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#8b4513] shadow-inner border border-[#d4af37]"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#d4af37] rounded-br-xl bg-gradient-to-tr from-[#ffd700] via-[#b8860b] to-[#8b4513] shadow-lg" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}>
                   <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-[#8b4513] shadow-inner border border-[#d4af37]"></div>
                </div>

                {/* Cover Design */}
                <div className="absolute inset-6 rounded border-2 border-[#8d6e63] flex flex-col items-center justify-center p-8 text-center bg-[#3e2723]/50">
                  <div className="mb-8 text-[#d7ccc8] opacity-80 drop-shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  
                  {noteId ? (
                    <h2 className="text-4xl font-serif font-bold text-[#f4e4bc] tracking-wider mb-4 drop-shadow-lg">{title || '無題'}</h2>
                  ) : (
                    <div className="w-full max-w-md space-y-8">
                      <h2 className="text-3xl font-serif font-bold text-[#f4e4bc] tracking-wider drop-shadow-lg">新篇章</h2>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="為此篇章命名..."
                        className="w-full bg-transparent border-b-2 border-[#8d6e63] text-center text-2xl text-[#f4e4bc] placeholder-[#8d6e63] focus:outline-none focus:border-[#f4e4bc] transition-colors py-2 font-serif"
                        autoFocus
                      />
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={handleCancelCreate}
                          className="px-6 py-2 rounded-full border border-[#8d6e63] text-[#d7ccc8] font-serif hover:bg-[#4e342e] transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => {
                            if (title.trim()) setPageState('content')
                          }}
                          disabled={!title.trim()}
                          className="px-8 py-2 rounded-full bg-[#5d4037] text-[#f4e4bc] font-serif tracking-widest hover:bg-[#4e342e] disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg border border-[#8d6e63]"
                        >
                          開啟手札
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {!noteId && (
                     <div className="mt-12 text-[#8d6e63] text-sm font-serif">
                       EatItUp 冒險者日誌
                     </div>
                  )}
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
