import { useMemo, useState } from 'react';
import { usePlannerState } from './hooks/usePlannerState';
import { getWeekInfo } from './lib/dates';
import { Hero } from './components/Hero';
import { NavBar } from './components/NavBar';
import { TodayPanel } from './components/TodayPanel';
import { WeekIndex } from './components/WeekIndex';
import { FavoritesStrip } from './components/FavoritesStrip';
import { MobileToday } from './components/MobileToday';
import { MobileWeek } from './components/MobileWeek';
import { MobileTabBar } from './components/MobileTabBar';
import { MealPicker } from './components/MealPicker';
import { ShoppingListView } from './components/ShoppingListView';
import { RecipesView } from './components/RecipesView';
import { RecipeModal } from './components/RecipeModal';
import { DeleteModal } from './components/DeleteModal';

export default function MealPlannerApp() {
  const planner = usePlannerState();
  const { loading, persons, plan, recipesDb, modal } = planner;
  const [activeTab, setActiveTab] = useState('plan'); // 'plan', 'list', 'meals'
  const [mobileView, setMobileView] = useState('today'); // 'today', 'week'
  const [picker, setPicker] = useState(null);

  const week = useMemo(() => getWeekInfo(), []);

  const handlePick = (day, meal) => setPicker({ day, meal });
  const handleSelectMeal = (recipeId) => {
    planner.handleMealSelect(picker.day, picker.meal, recipeId);
    setPicker(null);
  };

  const mobileCurrent = activeTab === 'plan' ? mobileView : activeTab;
  const handleMobileTab = (id) => {
    if (id === 'list' || id === 'meals') {
      setActiveTab(id);
    } else {
      setActiveTab('plan');
      setMobileView(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-ink">
        <div className="w-12 h-12 border-4 border-ink/20 border-t-royal rounded-full animate-spin mb-4"></div>
        <p className="font-serif text-xl">Завантаження ваших даних...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-28 lg:pb-0">
      {activeTab === 'plan' && <Hero plannedCount={planner.plannedCount} rangeLabel={week.rangeLabel} />}
      <NavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        shoppingItemsCount={planner.shoppingItemsCount}
        persons={persons}
        onPersonsChange={planner.handlePersonsChange}
        onCreate={modal.handleOpenAddModal}
      />

      {activeTab === 'plan' && (
        <>
          <TodayPanel today={week.today} plan={plan} recipesDb={recipesDb} onPick={handlePick} />
          <WeekIndex days={week.days} plan={plan} recipesDb={recipesDb} onPick={handlePick} onClear={planner.handleClearPlan} />
          <FavoritesStrip />
          {mobileView === 'today' ? (
            <MobileToday
              today={week.today} plan={plan} recipesDb={recipesDb}
              plannedCount={planner.plannedCount} rangeLabel={week.rangeLabel}
              persons={persons} onPersonsChange={planner.handlePersonsChange}
              onPick={handlePick} onOpenMeals={() => setActiveTab('meals')}
            />
          ) : (
            <MobileWeek
              week={week} plan={plan} recipesDb={recipesDb}
              plannedCount={planner.plannedCount} persons={persons}
              shoppingItemsCount={planner.shoppingItemsCount}
              onPick={handlePick} onOpenList={() => setActiveTab('list')}
            />
          )}
        </>
      )}

      {activeTab === 'list' && (
        <ShoppingListView
          persons={persons}
          week={week}
          shoppingListCategories={planner.shoppingListCategories}
          checkedItems={planner.checkedItems}
          toggleItemCheck={planner.toggleItemCheck}
          addExtraItem={planner.addExtraItem}
          removeExtraItem={planner.removeExtraItem}
          onGoToPlan={() => setActiveTab('plan')}
        />
      )}

      {activeTab === 'meals' && (
        <RecipesView
          recipesDb={recipesDb}
          planCounts={planner.planCounts}
          week={week}
          onEdit={modal.handleOpenEditModal}
          onToggleFavorite={planner.toggleFavorite}
          onAddToPlan={planner.handleMealSelect}
        />
      )}

      <MobileTabBar current={mobileCurrent} onChange={handleMobileTab} onCreate={modal.handleOpenAddModal} />

      {picker && <MealPicker target={picker} plan={plan} recipesDb={recipesDb} onSelect={handleSelectMeal} onClose={() => setPicker(null)} />}
      {modal.isAddRecipeModalOpen && <RecipeModal modal={modal} />}
      {modal.recipeToDelete && <DeleteModal modal={modal} recipesDb={recipesDb} />}
    </div>
  );
}
