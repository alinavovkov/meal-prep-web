import { useState } from 'react';
import { Plus } from './Icons';

const UNITS = ['г', 'мл', 'шт', 'ст.л', 'ч.л'];

export function AddItemRow({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('шт');

  const reset = () => { setName(''); setAmount(''); setUnit('шт'); setOpen(false); };
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, amount, unit });
    reset();
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="no-print flex w-full items-center gap-3.5 border-b border-ink py-3.5 text-left">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ink bg-sun"><Plus size={14} /></span>
        <span className="font-serif text-[23px] font-medium text-muted">Додати свій продукт…</span>
      </button>
    );
  }

  return (
    <form onSubmit={submit} onKeyDown={e => e.key === 'Escape' && reset()} className="no-print flex flex-wrap items-center gap-2 border-b border-ink py-3.5">
      <input
        autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Назва продукту"
        className="min-w-0 flex-1 basis-40 rounded-full border border-ink bg-white/60 px-4 py-2 font-serif text-xl outline-none focus:bg-white"
      />
      <input
        value={amount} onChange={e => setAmount(e.target.value)} placeholder="К-ть" inputMode="decimal"
        className="w-20 rounded-full border border-ink bg-white/60 px-4 py-2 text-center text-sm font-bold outline-none focus:bg-white"
      />
      <select value={unit} onChange={e => setUnit(e.target.value)} className="rounded-full border border-ink bg-white/60 px-3 py-2 text-sm font-bold outline-none">
        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
      <button type="submit" disabled={!name.trim()} className="rounded-full border border-ink bg-sun px-5 py-2 text-[13px] font-bold disabled:opacity-40">Додати</button>
      <button type="button" onClick={reset} className="px-2 text-sm font-semibold text-muted hover:text-ink">Скасувати</button>
    </form>
  );
}
