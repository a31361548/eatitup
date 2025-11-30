"use client"

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { gsap } from 'gsap'
import Swal from 'sweetalert2'
import Cropper, { Area } from 'react-easy-crop'
import getCroppedImg from '@/lib/cropImage'
import { HoloWindow } from '@/components/ui/HoloWindow'
import { TechButton } from '@/components/ui/TechButton'

export default function SettingsPage() {
  const { update } = useSession()
  const [avatars, setAvatars] = useState<string[]>([])
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const avatarRefs = useRef<(HTMLButtonElement | null)[]>([])
  const modalRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/avatars')
      .then((res) => res.json())
      .then((data) => setAvatars(data.avatars || []))
      .catch((err) => console.error('Failed to load avatars:', err))
  }, [])

  useEffect(() => {
    if (previewImage && modalRef.current && modalContentRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(modalContentRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 })
    }
  }, [previewImage])

  const handleAvatarSelect = async (avatar: string) => {
    try {
      const res = await fetch('/api/user/avatar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar }),
      })
      if (res.ok) {
        setSelectedAvatar(avatar)
        await update({ avatar })
        Swal.fire({
          icon: 'success',
          title: 'Avatar Updated',
          toast: true,
          timer: 1200,
          position: 'top-end',
          showConfirmButton: false,
          background: '#041C1C',
          color: '#67E8F9',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: '更新失敗',
          text: '請稍後再試',
          background: '#041C1C',
          color: '#FF0055',
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: '無法連線到伺服器',
        background: '#041C1C',
        color: '#FF0055',
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleConfirmUpload = async () => {
    if (!previewImage || !croppedAreaPixels) return
    setUploading(true)
    try {
      const croppedBlob = await getCroppedImg(previewImage, croppedAreaPixels)
      if (!croppedBlob) throw new Error('Crop failed')
      const formData = new FormData()
      formData.append('file', croppedBlob, 'avatar.jpg')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        await handleAvatarSelect(data.url)
        handleCloseModal()
      } else {
        Swal.fire({
          icon: 'error',
          title: '上傳失敗',
          text: '請確認檔案格式',
          background: '#041C1C',
          color: '#FF0055',
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: '上傳中斷',
        background: '#041C1C',
        color: '#FF0055',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleCloseModal = () => {
    if (modalContentRef.current) {
      gsap.to(modalContentRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.3,
        onComplete: () => setPreviewImage(null),
      })
    } else {
      setPreviewImage(null)
    }
  }

  const handleAvatarHover = (index: number, hovering: boolean) => {
    const el = avatarRefs.current[index]
    if (!el) return
    gsap.to(el, { scale: hovering ? 1.05 : 1, duration: 0.2 })
  }

  return (
    <HoloWindow title="PIXEL IDENTITY LAB" className="h-full">
      <div className="space-y-10">
        <section className="rounded-[36px] border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-black/20 p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">Avatar Matrix</p>
              <h2 className="font-pixel text-pixel-xl uppercase tracking-[0.35em]">選擇像素身份</h2>
              <p className="text-sm text-white/70">點擊下方頭像即可切換，也可以上傳自訂圖像。</p>
            </div>
            <label className="cursor-pointer">
              <TechButton as="div" variant="primary" className="!px-5 !py-3">
                上傳自訂
              </TechButton>
              <input type="file" accept="image/png, image/jpeg, image/svg+xml, image/webp" onChange={handleFileChange} disabled={uploading} className="hidden" />
            </label>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-black/25 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {avatars.map((avatar, index) => (
              <button
                key={avatar}
                ref={(el) => {
                  avatarRefs.current[index] = el
                }}
                onClick={() => handleAvatarSelect(avatar)}
                onMouseEnter={() => handleAvatarHover(index, true)}
                onMouseLeave={() => handleAvatarHover(index, false)}
                className={`relative aspect-square overflow-hidden rounded-[18px] border transition ${
                  selectedAvatar === avatar ? 'border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-white/10 hover:border-cyan-200/60'
                }`}
              >
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>
      </div>

      {previewImage && (
        <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div ref={modalContentRef} className="w-full max-w-sm">
            <HoloWindow title="裁切頭像">
              <div className="relative mb-6 h-64 w-full overflow-hidden rounded border border-white/10 bg-black/30">
                <Cropper image={previewImage} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} cropShape="round" showGrid={false} />
              </div>
              <div className="mb-6">
                <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-black/40 accent-cyan-300" />
              </div>
              <div className="flex gap-4">
                <TechButton variant="ghost" className="flex-1" onClick={handleCloseModal} disabled={uploading}>
                  取消
                </TechButton>
                <TechButton variant="primary" className="flex-1" onClick={handleConfirmUpload} disabled={uploading}>
                  {uploading ? '上傳中…' : '確認'}
                </TechButton>
              </div>
            </HoloWindow>
          </div>
        </div>
      )}
    </HoloWindow>
  )
}
