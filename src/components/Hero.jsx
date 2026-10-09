import { HERO_PHOTO, img } from '../data/photos';
import { ArrowRight } from './Icons';

const OVERLAY = 'linear-gradient(180deg, #141414B3 0%, #14141400 45%, #14141400 60%, #141414CC 100%)';

export function Hero({ plannedCount, rangeLabel }) {
  return (
    <section
      className="relative hidden lg:block h-[clamp(480px,50vw,720px)] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `${OVERLAY}, url(${img(HERO_PHOTO)})` }}
    >
      <h1 className="absolute inset-x-0 top-[-1.5vw] text-center font-display text-[clamp(96px,12.4vw,179px)] leading-none tracking-[-0.033em] text-sun whitespace-nowrap">
        МЕНЮ НА ТИЖДЕНЬ
      </h1>

      <div className="absolute left-[9.7%] top-[22%] rotate-12 rounded-full border border-ink bg-royal px-[22px] py-2.5 font-serif text-[22px] font-semibold text-white">
        СМАКОТА
      </div>

      <div className="absolute left-[80.6%] top-[34.7%] -rotate-[10deg] flex h-[147px] w-[236px] flex-col items-center justify-center rounded-[110px] border border-ink bg-sun text-ink">
        <span className="font-serif text-5xl font-semibold leading-none">{plannedCount}/21</span>
        <span className="mt-1 text-xs font-semibold">страв заплановано</span>
      </div>

      <div className="absolute bottom-[62px] left-14 flex items-center gap-2 font-head text-sm font-medium text-sun">
        {rangeLabel}
        <ArrowRight />
      </div>

      <p className="absolute bottom-10 right-14 w-[454px] text-right font-head text-2xl font-bold leading-[1.15] text-white">
        ПЛАНУЙТЕ СТРАВИ — СПИСОК ПОКУПОК ЗБЕРЕТЬСЯ САМ
      </p>
    </section>
  );
}
