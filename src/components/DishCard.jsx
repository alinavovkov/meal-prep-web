import { img } from '../data/photos';
import { dishMeta } from '../lib/planner';
import { Heart, Plus } from './Icons';

const MEAL_TONE = { 'Сніданок': 'bg-sun/70', 'Обід': 'bg-royal/20', 'Вечеря': 'bg-ink/10' };
const MEAL_EMOJI = { 'Сніданок': '🥞', 'Обід': '🍲', 'Вечеря': '🍽️' };

export function DishCard({ id, recipe, number, onEdit, onToggleFavorite, onAddToPlan }) {
  const meta = dishMeta(recipe);
  return (
    <article className="flex flex-col gap-2.5 lg:gap-3.5">
      <div
        className={`relative flex h-[190px] flex-col justify-between border border-ink bg-cover bg-center p-2.5 lg:h-[300px] lg:p-3.5 ${recipe.photo ? '' : (MEAL_TONE[recipe.mealType] || 'bg-ink/5')}`}
        style={recipe.photo ? { backgroundImage: `url(${img(recipe.photo)})` } : undefined}
      >
        {!recipe.photo && (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center text-6xl">{MEAL_EMOJI[recipe.mealType] || '🍽️'}</span>
        )}
        <div className="relative flex items-center justify-between">
          {recipe.mealType
            ? <span className="hidden rounded-full border border-ink bg-paper px-3 py-[5px] text-[11px] font-bold lg:block">{recipe.mealType}</span>
            : <span />}
          <button
            onClick={() => onToggleFavorite(id)} aria-pressed={!!recipe.favorite}
            aria-label={recipe.favorite ? 'Прибрати з улюбленого' : 'Додати в улюблене'}
            className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border border-ink lg:h-[34px] lg:w-[34px] ${recipe.favorite ? 'bg-royal text-white' : 'bg-paper text-ink'}`}
          >
            <Heart size={15} filled={!!recipe.favorite} />
          </button>
        </div>
        <div className="relative flex justify-end">
          <button onClick={() => onAddToPlan(id)} aria-label={`Додати в план: ${recipe.name}`} className="flex h-[34px] w-[34px] items-center justify-center gap-1.5 rounded-full border border-ink bg-sun hover:brightness-95 lg:h-auto lg:w-auto lg:px-3.5 lg:py-2">
            <Plus size={14} />
            <span className="hidden text-xs font-bold lg:inline">Додати в план</span>
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <span className="hidden pt-1 font-head text-[11px] font-medium lg:block">{String(number).padStart(2, '0')}.</span>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px] lg:gap-1">
          {recipe.mealType && <span className="text-[9px] font-bold tracking-[0.11em] text-muted lg:hidden">{recipe.mealType.toUpperCase()}</span>}
          <button onClick={() => onEdit(id)} className="text-left font-serif text-[21px] font-semibold leading-[1.05] hover:underline lg:text-[27px] lg:font-medium">{recipe.name}</button>
          <span className="text-[11px] font-semibold text-muted lg:text-xs">{meta}</span>
        </div>
      </div>
    </article>
  );
}
