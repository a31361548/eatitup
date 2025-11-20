'use client'

import { useState, useEffect, type ReactElement } from 'react'
import clsx from 'clsx'

interface ModeInputProps {
  currentItems: string[]
  onUpdate: (items: string[]) => void
  className?: string
}

export function ModeInput({ currentItems, onUpdate, className }: ModeInputProps): ReactElement {
  const [input, setInput] = useState(currentItems.join('\n'))
  const [lists, setLists] = useState<{ id: string; title: string; items: { label: string; weight: number }[] }[]>([])
  const [saving, setSaving] = useState(false)
  const [currentListId, setCurrentListId] = useState<string | null>(null)
  const [listName, setListName] = useState('')
  const [newItemInput, setNewItemInput] = useState('')

  useEffect(() => {
    setInput(currentItems.join('\n'))
  }, [currentItems])

  useEffect(() => {
    fetch('/api/lists')
      .then((res) => {
        if (res.ok) return res.json()
        return { lists: [] }
      })
      .then((data) => {
        if (data.lists) setLists(data.lists)
      })
      .catch(() => {})
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const val = e.target.value
    setInput(val)
    const items = val.split('\n').map(s => s.trim()).filter(Boolean)
    onUpdate(items)
  }

  const loadList = (listId: string): void => {
    const list = lists.find(l => l.id === listId)
    if (list) {
      const items = list.items.flatMap(i => Array.from({ length: i.weight }, () => i.label))
      setInput(items.join('\n'))
      onUpdate(items)
      setCurrentListId(listId)
      setListName(list.title)
    }
  }

  const addNewItem = (): void => {
    if (!newItemInput.trim()) return
    const newItems = [...currentItems, newItemInput.trim()]
    setInput(newItems.join('\n'))
    onUpdate(newItems)
    setNewItemInput('')
  }

  const saveList = async (): Promise<void> => {
    if (!listName.trim()) {
      alert('請輸入清單名稱')
      return
    }
    
    setSaving(true)
    try {
      const items = input.split('\n').map(s => s.trim()).filter(Boolean)
      const counts: Record<string, number> = {}
      items.forEach(i => { counts[i] = (counts[i] || 0) + 1 })

      let targetListId = currentListId

      // Auto-detect: if list name matches existing list, update it
      if (!currentListId) {
        const existingList = lists.find(l => l.title === listName.trim())
        if (existingList) {
          targetListId = existingList.id
        }
      }

      if (targetListId) {
        // Update existing list
        // First, delete all items
        const list = lists.find(l => l.id === targetListId)
        if (list) {
          await Promise.all(list.items.map(item =>
            fetch(`/api/items/${item.label}?listId=${targetListId}`, { method: 'DELETE' })
          ))
        }

        // Update list name if changed
        await fetch(`/api/lists/${targetListId}`, {
          method: 'PATCH',
          body: JSON.stringify({ title: listName.trim() })
        })

        // Add new items
        await Promise.all(Object.entries(counts).map(([label, weight]) =>
          fetch('/api/items', {
            method: 'POST',
            body: JSON.stringify({ listId: targetListId, label, weight })
          })
        ))

        alert('清單已更新！')
      } else {
        // Create new list
        const resList = await fetch('/api/lists', {
          method: 'POST',
          body: JSON.stringify({ title: listName.trim() }),
        })
        if (!resList.ok) throw new Error('Failed to create list')
        const { id } = await resList.json()

        await Promise.all(Object.entries(counts).map(([label, weight]) =>
          fetch('/api/items', {
            method: 'POST',
            body: JSON.stringify({ listId: id, label, weight })
          })
        ))

        setCurrentListId(id)
        alert('清單已儲存！')
      }

      // Refresh lists
      const res = await fetch('/api/lists')
      if (res.ok) {
        const data = await res.json()
        setLists(data.lists)
      }
    } catch (e) {
      alert('儲存失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={clsx('space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">選項設定</h3>
        {lists.length > 0 && (
          <select
            className="rounded-lg border border-white/20 bg-slate-800 px-3 py-1 text-sm text-white"
            onChange={(e) => loadList(e.target.value)}
            value={currentListId || ''}
          >
            <option value="" disabled>匯入清單...</option>
            {lists.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        )}
      </div>

      <textarea
        className="h-32 w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-white placeholder:text-white/30 focus:border-emerald-500 focus:outline-none"
        value={input}
        onChange={handleInputChange}
        placeholder="輸入選項，一行一個..."
      />

      {/* Add new item */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newItemInput}
          onChange={e => setNewItemInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNewItem()}
          placeholder="新增選項..."
          className="flex-1 rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
        <button
          onClick={addNewItem}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-400"
        >
          新增
        </button>
      </div>

      {/* Save section */}
      <div className="space-y-2 border-t border-white/10 pt-4">
        <input
          type="text"
          value={listName}
          onChange={e => setListName(e.target.value)}
          placeholder="清單名稱（自動判別新增或更新）"
          className="w-full rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
        <button
          onClick={saveList}
          disabled={saving || !listName.trim()}
          className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {saving ? '儲存中...' : '儲存清單'}
        </button>
      </div>
    </div>
  )
}
