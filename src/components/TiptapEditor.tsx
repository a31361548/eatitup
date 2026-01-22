'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  editable?: boolean
  darkControls?: boolean
  className?: string
}

export function TiptapEditor({ content, onChange, editable = true, darkControls = false, className = '' }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '開始寫作...',
      }),
      TextStyle,
      Color,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose ${darkControls ? 'text-black' : 'prose-invert'} max-w-none focus:outline-none min-h-[400px] p-4 ${className}`,
      },
    },
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  interface ToolbarButtonProps {
    onClick: () => void
    isActive: boolean
    children: React.ReactNode
    title: string
  }

  const ToolbarButton = ({ onClick, isActive, children, title }: ToolbarButtonProps) => (
    <button
      onClick={onClick}
      title={title}
      className={`rounded p-2 text-sm transition-colors ${
          isActive 
            ? 'bg-samurai-blue/20 text-samurai-blue font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
            : 'text-samurai-text/60 hover:bg-samurai-blue/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className={`depth-hud rounded-xl border overflow-hidden ${darkControls ? 'border-samurai-blue/30 bg-transparent' : 'border-white/10 bg-white/5'}`}>
      {editable && (
        <div className={`flex flex-wrap gap-1 border-b p-2 ${darkControls ? 'border-samurai-blue/30 bg-samurai-blue/5' : 'border-white/10 bg-white/5'}`}>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="粗體"
          >
            <b>B</b>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="斜體"
          >
            <i>I</i>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="刪除線"
          >
            <s>S</s>
          </ToolbarButton>
          <div className={`mx-1 w-px ${darkControls ? 'bg-samurai-blue/30' : 'bg-white/10'}`} />
          <div className="flex items-center gap-1">
             <input
                type="color"
                onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
                title="文字顏色"
             />
          </div>
          <div className={`mx-1 w-px ${darkControls ? 'bg-samurai-blue/30' : 'bg-white/10'}`} />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="標題 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="標題 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="標題 3"
          >
            H3
          </ToolbarButton>
          <div className={`mx-1 w-px ${darkControls ? 'bg-samurai-blue/30' : 'bg-white/10'}`} />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="項目符號"
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="編號列表"
          >
            1. List
          </ToolbarButton>
          <div className={`mx-1 w-px ${darkControls ? 'bg-samurai-blue/30' : 'bg-white/10'}`} />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="引用"
          >
            &quot;&quot;
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            isActive={false}
            title="分隔線"
          >
            —
          </ToolbarButton>
          <div className={`mx-1 w-px ${darkControls ? 'bg-samurai-blue/30' : 'bg-white/10'}`} />
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            title="復原"
          >
            ↪
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            title="重做"
          >
            ↩
          </ToolbarButton>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
