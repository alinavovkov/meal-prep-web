import { FAVORITES, img } from '../data/photos';

export function FavoritesStrip() {
  return (
    <section className="hidden lg:grid h-[420px] grid-cols-3 border-b border-ink">
      {FAVORITES.map((f, i) => (
        <div key={f.name} className="flex flex-col justify-end bg-cover bg-center p-7" style={{ backgroundImage: `url(${img(f.photo)})` }}>
          <span className={`self-start rounded-full border border-ink px-[18px] py-2 font-serif text-xl font-semibold ${f.tone === 'royal' ? 'bg-royal text-white' : 'bg-sun text-ink'} ${i === 1 ? 'rotate-[4deg]' : '-rotate-3'}`}>
            улюблене · {f.name}
          </span>
        </div>
      ))}
    </section>
  );
}
