import { useState } from 'react';
import { formatQty } from '../lib/planner';
import { CheckIcon, ChevronDown, CloseIcon } from './Icons';

const COLLAPSED_LIMIT = 8;

export function CategoryBlock({ index, title, items, checkedItems, onToggle, onRemoveExtra, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const [expanded, setExpanded] = useState(false);
  const checkedCount = items.filter(i => checkedItems[i.originalKey]).length;
  const hiddenCount = items.length - COLLAPSED_LIMIT;
  const num = String(index + 1).padStart(2, '0') + '.';

  return (
    <section className="break-inside-avoid lg:mb-9">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 border-b border-ink py-4 text-left lg:cursor-default"
      >
        <span className="font-head text-xs font-medium">{num}</span>
        {index % 2 === 0
          ? <span className="flex-1 font-head text-sm font-bold tracking-[-0.02em] lg:text-xl">{title.toUpperCase()}</span>
          : <span className="flex-1 font-serif text-2xl font-medium leading-tight lg:text-[32px]">{title}</span>}
        <span className="rounded-full border border-ink px-3 py-1 text-[11px] font-bold">{checkedCount}/{items.length}</span>
        <span className={`transition-transform lg:hidden ${open ? 'rotate-180' : ''}`}><ChevronDown size={18} /></span>
      </button>

      <div className={open ? '' : 'hidden lg:block print:block'}>
        {items.map((item, i) => {
          const checked = !!checkedItems[item.originalKey];
          const hidden = !expanded && i >= COLLAPSED_LIMIT;
          return (
            <div key={item.originalKey} className={`items-center border-b border-ink/20 ${hidden ? 'hidden lg:flex print:flex' : 'flex'}`}>
              <button
                role="checkbox" aria-checked={checked} onClick={() => onToggle(item.originalKey)}
                className="flex min-w-0 flex-1 items-center gap-3.5 py-[11px] text-left"
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink ${checked ? 'bg-ink text-sun' : ''}`}>
                  {checked && <CheckIcon />}
                </span>
                <span className={`min-w-0 flex-1 font-serif text-xl font-medium lg:text-[23px] ${checked ? 'text-ink/40' : ''}`}>{item.name}</span>
                <span className={`shrink-0 text-[13px] font-bold ${checked ? 'text-ink/40' : ''}`}>{formatQty(item.amount, item.unit)}</span>
              </button>
              {item.extraId && (
                <button onClick={() => onRemoveExtra(item.extraId)} aria-label={`Видалити ${item.name}`} className="no-print ml-2 rounded-full p-1 text-muted hover:text-ink"><CloseIcon size={16} /></button>
              )}
            </div>
          );
        })}
        {hiddenCount > 0 && !expanded && (
          <button onClick={() => setExpanded(true)} className="no-print py-2.5 text-xs font-bold text-royal lg:hidden">
            + ще {hiddenCount} {hiddenCount === 1 ? 'продукт' : hiddenCount < 5 ? 'продукти' : 'продуктів'}
          </button>
        )}
      </div>
    </section>
  );
}
