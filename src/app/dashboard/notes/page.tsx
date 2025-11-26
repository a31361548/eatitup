'use client'

import { useState, useEffect } from 'react'
import { HolographicPad } from '@/components/HolographicPad'
import Swal from 'sweetalert2'

interface Note {
  id: string
  title: string
  updatedAt: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [isPadOpen, setIsPadOpen] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = () => {
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes)
        setLoading(false)
      })
      .catch(err => console.error('Fetch error:', err))
  }

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      if (res.ok) {
        await fetchNotes()
      }
    } catch (error) {
      console.error('Failed to create note', error)
    }
  }

  const handleUpdateNote = async (title: string, content: string) => {
    if (!selectedNoteId) {
      return handleCreateNote(title, content)
    }

    try {
      await fetch(`/api/notes/${selectedNoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      fetchNotes()
    } catch (error) {
      console.error('Failed to update note', error)
    }
  }

  const handleDeleteNote = async () => {
    if (!selectedNoteId) return

    const result = await Swal.fire({
      title: '刪除資料日誌？',
      text: "此動作無法復原，確定要執行刪除程序嗎？",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0055',
      cancelButtonColor: '#114242',
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消',
      background: '#041C1C',
      color: '#67E8F9'
    })

    if (result.isConfirmed) {
      try {
        await fetch(`/api/notes/${selectedNoteId}`, { method: 'DELETE' })
        setIsPadOpen(false)
        fetchNotes()
        Swal.fire({
          title: '已刪除',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#041C1C',
          color: '#67E8F9'
        })
      } catch (error) {
        console.error('Failed to delete note', error)
      }
    }
  }

  const openNewNote = () => {
    setSelectedNoteId(null)
    setIsPadOpen(true)
  }

  const openNote = (id: string) => {
    setSelectedNoteId(id)
    setIsPadOpen(true)
  }

  if (loading) return <div className="text-aether-cyan p-8 font-tech animate-pulse">資料庫初始化中...</div>

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none bg-tech-grid-overlay opacity-20" />
      
      <div className="flex items-center justify-between mb-8 shrink-0 relative z-10">
        <div>
            <h1 className="text-4xl font-header text-white drop-shadow-[0_0_10px_rgba(103,232,249,0.5)]">
            資料日誌
            </h1>
            <p className="font-tech text-aether-cyan/60 tracking-widest text-sm mt-2">SECURE STORAGE // ENCRYPTED</p>
        </div>
        
        <button
          onClick={openNewNote}
          className="group relative overflow-hidden bg-aether-dim/50 border border-aether-cyan/50 px-8 py-3 font-tech font-bold text-aether-cyan shadow-[0_0_15px_rgba(103,232,249,0.2)] transition-all hover:bg-aether-cyan/20 hover:shadow-[0_0_25px_rgba(103,232,249,0.4)] clip-path-slant"
        >
          <span className="relative z-10 tracking-widest">+ 新增日誌</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-aether-cyan/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {notes.map((note) => (
                <div 
                    key={note.id} 
                    onClick={() => openNote(note.id)}
                    className="group relative aspect-[4/3] cursor-pointer transition-all duration-300 hover:-translate-y-1"
                >
                    {/* Holographic Card */}
                    <div className="absolute inset-0 bg-[#041C1C]/80 border border-aether-cyan/30 shadow-[0_0_10px_rgba(103,232,249,0.1)] group-hover:border-aether-cyan group-hover:shadow-[0_0_20px_rgba(103,232,249,0.3)] backdrop-blur-sm overflow-hidden flex flex-col">
                        {/* Header Bar */}
                        <div className="h-1 w-full bg-aether-cyan/20 group-hover:bg-aether-cyan transition-colors" />
                        
                        {/* Content Preview */}
                        <div className="flex-1 p-4 flex flex-col justify-between relative">
                            {/* Scanline Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(103,232,249,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
                            
                            <h3 className="text-white font-tech text-lg font-bold line-clamp-2 tracking-wide group-hover:text-aether-cyan transition-colors">
                                {note.title}
                            </h3>
                            
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-[10px] font-pixel text-aether-cyan/40 uppercase tracking-widest">
                                    ID: {note.id.slice(0, 6)}
                                </span>
                                <div className="w-2 h-2 bg-aether-cyan/50 rounded-full animate-pulse" />
                            </div>
                        </div>
                        
                        {/* Corner Accents */}
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-aether-cyan/50" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-aether-cyan/50" />
                    </div>
                </div>
            ))}
        </div>
        
        {notes.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-aether-cyan/30">
                <div className="w-16 h-16 border-2 border-dashed border-aether-cyan/30 rounded-full animate-spin-slow mb-4" />
                <p className="text-xl font-tech tracking-widest">無資料</p>
                <p className="text-sm mt-2 font-pixel">請建立新日誌以開始</p>
            </div>
        )}
      </div>

      <HolographicPad
        isOpen={isPadOpen}
        onClose={() => setIsPadOpen(false)}
        noteId={selectedNoteId}
        onSave={handleUpdateNote}
        onDelete={handleDeleteNote}
      />
    </div>
  )
}
