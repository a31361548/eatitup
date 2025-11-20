'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/TiptapEditor'

export default function NoteEditorPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/notes/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Note not found')
        return res.json()
      })
      .then((data) => {
        setTitle(data.note.title)
        setContent(data.note.content)
        setLoading(false)
      })
      .catch(() => {
        router.push('/dashboard/notes')
      })
  }, [params.id, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/notes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('確定要刪除這篇筆記嗎？')) return
    await fetch(`/api/notes/${params.id}`, { method: 'DELETE' })
    router.push('/dashboard/notes')
  }

  if (loading) return <div className="text-white">載入中...</div>

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-white/30 focus:outline-none"
          placeholder="筆記標題"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {saving ? '儲存中...' : '儲存'}
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-500/20"
          >
            刪除
          </button>
        </div>
      </div>

      <TiptapEditor content={content} onChange={setContent} />
    </div>
  )
}
