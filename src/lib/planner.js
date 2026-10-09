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
  if (lowerName.includes('тунец') || lowerName.includes('риб')) return 'Риба та морепродукти';
  if (lowerName.includes('картоп') || lowerName.includes('моркв') || lowerName.includes('цибул') || lowerName.includes('буряк') || lowerName.includes('капуст') || lowerName.includes('помідор') || lowerName.includes('огір') || lowerName.includes('салат') || lowerName.includes('банан') || lowerName.includes('яблук') || lowerName.includes('часник')) return 'Овочі, фрукти та зелень';
  if (lowerName.includes('сир') || lowerName.includes('сметан') || lowerName.includes('молок') || lowerName.includes('масло') || lowerName.includes('яйце')) return 'Молочні продукти та яйця';
  if (lowerName.includes('макарон') || lowerName.includes('рис') || lowerName.includes('греч') || lowerName.includes('вівсян') || lowerName.includes('борошно')) return 'Бакалія (крупи, макарони)';
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

export const INITIAL_RECIPES_DB = {
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
