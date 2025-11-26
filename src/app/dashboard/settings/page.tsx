'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { gsap } from 'gsap'
import Swal from 'sweetalert2'
import Cropper, { Area } from 'react-easy-crop'
import getCroppedImg from '@/lib/cropImage'
import { PixelCard, PixelButton } from '@/components/PixelComponents'

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
          background: '#0a0a0c',
          color: '#e2e8f0',
          customClass: {
            popup: 'border border-gold-500/30 shadow-glow-gold'
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: '更新失敗',
          text: '請稍後再試',
          background: '#0a0a0c',
          color: '#e2e8f0',
          customClass: {
            popup: 'border border-red-500/30'
          }
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '發生錯誤',
        text: '請檢查網路連線',
        background: '#0a0a0c',
        color: '#e2e8f0',
        customClass: {
          popup: 'border border-red-500/30'
        }
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
          background: '#0a0a0c',
          color: '#e2e8f0',
          customClass: {
            popup: 'border border-red-500/30'
          }
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '發生錯誤',
        text: '上傳過程中發生錯誤',
        background: '#0a0a0c',
        color: '#e2e8f0',
        customClass: {
          popup: 'border border-red-500/30'
        }
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
    <div className="space-y-8 text-mythril-100">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">
          個人設定
        </h1>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-gold-500/50 to-transparent"></div>
      </div>
      
      <PixelCard title="外觀自訂" glow="gold">
        <div className="space-y-8">
            <h2 className="text-pixel-lg font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                選擇頭像
            </h2>
            
            <div className="grid grid-cols-3 gap-6 md:grid-cols-6 p-4 bg-void-900/50 rounded-lg border border-white/5">
            {avatars.map((avatar, index) => (
                <button
                key={avatar}
                ref={el => { avatarRefs.current[index] = el }}
                onClick={() => handleAvatarSelect(avatar)}
                onMouseEnter={() => handleAvatarHover(index, true)}
                onMouseLeave={() => handleAvatarHover(index, false)}
                className={`relative aspect-square overflow-hidden rounded-full border-2 transition-all group ${
                    selectedAvatar === avatar 
                    ? 'border-gold-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' 
                    : 'border-white/10 hover:border-cyan-400/50'
                }`}
                >
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                {selectedAvatar === avatar && (
                    <div className="absolute inset-0 bg-gold-400/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gold-400 rounded-full shadow-[0_0_5px_#fbbf24]"></div>
                    </div>
                )}
                </button>
            ))}
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-5 border-t border-white/5 pt-8">
            <p className="text-pixel-sm text-mythril-300 font-tech tracking-wider">或上傳自訂圖片</p>
            <label className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
                <div className="relative flex items-center gap-2 bg-void-800 border border-cyan-500/30 px-6 py-2 rounded-lg text-cyan-400 font-tech uppercase tracking-widest hover:text-cyan-300 transition-colors">
                    <span>UPLOAD IMAGE</span>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml, image/webp"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </div>
            </label>
            </div>
        </div>
      </PixelCard>

      {/* Preview Modal */}
      {previewImage && (
        <div 
          ref={modalRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void-900/80 backdrop-blur-sm p-4"
        >
          <div 
            ref={modalContentRef}
            className="w-full max-w-sm"
          >
            <PixelCard title="裁切頭貼" glow="blue">
                <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl border border-white/10 bg-void-900">
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
                    className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-void-700 accent-cyan-400"
                    />
                </div>

                <div className="flex gap-4">
                    <PixelButton
                        onClick={handleCloseModal}
                        disabled={uploading}
                        variant="danger"
                        className="flex-1"
                    >
                    取消
                    </PixelButton>
                    <PixelButton
                        onClick={handleConfirmUpload}
                        disabled={uploading}
                        variant="success"
                        className="flex-1"
                    >
                    {uploading ? '上傳中...' : '確定更換'}
                    </PixelButton>
                </div>
            </PixelCard>
          </div>
        </div>
      )}
    </div>
  )
}
