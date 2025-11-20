"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

type MemberStatus = 'ACTIVE' | 'INACTIVE'

type Member = {
  id: string
  email: string
  name: string | null
  status: MemberStatus
  note: string | null
  role: string
  createdAt: string
}

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; member: Member }
  | { type: 'reset'; member: Member }
  | null

const STATUS_LABEL: Record<MemberStatus, string> = {
  ACTIVE: '啟用',
  INACTIVE: '停用'
}

const pageSize = 10

export default function MembersClient(): React.ReactElement {
  const [members, setMembers] = useState<Member[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)
  const [form, setForm] = useState({ email: '', name: '', status: 'ACTIVE' as MemberStatus, note: '', password: '' })
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total])

  const fetchMembers = useCallback(async (pageValue = page, searchValue = search) => {
    setLoading(true)
    setError(null)
    try {
      const safePage = Math.max(1, pageValue)
      const params = new URLSearchParams({ page: String(safePage), pageSize: String(pageSize) })
      if (searchValue) params.set('search', searchValue)
      const res = await fetch(`/api/admin/members?${params.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('讀取失敗')
      const data = await res.json()
      setMembers(data.members)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : '讀取失敗')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    const handle = setTimeout(() => {
      setPage(1)
      setSearch(searchInput.trim())
    }, 400)
    return () => clearTimeout(handle)
  }, [searchInput])

  useEffect(() => {
    fetchMembers(1, search)
  }, [search, fetchMembers])

  const openCreate = (): void => {
    setForm({ email: '', name: '', status: 'ACTIVE', note: '', password: '' })
    setModalError(null)
    setModal({ type: 'create' })
  }

  const openEdit = (member: Member): void => {
    setForm({ email: member.email, name: member.name ?? '', status: member.status, note: member.note ?? '', password: '' })
    setModalError(null)
    setModal({ type: 'edit', member })
  }

  const openReset = (member: Member): void => {
    setForm({ email: member.email, name: member.name ?? '', status: member.status, note: member.note ?? '', password: '' })
    setModalError(null)
    setModal({ type: 'reset', member })
  }

  const closeModal = (): void => {
    setModal(null)
    setModalError(null)
    setModalLoading(false)
  }

  const submitMember = async (): Promise<void> => {
    if (!modal) return
    setModalLoading(true)
    setModalError(null)
    try {
      if (modal.type === 'create') {
        if (!form.password || form.password.length < 6) {
          setModalError('密碼至少 6 字')
          setModalLoading(false)
          return
        }
        const res = await fetch('/api/admin/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            name: form.name || undefined,
            password: form.password,
            note: form.note || undefined,
            status: form.status
          })
        })
        if (!res.ok) throw new Error('建立失敗')
      } else if (modal.type === 'edit') {
        const res = await fetch(`/api/admin/members/${modal.member.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            name: form.name || undefined,
            note: form.note ?? null,
            status: form.status
          })
        })
        if (!res.ok) throw new Error('更新失敗')
      } else if (modal.type === 'reset') {
        if (!form.password || form.password.length < 6) {
          setModalError('新密碼至少 6 字')
          setModalLoading(false)
          return
        }
        const res = await fetch(`/api/admin/members/${modal.member.id}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: form.password })
        })
        if (!res.ok) throw new Error('重設失敗')
      }
      closeModal()
      fetchMembers(page, search)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : '操作失敗')
      setModalLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="flex-1 min-w-[220px] rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-emerald-300"
          placeholder="搜尋 email 或名稱"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30" onClick={openCreate}>
          新增成員
        </button>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm text-white/80">
            <thead>
              <tr className="text-white/70">
                <th className="px-4 py-3 font-medium">姓名 / Email</th>
                <th className="px-4 py-3 font-medium">狀態</th>
                <th className="px-4 py-3 font-medium">備註</th>
                <th className="px-4 py-3 font-medium">建立時間</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6 text-center text-white/60" colSpan={5}>讀取中…</td></tr>
              ) : members.length === 0 ? (
                <tr><td className="px-4 py-6 text-center text-white/60" colSpan={5}>目前沒有符合條件的成員</td></tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="border-t border-white/5">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">{member.name ?? '—'}</div>
                      <div className="text-xs text-white/60">{member.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${member.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'}`}>
                        {STATUS_LABEL[member.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4">{member.note ?? '—'}</td>
                    <td className="px-4 py-4 text-white/60">{new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium' }).format(new Date(member.createdAt))}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10" onClick={() => openEdit(member)}>
                          編輯
                        </button>
                        <button className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10" onClick={() => openReset(member)}>
                          重設密碼
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {error && <p className="p-4 text-sm text-rose-300">{error}</p>}
      </div>
      <div className="flex items-center justify-between text-sm text-white/70">
        <span>共 {total} 位成員</span>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-white/20 px-3 py-1 disabled:opacity-40" onClick={() => { setPage((p) => Math.max(1, p - 1)); fetchMembers(page - 1, search) }} disabled={page <= 1}>
            上一頁
          </button>
          <span>{page} / {totalPages}</span>
          <button className="rounded-full border border-white/20 px-3 py-1 disabled:opacity-40" onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); fetchMembers(page + 1, search) }} disabled={page >= totalPages}>
            下一頁
          </button>
        </div>
      </div>
      {modal && (
        <Modal title={modal.type === 'create' ? '新增成員' : modal.type === 'edit' ? '編輯成員' : '重設密碼'} onClose={closeModal}>
          {modal.type !== 'reset' && (
            <>
              <label className="space-y-2 text-sm text-white/70">
                Email
                <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-300" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="space-y-2 text-sm text-white/70">
                顯示名稱
                <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-300" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="space-y-2 text-sm text-white/70">
                狀態
                <select className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-300" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as MemberStatus })}>
                  <option value="ACTIVE">啟用</option>
                  <option value="INACTIVE">停用</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/70">
                備註
                <textarea className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-300" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3} />
              </label>
            </>
          )}
          {modal.type === 'create' && (
            <label className="space-y-2 text-sm text-white/70">
              初始密碼
              <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-300" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
          )}
          {modal.type === 'reset' && (
            <label className="space-y-2 text-sm text-white/70">
              新密碼
              <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-300" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
          )}
          {modalError && <p className="text-sm text-rose-300">{modalError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80" onClick={closeModal} disabled={modalLoading}>取消</button>
            <button className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 disabled:opacity-60" onClick={submitMember} disabled={modalLoading}>
              {modalLoading ? '處理中…' : '儲存'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

type ModalProps = {
  title: string
  onClose: () => void
  children: ReactNode
}

function Modal({ title, onClose, children }: ModalProps): React.ReactElement {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="text-white/60 hover:text-white" onClick={onClose}>✕</button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  )
}
