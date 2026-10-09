import { useState } from 'react';
import { MEAL_TYPES } from '../lib/planner';
import { CloseIcon } from './Icons';

const chip = (active) => `rounded-full border border-ink px-4 py-2 text-[13px] font-bold ${active ? 'bg-ink text-sun' : 'hover:bg-ink/5'}`;

export function AddToPlanSheet({ recipe, days, defaultMeal, onConfirm, onClose }) {
  const today = days.find(d => d.isToday) || days[0];
  const [day, setDay] = useState(today.name);
  const [meal, setMeal] = useState(MEAL_TYPES.includes(defaultMeal) ? defaultMeal : MEAL_TYPES[1]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 lg:items-center lg:p-4" onClick={onClose}>
      <div
        role="dialog" aria-label={`Додати в план: ${recipe.name}`}
        className="w-full max-w-lg rounded-t-[28px] border border-ink bg-paper lg:rounded-[28px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink px-6 py-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.12em] text-muted">ДОДАТИ В ПЛАН</span>
            <span className="font-serif text-2xl font-medium">{recipe.name}</span>
          </div>
          <button onClick={onClose} aria-label="Закрити" className="rounded-full p-2 hover:bg-ink/10"><CloseIcon /></button>
        </div>
        <div className="flex flex-col gap-5 px-6 py-5">
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[0.12em] text-muted">ДЕНЬ</p>
            <div className="flex flex-wrap gap-2">
              {days.map(d => (
                <button key={d.name} onClick={() => setDay(d.name)} aria-pressed={day === d.name} className={chip(day === d.name)}>
                  {d.name.slice(0, 2)} · {d.day}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[0.12em] text-muted">ПРИЙОМ ЇЖІ</p>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map(m => <button key={m} onClick={() => setMeal(m)} aria-pressed={meal === m} className={chip(meal === m)}>{m}</button>)}
            </div>
          </div>
          <button onClick={() => onConfirm(day, meal)} className="self-start rounded-full border border-ink bg-sun px-6 py-2.5 text-[13px] font-bold hover:brightness-95">
            Додати в план
          </button>
        </div>
      </div>
    </div>
  );
}
