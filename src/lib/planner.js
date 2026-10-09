export const INGREDIENT_CATEGORIES = {
  'М\'ясо та птиця': 1,
  'Риба та морепродукти': 2,
  'Овочі, фрукти та зелень': 3,
  'Молочні продукти та яйця': 4,
  'Бакалія (крупи, макарони)': 5,
  'Хлібобулочні вироби': 6,
  'Спеції, соуси та олії': 7,
  'Інше': 8
};

export const getCategoryForIngredient = (ingredientName) => {
  const lowerName = ingredientName.toLowerCase();
  if (lowerName.includes('свинин') || lowerName.includes('ялович') || lowerName.includes('кур') || lowerName.includes('фарш') || lowerName.includes('корейка')) return 'М\'ясо та птиця';
  if (lowerName.includes('тунец') || lowerName.includes('риб') || lowerName.includes('лосос')) return 'Риба та морепродукти';
  if (lowerName.includes('картоп') || lowerName.includes('моркв') || lowerName.includes('цибул') || lowerName.includes('буряк') || lowerName.includes('капуст') || lowerName.includes('помідор') || lowerName.includes('огір') || lowerName.includes('салат') || lowerName.includes('банан') || lowerName.includes('яблук') || lowerName.includes('часник') || lowerName.includes('шпинат') || lowerName.includes('авокадо') || lowerName.includes('лимон') || lowerName.includes('базилік') || lowerName.includes('ягод') || lowerName.includes('зелень')) return 'Овочі, фрукти та зелень';
  if (lowerName.includes('сир') || lowerName.includes('сметан') || lowerName.includes('молок') || lowerName.includes('масло') || lowerName.includes('яйце') || lowerName.includes('моцарел') || lowerName.includes('пармезан') || lowerName.includes('йогурт')) return 'Молочні продукти та яйця';
  if (lowerName.includes('макарон') || lowerName.includes('рис') || lowerName.includes('греч') || lowerName.includes('вівсян') || lowerName.includes('борошно') || lowerName.includes('вермішел')) return 'Бакалія (крупи, макарони)';
  if (lowerName.includes('хліб')) return 'Хлібобулочні вироби';
  if (lowerName.includes('олія') || lowerName.includes('паста') || lowerName.includes('мед')) return 'Спеції, соуси та олії';
  return 'Інше';
};

export const parseSmartText = (text) => {
  if (!text.trim()) return [];
  const results = [];

  let processText = text.replace(/(л|г|кг|мл|шт\.|шт|ст\.\s*л\.|ст\.л\.|ч\.\s*л\.|ч\.л\.)\s*([А-ЯІЇЄҐ])/g, "$1\n$2");
  const lines = processText.split('\n');

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let name = '';
    let amountStr = '';
    let rawUnit = '';

    const matchStart = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*(г|кг|мл|л|шт\.?|ст\.?\s*л\.?|ч\.?\s*л\.?|зубчі?к?|пучок)?\s+(.*)$/i);
    const matchEnd = trimmed.match(/(.*?)\s*(\d+(?:[.,]\d+)?)\s*(г|кг|мл|л|шт\.?|ст\.?\s*л\.?|ч\.?\s*л\.?|зубчі?к?|пучок)?\s*$/i);

    if (matchStart) {
      amountStr = matchStart[1];
      rawUnit = matchStart[2] ? matchStart[2].toLowerCase().replace(/\s/g, '') : 'шт';
      name = matchStart[3].trim();
    } else if (matchEnd) {
      name = matchEnd[1].trim();
      amountStr = matchEnd[2];
      rawUnit = matchEnd[3] ? matchEnd[3].toLowerCase().replace(/\s/g, '') : 'шт';
    }

    if (name && amountStr) {
      let amount = parseFloat(amountStr.replace(',', '.'));
      let unit = 'шт';

      if (rawUnit.includes('г') && !rawUnit.includes('кг')) unit = 'г';
      else if (rawUnit.includes('кг')) { unit = 'г'; amount *= 1000; }
      else if (rawUnit.includes('мл')) unit = 'мл';
      else if (rawUnit === 'л') { unit = 'мл'; amount *= 1000; }
      else if (rawUnit.includes('ст.л') || rawUnit.includes('стл')) unit = 'ст.л';
      else if (rawUnit.includes('ч.л') || rawUnit.includes('чл')) unit = 'ч.л';
      else if (rawUnit.includes('шт')) unit = 'шт';

      name = name.replace(/^[-–—*,•\s]+|[-–—*,.\s]+$/g, '');

      if (name && !isNaN(amount)) {
        results.push({ name, amount, unit });
      }
    }
  });
  return results;
};

