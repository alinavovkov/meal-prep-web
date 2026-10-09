import { MEAL_TYPES } from '../lib/planner';
import { FAVORITES, getMealView, HERO_PHOTO, img } from '../data/photos';
import { ArrowRight, Minus, Plus } from './Icons';
import { Thumb } from './Thumb';

const OVERLAY = 'linear-gradient(180deg, #141414B3 0%, #14141400 45%, #14141400 60%, #141414CC 100%)';

export function MobileToday({ today, plan, recipesDb, plannedCount, rangeLabel, persons, onPersonsChange, onPick, onOpenMeals }) {
  return (
    <div className="lg:hidden">
      <section
        className="relative h-[clamp(440px,128vw,640px)] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `${OVERLAY}, url(${img(HERO_PHOTO)})` }}
      >
        <h1 className="absolute inset-x-0 top-[14%] text-center font-display text-[clamp(56px,21.5vw,140px)] leading-[0.9] tracking-[-0.035em] whitespace-nowrap text-sun">
          МЕНЮ НА<br />ТИЖДЕНЬ
        </h1>
        <div className="absolute left-[7%] top-[56%] rotate-[10deg] rounded-full border border-ink bg-royal px-4 py-[7px] font-serif text-lg font-semibold text-white">СМАКОТА</div>
        <div className="absolute right-[6%] top-[60%] -rotate-[10deg] flex h-[68px] w-[130px] flex-col items-center justify-center rounded-[68px] border border-ink bg-sun">
          <span className="font-serif text-[30px] font-semibold leading-none">{plannedCount}/21</span>
          <span className="text-[10px] font-bold">заплановано</span>
        </div>
        <div className="absolute inset-x-5 bottom-[7%] flex items-end justify-between">
          <span className="flex items-center gap-1.5 font-head text-[11px] font-medium text-sun">{rangeLabel}<ArrowRight size={14} /></span>
          <p className="w-[190px] text-right font-head text-sm font-bold leading-[1.15] text-white">ПЛАНУЙТЕ СТРАВИ — ПОКУПКИ ЗБЕРУТЬСЯ САМІ</p>
        </div>
      </section>

      <section className="flex flex-col gap-5 px-5 pb-2 pt-7">
        <div className="flex items-end justify-between">
          <h2 className="whitespace-pre-line font-display text-[38px] leading-none">{`СЬОГОДНІ —\n${today.name.toUpperCase()}, ${today.day}`}</h2>
          <div className="flex items-center gap-2 rounded-full border border-ink px-2 py-1 text-[13px] font-bold">
            <button onClick={() => onPersonsChange(persons - 1)} aria-label="Менше персон" className="p-1"><Minus size={14} /></button>
            <span aria-label="Персон">{persons}</span>
            <button onClick={() => onPersonsChange(persons + 1)} aria-label="Більше персон" className="p-1"><Plus size={14} /></button>
          </div>
        </div>
        <div className="flex flex-col">
          {MEAL_TYPES.map(type => {
            const m = getMealView(plan[today.name][type], recipesDb, type);
            return (
              <button key={type} onClick={() => onPick(today.name, type)} className="flex items-center gap-3.5 border-b border-ink py-3.5 text-left">
                <Thumb meal={m} size={64} />
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="text-[10px] font-bold tracking-[0.12em] text-muted">{type.toUpperCase()}</span>
                  <span className={`font-serif text-[26px] font-medium leading-tight ${m.empty ? 'text-ink/40' : ''}`}>{m.empty ? 'ще не обрано' : m.name}</span>
                </span>
                {m.empty
                  ? <span className="rounded-full border border-ink bg-sun px-4 py-2 text-xs font-bold">Додати</span>
                  : <ArrowRight size={20} />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3.5 pb-6 pt-5">
        <div className="flex items-center justify-between border-b border-ink px-5 pb-2">
          <span className="font-serif text-[28px] font-medium">Улюблене</span>
          <button onClick={onOpenMeals} className="text-[10px] font-extrabold tracking-[0.12em]">УСІ СТРАВИ →</button>
        </div>
        <div className="grid grid-cols-3">
          {FAVORITES.map(f => (
            <div key={f.name} className="flex h-[170px] items-end justify-center border-r border-ink bg-cover bg-center p-3 last:border-r-0" style={{ backgroundImage: `url(${img(f.photo)})` }}>
              <span className={`rounded-full border border-ink px-3 py-1 font-serif text-base font-semibold ${f.tone === 'royal' ? 'bg-royal text-white' : 'bg-sun'}`}>{f.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
