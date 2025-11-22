'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { gsap } from 'gsap'
import Swal from 'sweetalert2'
import Cropper, { Area } from 'react-easy-crop'
import getCroppedImg from '@/lib/cropImage'

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

  // Fetch avatars from API
  useEffect(() => {
    fetch('/api/avatars')
      .then(res => res.json())
      .then(data => setAvatars(data.avatars || []))
      .catch(err => console.error('Failed to load avatars:', err))
  }, [])

  // Animate modal entrance
  useEffect(() => {
    if (previewImage && modalRef.current && modalContentRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )
      gsap.fromTo(
        modalContentRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
      )
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
          title: '更新成功',
          text: '頭貼已更新',
          timer: 1500,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#fff'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: '更新失敗',
          text: '請稍後再試',
          background: '#1e293b',
          color: '#fff'
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '發生錯誤',
        text: '請檢查網路連線',
        background: '#1e293b',
        color: '#fff'
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    // Reset input value so same file can be selected again if cancelled
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

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        await handleAvatarSelect(data.url)
        handleCloseModal()
      } else {
        Swal.fire({
          icon: 'error',
          title: '上傳失敗',
          text: '請確認檔案格式是否正確',
          background: '#1e293b',
          color: '#fff'
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '發生錯誤',
        text: '上傳過程中發生錯誤',
        background: '#1e293b',
        color: '#fff'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleCloseModal = () => {
    if (modalRef.current && modalContentRef.current) {
      gsap.to(modalContentRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.3
      })
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.1,
        onComplete: () => {
          setPreviewImage(null)
        }
      })
    } else {
      setPreviewImage(null)
    }
  }

  const handleAvatarHover = (index: number, isHovering: boolean) => {
    const el = avatarRefs.current[index]
    if (!el) return

    gsap.to(el, {
      scale: isHovering ? 1.1 : 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  return (
    <div className="space-y-8 text-white">
      <h1 className="text-3xl font-semibold">個人設定</h1>
      
      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-xl font-semibold">選擇頭像</h2>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {avatars.map((avatar, index) => (
            <button
              key={avatar}
              ref={el => { avatarRefs.current[index] = el }}
              onClick={() => handleAvatarSelect(avatar)}
              onMouseEnter={() => handleAvatarHover(index, true)}
              onMouseLeave={() => handleAvatarHover(index, false)}
              className={`relative aspect-square overflow-hidden rounded-full border-2 transition-all ${
                selectedAvatar === avatar ? 'border-emerald-400' : 'border-transparent hover:border-white/30'
              }`}
            >
              <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <p className="mb-2 text-sm text-white/70">或上傳自訂圖片</p>
          <label className="inline-block cursor-pointer rounded-full bg-white/10 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
            選擇圖片
            <input
              type="file"
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview Modal */}
        {previewImage && (
          <div 
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <div 
              ref={modalContentRef}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
            >
              <h3 className="mb-6 text-center text-xl font-semibold text-white">裁切頭貼</h3>
              <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl bg-black">
                <Cropper
                  image={previewImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>
              <div className="mb-6 px-4">
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-emerald-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  disabled={uploading}
                  className="flex-1 rounded-full border border-white/20 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmUpload}
                  disabled={uploading}
                  className="flex-1 rounded-full bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                >
                  {uploading ? '上傳中...' : '確定更換'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
