import { getMealView } from '../data/photos';
import { CloseIcon } from './Icons';
import { Thumb } from './Thumb';

export function MealPicker({ target, plan, recipesDb, onSelect, onClose }) {
  const current = plan[target.day][target.meal];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 lg:items-center lg:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-label={`${target.meal} · ${target.day}`}
        className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-t-[28px] border border-ink bg-paper lg:rounded-[28px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink px-6 py-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.12em] text-muted">{target.meal.toUpperCase()} · {target.day.toUpperCase()}</span>
            <span className="font-serif text-2xl font-medium">Оберіть страву</span>
          </div>
          <button onClick={onClose} aria-label="Закрити" className="rounded-full p-2 hover:bg-ink/10"><CloseIcon /></button>
        </div>
        <div className="overflow-y-auto px-6 pb-4">
          <button onClick={() => onSelect('')} className={`flex w-full items-center gap-3 border-b border-ink/20 py-3 text-left font-serif text-xl ${current === '' ? 'font-semibold' : 'text-ink/60'}`}>
            <Thumb meal={{ empty: true }} size={40} />
            Не обрано
          </button>
          {Object.entries(recipesDb).map(([id, recipe]) => (
            <button key={id} onClick={() => onSelect(id)} className={`flex w-full items-center gap-3 border-b border-ink/20 py-3 text-left font-serif text-xl ${current === id ? 'bg-sun font-semibold' : 'font-medium'}`}>
              <Thumb meal={getMealView(id, recipesDb, target.meal)} size={40} />
              {recipe.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
