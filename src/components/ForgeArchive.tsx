import React, { useState, useEffect } from 'react';

interface ForgeArchiveProps {
  input: string;
  setInput: (value: string) => void;
  isSpinning: boolean;
  onSpin: () => void;
  optionsCount: number;
}

interface List {
  id: string;
  title: string;
  items: { label: string; weight: number }[];
}

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

  // Fetch lists on mount
  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await fetch('/api/lists');
      if (res.ok) {
        const data = await res.json();
        setLists(data.lists || []);
      }
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

  const saveList = async () => {
    if (!listName.trim()) {
      alert('Please inscribe a name for this destiny.');
      return;
    }
    
    setSaving(true);
    try {
      const items = input.split('\n').map(s => s.trim()).filter(Boolean);
      const counts: Record<string, number> = {};
      items.forEach(i => { counts[i] = (counts[i] || 0) + 1 });

      let targetListId = currentListId;

      // Auto-detect: if list name matches existing list, update it
      if (!currentListId) {
        const existingList = lists.find(l => l.title === listName.trim());
        if (existingList) {
          targetListId = existingList.id;
        }
      }

      if (targetListId) {
        // Update existing list
        // 1. Delete all items
        const list = lists.find(l => l.id === targetListId);
        if (list) {
          await Promise.all(list.items.map(item =>
            fetch(`/api/items/${encodeURIComponent(item.label)}?listId=${targetListId}`, { method: 'DELETE' })
          ));
        }

        // 2. Update list name
        await fetch(`/api/lists/${targetListId}`, {
          method: 'PATCH',
          body: JSON.stringify({ title: listName.trim() })
        });

        // 3. Add new items
        await Promise.all(Object.entries(counts).map(([label, weight]) =>
          fetch('/api/items', {
            method: 'POST',
            body: JSON.stringify({ listId: targetListId, label, weight })
          })
        ));

        alert('Destiny rewritten!');
      } else {
        // Create new list
        const resList = await fetch('/api/lists', {
          method: 'POST',
          body: JSON.stringify({ title: listName.trim() }),
        });
        if (!resList.ok) throw new Error('Failed to create list');
        const { id } = await resList.json();

        await Promise.all(Object.entries(counts).map(([label, weight]) =>
          fetch('/api/items', {
            method: 'POST',
            body: JSON.stringify({ listId: id, label, weight })
          })
        ));

        setCurrentListId(id);
        alert('New destiny forged!');
      }

      // Refresh lists
      await fetchLists();

    } catch (e) {
      console.error(e);
      alert('The forge is cold. Save failed.');
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
           Archive
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
             <option value="" disabled>Select a scroll...</option>
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
            placeholder="Inscribe destinies here..."
          />
       </div>

       {/* Save Controls */}
       <div className="flex gap-2 mb-6">
          <input 
             type="text" 
             value={listName}
             onChange={(e) => setListName(e.target.value)}
             placeholder="Scroll Name"
             className="flex-1 bg-[#0f0500] border border-forge-bronze text-forge-light font-scroll p-3 rounded-lg focus:outline-none focus:border-forge-gold placeholder-white/20"
             disabled={isSpinning}
          />
          <button 
             onClick={saveList}
             disabled={saving || isSpinning}
             className="px-6 bg-forge-metal border border-forge-bronze text-forge-gold font-rune hover:bg-forge-brown hover:border-forge-gold transition-colors rounded-lg disabled:opacity-50"
          >
             {saving ? '...' : 'Save'}
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
                {isSpinning ? 'Forging...' : 'Strike Fate'}
              </span>
          </div>
       </button>
       
       {optionsCount < 2 && (
         <p className="text-center text-forge-ember font-scroll mt-4 text-sm italic animate-pulse">
           * Requires at least 2 materials to forge
         </p>
       )}
    </div>
  );
};
