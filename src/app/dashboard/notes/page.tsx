'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Note {
  id: string
  title: string
  updatedAt: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes)
        setLoading(false)
      })
  }, [])

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteTitle.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newNoteTitle }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/dashboard/notes/${data.id}`)
      }
    } catch (error) {
      console.error('Failed to create note', error)
      setCreating(false)
    }
  }

  if (loading) return <div className="text-white">載入中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">我的記事本</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-full bg-emerald-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          + 新增筆記
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/dashboard/notes/${note.id}`}
            className="group block rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-emerald-500/50 hover:bg-white/10"
          >
            <h3 className="mb-2 text-xl font-medium text-white group-hover:text-emerald-400 truncate">
              {note.title}
            </h3>
            <p className="text-sm text-white/40">
              {new Date(note.updatedAt).toLocaleDateString('zh-TW')}
            </p>
          </Link>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/40">
            目前沒有筆記，點擊右上角新增
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-semibold text-white">新增筆記</h2>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/60">標題</label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="輸入筆記標題..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg px-4 py-2 text-sm text-white/60 hover:text-white"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!newNoteTitle.trim() || creating}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  {creating ? '建立中...' : '建立'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