const BASE_RECIPES = {
  'roast': {
    name: 'Жарке по-домашньому',
    ingredients: [
      { name: 'Свинина (м\'якоть)', amount: 150, unit: 'г' },
      { name: 'Картопля', amount: 200, unit: 'г' },
      { name: 'Цибуля ріпчаста', amount: 30, unit: 'г' },
      { name: 'Морква', amount: 30, unit: 'г' },
      { name: 'Томатна паста', amount: 15, unit: 'г' },
      { name: 'Олія соняшникова', amount: 10, unit: 'мл' },
    ]
  },
  'tuna_pasta': {
    name: 'Паста з тунцем',
    ingredients: [
      { name: 'Макарони (твердих сортів)', amount: 80, unit: 'г' },
      { name: 'Тунець консервований', amount: 60, unit: 'г' },
      { name: 'Помідори чері', amount: 50, unit: 'г' },
      { name: 'Сир пармезан', amount: 10, unit: 'г' },
      { name: 'Оливкова олія', amount: 5, unit: 'мл' },
    ]
  },
  'plov': {
    name: 'Плов зі свининою',
    ingredients: [
      { name: 'Свинина', amount: 120, unit: 'г' },
      { name: 'Рис (довгозернистий)', amount: 80, unit: 'г' },
      { name: 'Морква', amount: 60, unit: 'г' },
      { name: 'Цибуля ріпчаста', amount: 40, unit: 'г' },
      { name: 'Часник', amount: 0.2, unit: 'шт' },
      { name: 'Олія соняшникова', amount: 15, unit: 'мл' },
    ]
  },
  'borscht': {
    name: 'Борщ український',
    ingredients: [
      { name: 'Свинина на кістці', amount: 100, unit: 'г' },
      { name: 'Буряк', amount: 80, unit: 'г' },
      { name: 'Капуста білокачанна', amount: 60, unit: 'г' },
      { name: 'Картопля', amount: 50, unit: 'г' },
      { name: 'Морква', amount: 30, unit: 'г' },
      { name: 'Цибуля ріпчаста', amount: 20, unit: 'г' },
      { name: 'Томатна паста', amount: 15, unit: 'г' },
      { name: 'Сметана', amount: 20, unit: 'г' },
    ]
  },
  'cutlets_puree': {
    name: 'Котлети з картопляним пюре',
    ingredients: [
      { name: 'Фарш м\'ясний', amount: 120, unit: 'г' },
      { name: 'Хліб білий', amount: 20, unit: 'г' },
      { name: 'Молоко', amount: 30, unit: 'мл' },
      { name: 'Картопля', amount: 250, unit: 'г' },
      { name: 'Вершкове масло', amount: 15, unit: 'г' },
      { name: 'Молоко', amount: 50, unit: 'мл' },
    ]
  },
  'chops_buckwheat': {
    name: 'Відбивні з гречкою',
    ingredients: [
      { name: 'Свиняча корейка', amount: 150, unit: 'г' },
      { name: 'Яйце куряче', amount: 0.5, unit: 'шт' },
      { name: 'Борошно', amount: 10, unit: 'г' },
      { name: 'Гречана крупа', amount: 70, unit: 'г' },
      { name: 'Вершкове масло', amount: 10, unit: 'г' },
      { name: 'Олія соняшникова', amount: 10, unit: 'мл' },
    ]
  },
  'oatmeal': {
    name: 'Вівсянка з фруктами',
    ingredients: [
      { name: 'Вівсяні пластівці', amount: 50, unit: 'г' },
      { name: 'Молоко', amount: 150, unit: 'мл' },
      { name: 'Банан', amount: 0.5, unit: 'шт' },
      { name: 'Яблуко', amount: 0.5, unit: 'шт' },
      { name: 'Мед', amount: 10, unit: 'г' },
    ]
  },
  'salad_chicken': {
    name: 'Салат з куркою',
    ingredients: [
      { name: 'Куряче філе', amount: 100, unit: 'г' },
      { name: 'Салат айсберг', amount: 50, unit: 'г' },
      { name: 'Помідори', amount: 60, unit: 'г' },
      { name: 'Огірки', amount: 50, unit: 'г' },
      { name: 'Оливкова олія', amount: 10, unit: 'мл' },
    ]
  }
};

