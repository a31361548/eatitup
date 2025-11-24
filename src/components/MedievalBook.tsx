'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookPage } from './BookPage';
import { TiptapEditor } from './TiptapEditor';
import { AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

interface MedievalBookProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string | null;
  initialTitle?: string;
  onSave: (title: string, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

type PagesContent = Record<number, string>;
const MAX_CONTENT_PAGES = 6; // Support up to 6 pages for double-sided demo (P1-P6)

export function MedievalBook({
  isOpen,
  onClose,
  noteId,
  initialTitle = '',
  onSave,
  onDelete
}: MedievalBookProps) {
  const [title, setTitle] = useState(initialTitle);
  const [pages, setPages] = useState<PagesContent>({ 1: '' });
  const [flippedIndex, setFlippedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Dimensions
  const width = 450;
  const height = 600;

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
      if (noteId) {
        setFlippedIndex(1); // Open to first spread (P1/P2)
        fetchNoteContent();
      } else {
        setFlippedIndex(0); // Start at cover for new notes
        setTitle('');
        setPages({ 1: '' });
      }
    } else {
      const timer = setTimeout(() => setFlippedIndex(0), 500);
      return () => clearTimeout(timer);
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
          const parsedContent = JSON.parse(data.note.content);
          if (typeof parsedContent === 'object' && parsedContent !== null) {
            setPages(parsedContent);
          } else {
            setPages({ 1: data.note.content });
          }
        } catch {
          setPages({ 1: data.note.content });
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
            title: '請輸入標題',
            background: '#3e2723',
            color: '#f4e4bc'
        });
        return;
    }
    setSaving(true);
    try {
      const contentToSave = JSON.stringify(pages);
      await onSave(title, contentToSave);
      setIsDirty(false);
      if (shouldClose) {
        onClose();
      } else {
        Swal.fire({
            icon: 'success',
            title: '已儲存',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            background: '#3e2723',
            color: '#f4e4bc'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: '儲存失敗',
        background: '#3e2723',
        color: '#f4e4bc'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseRequest = () => {
    if (isDirty) {
      Swal.fire({
        title: '尚未儲存',
        text: "您的修改尚未儲存，是否要儲存？",
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '儲存並關閉',
        denyButtonText: '直接關閉',
        cancelButtonText: '取消',
        background: '#3e2723',
        color: '#f4e4bc',
        confirmButtonColor: '#5d4037',
        denyButtonColor: '#d33'
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

  const handlePageChange = (pageNum: number, content: string) => {
    setPages(prev => ({ ...prev, [pageNum]: content }));
    setIsDirty(true);
  };

  // Calculate total sheets needed
  // Sheet 0: Front=Cover, Back=Page 1
  // Sheet 1: Front=Page 2, Back=Page 3
  // Sheet 2: Front=Page 4, Back=Page 5
  // ...
  // We need enough sheets to cover MAX_CONTENT_PAGES.
  // P1 is on Sheet 0 Back.
  // P2, P3 on Sheet 1.
  // P4, P5 on Sheet 2.
  // P6, P7 on Sheet 3.
  // Formula: Page N is on:
  // If N=1: Sheet 0 Back.
  // If N>1: Sheet ceil((N-1)/2).
  // Total sheets = 1 (Cover) + ceil((MAX_CONTENT_PAGES - 1) / 2).
  // For 6 pages: 1 + ceil(5/2) = 1 + 3 = 4 sheets (Indices 0, 1, 2, 3).
  const contentSheetsCount = Math.ceil((MAX_CONTENT_PAGES - 1) / 2);
  const totalSheets = 1 + contentSheetsCount; 
  
  const isBookClosed = flippedIndex === 0;
  const isBookFinished = flippedIndex === totalSheets;

  const handleNext = () => {
    if (flippedIndex < totalSheets) {
      setFlippedIndex(p => p + 1);
    }
  };

  const handlePrev = () => {
    if (flippedIndex > 0) {
      setFlippedIndex(p => p - 1);
    }
  };

  const getZIndex = (index: number) => {
    if (index >= flippedIndex) {
      return totalSheets - index;
    } else {
      return index;
    }
  };

  const renderPageContent = (pageNum: number) => {
    if (pageNum > MAX_CONTENT_PAGES) return null;
    
    return (
      <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-amber-900/20 pb-2">
              <span className="font-serif text-amber-900/60 text-sm">Page {pageNum}</span>
              {pageNum === 1 && (
                  <div className="flex gap-2">
                      {noteId && onDelete && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="text-xs border border-amber-900 text-amber-900 px-2 py-1 rounded hover:bg-amber-100"
                          >
                              Delete
                          </button>
                      )}
                  </div>
              )}
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar no-scrollbar" onClick={(e) => e.stopPropagation()}>
              {loading ? (
                  <div className="flex items-center justify-center h-full text-amber-900/50 font-serif animate-pulse">
                      Reading ancient texts...
                  </div>
              ) : (
                  <TiptapEditor
                      content={pages[pageNum] || ''}
                      onChange={(content) => handlePageChange(pageNum, content)}
                      editable={true}
                      darkControls={true}
                  />
              )}
          </div>
      </div>
    );
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden">
            {/* Close Button (Top Right) */}
            <button 
                onClick={handleCloseRequest}
                className="fixed top-8 right-8 z-[60] group flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full transition-all shadow-lg border border-white/10"
            >
                <span className="text-sm font-serif">{isDirty ? '儲存並關閉' : '關閉'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="relative flex flex-col items-center justify-center h-full w-full p-4">
              {/* Controls / Hints */}
              <div className="absolute top-8 text-amber-100/50 font-serif tracking-widest text-sm z-50 animate-pulse pointer-events-none select-none">
                {isBookClosed ? "Click to Open" : "Click pages to flip"}
              </div>

              {/* Book Container */}
              <div 
                className="relative perspective-2000 transition-transform duration-700 ease-in-out"
                style={{ 
                  width: width * 2,
                  height: height,
                  transform: isBookClosed 
                    ? `translateX(-${width / 2}px)` 
                    : isBookFinished 
                      ? `translateX(${width / 2}px)` 
                      : 'translateX(0)',
                }}
              >
                <div className="absolute inset-0 preserve-3d">
                  {/* Static Back Cover - Left Side */}
                  <div 
                    className={`absolute right-1/2 top-0 bg-leather rounded-l-md shadow-2xl origin-right transition-all duration-500 ease-in-out ${
                      isBookClosed ? 'opacity-0 rotate-y-12' : 'opacity-100 rotate-y-0'
                    }`}
                    style={{
                      width: width,
                      height: height,
                      transform: isBookClosed ? 'translateZ(-2px) rotateY(15deg)' : 'translateZ(-2px) rotateY(0deg)',
                      boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.3), 0 20px 50px rgba(0,0,0,0.5)'
                    }}
                  />

                  {/* Static Back Cover - Right Side */}
                  <div 
                    className={`absolute left-1/2 top-0 bg-leather rounded-r-md shadow-2xl origin-left transition-all duration-500 ease-in-out ${
                      isBookFinished ? 'opacity-0 rotate-y-minus-12' : 'opacity-100 rotate-y-0'
                    }`}
                    style={{
                      width: width,
                      height: height,
                      transform: isBookFinished ? 'translateZ(-2px) rotateY(-15deg)' : 'translateZ(-2px) rotateY(0deg)',
                      boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.3), 0 20px 50px rgba(0,0,0,0.5)'
                    }}
                  />

                  {/* Spine */}
                  <div 
                     className="absolute left-1/2 top-0 bottom-0 w-12 bg-amber-900 rounded-sm"
                     style={{
                       transform: 'translateX(-50%) translateZ(-5px)',
                       background: 'linear-gradient(to right, #2d1b16, #5d4037 40%, #5d4037 60%, #2d1b16)',
                       boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                     }}
                  />

                  {/* Render Pages */}
                  
                  {/* Sheet 0: Front=Cover, Back=Page 1 */}
                  <BookPage
                    index={0}
                    isFlipped={0 < flippedIndex}
                    zIndex={getZIndex(0)}
                    onFlip={() => {
                        if (0 < flippedIndex) handlePrev();
                        else handleNext();
                    }}
                    width={width}
                    height={height}
                    type="cover"
                    title={title || ""}
                    subtitle="Chronicles of the Realm"
                    backChildren={renderPageContent(1)}
                    isEditable={true}
                    onTitleChange={(newTitle) => {
                        setTitle(newTitle);
                        setIsDirty(true);
                    }}
                  />

                  {/* Content Sheets */}
                  {Array.from({ length: contentSheetsCount }).map((_, i) => {
                     const sheetIndex = i + 1; // 1, 2, 3...
                     // Sheet 1: Front=P2, Back=P3
                     // Sheet 2: Front=P4, Back=P5
                     const frontPageNum = sheetIndex * 2;
                     const backPageNum = sheetIndex * 2 + 1;
                     
                     const isFlipped = sheetIndex < flippedIndex;
                     
                     return (
                       <BookPage
                         key={sheetIndex}
                         index={sheetIndex}
                         isFlipped={isFlipped}
                         zIndex={getZIndex(sheetIndex)}
                         onFlip={() => {
                           if (isFlipped) handlePrev();
                           else handleNext();
                         }}
                         width={width}
                         height={height}
                         type="content"
                         frontChildren={renderPageContent(frontPageNum)}
                         backChildren={renderPageContent(backPageNum)}
                       />
                     );
                  })}
                </div>
              </div>
            </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
