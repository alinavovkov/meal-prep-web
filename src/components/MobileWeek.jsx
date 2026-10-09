import { useState } from 'react';
import { MEAL_TYPES } from '../lib/planner';
import { getMealView } from '../data/photos';
import { pluralPersons, pluralProducts } from '../lib/dates';
import { ArrowRight, ChevronDown, Plus } from './Icons';
import { Thumb } from './Thumb';

export function MobileWeek({ week, plan, recipesDb, plannedCount, persons, shoppingItemsCount, onPick, onOpenList }) {
  const [openIndex, setOpenIndex] = useState(week.todayIndex);

  return (
    <div className="lg:hidden pt-4">
      <header className="flex flex-col gap-2.5 px-5 pb-6 pt-1">
        <span className="font-head text-[11px] font-medium">ТИЖДЕНЬ {week.weekNumber}</span>
        <div className="flex items-center justify-between gap-3">
          <h1 className="min-w-0 flex-1 font-display text-[clamp(40px,14vw,88px)] leading-[0.95]">{week.rangeLabel}</h1>
          <div className="flex h-[78px] w-[118px] shrink-0 -rotate-[10deg] flex-col items-center justify-center rounded-[60px] border border-ink bg-sun">
            <span className="font-serif text-[28px] font-semibold leading-none">{plannedCount}/21</span>
            <span className="text-[9px] font-bold">заплановано</span>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-between bg-royal px-5 py-3.5 text-white">
        <div className="flex flex-col gap-0.5">
          <span className="font-head text-xs font-bold">СПИСОК ПОКУПОК</span>
          <span className="font-serif text-[17px]">{shoppingItemsCount} {pluralProducts(shoppingItemsCount)} на {persons} {pluralPersons(persons)}</span>
        </div>
        <button onClick={onOpenList} className="flex items-center gap-1.5 rounded-full border border-ink bg-sun px-4 py-2 text-xs font-bold text-ink">
          Відкрити <ArrowRight size={14} />
        </button>
      </div>

      <div className="pb-5">
        {week.days.map(d => {
          const open = openIndex === d.index;
          const meals = MEAL_TYPES.map(type => ({ type, ...getMealView(plan[d.name][type], recipesDb, type) }));
          const done = meals.filter(m => !m.empty).length;
          return (
            <div key={d.name} className={`border-b border-ink ${d.isToday ? 'bg-sun' : ''}`}>
              <button onClick={() => setOpenIndex(open ? -1 : d.index)} aria-expanded={open} className="flex w-full items-center gap-3 px-5 py-4 text-left">
                <span className="w-8 shrink-0 font-head text-[11px] font-medium">{d.number}</span>
                <span className="flex min-w-0 flex-1 flex-col">
                  {d.index % 2 === 0
                    ? <span className="font-head text-lg font-bold tracking-[-0.02em]">{d.name.toUpperCase()}</span>
                    : <span className="font-serif text-[28px] font-medium leading-tight">{d.name}</span>}
                  <span className="text-[11px] font-semibold text-muted">{d.dateLabel} · {done}/3{d.isToday ? ' · сьогодні' : ''}</span>
                </span>
                {!open && done > 0 && (
                  <span className="flex">
                    {meals.filter(m => !m.empty).map((m, i) => <Thumb key={m.type} meal={m} size={36} className={i ? '-ml-2.5' : ''} />)}
                  </span>
                )}
                <span className={`transition-transform ${open ? 'rotate-180' : ''}`}><ChevronDown /></span>
              </button>
              {open && (
                <div className="flex flex-col gap-3 px-5 pb-4">
                  {meals.map(m => (
                    <button key={m.type} onClick={() => onPick(d.name, m.type)} className="flex items-center gap-3 text-left">
                      <Thumb meal={m} size={48} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-[9px] font-bold tracking-[0.12em] text-muted">{m.type.toUpperCase()}</span>
                        <span className={`font-serif text-xl font-medium leading-tight ${m.empty ? 'text-ink/40' : ''}`}>{m.empty ? 'ще не обрано' : m.name}</span>
                      </span>
                      {m.empty
                        ? <span className="flex items-center gap-1 rounded-full border border-ink bg-white/60 px-3 py-1.5 text-[11px] font-bold"><Plus size={12} />Додати</span>
                        : <ArrowRight size={18} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
