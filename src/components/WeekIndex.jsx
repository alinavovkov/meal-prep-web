import { MEAL_TYPES } from '../lib/planner';
import { getMealView } from '../data/photos';
import { ArrowRight } from './Icons';
import { Thumb } from './Thumb';

export function WeekIndex({ days, plan, recipesDb, onPick, onClear }) {
  return (
    <section className="hidden lg:flex flex-col pt-6">
      <div className="flex items-center justify-between border-b border-ink px-14 py-4">
        <span className="text-[11px] font-bold tracking-[0.14em] text-muted">ВЕСЬ ТИЖДЕНЬ</span>
        <button onClick={onClear} className="font-serif text-lg text-muted hover:text-ink hover:underline">Очистити план</button>
      </div>
      {days.map(d => (
        <div key={d.name} className={`flex items-center gap-6 border-b border-ink px-14 py-[22px] ${d.isToday ? 'bg-sun' : ''}`}>
          <span className="w-14 shrink-0 font-head text-[13px] font-medium">{d.number}</span>
          <div className="flex w-80 shrink-0 flex-col gap-0.5">
            {d.index % 2 === 0
              ? <span className="font-head text-[26px] font-bold tracking-[-0.02em]">{d.name.toUpperCase()}</span>
              : <span className="font-serif text-4xl font-medium leading-tight">{d.name}</span>}
            <span className="text-xs font-semibold text-muted">{d.dateLabel}{d.isToday ? ' · сьогодні' : ''}</span>
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-3 gap-6">
            {MEAL_TYPES.map(type => {
              const m = getMealView(plan[d.name][type], recipesDb, type);
              return (
                <button key={type} onClick={() => onPick(d.name, type)} className="flex min-w-0 items-center gap-3 rounded-full py-0.5 pr-3 text-left hover:bg-ink/5">
                  <Thumb meal={m} size={52} />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[10px] font-bold tracking-[0.12em] text-muted">{type.toUpperCase()}</span>
                    <span className={`font-serif text-[19px] font-semibold leading-[1.1] ${m.empty ? 'text-ink/50' : ''}`}>{m.empty ? 'Додати страву' : m.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <ArrowRight size={26} />
        </div>
      ))}
    </section>
  );
}
