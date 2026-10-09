import { img } from '../data/photos';
import { Plus } from './Icons';

export function Thumb({ meal, size = 52, className = '' }) {
  const dim = { width: size, height: size };
  if (meal.photo) {
    return (
      <span
        className={`shrink-0 rounded-full border border-ink bg-cover bg-center ${className}`}
        style={{ ...dim, backgroundImage: `url(${img(meal.photo)})` }}
      />
    );
  }
  return (
    <span
      className={`shrink-0 rounded-full border border-ink flex items-center justify-center ${meal.empty ? '' : 'bg-paper'} ${className}`}
      style={{ ...dim, fontSize: size * 0.46 }}
    >
      {meal.empty ? <Plus size={Math.round(size * 0.38)} /> : meal.emoji}
    </span>
  );
}
