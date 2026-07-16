import React, { useState, useMemo, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// Firebase Setup
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV-cLhMyYHcFdC6V-ZYQ1OQbul5TPa5Eo",
  authDomain: "meal-planner-f0fea.firebaseapp.com",
  projectId: "meal-planner-f0fea",
  storageBucket: "meal-planner-f0fea.firebasestorage.app",
  messagingSenderId: "795072203485",
  appId: "1:795072203485:web:5705bf1817cbead28ba934",
  measurementId: "G-2Q2ZSGZYG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Define categories for sorting the shopping list like in a supermarket
const INGREDIENT_CATEGORIES = {
  'М\'ясо та птиця': 1,
  'Риба та морепродукти': 2,
  'Овочі, фрукти та зелень': 3,
  'Молочні продукти та яйця': 4,
  'Бакалія (крупи, макарони)': 5,
  'Хлібобулочні вироби': 6,
  'Спеції, соуси та олії': 7,
  'Інше': 8
};

// Helper function to map ingredients to categories
const getCategoryForIngredient = (ingredientName) => {
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

// Define the initial database of recipes.
const INITIAL_RECIPES_DB = {
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

const DAYS_OF_WEEK = [
  'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'
];
const MEAL_TYPES = ['Сніданок', 'Обід', 'Вечеря'];

export default function MealPlannerApp() {
  const [persons, setPersons] = useState(2);
  const [activeTab, setActiveTab] = useState('plan');
  const [recipesDb, setRecipesDb] = useState(INITIAL_RECIPES_DB);

  // State for checked items in shopping list
  const [checkedItems, setCheckedItems] = useState({});

  // State to hold the selected meals for each day and meal type
  const [plan, setPlan] = useState(() => {
    const initialPlan = {};
    DAYS_OF_WEEK.forEach(day => {
      initialPlan[day] = {};
      MEAL_TYPES.forEach(meal => {
        initialPlan[day][meal] = ''; // empty string means no meal selected
      });
    });
    return initialPlan;
  });

  // State for the "Add Recipe" modal
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([{ name: '', amount: '', unit: 'г' }]);

  // Firebase Auth & Data Sync States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await signInAnonymously(auth);
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'appData', 'state');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.persons !== undefined) setPersons(data.persons);
        if (data.recipesDb) setRecipesDb(data.recipesDb);
        if (data.plan) setPlan(data.plan);
        if (data.checkedItems) setCheckedItems(data.checkedItems);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading data:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const updateCloudState = async (partialData) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'appData', 'state');
    await setDoc(docRef, partialData, { merge: true });
  };

  const handlePersonsChange = (newPersons) => {
    const value = Math.max(1, newPersons);
    setPersons(value);
    updateCloudState({ persons: value });
  };

  const handleMealSelect = (day, mealType, recipeId) => {
    setPlan(prevPlan => {
      const newPlan = {
        ...prevPlan,
        [day]: {
          ...prevPlan[day],
          [mealType]: recipeId
        }
      };
      updateCloudState({ plan: newPlan });
      return newPlan;
    });
  };

  const handleClearPlan = () => {
    const emptyPlan = {};
    DAYS_OF_WEEK.forEach(day => {
      emptyPlan[day] = {};
      MEAL_TYPES.forEach(meal => {
        emptyPlan[day][meal] = '';
      });
    });
    setPlan(emptyPlan);
    setCheckedItems({});
    updateCloudState({ plan: emptyPlan, checkedItems: {} });
  };

  const handleAddIngredientRow = () => {
    setNewRecipeIngredients([...newRecipeIngredients, { name: '', amount: '', unit: 'г' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...newRecipeIngredients];
    updatedIngredients[index][field] = value;
    setNewRecipeIngredients(updatedIngredients);
  };

  const handleRemoveIngredientRow = (index) => {
    const updatedIngredients = newRecipeIngredients.filter((_, i) => i !== index);
    setNewRecipeIngredients(updatedIngredients);
  };

  const handleSaveRecipe = () => {
    if (!newRecipeName.trim()) return;

    // Filter out incomplete ingredient rows
    const validIngredients = newRecipeIngredients.filter(ing => ing.name.trim() && ing.amount);

    // Generate a unique ID for the new recipe
    const newRecipeId = `custom_${Date.now()}`;

    setRecipesDb(prev => {
      const newDb = {
        ...prev,
        [newRecipeId]: {
          name: newRecipeName,
          ingredients: validIngredients.map(ing => ({
            name: ing.name.trim(),
            amount: parseFloat(ing.amount),
            unit: ing.unit
          }))
        }
      };
      updateCloudState({ recipesDb: newDb });
      return newDb;
    });

    // Reset form and close modal
    setNewRecipeName('');
    setNewRecipeIngredients([{ name: '', amount: '', unit: 'г' }]);
    setIsAddRecipeModalOpen(false);
  };

  const toggleItemCheck = (key) => {
    setCheckedItems(prev => {
      const newChecked = {
        ...prev,
        [key]: !prev[key]
      };
      updateCloudState({ checkedItems: newChecked });
      return newChecked;
    });
  };

  // useMemo to recalculate the shopping list only when plan, persons, or recipes change
  const shoppingListCategories = useMemo(() => {
    const list = {};

    // Iterate through the plan
    Object.values(plan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(recipeId => {
        if (recipeId && recipesDb[recipeId]) {
          const recipe = recipesDb[recipeId];
          // Add ingredients for this recipe multiplied by number of persons
          recipe.ingredients.forEach(ing => {
            const totalAmount = ing.amount * persons;
            // Key based on name to aggregate identical ingredients even if they have slightly different units, 
            // but for simplicity, we assume units for the same ingredient name are consistent.
            const key = ing.name.trim().toLowerCase();

            if (list[key]) {
              list[key].amount += totalAmount;
            } else {
              list[key] = {
                name: ing.name,
                amount: totalAmount,
                unit: ing.unit,
                originalKey: key
              };
            }
          });
        }
      });
    });

    // Group by category
    const categorizedList = {};
    Object.keys(INGREDIENT_CATEGORIES).forEach(cat => {
      categorizedList[cat] = [];
    });

    Object.values(list).forEach(item => {
      const category = getCategoryForIngredient(item.name);
      if (!categorizedList[category]) {
        categorizedList[category] = [];
      }
      categorizedList[category].push(item);
    });

    // Sort items within each category alphabetically
    Object.keys(categorizedList).forEach(cat => {
      categorizedList[cat].sort((a, b) => a.name.localeCompare(b.name));
    });

    return categorizedList;
  }, [plan, persons, recipesDb]);

  // Check if shopping list is completely empty
  const isShoppingListEmpty = useMemo(() => {
    return Object.values(shoppingListCategories).every(catList => catList.length === 0);
  }, [shoppingListCategories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-emerald-600">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Завантаження ваших даних...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Меню на тиждень</h1>
            <p className="text-gray-500 text-sm">Сплануйте своє харчування та отримайте список покупок</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddRecipeModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
            >
              + Створити страву
            </button>
            <div className="flex items-center bg-emerald-50 rounded-lg p-2 border border-emerald-100">
              <label htmlFor="persons" className="mr-2 font-medium text-emerald-800 text-sm">Персон:</label>
              <div className="flex items-center">
                <button
                  onClick={() => handlePersonsChange(persons - 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-emerald-600 hover:bg-emerald-100 font-bold border border-emerald-200 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-base text-emerald-900">{persons}</span>
                <button
                  onClick={() => handlePersonsChange(persons + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-emerald-600 hover:bg-emerald-100 font-bold border border-emerald-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'plan'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
          >
            🗓️ Планувальник
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'list'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
          >
            🛒 Список покупок
          </button>
        </div>

        { }
        {activeTab === 'plan' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-end">
              <button
                onClick={handleClearPlan}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                🗑️ Очистити план
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-emerald-600 text-white p-2 text-center font-semibold text-sm">
                    {day}
                  </div>
                  <div className="p-4 space-y-3">
                    {MEAL_TYPES.map(mealType => (
                      <div key={`${day}-${mealType}`} className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          {mealType}
                        </label>
                        <select
                          value={plan[day][mealType]}
                          onChange={(e) => handleMealSelect(day, mealType, e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm appearance-none cursor-pointer truncate"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: `right 0.5rem center`,
                            backgroundRepeat: `no-repeat`,
                            backgroundSize: `1.5em 1.5em`,
                            paddingRight: `2rem`
                          }}
                        >
                          <option value="">-- Не обрано --</option>
                          {Object.entries(recipesDb).map(([id, recipe]) => (
                            <option key={id} value={id}>
                              {recipe.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        { }
        {activeTab === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Список продуктів на {persons} {persons === 1 ? 'персону' : (persons > 1 && persons < 5) ? 'персони' : 'персон'}
            </h2>

            {isShoppingListEmpty ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">🛒</div>
                <p>Ваш список покупок порожній.</p>
                <p className="text-sm mt-1">Додайте страви у планувальнику, щоб сформувати список.</p>
                <button
                  onClick={() => setActiveTab('plan')}
                  className="mt-4 inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
                >
                  Перейти до планування
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Map over categories sorted by INGREDIENT_CATEGORIES order */}
                {Object.entries(shoppingListCategories)
                  .sort(([catA], [catB]) => INGREDIENT_CATEGORIES[catA] - INGREDIENT_CATEGORIES[catB])
                  .filter(([_, items]) => items.length > 0)
                  .map(([category, items]) => (
                    <div key={category} className="mb-4">
                      <h3 className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md mb-2 text-sm uppercase tracking-wide">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 pl-2">
                        {items.map((item, index) => {
                          const itemKey = item.originalKey;
                          const isChecked = checkedItems[itemKey];
                          return (
                            <label
                              key={itemKey}
                              className={`flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 cursor-pointer transition-colors ${isChecked ? 'opacity-50' : ''}`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={!!isChecked}
                                  onChange={() => toggleItemCheck(itemKey)}
                                  className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                                />
                                <span className={`text-gray-700 transition-all ${isChecked ? 'line-through text-gray-400' : ''}`}>
                                  {item.name}
                                </span>
                              </div>
                              <span className={`font-semibold px-2 py-0.5 rounded text-sm transition-all ${isChecked ? 'bg-transparent text-gray-400' : 'text-gray-900 bg-gray-100'}`}>
                                {Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(1)} {item.unit}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {!isShoppingListEmpty && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    let textToCopy = 'Список покупок:\n\n';
                    Object.entries(shoppingListCategories)
                      .sort(([catA], [catB]) => INGREDIENT_CATEGORIES[catA] - INGREDIENT_CATEGORIES[catB])
                      .filter(([_, items]) => items.length > 0)
                      .forEach(([category, items]) => {
                        textToCopy += `[ ${category} ]\n`;
                        items.forEach(item => {
                          textToCopy += `- ${item.name}: ${Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(1)} ${item.unit}\n`;
                        });
                        textToCopy += '\n';
                      });

                    navigator.clipboard.writeText(textToCopy)
                      // Ideally we'd use a toast notification here instead of alert, but keeping it simple as per instructions (Wait, instructions say DO NOT use alert under any circumstances. I must fix this).
                      .catch(err => console.error('Failed to copy text: ', err));
                  }}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  📋 Скопіювати список
                </button>
              </div>
            )}
          </div>
        )}

        { }
        {/* Add Recipe Modal */}
        {isAddRecipeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Додати нову страву</h2>
                  <button
                    onClick={() => setIsAddRecipeModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold p-2"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Назва страви</label>
                    <input
                      type="text"
                      value={newRecipeName}
                      onChange={(e) => setNewRecipeName(e.target.value)}
                      placeholder="Наприклад: Картопля по-селянськи"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-medium text-gray-700">Інгредієнти (на 1 порцію)</label>
                      <button
                        onClick={handleAddIngredientRow}
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                      >
                        + Додати рядок
                      </button>
                    </div>

                    <div className="space-y-2">
                      {newRecipeIngredients.map((ing, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={ing.name}
                              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                              placeholder="Назва продукту"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="w-20">
                            <input
                              type="number"
                              value={ing.amount}
                              onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                              placeholder="К-ть"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="w-20">
                            <select
                              value={ing.unit}
                              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            >
                              <option value="г">г</option>
                              <option value="мл">мл</option>
                              <option value="шт">шт</option>
                              <option value="ст.л">ст.л</option>
                              <option value="ч.л">ч.л</option>
                            </select>
                          </div>
                          <button
                            onClick={() => handleRemoveIngredientRow(index)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                            disabled={newRecipeIngredients.length === 1}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsAddRecipeModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Скасувати
                  </button>
                  <button
                    onClick={handleSaveRecipe}
                    disabled={!newRecipeName.trim()}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Зберегти страву
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}