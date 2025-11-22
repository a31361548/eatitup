'use client'

import { useState, useEffect } from 'react'
import { MedievalBook } from '@/components/MedievalBook'
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
        setIsBookOpen(false)
        Swal.fire({
          icon: 'success',
          title: '已建立',
          timer: 1500,
          showConfirmButton: false,
          background: '#3e2723',
          color: '#f4e4bc'
        })
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
      Swal.fire({
        icon: 'success',
        title: '已儲存',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1500,
        background: '#3e2723',
        color: '#f4e4bc'
      })
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

  // Group notes into chunks of 15 for shelf units (3 shelves * 5 books)
  const shelfUnits = []
  for (let i = 0; i < notes.length; i += 15) {
    shelfUnits.push(notes.slice(i, i + 15))
  }
  // Always ensure at least one empty shelf unit if no notes
  if (shelfUnits.length === 0) {
    shelfUnits.push([])
  }

  if (loading) return <div className="text-white">整理書架中...</div>

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h1 className="text-4xl font-serif font-bold text-[#f4e4bc] drop-shadow-lg">
          冒險者書架
        </h1>
        <button
          onClick={openNewNote}
          className="group relative overflow-hidden rounded-full bg-[#5d4037] px-8 py-3 font-serif font-bold text-[#f4e4bc] shadow-lg transition-all hover:bg-[#4e342e] hover:scale-105 hover:shadow-emerald-500/20"
        >
          <span className="relative z-10">+ 撰寫新篇章</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </div>

      {/* Horizontal Bookshelf Container */}
      <div className="flex-1 flex overflow-x-auto items-center gap-16 pb-8  custom-scrollbar">
        {shelfUnits.map((unitNotes, index) => (
          <div key={index} className="relative shrink-0 w-[400px] h-[90%] flex flex-col justify-between bg-[#2d1b16] border-x-4 border-t-4 border-[#3e2723] rounded-t-2xl shadow-2xl pt-8 pb-4">
            {/* Shelf Top Decoration */}
            <div className="absolute -top-5 left-0 right-0 h-5 bg-[#3e2723] rounded-t-lg flex justify-center">
               <div className="w-1/3 h-full bg-[#4e342e] rounded-t-lg shadow-inner"></div>
            </div>

            {/* 3 Shelves Loop */}
            {[0, 1, 2].map((shelfIndex) => (
              <div key={shelfIndex} className="relative flex-1 w-full px-4 flex items-end border-b-[16px] border-[#3e2723] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)]">
                {/* Shelf Background Depth */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                
                {/* Books on this shelf (slice of 5) */}
                <div className="relative z-10 w-full h-[90%] grid grid-cols-5 gap-2 items-end">
                  {unitNotes.slice(shelfIndex * 5, (shelfIndex + 1) * 5).map((note) => (
                    <div key={note.id} className="group relative flex flex-col items-center justify-end h-full">
                      <button
                        onClick={() => openNote(note.id)}
                        className="relative w-full rounded-sm shadow-md transition-all duration-300 
                                   group-hover:-translate-y-4 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] 
                                   group-hover:z-20 z-10
                                   border-l border-white/10 border-r border-black/20"
                        style={{ 
                           height: `${Math.max(80, 90 + (note.title.length % 3) * 3)}%`, 
                           backgroundColor: ['#4e342e', '#3e2723', '#5d4037', '#2d1b16', '#795548'][note.title.length % 5],
                           backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0.3) 100%)'
                        }}
                      >
                        {/* Spine Details */}
                        <div className="absolute top-2 left-0 right-0 h-px bg-[#f4e4bc]/30 mx-1"></div>
                        <div className="absolute bottom-2 left-0 right-0 h-px bg-[#f4e4bc]/30 mx-1"></div>
                        
                        {/* Title on Spine (Vertical with Ellipsis) */}
                        <div className="absolute inset-1 flex items-center justify-center overflow-hidden">
                          <p className="writing-vertical-rl text-xs font-serif font-bold text-[#f4e4bc] tracking-wider drop-shadow-md m-0 max-h-full overflow-hidden" style={{ lineHeight: '1.2' }}>
                            {note.title.length > 15 ? note.title.slice(0, 15) + '...' : note.title}
                          </p>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
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
