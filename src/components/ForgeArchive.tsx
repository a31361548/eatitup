import React, { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import Swal from 'sweetalert2';

interface ForgeArchiveProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  isSpinning: boolean;
  onSpin: () => void;
  optionsCount: number;
}

interface ListItem {
  id: string;
  label: string;
  weight: number;
}

interface List {
  id: string;
  title: string;
  items: ListItem[];
}

type ListsResponse = {
  lists?: List[];
};

const parseLines = (value: string): string[] =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const buildCounts = (items: string[]): Record<string, number> => {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
};

export const ForgeArchive: React.FC<ForgeArchiveProps> = ({ 
  input, 
  setInput, 
  isSpinning, 
  onSpin,
  optionsCount 
}) => {
  const [lists, setLists] = useState<List[]>([]);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [listName, setListName] = useState('');
  const [saving, setSaving] = useState(false);
  const [newOption, setNewOption] = useState('');

  // Fetch lists on mount
  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await fetch('/api/lists');
      if (!res.ok) throw new Error('Failed to fetch lists');
      const data: ListsResponse = await res.json();
      setLists(data.lists ?? []);
    } catch (e) {
      console.error('Failed to fetch lists', e);
    }
  };

  const loadList = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      // Flatten items based on weight (simple representation for text area)
      const items = list.items.flatMap(i => Array.from({ length: i.weight }, () => i.label));
      setInput(items.join('\n'));
      setCurrentListId(listId);
      setListName(list.title);
    }
  };

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed) {
      void Swal.fire({
        icon: 'warning',
        title: '請輸入選項內容',
        confirmButtonText: '好的',
      });
      return;
    }
    setInput((prev) => (prev ? `${prev}\n${trimmed}` : trimmed));
    setNewOption('');
    void Swal.fire({
      icon: 'success',
      title: '已加入新選項',
      timer: 1600,
      showConfirmButton: false,
    });
  };

  const deleteAllItems = async (list: List) => {
    await Promise.all(
      list.items.map(async (item) => {
        const form = new FormData();
        form.append('_method', 'DELETE');
        const res = await fetch(`/api/items/${item.id}`, {
          method: 'POST',
          body: form,
        });
        if (!res.ok) {
          throw new Error('Failed to delete item');
        }
      })
    );
  };

  const saveList = async () => {
    const trimmedName = listName.trim();
    if (!trimmedName) {
      void Swal.fire({
        icon: 'warning',
        title: '請輸入卷軸名稱',
      });
      return;
    }

    const items = parseLines(input);
    if (items.length === 0) {
      void Swal.fire({
        icon: 'warning',
        title: '至少需要一個選項',
      });
      return;
    }
    const counts = buildCounts(items);

    setSaving(true);
    try {
      let targetListId = currentListId;

      // Auto-detect: if list name matches existing list, update it
      if (!currentListId) {
        const existingList = lists.find(l => l.title === trimmedName);
        if (existingList) {
          targetListId = existingList.id;
        }
      }

      if (targetListId) {
        // Update existing list
        const list = lists.find(l => l.id === targetListId);
        if (list) {
          await deleteAllItems(list);
        }

        // 2. Update list name
        await fetch(`/api/lists/${targetListId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: trimmedName })
        });

        // 3. Add new items
        await Promise.all(Object.entries(counts).map(([label, weight]) =>
          fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listId: targetListId, label, weight })
          })
        ));

        void Swal.fire({
          icon: 'success',
          title: '卷軸已更新',
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        // Create new list
        const resList = await fetch('/api/lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: trimmedName }),
        });
        if (!resList.ok) throw new Error('Failed to create list');
        const { id } = await resList.json();

        await Promise.all(Object.entries(counts).map(([label, weight]) =>
          fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listId: id, label, weight })
          })
        ));

        setCurrentListId(id);
        void Swal.fire({
          icon: 'success',
          title: '已建立新的命運卷軸',
          timer: 1800,
          showConfirmButton: false,
        });
      }

      setListName(trimmedName);

      // Refresh lists
      await fetchLists();

    } catch (e) {
      console.error(e);
      void Swal.fire({
        icon: 'error',
        title: '鍛造失敗',
        text: '請稍後再試',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative bg-[#1a100c] rounded-t-[40px] md:rounded-t-[100px] rounded-b-[20px] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-x-2 border-b-2 border-[#3e2723] group ring-1 ring-white/5">
       {/* Glowing Top Edge */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-forge-gold to-transparent shadow-[0_0_15px_#ffb300]"></div>
       
       {/* Header */}
       <div className="text-center mb-6 mt-2">
         <h1 className="text-3xl md:text-5xl font-rune text-forge-gold font-bold drop-shadow-md tracking-wide">
           命運典藏
         </h1>
         <div className="flex items-center justify-center gap-4 mt-3 opacity-60">
            <div className="h-[1px] w-8 md:w-12 bg-forge-bronze"></div>
            <div className="w-2 h-2 rotate-45 bg-forge-gold"></div>
            <div className="h-[1px] w-8 md:w-12 bg-forge-bronze"></div>
         </div>
       </div>

       {/* List Selection (Magical Dropdown) */}
       <div className="relative mb-4">
          <select 
            className="w-full bg-[#0f0500] border border-forge-bronze text-forge-light font-scroll p-3 rounded-lg focus:outline-none focus:border-forge-gold appearance-none cursor-pointer"
            onChange={(e) => loadList(e.target.value)}
            value={currentListId || ''}
            disabled={isSpinning}
          >
             <option value="" disabled>選擇卷軸...</option>
             {lists.map(l => (
               <option key={l.id} value={l.id}>{l.title}</option>
             ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-forge-gold">
             ▼
          </div>
       </div>

       {/* Input Area */}
       <div className="relative mb-4 bg-[#0f0500] rounded-xl border border-[#3e2723] shadow-inner overflow-hidden group-hover:border-[#5d4037] transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-forge-glow/20 to-transparent"></div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSpinning}
            className="w-full h-48 md:h-64 bg-transparent p-6 font-scroll text-xl md:text-2xl text-forge-light focus:outline-none focus:bg-[#1a120f] transition-all resize-none forge-scroll leading-loose tracking-wide placeholder-white/20"
            placeholder="在此刻寫命運..."
          />
       </div>

       {/* Quick Add Option */}
       <div className="mb-6 flex flex-col gap-3 md:flex-row">
         <input
           type="text"
           value={newOption}
           onChange={(e) => setNewOption(e.target.value)}
           placeholder="輸入新的命運碎片..."
           disabled={isSpinning}
           className="flex-1 bg-[#0f0500] border border-forge-bronze/80 text-forge-light font-scroll p-3 rounded-lg focus:outline-none focus:border-forge-gold placeholder-white/20 disabled:opacity-50"
         />
         <button
           type="button"
           onClick={handleAddOption}
           disabled={isSpinning}
           className="px-6 bg-forge-gold/20 border border-forge-gold text-forge-light font-rune tracking-[0.3em] uppercase rounded-lg hover:bg-forge-gold/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
         >
           刻入
         </button>
       </div>

       {/* Save Controls */}
       <div className="flex gap-2 mb-6">
          <input 
             type="text" 
             value={listName}
             onChange={(e) => setListName(e.target.value)}
             placeholder="卷軸名稱"
             className="flex-1 bg-[#0f0500] border border-forge-bronze text-forge-light font-scroll p-3 rounded-lg focus:outline-none focus:border-forge-gold placeholder-white/20"
             disabled={isSpinning}
          />
          <button 
             onClick={saveList}
             disabled={saving || isSpinning}
             className="px-6 bg-forge-metal border border-forge-bronze text-forge-gold font-rune hover:bg-forge-brown hover:border-forge-gold transition-colors rounded-lg disabled:opacity-50"
          >
             {saving ? '鍛造中...' : '儲存卷軸'}
          </button>
       </div>

       {/* Action Button (The Hammer) */}
       <button
         onClick={onSpin}
         disabled={isSpinning || optionsCount < 2}
         className="w-full relative h-16 md:h-20 group/btn overflow-hidden rounded-sm bg-forge-brown border border-forge-gold/30 hover:border-forge-gold transition-all shadow-[0_5px_0_#1a0f0a] active:shadow-none active:translate-y-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
       >
          {/* Molten Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-forge-dark via-forge-brown to-forge-dark"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-forge-glow/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10 flex items-center justify-center gap-3">
              <span className="font-rune text-forge-light text-xl md:text-2xl tracking-[0.2em] uppercase group-hover/btn:text-white group-hover/btn:drop-shadow-[0_0_8px_#ffb300] transition-all">
                {isSpinning ? '鍛造進行中...' : '啟動命運'}
              </span>
          </div>
       </button>
       
       {optionsCount < 2 && (
         <p className="text-center text-forge-ember font-scroll mt-4 text-sm italic animate-pulse">
           ※ 需要至少兩種素材才能鍛造
         </p>
       )}
    </div>
  );
};
