'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TiptapEditor } from './TiptapEditor';
import { AnimatePresence, motion } from 'framer-motion';
import Swal from 'sweetalert2';
import clsx from 'clsx';

interface HolographicPadProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string | null;
  initialTitle?: string;
  onSave: (title: string, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

type FontOption = 'pixel' | 'retro' | 'tech' | 'standard';

const FONT_OPTIONS: { id: FontOption; label: string; class: string }[] = [
  { id: 'pixel', label: 'Pixel', class: 'font-pixel text-lg tracking-wide' },
  { id: 'retro', label: 'Retro', class: 'font-header text-sm leading-relaxed' },
  { id: 'tech', label: 'Tech', class: 'font-tech text-lg tracking-wider' },
  { id: 'standard', label: 'Standard', class: 'font-sans text-base' },
];

export function HolographicPad({
  isOpen,
  onClose,
  noteId,
  initialTitle = '',
  onSave,
  onDelete
}: HolographicPadProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedFont, setSelectedFont] = useState<FontOption>('tech');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
      if (noteId) {
        fetchNoteContent();
      } else {
        setTitle('');
        setContent('');
      }
    }
  }, [isOpen, noteId]);

  const fetchNoteContent = async () => {
    if (!noteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${noteId}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.note.title);
        try {
            const parsed = JSON.parse(data.note.content);
            if (typeof parsed === 'object' && parsed !== null && '1' in parsed) {
                setContent(parsed['1']);
            } else {
                setContent(data.note.content);
            }
        } catch {
            setContent(data.note.content);
        }
      }
    } catch (error) {
      console.error('Failed to load note', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (shouldClose = false) => {
    if (!title.trim()) {
        Swal.fire({
            icon: 'warning',
            title: '缺少標題',
            text: '請為這份日誌輸入標題',
            background: '#09090B', // samurai-dark
            color: '#FACC15', // samurai-yellow
            confirmButtonColor: '#F43F5E', // samurai-red
            confirmButtonText: '確定'
        });
        return;
    }
    setSaving(true);
    try {
      await onSave(title, content);
      setIsDirty(false);
      if (shouldClose) {
        onClose();
      } else {
        Swal.fire({
            icon: 'success',
            title: '資料已儲存',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            background: '#09090B',
            color: '#3B82F6' // samurai-blue
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: '上傳失敗',
        text: '儲存過程中發生錯誤',
        background: '#09090B',
        color: '#F43F5E',
        confirmButtonText: '確定'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseRequest = () => {
    if (isDirty) {
      Swal.fire({
        title: '尚未儲存變更',
        text: "資料流即將中斷，是否要儲存變更？",
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '儲存並離開',
        denyButtonText: '捨棄變更',
        cancelButtonText: '取消',
        background: '#09090B',
        color: '#E2E8F0', // samurai-text
        confirmButtonColor: '#3B82F6', // samurai-blue
        denyButtonColor: '#F43F5E', // samurai-red
        cancelButtonColor: '#18181B' // samurai-dim

      }).then((result) => {
        if (result.isConfirmed) {
          handleSave(true);
        } else if (result.isDenied) {
          onClose();
        }
      });
    } else {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const currentFontClass = FONT_OPTIONS.find(f => f.id === selectedFont)?.class || '';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl h-[85vh] flex flex-col bg-samurai-dark/95 border border-samurai-blue/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] rounded-lg overflow-hidden"
            >
                {/* Holographic Grid Background */}
                <div className="absolute inset-0 pointer-events-none depth-base opacity-30" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-samurai-blue/5 via-transparent to-samurai-blue/5" />
                
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between p-4 border-b border-samurai-blue/30 bg-samurai-dim/50 backdrop-blur">

                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-2 h-8 bg-samurai-red animate-pulse" />
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                            placeholder="輸入標題..."
                            className="bg-transparent border-none text-2xl font-tech text-white placeholder-samurai-text/30 focus:outline-none w-full tracking-wider"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Font Selector */}
                        <div className="flex items-center bg-samurai-dim/50 rounded border border-samurai-blue/20 p-1 mr-4">
                            {FONT_OPTIONS.map((font) => (
                                <button
                                    key={font.id}
                                    onClick={() => setSelectedFont(font.id)}
                                    className={clsx(
                                        "px-3 py-1 text-xs uppercase transition-all rounded",
                                        selectedFont === font.id 
                                            ? "bg-samurai-blue text-white font-bold shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                            : "text-samurai-blue/70 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    {font.label}
                                </button>
                            ))}
                        </div>

                        {noteId && onDelete && (
                            <button 
                                onClick={onDelete}
                                className="p-2 text-samurai-red hover:bg-samurai-red/10 rounded transition-colors border border-transparent hover:border-samurai-red/50"
                                title="刪除日誌"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        )}
                        
                        <button 
                            onClick={handleCloseRequest}
                            className="p-2 text-samurai-blue hover:bg-samurai-blue/10 rounded transition-colors border border-transparent hover:border-samurai-blue/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-samurai-blue/50 font-tech animate-pulse tracking-widest">
                            資料流初始化中...
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                            <TiptapEditor
                                content={content}
                                onChange={(newContent) => {
                                    setContent(newContent);
                                    setIsDirty(true);
                                }}
                                editable={true}
                                darkControls={false}
                                className={clsx("min-h-[60vh] text-white/90 selection:bg-samurai-blue selection:text-white", currentFontClass)}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="relative z-10 p-4 border-t border-samurai-blue/30 bg-samurai-dim/80 backdrop-blur flex justify-between items-center">

                    <div className="text-xs font-tech text-samurai-blue/50 tracking-widest">
                        狀態: {saving ? '上傳中...' : (isDirty ? '未儲存' : '已同步')}
                    </div>
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className={clsx(
                            "px-8 py-2 font-tech font-bold uppercase tracking-widest transition-all clip-path-slant",
                            saving 
                                ? "bg-samurai-dim text-white/50 cursor-wait" 
                                : "bg-samurai-blue text-white hover:bg-white hover:text-samurai-blue hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                        )}
                    >
                        {saving ? '處理中' : '儲存資料'}
                    </button>
                </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
