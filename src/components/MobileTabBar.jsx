import { BookIcon, CalendarIcon, CartIcon, Plus, SunIcon } from './Icons';

export function MobileTabBar({ current, onChange, onCreate }) {
  const tab = (id, label, Icon) => (
    <button
      key={id}
      onClick={() => onChange(id)}
      aria-current={current === id ? 'page' : undefined}
      className={`flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-3xl text-[10px] font-extrabold ${current === id ? 'bg-sun text-ink' : 'text-white'}`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-lg items-center gap-2.5 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="flex h-[60px] flex-1 items-center rounded-[30px] border border-ink bg-royal p-1.5">
        {tab('today', 'Сьогодні', SunIcon)}
        {tab('week', 'Тиждень', CalendarIcon)}
        {tab('list', 'Покупки', CartIcon)}
        {tab('meals', 'Страви', BookIcon)}
      </div>
      <button onClick={onCreate} aria-label="Створити страву" className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border border-ink bg-sun">
        <Plus size={24} />
      </button>
    </div>
  );
}
