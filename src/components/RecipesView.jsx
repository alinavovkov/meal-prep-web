import { useMemo, useState } from 'react';
import { MEAL_TYPES, dishMeta } from '../lib/planner';
import { img } from '../data/photos';
import { ArrowRight, ChevronDown, ClockIcon, FilterIcon, Heart, LeafIcon, Plus, SearchIcon } from './Icons';
import { DishCard } from './DishCard';
import { AddToPlanSheet } from './AddToPlanSheet';

const PAGE_SIZE = 12;
const SORTS = { popular: 'Популярні', name: 'За назвою', quick: 'Швидкі' };

const chipClass = (active) => `flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink px-3.5 py-2 text-xs font-bold lg:px-4 lg:py-2.5 ${active ? 'bg-ink text-sun' : 'hover:bg-ink/5'}`;

export function RecipesView({ recipesDb, planCounts, week, onEdit, onToggleFavorite, onAddToPlan }) {
  const [query, setQuery] = useState('');
  const [meal, setMeal] = useState('');
  const [quick, setQuick] = useState(false);
  const [veg, setVeg] = useState(false);
  const [fav, setFav] = useState(false);
  const [sort, setSort] = useState('popular');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(false);
  const [sheetFor, setSheetFor] = useState(null);

  const all = useMemo(() => Object.entries(recipesDb).map(([id, recipe], order) => ({ id, recipe, order })), [recipesDb]);
  const favCount = all.filter(r => r.recipe.favorite).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = all.filter(({ recipe }) =>
      (!meal || recipe.mealType === meal) &&
      (!quick || (recipe.minutes && recipe.minutes <= 30)) &&
      (!veg || recipe.vegetarian) &&
      (!fav || recipe.favorite) &&
      (!q || recipe.name.toLowerCase().includes(q) || recipe.ingredients.some(i => i.name.toLowerCase().includes(q)))
    );
    const popularity = (r) => (planCounts[r.id] || 0) * 10 + (r.recipe.favorite ? 1 : 0);
    const cmp = {
      popular: (a, b) => popularity(b) - popularity(a) || a.order - b.order,
      name: (a, b) => a.recipe.name.localeCompare(b.recipe.name, 'uk'),
      quick: (a, b) => (a.recipe.minutes || 9999) - (b.recipe.minutes || 9999) || a.order - b.order,
    }[sort];
    return [...list].sort(cmp);
  }, [all, query, meal, quick, veg, fav, sort, planCounts]);

  const featured = useMemo(() => {
    const score = (r) => (planCounts[r.id] || 0) * 100 + (r.recipe.favorite ? 10 : 0) + (r.recipe.description ? 1 : 0);
    return [...all].sort((a, b) => score(b) - score(a) || a.order - b.order)[0];
  }, [all, planCounts]);

  const withReset = (setter) => (value) => { setter(value); setLimit(PAGE_SIZE); };
  const setQ = withReset(setQuery), setM = withReset(setMeal), setS = withReset(setSort);
  const toggle = (setter) => () => { setter(v => !v); setLimit(PAGE_SIZE); };

  const visible = filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;
  const sheetRecipe = sheetFor ? recipesDb[sheetFor] : null;
  const counterEnd = String(visible.length).padStart(2, '0');

  return (
    <div>
      <section className="relative flex flex-col gap-3.5 px-5 pb-4 pt-1 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-7 lg:pt-9">
        <div className="flex items-center justify-between lg:hidden">
          <span className="font-head text-[10px] font-semibold">КУЛІНАРНА КНИГА</span>
          <button onClick={toggle(setFav)} aria-pressed={fav} className="flex items-center gap-1.5 rounded-full border border-ink bg-royal px-3 py-[7px] text-white">
            <Heart size={13} filled /><span className="font-serif text-sm font-semibold">{favCount}</span>
          </button>
        </div>
        <h1 className="font-display text-[clamp(64px,18.5vw,110px)] leading-[0.85] tracking-[-0.045em] lg:min-w-0 lg:text-[clamp(120px,19vw,300px)] lg:leading-[0.82] lg:tracking-[-0.027em]">СТРАВИ</h1>
        <div className="absolute right-5 top-20 flex h-[60px] w-[110px] rotate-[8deg] flex-col items-center justify-center rounded-[60px] border border-ink bg-sun lg:hidden">
          <span className="font-serif text-[28px] font-semibold leading-none">{all.length}</span>
          <span className="text-[9px] font-bold">рецепти</span>
        </div>
        <button onClick={toggle(setFav)} aria-pressed={fav} className="hidden -rotate-[8deg] items-center gap-1.5 whitespace-nowrap rounded-full border border-ink bg-royal px-5 py-2 text-white lg:absolute lg:left-[60%] lg:top-[36%] lg:flex">
          <Heart size={16} filled /><span className="font-serif text-[22px] font-semibold">{favCount} улюблених</span>
        </button>
        <div className="hidden w-[min(440px,28vw)] shrink-0 flex-col gap-5 pb-2.5 lg:flex">
          <div className="flex h-[90px] w-[180px] rotate-6 flex-col items-center justify-center rounded-[90px] border border-ink bg-sun">
            <span className="font-serif text-5xl font-semibold leading-none">{all.length}</span>
            <span className="text-xs font-bold">рецептів</span>
          </div>
          <p className="font-serif text-[26px] font-medium leading-[1.15]">Ваша кулінарна книга: улюблене, нові ідеї та все, що вже стоїть у плані.</p>
        </div>
      </section>

      <div className="flex flex-col gap-3 px-5 pb-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-2.5 lg:border-b lg:border-ink lg:px-12 lg:py-4">
        <label className="flex h-[46px] items-center gap-2.5 rounded-full border border-ink bg-white/60 px-4 lg:h-auto lg:w-80 lg:px-[18px] lg:py-[11px]">
          <SearchIcon />
          <input
            value={query} onChange={e => setQ(e.target.value)} placeholder="Знайти страву чи інгредієнт…" aria-label="Пошук страви"
            className="min-w-0 flex-1 bg-transparent font-serif text-[19px] font-medium outline-none placeholder:text-muted"
          />
          <button onClick={() => setShowFilters(v => !v)} aria-label="Фільтри" aria-pressed={showFilters} className="lg:hidden"><FilterIcon /></button>
        </label>
        <div className="flex gap-1.5 overflow-x-auto lg:gap-2.5">
          <button onClick={() => setM('')} aria-pressed={!meal} className={chipClass(!meal)}>Усі · {all.length}</button>
          {MEAL_TYPES.map(m => <button key={m} onClick={() => setM(meal === m ? '' : m)} aria-pressed={meal === m} className={chipClass(meal === m)}>{m}</button>)}
        </div>
        <div className={`${showFilters ? 'flex' : 'hidden'} flex-wrap items-center gap-2 lg:flex lg:flex-1 lg:gap-2.5`}>
          <span className="hidden h-7 w-px bg-ink/20 lg:block" />
          <button onClick={toggle(setQuick)} aria-pressed={quick} className={chipClass(quick)}><ClockIcon /> До 30 хв</button>
          <button onClick={toggle(setVeg)} aria-pressed={veg} className={chipClass(veg)}><LeafIcon /> Вегетаріанське</button>
          <button onClick={toggle(setFav)} aria-pressed={fav} className={chipClass(fav)}><Heart size={13} /> Улюблене</button>
          <label className="relative flex items-center gap-1.5 font-serif text-[19px] font-medium lg:ml-auto">
            <select value={sort} onChange={e => setS(e.target.value)} aria-label="Сортування" className="cursor-pointer appearance-none bg-transparent pr-5 outline-none">
              {Object.entries(SORTS).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
            </select>
            <span className="pointer-events-none absolute right-0"><ChevronDown size={14} /></span>
          </label>
        </div>
      </div>

      {featured && (
        <section className="border-y border-ink lg:grid lg:min-h-[520px] lg:grid-cols-2 lg:border-t-0">
          <div
            className="relative h-[230px] border-b border-ink bg-ink/10 bg-cover bg-center p-3.5 lg:h-auto lg:border-b-0"
            style={featured.recipe.photo ? { backgroundImage: `url(${img(featured.recipe.photo)})` } : undefined}
          >
            <span className="inline-block -rotate-[4deg] rounded-full border border-ink bg-royal px-3.5 py-1.5 font-serif text-[17px] font-semibold text-white lg:hidden">страва тижня</span>
          </div>
          <div className="flex items-end gap-3 px-5 py-4 lg:flex-col lg:items-stretch lg:justify-between lg:p-14 lg:pb-12">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 lg:gap-5">
              <span className="hidden font-head text-xs font-semibold text-royal lg:block">СТРАВА ТИЖНЯ</span>
              <h2 className="font-display text-[30px] leading-[0.95] lg:text-[clamp(44px,5vw,72px)] lg:tracking-[-0.02em]">{featured.recipe.name.toUpperCase()}</h2>
              <p className="hidden font-serif text-2xl font-medium leading-[1.2] text-muted lg:block">
                {featured.recipe.description || `Основні інгредієнти: ${featured.recipe.ingredients.slice(0, 4).map(i => i.name.toLowerCase()).join(', ')}.`}
              </p>
              <div className="hidden flex-wrap gap-2.5 lg:flex">
                {[featured.recipe.minutes && `${featured.recipe.minutes} хв`, featured.recipe.kcal && `${featured.recipe.kcal} ккал`, featured.recipe.mealType, `${featured.recipe.ingredients.length} інгредієнтів`].filter(Boolean).map(t => (
                  <span key={t} className="rounded-full border border-ink px-3 py-[5px] text-[11px] font-bold">{t}</span>
                ))}
              </div>
              <span className="text-[11px] font-semibold text-muted lg:hidden">{dishMeta(featured.recipe)}{featured.recipe.mealType ? ` · ${featured.recipe.mealType}` : ''}</span>
            </div>
            <button onClick={() => setSheetFor(featured.id)} aria-label="Додати в план" className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-ink bg-sun lg:hidden"><Plus size={18} /></button>
            <div className="hidden items-center gap-3 lg:flex">
              <button onClick={() => setSheetFor(featured.id)} className="flex items-center gap-2 rounded-full border border-ink bg-sun px-6 py-3 text-[13px] font-bold hover:brightness-95"><Plus size={15} /> Додати в план</button>
              <button onClick={() => onEdit(featured.id)} className="flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-[13px] font-bold hover:bg-ink/5">Рецепт <ArrowRight size={15} /></button>
            </div>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4 px-5 pb-8 pt-6 lg:gap-7 lg:px-12 lg:pb-14 lg:pt-9">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-[28px] font-medium leading-none lg:text-[44px]">Усі страви</h2>
          <span className="font-head text-[10px] font-medium lg:text-xs">
            {filtered.length ? `01 — ${counterEnd} З ${filtered.length}` : '0 З 0'}
          </span>
        </div>
        {filtered.length === 0 ? (
          <p className="border-y border-ink py-12 text-center font-serif text-2xl text-muted">Нічого не знайдено — спробуйте інший запит чи фільтр.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 lg:grid-cols-4 lg:gap-6">
            {visible.map(({ id, recipe }, i) => (
              <DishCard key={id} id={id} recipe={recipe} number={i + 1} onEdit={onEdit} onToggleFavorite={onToggleFavorite} onAddToPlan={setSheetFor} />
            ))}
          </div>
        )}
        {remaining > 0 && (
          <div className="flex justify-center pt-3">
            <button onClick={() => setLimit(l => l + PAGE_SIZE)} className="flex items-center gap-2.5 rounded-full border border-ink px-8 py-3.5 font-serif text-[22px] font-semibold hover:bg-ink/5">
              Показати ще {Math.min(remaining, PAGE_SIZE)} страв
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </section>

      {sheetRecipe && (
        <AddToPlanSheet
          recipe={sheetRecipe} days={week.days} defaultMeal={sheetRecipe.mealType}
          onConfirm={(day, mealType) => { onAddToPlan(day, mealType, sheetFor); setSheetFor(null); }}
          onClose={() => setSheetFor(null)}
        />
      )}
    </div>
  );
}
