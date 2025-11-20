'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteListButton({ listId }: { listId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('確定要刪除這個清單嗎？此動作無法復原。')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/lists/${listId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('刪除失敗')
      }
    } catch (error) {
      console.error(error)
      alert('發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-200 hover:bg-red-500/20 disabled:opacity-50"
    >
      {loading ? '刪除中...' : '刪除'}
    </button>
  )
}
