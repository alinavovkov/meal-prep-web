import { INGREDIENT_CATEGORIES } from '../lib/planner';

export function ShoppingListView({ persons, isShoppingListEmpty, shoppingListCategories, checkedItems, toggleItemCheck, onGoToPlan }) {
  return (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Список продуктів на {persons} {persons === 1 ? 'персону' : (persons > 1 && persons < 5) ? 'персони' : 'персон'}</h2>
    {isShoppingListEmpty ? (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">🛒</div>
        <p>Ваш список покупок порожній.</p>
        <button onClick={() => onGoToPlan()} className="mt-4 inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors">Перейти до планування</button>
      </div>
    ) : (
      <div className="space-y-6">
        {Object.entries(shoppingListCategories).sort(([catA], [catB]) => INGREDIENT_CATEGORIES[catA] - INGREDIENT_CATEGORIES[catB]).filter(([_, items]) => items.length > 0).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h3 className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md mb-2 text-sm uppercase tracking-wide">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 pl-2">
              {items.map((item) => {
                const itemKey = item.originalKey;
                const isChecked = checkedItems[itemKey];
                return (
                  <label key={itemKey} className={`flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 cursor-pointer transition-colors ${isChecked ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={!!isChecked} onChange={() => toggleItemCheck(itemKey)} className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600" />
                      <span className={`text-gray-700 transition-all ${isChecked ? 'line-through text-gray-400' : ''}`}>{item.name}</span>
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
        <button onClick={() => {
          let textToCopy = 'Список покупок:\n\n';
          Object.entries(shoppingListCategories).sort(([catA], [catB]) => INGREDIENT_CATEGORIES[catA] - INGREDIENT_CATEGORIES[catB]).filter(([_, items]) => items.length > 0).forEach(([category, items]) => {
            textToCopy += `[ ${category} ]\n`;
            items.forEach(item => textToCopy += `- ${item.name}: ${Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(1)} ${item.unit}\n`);
            textToCopy += '\n';
          });
          navigator.clipboard.writeText(textToCopy).catch(err => console.error('Failed to copy text: ', err));
        }} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm">
          📋 Скопіювати список
        </button>
      </div>
    )}
  </div>
  );
}