export const DAYS_OF_WEEK = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
export const MEAL_TYPES = ['Сніданок', 'Обід', 'Вечеря'];

const BASE_META = {
  roast: { mealType: 'Обід', minutes: 50, kcal: 610 },
  tuna_pasta: { mealType: 'Вечеря', minutes: 25, kcal: 470, photo: 'pasta' },
  plov: { mealType: 'Обід', minutes: 50, kcal: 620, photo: 'plov' },
  borscht: { mealType: 'Обід', minutes: 90, kcal: 340, photo: 'soup' },
  cutlets_puree: { mealType: 'Вечеря', minutes: 45, kcal: 640, photo: 'cutlets' },
  chops_buckwheat: { mealType: 'Вечеря', minutes: 40, kcal: 590 },
  oatmeal: { mealType: 'Сніданок', minutes: 10, kcal: 310, vegetarian: true, photo: 'oatmeal' },
  salad_chicken: { mealType: 'Обід', minutes: 15, kcal: 280 },
};

const ing = (name, amount, unit) => ({ name, amount, unit });

const NEW_RECIPES = {
  oatmeal_berries: {
    name: 'Вівсянка з ягодами', mealType: 'Сніданок', minutes: 10, kcal: 290, vegetarian: true, photo: 'oatmeal',
    ingredients: [ing('Вівсяні пластівці', 50, 'г'), ing('Молоко', 150, 'мл'), ing('Ягоди мікс', 80, 'г'), ing('Мед', 10, 'г')],
  },
  omelet_spinach: {
    name: 'Омлет зі шпинатом', mealType: 'Сніданок', minutes: 15, kcal: 320, vegetarian: true, photo: 'omelet',
    ingredients: [ing('Яйце куряче', 3, 'шт'), ing('Шпинат', 50, 'г'), ing('Молоко', 50, 'мл'), ing('Вершкове масло', 10, 'г'), ing('Сир пармезан', 10, 'г')],
  },
  avocado_toast: {
    name: 'Тости з авокадо', mealType: 'Сніданок', minutes: 10, kcal: 360, vegetarian: true, photo: 'toast',
    ingredients: [ing('Хліб на заквасці', 60, 'г'), ing('Авокадо', 1, 'шт'), ing('Яйце куряче', 1, 'шт'), ing('Лимон', 0.25, 'шт')],
  },
  crepes_honey: {
    name: 'Млинці з медом', mealType: 'Сніданок', minutes: 25, kcal: 380, vegetarian: true, photo: 'crepes',
    ingredients: [ing('Борошно', 80, 'г'), ing('Молоко', 150, 'мл'), ing('Яйце куряче', 1, 'шт'), ing('Мед', 20, 'г'), ing('Олія соняшникова', 10, 'мл')],
  },
  chicken_soup: {
    name: 'Курячий суп', mealType: 'Обід', minutes: 45, kcal: 260, photo: 'soup',
    ingredients: [ing('Куряче філе', 100, 'г'), ing('Картопля', 80, 'г'), ing('Морква', 30, 'г'), ing('Цибуля ріпчаста', 20, 'г'), ing('Вермішель', 20, 'г')],
  },
  plov_chicken: {
    name: 'Плов з куркою', mealType: 'Обід', minutes: 50, kcal: 540, photo: 'plov',
    ingredients: [ing('Куряче філе', 120, 'г'), ing('Рис (довгозернистий)', 80, 'г'), ing('Морква', 60, 'г'), ing('Цибуля ріпчаста', 40, 'г'), ing('Часник', 0.2, 'шт'), ing('Олія соняшникова', 15, 'мл')],
  },
  vareniki: {
    name: 'Вареники з картоплею', mealType: 'Обід', minutes: 40, kcal: 480, vegetarian: true, photo: 'vareniki',
    ingredients: [ing('Борошно', 120, 'г'), ing('Картопля', 150, 'г'), ing('Цибуля ріпчаста', 30, 'г'), ing('Сметана', 30, 'г'), ing('Вершкове масло', 10, 'г')],
  },
  golubtsi: {
    name: 'Голубці', mealType: 'Обід', minutes: 70, kcal: 450, photo: 'golubtsi',
    ingredients: [ing('Капуста білокачанна', 150, 'г'), ing('Фарш м\'ясний', 100, 'г'), ing('Рис (довгозернистий)', 30, 'г'), ing('Морква', 30, 'г'), ing('Томатна паста', 20, 'г'), ing('Сметана', 20, 'г')],
  },
  baked_salmon: {
    name: 'Запечений лосось', mealType: 'Вечеря', minutes: 30, kcal: 520, photo: 'salmon',
    ingredients: [ing('Лосось (філе)', 150, 'г'), ing('Лимон', 0.5, 'шт'), ing('Оливкова олія', 10, 'мл'), ing('Помідори чері', 50, 'г')],
  },
  pasta_tomato: {
    name: 'Паста з томатами', mealType: 'Вечеря', minutes: 35, kcal: 560, vegetarian: true, photo: 'pasta',
    ingredients: [ing('Макарони (твердих сортів)', 80, 'г'), ing('Помідори', 150, 'г'), ing('Часник', 0.2, 'шт'), ing('Базилік', 5, 'г'), ing('Сир пармезан', 15, 'г'), ing('Оливкова олія', 10, 'мл')],
  },
  pizza_margherita: {
    name: 'Піца маргарита', mealType: 'Вечеря', minutes: 35, kcal: 690, vegetarian: true, photo: 'pizza',
    ingredients: [ing('Борошно', 100, 'г'), ing('Моцарела', 100, 'г'), ing('Помідори', 80, 'г'), ing('Базилік', 5, 'г'), ing('Оливкова олія', 10, 'мл')],
  },
  deruny: {
    name: 'Деруни зі сметаною', mealType: 'Обід', minutes: 30, kcal: 430, vegetarian: true, photo: 'deruny',
    description: 'Хрусткі картопляні деруни з цибулею, золотаві по краях — класика суботнього обіду.',
    ingredients: [ing('Картопля', 250, 'г'), ing('Цибуля ріпчаста', 30, 'г'), ing('Яйце куряче', 1, 'шт'), ing('Борошно', 20, 'г'), ing('Сметана', 40, 'г'), ing('Олія соняшникова', 20, 'мл')],
  },
};

