import { INGREDIENT_CATEGORIES, formatQty } from './planner';

export const getSortedCategories = (categories) =>
  Object.entries(categories)
    .sort(([a], [b]) => INGREDIENT_CATEGORIES[a] - INGREDIENT_CATEGORIES[b])
    .filter(([, items]) => items.length > 0);

export const buildShoppingText = (categories) => {
  let text = 'Список покупок:\n\n';
  getSortedCategories(categories).forEach(([category, items]) => {
    text += `[ ${category} ]\n`;
    items.forEach(item => { text += `- ${item.name}: ${formatQty(item.amount, item.unit)}\n`; });
    text += '\n';
  });
  return text.trim();
};
