import { DAYS_OF_WEEK } from './planner';

const MONTHS_GEN = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];

const getIsoWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

export const getWeekInfo = (now = new Date()) => {
  const todayIndex = (now.getDay() + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - todayIndex);
  const days = DAYS_OF_WEEK.map((name, i) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    return {
      name,
      index: i,
      number: String(i + 1).padStart(2, '0') + '.',
      day: date.getDate(),
      month: MONTHS_GEN[date.getMonth()],
      dateLabel: `${date.getDate()} ${MONTHS_GEN[date.getMonth()]}`,
      isToday: i === todayIndex,
    };
  });
  const first = days[0];
  const last = days[6];
  const rangeLabel = (first.month === last.month
    ? `${first.day} – ${last.day} ${last.month}`
    : `${first.day} ${first.month} – ${last.day} ${last.month}`).toUpperCase();
  return { days, todayIndex, today: days[todayIndex], rangeLabel, weekNumber: getIsoWeekNumber(now) };
};

export const pluralPersons = (n) => (n === 1 ? 'персону' : n > 1 && n < 5 ? 'персони' : 'персон');
export const pluralProducts = (n) => {
  const last = n % 10;
  if (n % 100 >= 11 && n % 100 <= 14) return 'продуктів';
  if (last === 1) return 'продукт';
  if (last >= 2 && last <= 4) return 'продукти';
  return 'продуктів';
};
