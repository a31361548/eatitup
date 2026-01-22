'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/TiptapEditor'
import { TechButton } from '@/components/ui/TechButton'
import Swal from 'sweetalert2'

export default function NoteEditorPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [initialTitle, setInitialTitle] = useState('')
  const [initialContent, setInitialContent] = useState('')
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
        setInitialTitle(data.note.title)
        setInitialContent(data.note.content)
        setLoading(false)
      })
      .catch(() => {
        router.push('/dashboard/notes')
      })
  }, [params.id, router])

  const hasUnsavedChanges = useMemo(
    () => title !== initialTitle || content !== initialContent,
    [title, initialTitle, content, initialContent]
  )

  const navigateBack = () => {
    router.push('/dashboard/notes')
  }

  const handleSave = async ({ closeAfterSave = false }: { closeAfterSave?: boolean } = {}) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/notes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) {
        throw new Error('Failed to save note')
      }
      setInitialTitle(title)
      setInitialContent(content)
      if (closeAfterSave) {
        navigateBack()
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '儲存失敗',
        text: '請稍後再試',
        background: 'var(--color-samurai-dark)',
        color: 'var(--color-samurai-yellow)',
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

  const handleClose = async () => {
    if (!hasUnsavedChanges) {
      navigateBack()
      return
    }

    const result = await Swal.fire({
      title: '有變更尚未儲存',
      text: '要先儲存再離開嗎？',
      icon: 'warning',
      showCancelButton: false,
      showDenyButton: true,
      confirmButtonText: '儲存',
      denyButtonText: '捨棄',
      background: 'var(--color-samurai-dark)',
      color: 'var(--color-samurai-yellow)',
      confirmButtonColor: 'var(--color-samurai-success)',
      denyButtonColor: 'var(--color-samurai-red)',
    })

    if (result.isConfirmed) {
      await handleSave({ closeAfterSave: true })
    } else if (result.isDenied) {
      navigateBack()
    }
  }

  if (loading) return <div className="text-white">載入中...</div>

  return (
    <div className="fixed inset-x-0 bottom-0 top-24 z-40 overflow-y-auto bg-black/70 px-4 py-10 backdrop-blur-sm">
      <div className="relative mx-auto max-w-3xl space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl">
        <button
          aria-label="關閉筆記"
          onClick={handleClose}
          className="absolute -top-5 -right-5 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-white/30 focus:outline-none"
            placeholder="筆記標題"
          />
          <div className="flex items-center gap-2">
            <TechButton
              onClick={() => handleSave()}
              disabled={saving}
              variant="secondary"
              className="!px-4 !py-2 text-sm"
            >
              {saving ? '儲存中...' : '儲存'}
            </TechButton>
            <TechButton
              onClick={handleDelete}
              variant="danger"
              className="!px-4 !py-2 text-sm"
            >
              刪除
            </TechButton>
          </div>
        </div>

        <TiptapEditor content={content} onChange={setContent} />
      </div>
    </div>
  )
}
