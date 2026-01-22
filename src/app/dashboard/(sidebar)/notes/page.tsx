'use client'

import { useState, useEffect } from 'react'
import { HolographicPad } from '@/components/HolographicPad'
import { HoloWindow } from '@/components/ui/HoloWindow'
import { TechButton } from '@/components/ui/TechButton'
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
      .catch((err) => console.error('Fetch error:', err))
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
      confirmButtonColor: 'var(--color-samurai-red)',
      cancelButtonColor: 'var(--color-samurai-dim)',
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消',
      background: 'var(--color-samurai-dark)',
      color: 'var(--color-samurai-yellow)'

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
          background: '#09090B',
          color: '#3B82F6'

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

  if (loading) return <div className="p-8 font-tech text-samurai-blue animate-pulse">資料庫初始化中...</div>

  return (
    <HoloWindow
      title="DATA ARCHIVE"
      className="h-full"
      controls={
        <TechButton variant="primary" className="!px-4 !py-2 text-[11px]" onClick={openNewNote}>
          新增日誌
        </TechButton>
      }
    >
      <div className="flex h-full flex-col space-y-8">
        <section className="rounded-[32px] border border-white/10 bg-black/30 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">檔案總覽</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-pixel text-pixel-xl uppercase tracking-[0.35em]">資料日誌庫</h1>
              <p className="text-sm text-white/70">蒐集靈感、任務紀錄與任何重要觀察，點擊卡片即可開啟。</p>
            </div>
            <div className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">
              總計 {notes.length} 筆
            </div>
          </div>
        </section>

        <section className="flex-1 overflow-hidden rounded-[32px] border border-white/10 bg-black/20 p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => openNote(note.id)}
                className="h-36 rounded-[24px] border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-black/30 p-4 text-left text-white shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-samurai-blue/60"
              >
                <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">ID {note.id.slice(0, 6)}</p>
                <h3 className="mt-2 line-clamp-2 text-lg font-heading">{note.title}</h3>
                <p className="mt-4 text-xs text-white/50">{new Date(note.updatedAt).toLocaleDateString('zh-TW')}</p>
              </button>
            ))}
          </div>
          {notes.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-white/60">
              <p>目前尚無日誌，點擊右上角新增一筆。</p>
            </div>
          )}
        </section>
      </div>

      <HolographicPad
        isOpen={isPadOpen}
        onClose={() => setIsPadOpen(false)}
        noteId={selectedNoteId}
        onSave={handleUpdateNote}
        onDelete={handleDeleteNote}
      />
    </HoloWindow>
  )
}
