import { MEAL_TYPES } from '../lib/planner';
import { getMealView, img, TODAY_FALLBACK_PHOTO } from '../data/photos';
import { ArrowRight } from './Icons';

const EMPTY_NOTE = { 'Сніданок': 'Сніданок ще порожній', 'Обід': 'Обід ще порожній', 'Вечеря': 'Вечеря ще порожня' };
const ADD_LABEL = { 'Сніданок': 'Додати сніданок', 'Обід': 'Додати обід', 'Вечеря': 'Додати вечерю' };

export function TodayPanel({ today, plan, recipesDb, onPick }) {
  const meals = MEAL_TYPES.map(type => ({ type, ...getMealView(plan[today.name][type], recipesDb, type) }));
  const firstEmpty = meals.find(m => m.empty);
  const photo = meals.find(m => m.photo)?.photo || TODAY_FALLBACK_PHOTO;

  return (
    <section className="hidden lg:grid grid-cols-2 min-h-[600px]">
      <div className="flex flex-col justify-between px-14 pb-12 pt-16">
        <div className="flex flex-col gap-9">
          <h2 className="whitespace-pre-line font-display text-[clamp(40px,3.6vw,52px)] leading-[1.02]">
            {`СЬОГОДНІ — ${today.name.toUpperCase()},\n${today.dateLabel.toUpperCase()}`}
          </h2>
          <div className="flex flex-col">
            {meals.map(m => (
              <button
                key={m.type}
                onClick={() => onPick(today.name, m.type)}
                className="flex items-center gap-6 border-b border-ink/20 py-3.5 text-left hover:bg-ink/5"
              >
                <span className="w-[120px] shrink-0 text-[11px] font-bold tracking-[0.14em] text-muted">{m.type.toUpperCase()}</span>
                <span className={`font-serif text-[30px] font-medium leading-tight ${m.empty ? 'text-ink/40' : ''}`}>
                  {m.empty ? 'ще не обрано' : m.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-[280px] text-[13px] leading-normal text-muted">
            {firstEmpty
              ? `${EMPTY_NOTE[firstEmpty.type]}. Оберіть страву — інгредієнти одразу потраплять до списку покупок.`
              : 'На сьогодні все заплановано. Інгредієнти вже у списку покупок.'}
          </p>
          {firstEmpty && (
            <button
              onClick={() => onPick(today.name, firstEmpty.type)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-ink bg-sun px-[22px] py-2.5 text-[13px] font-bold hover:brightness-95"
            >
              {ADD_LABEL[firstEmpty.type]}
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="bg-cover bg-center" style={{ backgroundImage: `url(${img(photo)})` }} />
    </section>
  );
}