export const SEED_VERSION = 2;
export const NEW_SEED_RECIPES = NEW_RECIPES;
export const INITIAL_RECIPES_DB = {
  ...Object.fromEntries(Object.entries(BASE_RECIPES).map(([id, recipe]) => [id, { ...recipe, ...BASE_META[id] }])),
  ...NEW_RECIPES,
};

const META_KEYS = ['mealType', 'minutes', 'kcal', 'vegetarian', 'photo', 'description'];

export const normalizeRecipe = (id, recipe) => {
  const seed = INITIAL_RECIPES_DB[id] || {};
  const seedMeta = Object.fromEntries(META_KEYS.filter(k => seed[k] !== undefined).map(k => [k, seed[k]]));
  return { mealType: '', minutes: null, kcal: null, vegetarian: false, favorite: false, photo: null, description: '', ...seedMeta, ...recipe };
};

export const normalizeRecipes = (db) => Object.fromEntries(Object.entries(db).map(([id, recipe]) => [id, normalizeRecipe(id, recipe)]));

export const CATEGORY_SHORT_NAMES = {
  'М\'ясо та птиця': 'М\'ясо та риба',
  'Риба та морепродукти': 'М\'ясо та риба',
  'Овочі, фрукти та зелень': 'Овочі та зелень',
  'Молочні продукти та яйця': 'Молочне та яйця',
  'Бакалія (крупи, макарони)': 'Бакалія',
  'Хлібобулочні вироби': 'Хліб',
  'Спеції, соуси та олії': 'Спеції та соуси',
  'Інше': 'Інше',
};

export const formatQty = (amount, unit) => {
  const round = (n) => (Number.isInteger(n) ? n : Number(n.toFixed(1)));
  if (unit === 'г' && amount >= 1000) return `${round(amount / 1000)} кг`;
  if (unit === 'мл' && amount >= 1000) return `${round(amount / 1000)} л`;
  return `${round(amount)} ${unit}`;
};

export const dishMeta = (recipe) => {
  const parts = [recipe.minutes ? `${recipe.minutes} хв` : null, recipe.kcal ? `${recipe.kcal} ккал` : null].filter(Boolean);
  return parts.length ? parts.join(' · ') : `${recipe.ingredients.length} інгредієнтів`;
};
