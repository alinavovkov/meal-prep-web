import { useMemo, useState } from 'react';
import { CATEGORY_SHORT_NAMES } from '../lib/planner';
import { pluralPersons } from '../lib/dates';
import { buildShoppingText, getSortedCategories } from '../lib/shoppingText';
import { CopyIcon, FileDownIcon, PrinterIcon, SendIcon, ShareIcon } from './Icons';
import { CategoryBlock } from './CategoryBlock';
import { AddItemRow } from './AddItemRow';

const pill = 'flex items-center gap-[7px] rounded-full border border-ink px-4 py-2.5 text-xs font-bold hover:bg-ink/5';
const roundBtn = 'flex h-11 w-11 items-center justify-center rounded-full border border-ink hover:bg-ink/5 lg:hidden';

export function ShoppingListView({ persons, week, shoppingListCategories, checkedItems, toggleItemCheck, addExtraItem, removeExtraItem, onGoToPlan }) {
  const [copied, setCopied] = useState(false);

  const groups = useMemo(() => {
    const byName = new Map();
    getSortedCategories(shoppingListCategories).forEach(([category, items]) => {
      const title = CATEGORY_SHORT_NAMES[category] || category;
      byName.set(title, [...(byName.get(title) || []), ...items]);
    });
    return [...byName.entries()].map(([title, items]) => ({ title, items: [...items].sort((a, b) => a.name.localeCompare(b.name)) }));
  }, [shoppingListCategories]);

  const total = groups.reduce((sum, g) => sum + g.items.length, 0);
  const checked = groups.reduce((sum, g) => sum + g.items.filter(i => checkedItems[i.originalKey]).length, 0);
  const percent = total ? Math.round((checked / total) * 100) : 0;
  const text = useMemo(() => buildShoppingText(shoppingListCategories), [shoppingListCategories]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Список покупок', text }); return; } catch (err) { if (err.name === 'AbortError') return; }
    }
    copy();
  };
  const telegram = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener');

  return (
    <div>
      <section className="relative px-5 pb-6 pt-2 lg:px-12 lg:pb-7 lg:pt-10">
        <span className="font-head text-[10px] font-semibold lg:hidden">{week.rangeLabel} · {persons} {persons === 1 ? 'ПЕРСОНА' : persons < 5 ? 'ПЕРСОНИ' : 'ПЕРСОН'}</span>
        <h1 className="mt-3 max-w-[66%] font-display text-[clamp(44px,13.5vw,100px)] leading-[0.9] tracking-[-0.03em] lg:mt-0 lg:max-w-none lg:whitespace-nowrap lg:text-[clamp(110px,13.6vw,196px)]">
          СПИСОК ПОКУПОК
        </h1>

        <div className="absolute right-4 top-12 flex h-[78px] w-[116px] -rotate-[10deg] flex-col items-center justify-center rounded-[68px] border border-ink bg-sun lg:right-[8%] lg:top-5 lg:h-[110px] lg:w-[220px] lg:rounded-[110px]">
          <span className="font-serif text-[28px] font-semibold leading-none lg:text-5xl">{checked}/{total}</span>
          <span className="text-[10px] font-bold lg:text-xs">вже в кошику</span>
        </div>
        <div className="absolute left-[5%] top-[130px] hidden rotate-[8deg] rounded-full border border-ink bg-royal px-5 py-2 font-serif text-[22px] font-semibold text-white lg:block">
          на {persons} {pluralPersons(persons)}
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:mt-7 lg:flex-row lg:items-center lg:justify-between lg:border-t lg:border-ink lg:pt-5">
          <div className="flex items-center gap-5">
            <span className="hidden font-head text-[13px] font-semibold lg:block">{week.rangeLabel}</span>
            <div
              role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}
              className="h-3 flex-1 overflow-hidden rounded-full border border-ink lg:h-3.5 lg:w-60 lg:flex-none"
            >
              <div className="h-full border-r border-ink bg-sun" style={{ width: `${percent}%`, borderRightWidth: percent ? 1 : 0 }} />
            </div>
            <span className="hidden font-serif text-xl font-medium text-muted lg:block">Кількості розраховано на {persons} {pluralPersons(persons)}</span>
          </div>
          <div className="no-print flex items-center gap-2.5">
            <button onClick={share} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-ink bg-royal px-[22px] text-[13px] font-bold text-white hover:brightness-110 lg:h-10 lg:flex-none">
              <ShareIcon /> Поділитися
            </button>
            <button onClick={telegram} aria-label="Telegram" className={roundBtn}><SendIcon size={16} /></button>
            <button onClick={copy} aria-label="Копіювати" className={roundBtn}><CopyIcon size={16} /></button>
            <button onClick={() => window.print()} aria-label="PDF" className={roundBtn}><FileDownIcon size={16} /></button>
            <button onClick={telegram} className={`${pill} hidden lg:flex`}><SendIcon /> Telegram</button>
            <button onClick={copy} className={`${pill} hidden lg:flex`}><CopyIcon /> {copied ? 'Скопійовано' : 'Копіювати'}</button>
            <button onClick={() => window.print()} className={`${pill} hidden lg:flex`}><FileDownIcon /> PDF</button>
            <button onClick={() => window.print()} className={`${pill} hidden lg:flex`}><PrinterIcon /> Друк</button>
          </div>
        </div>
        <span aria-live="polite" className="sr-only">{copied ? 'Список скопійовано' : ''}</span>
      </section>

      <div className="px-5 pb-8 lg:columns-2 lg:gap-12 lg:px-12 lg:pb-16 lg:pt-3">
        {total === 0 && (
          <div className="break-inside-avoid border-y border-ink py-12 text-center">
            <p className="font-serif text-3xl">Ваш список покупок порожній.</p>
            <p className="mt-1 text-sm text-muted">Додайте страви до плану — інгредієнти з’являться тут.</p>
            <button onClick={onGoToPlan} className="mt-5 rounded-full border border-ink bg-sun px-6 py-2.5 text-[13px] font-bold hover:brightness-95">Перейти до планування</button>
          </div>
        )}
        {groups.map((g, i) => (
          <CategoryBlock
            key={g.title} index={i} title={g.title} items={g.items}
            checkedItems={checkedItems} onToggle={toggleItemCheck} onRemoveExtra={removeExtraItem}
            defaultOpen={i < 2}
          />
        ))}
        <div className="break-inside-avoid lg:mb-9"><AddItemRow onAdd={addExtraItem} /></div>
        <div className="no-print mt-6 break-inside-avoid border border-ink bg-royal p-7 text-white lg:mt-0">
          <h2 className="font-head text-lg font-bold">ВІДПРАВТЕ СПИСОК У TELEGRAM</h2>
          <p className="mt-3 font-serif text-[22px] font-medium leading-[1.2]">Надішліть список у чат — і той, хто йде в магазин, матиме все під рукою.</p>
          <button onClick={telegram} className="mt-4 flex items-center gap-2 rounded-full border border-ink bg-sun px-5 py-2.5 text-[13px] font-bold text-ink hover:brightness-95">
            <SendIcon /> Надіслати
          </button>
        </div>
      </div>
    </div>
  );
}
