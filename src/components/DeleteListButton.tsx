'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export function DeleteListButton({ listId }: { listId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '刪除此模組？',
      text: "此動作無法復原，確定要刪除這個命運演算法嗎？",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0055',
      cancelButtonColor: '#114242',
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消',
      background: '#041C1C',
      color: '#67E8F9'
    })

    if (!result.isConfirmed) return

    setLoading(true)
    try {
      const res = await fetch(`/api/lists/${listId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
        Swal.fire({
            title: '已刪除',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#041C1C',
            color: '#67E8F9'
        })
      } else {
        Swal.fire({
            title: '刪除失敗',
            text: '無法刪除此模組',
            icon: 'error',
            background: '#041C1C',
            color: '#FF0055'
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        title: '發生錯誤',
        text: '系統發生預期外的錯誤',
        icon: 'error',
        background: '#041C1C',
        color: '#FF0055'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded border border-aether-alert/30 bg-aether-alert/10 px-4 py-2 font-tech text-xs uppercase tracking-widest text-aether-alert transition hover:bg-aether-alert/20 hover:border-aether-alert disabled:opacity-50"
    >
      {loading ? '刪除中...' : '刪除'}
    </button>
  )
}
