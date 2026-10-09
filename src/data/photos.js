export const img = (name) => `${import.meta.env.BASE_URL}images/${name}.jpg`;

export const HERO_PHOTO = 'pizza';
export const TODAY_FALLBACK_PHOTO = 'toast';

export const FAVORITES = [
  { name: 'Вареники', photo: 'vareniki', tone: 'sun' },
  { name: 'Деруни', photo: 'deruny', tone: 'royal' },
  { name: 'Паста', photo: 'pasta', tone: 'sun' },
];

const RECIPE_PHOTOS = {
  tuna_pasta: 'pasta',
  plov: 'plov',
  borscht: 'soup',
  cutlets_puree: 'cutlets',
  oatmeal: 'oatmeal',
};

const MEAL_EMOJI = { 'Сніданок': '🥞', 'Обід': '🍲', 'Вечеря': '🍽️' };

export const getMealView = (recipeId, recipesDb, mealType) => {
  const recipe = recipeId ? recipesDb[recipeId] : null;
  if (!recipe) return { empty: true, name: '', photo: null, emoji: MEAL_EMOJI[mealType] };
  return { empty: false, name: recipe.name, photo: RECIPE_PHOTOS[recipeId] || null, emoji: MEAL_EMOJI[mealType] };
};
