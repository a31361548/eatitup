'use client'

import { useState, useEffect } from 'react'
import { MedievalBook } from '../../../components/MedievalBook'
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
  const [isBookOpen, setIsBookOpen] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = () => {
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched notes:', data.notes)
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
        // Don't close book here, let MedievalBook handle it or user close it
        // Actually, if it's a new note, we might want to keep it open or close it?
        // The MedievalBook handleSave calls onSave.
        // If we want to close after save, we can. But usually we keep editing.
        // Let's just refresh the list.
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
      title: '確定要撕毀這頁手札嗎？',
      text: "此動作無法復原",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '是的，撕毀它',
      cancelButtonText: '取消',
      background: '#3e2723',
      color: '#f4e4bc'
    })

    if (result.isConfirmed) {
      try {
        await fetch(`/api/notes/${selectedNoteId}`, { method: 'DELETE' })
        setIsBookOpen(false)
        fetchNotes()
        Swal.fire({
          title: '已撕毀',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#3e2723',
          color: '#f4e4bc'
        })
      } catch (error) {
        console.error('Failed to delete note', error)
      }
    }
  }

  const openNewNote = () => {
    setSelectedNoteId(null)
    setIsBookOpen(true)
  }

  const openNote = (id: string) => {
    setSelectedNoteId(id)
    setIsBookOpen(true)
  }

  if (loading) return <div className="text-white p-8">整理書架中...</div>

  return (
    <div className=" flex flex-col  overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h1 className="text-4xl font-serif font-bold text-[#f4e4bc] drop-shadow-lg">
          記事本
        </h1>
        <button
          onClick={openNewNote}
          className="group relative overflow-hidden rounded-full bg-[#5d4037] px-8 py-3 font-serif font-bold text-[#f4e4bc] shadow-lg transition-all hover:bg-[#4e342e] hover:scale-105 hover:shadow-emerald-500/20"
        >
          <span className="relative z-10">+ 撰寫新篇</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar no-scrollbar p-4">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* New Note Placeholder (Optional, or just use button above) */}
            
            {notes.map((note) => (
                <div 
                    key={note.id} 
                    onClick={() => openNote(note.id)}
                    className="group relative aspect-[3/4] cursor-pointer perspective-1000"
                >
                    {/* Book Cover */}
                    <div className="absolute inset-0 bg-[#3e2723] rounded-r-lg shadow-xl transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-y-[-15deg] group-hover:shadow-2xl border-l-4 border-[#2d1b16]">
                        {/* Leather Texture */}
                        <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-overlay rounded-r-lg"></div>
                        
                        {/* Decorative Corners */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d4af37] rounded-tr-md"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4af37] rounded-br-md"></div>

                        {/* Title Box */}
                        <div className="absolute top-1/4 left-4 right-4 border border-[#8d6e63] p-2 flex items-center justify-center bg-black/20">
                            <h3 className="text-[#f4e4bc] font-serif text-center font-bold line-clamp-3 drop-shadow-md">
                                {note.title}
                            </h3>
                        </div>

                        {/* Spine Hint */}
                        <div className="absolute left-2 top-0 bottom-0 w-1 bg-[#2d1b16]/50"></div>
                    </div>
                    
                    {/* Pages Hint (Side View) */}
                    <div className="absolute right-0 top-1 bottom-1 w-2 bg-[#f3e9d2] rounded-r-sm transform translate-z-[-2px] translate-x-[2px] shadow-sm group-hover:translate-x-[4px] transition-transform duration-300"></div>
                </div>
            ))}
        </div>
        
        {notes.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#8d6e63] opacity-50">
                <p className="text-2xl font-serif mb-4">書架空空如也...</p>
                <p>點擊右上角開始撰寫您的第一篇冒險日誌</p>
            </div>
        )}
      </div>

      <MedievalBook
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        noteId={selectedNoteId}
        onSave={handleUpdateNote}
        onDelete={handleDeleteNote}
      />
    </div>
  )
}
