import { useState, useMemo, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, appId } from '../lib/firebase';
import {
  INGREDIENT_CATEGORIES,
  INITIAL_RECIPES_DB,
  NEW_SEED_RECIPES,
  SEED_VERSION,
  normalizeRecipes,
  DAYS_OF_WEEK,
  MEAL_TYPES,
  getCategoryForIngredient,
  parseSmartText,
} from '../lib/planner';

const EMPTY_META = { mealType: '', minutes: '', kcal: '', vegetarian: false, photo: null, description: '' };

export function usePlannerState() {
  const [persons, setPersons] = useState(2);
  const [recipesDb, setRecipesDb] = useState(INITIAL_RECIPES_DB);
  const [checkedItems, setCheckedItems] = useState({});
  const [extraItems, setExtraItems] = useState([]);
  const [plan, setPlan] = useState(() => {
    const initialPlan = {};
    DAYS_OF_WEEK.forEach(day => {
      initialPlan[day] = {};
      MEAL_TYPES.forEach(meal => {
        initialPlan[day][meal] = ''; 
      });
    });
    return initialPlan;
  });

  const recipes = useMemo(() => normalizeRecipes(recipesDb), [recipesDb]);

  // Modal States
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState(null); 
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([{ name: '', amount: '', unit: 'г' }]);
  const [recipeMeta, setRecipeMeta] = useState(EMPTY_META);
  const [smartText, setSmartText] = useState('');
  const [smartError, setSmartError] = useState('');
  
  // Custom Confirmation Modal State
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // Auth States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Помилка авторизації:", error);
      }
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
        if (data.recipesDb) {
          if ((data.seedVersion || 1) < SEED_VERSION) {
            const merged = { ...NEW_SEED_RECIPES, ...data.recipesDb };
            setRecipesDb(merged);
            setDoc(docRef, { recipesDb: merged, seedVersion: SEED_VERSION }, { merge: true }).catch(err => console.error('Seed migration failed:', err));
          } else {
            setRecipesDb(data.recipesDb);
          }
        }
        if (data.plan) setPlan(data.plan);
        if (data.checkedItems) setCheckedItems(data.checkedItems);
        if (data.extraItems) setExtraItems(data.extraItems);
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
    const data = partialData.recipesDb ? { ...partialData, seedVersion: SEED_VERSION } : partialData;
    await setDoc(docRef, data, { merge: true });
  };

  const handlePersonsChange = (newPersons) => {
    const value = Math.max(1, newPersons);
    setPersons(value);
    updateCloudState({ persons: value });
  };

  const handleMealSelect = (day, mealType, recipeId) => {
    setPlan(prevPlan => {
      const newPlan = { ...prevPlan, [day]: { ...prevPlan[day], [mealType]: recipeId } };
      updateCloudState({ plan: newPlan });
      return newPlan;
    });
  };

  const handleClearPlan = () => {
    const emptyPlan = {};
    DAYS_OF_WEEK.forEach(day => {
      emptyPlan[day] = {};
      MEAL_TYPES.forEach(meal => emptyPlan[day][meal] = '');
    });
    setPlan(emptyPlan);
    setCheckedItems({});
    updateCloudState({ plan: emptyPlan, checkedItems: {} });
  };

  const handleOpenAddModal = () => {
    setNewRecipeName('');
    setNewRecipeIngredients([{ name: '', amount: '', unit: 'г' }]);
    setRecipeMeta(EMPTY_META);
    setEditingRecipeId(null);
    setSmartText('');
    setSmartError('');
    setIsAddRecipeModalOpen(true);
  };

  const handleOpenEditModal = (recipeId) => {
    const recipe = recipes[recipeId];
    if (!recipe) return;
    setRecipeMeta({
      mealType: recipe.mealType || '',
      minutes: recipe.minutes ?? '',
      kcal: recipe.kcal ?? '',
      vegetarian: !!recipe.vegetarian,
      photo: recipe.photo || null,
      description: recipe.description || '',
    });
    setNewRecipeName(recipe.name);
    setNewRecipeIngredients(recipe.ingredients.length > 0 ? [...recipe.ingredients] : [{ name: '', amount: '', unit: 'г' }]);
    setEditingRecipeId(recipeId);
    setSmartText('');
    setSmartError('');
    setIsAddRecipeModalOpen(true);
  };

  const confirmDeleteRecipe = () => {
    if (!recipeToDelete) return;
    
    setRecipesDb(prev => {
      const newDb = { ...prev };
      delete newDb[recipeToDelete];
      updateCloudState({ recipesDb: newDb });
      return newDb;
    });

    setPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      let planChanged = false;
      DAYS_OF_WEEK.forEach(day => {
        MEAL_TYPES.forEach(meal => {
          if (newPlan[day][meal] === recipeToDelete) {
            newPlan[day][meal] = '';
            planChanged = true;
          }
        });
      });
      if (planChanged) updateCloudState({ plan: newPlan });
      return newPlan;
    });
    
    setRecipeToDelete(null);
    setIsAddRecipeModalOpen(false);
    setEditingRecipeId(null);
  };

  const handleSmartImport = () => {
    setSmartError('');
    const parsed = parseSmartText(smartText);
    if (parsed.length > 0) {
      const current = newRecipeIngredients.filter(ing => ing.name.trim() !== '' || ing.amount !== '');
      setNewRecipeIngredients([...current, ...parsed]);
      setSmartText('');
    } else {
      setSmartError('Не вдалося розпізнати інгредієнти. Перевірте текст.');
      setTimeout(() => setSmartError(''), 3000);
    }
  };

  const handleAddIngredientRow = () => setNewRecipeIngredients([...newRecipeIngredients, { name: '', amount: '', unit: 'г' }]);
  
  const handleIngredientChange = (index, field, value) => {
    const updated = [...newRecipeIngredients];
    updated[index][field] = value;
    setNewRecipeIngredients(updated);
  };

  const handleRemoveIngredientRow = (index) => setNewRecipeIngredients(newRecipeIngredients.filter((_, i) => i !== index));

  const handleSaveRecipe = () => {
    if (!newRecipeName.trim()) return;
    const validIngredients = newRecipeIngredients.filter(ing => ing.name.trim() && ing.amount);
    const recipeIdToSave = editingRecipeId || `custom_${Date.now()}`;

    setRecipesDb(prev => {
      const newDb = {
        ...prev,
        [recipeIdToSave]: {
          ...prev[recipeIdToSave],
          name: newRecipeName,
          mealType: recipeMeta.mealType,
          minutes: recipeMeta.minutes === '' ? null : Number(recipeMeta.minutes),
          kcal: recipeMeta.kcal === '' ? null : Number(recipeMeta.kcal),
          vegetarian: recipeMeta.vegetarian,
          photo: recipeMeta.photo,
          description: recipeMeta.description.trim(),
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

    setIsAddRecipeModalOpen(false);
    setEditingRecipeId(null);
  };

  const toggleFavorite = (recipeId) => {
    setRecipesDb(prev => {
      if (!prev[recipeId]) return prev;
      const newDb = { ...prev, [recipeId]: { ...prev[recipeId], favorite: !recipes[recipeId]?.favorite } };
      updateCloudState({ recipesDb: newDb });
      return newDb;
    });
  };

  const addExtraItem = ({ name, amount, unit }) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const parsed = parseFloat(String(amount).replace(',', '.'));
    const newItems = [...extraItems, { id: `x${Date.now()}`, name: trimmed, amount: Number.isNaN(parsed) ? 1 : parsed, unit }];
    setExtraItems(newItems);
    updateCloudState({ extraItems: newItems });
  };

  const removeExtraItem = (extraId) => {
    const newItems = extraItems.filter(item => item.id !== extraId);
    setExtraItems(newItems);
    updateCloudState({ extraItems: newItems });
  };

  const toggleItemCheck = (key) => {
    setCheckedItems(prev => {
      const newChecked = { ...prev, [key]: !prev[key] };
      updateCloudState({ checkedItems: newChecked });
      return newChecked;
    });
  };

  const shoppingListCategories = useMemo(() => {
    const list = {};
    Object.values(plan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(recipeId => {
        if (recipeId && recipesDb[recipeId]) {
          recipesDb[recipeId].ingredients.forEach(ing => {
            const totalAmount = ing.amount * persons;
            const key = ing.name.trim().toLowerCase();
            if (list[key]) {
              list[key].amount += totalAmount;
            } else {
              list[key] = { name: ing.name, amount: totalAmount, unit: ing.unit, originalKey: key };
            }
          });
        }
      });
    });

    const categorizedList = {};
    Object.keys(INGREDIENT_CATEGORIES).forEach(cat => categorizedList[cat] = []);

    Object.values(list).forEach(item => {
      const category = getCategoryForIngredient(item.name);
      if (!categorizedList[category]) categorizedList[category] = [];
      categorizedList[category].push(item);
    });

    extraItems.forEach(item => {
      const category = item.category && categorizedList[item.category] ? item.category : getCategoryForIngredient(item.name);
      categorizedList[category].push({ name: item.name, amount: item.amount, unit: item.unit, originalKey: `extra:${item.id}`, extraId: item.id });
    });

    Object.keys(categorizedList).forEach(cat => categorizedList[cat].sort((a, b) => a.name.localeCompare(b.name)));
    return categorizedList;
  }, [plan, persons, recipesDb, extraItems]);

  const isShoppingListEmpty = useMemo(() => Object.values(shoppingListCategories).every(catList => catList.length === 0), [shoppingListCategories]);

  const shoppingItemsCount = useMemo(
    () => Object.values(shoppingListCategories).reduce((sum, items) => sum + items.length, 0),
    [shoppingListCategories]
  );

  const plannedCount = useMemo(
    () => DAYS_OF_WEEK.reduce((sum, day) => sum + MEAL_TYPES.filter(meal => recipesDb[plan[day]?.[meal]]).length, 0),
    [plan, recipesDb]
  );

  const planCounts = useMemo(() => {
    const counts = {};
    Object.values(plan).forEach(dayMeals => Object.values(dayMeals).forEach(id => { if (id) counts[id] = (counts[id] || 0) + 1; }));
    return counts;
  }, [plan]);

  return {
    loading, persons, plan, recipesDb: recipes, checkedItems, planCounts,
    toggleFavorite, addExtraItem, removeExtraItem,
    shoppingListCategories, isShoppingListEmpty, shoppingItemsCount, plannedCount,
    handlePersonsChange, handleMealSelect, handleClearPlan, toggleItemCheck,
    modal: {
      isAddRecipeModalOpen, setIsAddRecipeModalOpen, editingRecipeId,
      newRecipeName, setNewRecipeName, newRecipeIngredients, recipeMeta, setRecipeMeta,
      smartText, setSmartText, smartError,
      handleOpenAddModal, handleOpenEditModal, handleSmartImport,
      handleAddIngredientRow, handleIngredientChange, handleRemoveIngredientRow, handleSaveRecipe,
      recipeToDelete, setRecipeToDelete, confirmDeleteRecipe,
    },
  };
}
