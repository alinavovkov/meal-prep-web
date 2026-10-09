import { Minus, Plus } from './Icons';

export function NavBar({ activeTab, onTabChange, shoppingItemsCount, persons, onPersonsChange, onCreate }) {
  const tab = (id, label) => (
    <button
      key={id}
      onClick={() => onTabChange(id)}
      className={`text-xs tracking-[0.1em] text-white underline-offset-8 hover:underline ${activeTab === id ? 'font-extrabold underline' : 'font-semibold'}`}
    >
      {label}
    </button>
  );

  return (
    <nav className="hidden lg:flex h-[72px] items-center justify-between bg-royal px-14">
      <span className="font-head text-[22px] font-extrabold text-white">СМАКОТА</span>
      <div className="flex items-center gap-14">
        {tab('plan', 'ПЛАНУВАЛЬНИК')}
        {tab('list', `СПИСОК ПОКУПОК · ${shoppingItemsCount}`)}
        {tab('meals', 'СТРАВИ')}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-white">
          <span>{persons} {persons === 1 ? 'ПЕРСОНА' : persons < 5 ? 'ПЕРСОНИ' : 'ПЕРСОН'}</span>
          <button onClick={() => onPersonsChange(persons - 1)} aria-label="Менше персон" className="flex h-6 w-6 items-center justify-center rounded-full border border-white/60 hover:bg-white/20"><Minus size={12} /></button>
          <button onClick={() => onPersonsChange(persons + 1)} aria-label="Більше персон" className="flex h-6 w-6 items-center justify-center rounded-full border border-white/60 hover:bg-white/20"><Plus size={12} /></button>
        </div>
      </div>
      <button onClick={onCreate} className="rounded-full border border-ink bg-sun px-[22px] py-2.5 text-[13px] font-bold text-ink hover:brightness-95">
        Створити страву
      </button>
    </nav>
  );
}
