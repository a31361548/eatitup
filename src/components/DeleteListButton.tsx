'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { TechButton } from '@/components/ui/TechButton'

export function DeleteListButton({ listId }: { listId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '刪除此卷軸？',
      text: '此動作無法復原，確定要刪除此資料卷軸嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F43F5E',
      cancelButtonColor: '#09090B',
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消',
      background: '#09090B',
      color: '#FACC15',

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
          background: '#09090B',
          color: '#3B82F6',

        })
      } else {
        Swal.fire({
          title: '刪除失敗',
          text: '無法刪除此卷軸',
          icon: 'error',
          background: '#09090B',
          color: '#F43F5E',

        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        title: '發生錯誤',
        text: '系統發生預期外的錯誤',
        icon: 'error',
        background: '#09090B',
        color: '#F43F5E',

      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <TechButton variant="danger" onClick={handleDelete} disabled={loading} className="!px-4 !py-2 text-[11px]">
      {loading ? '刪除中…' : '刪除'}
    </TechButton>
  )
}
