export function RecipesView({ recipesDb, onEdit, onDelete }) {
  return (
  <div className="space-y-4 animate-in fade-in duration-300">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {Object.entries(recipesDb).map(([recipeId, recipe]) => (
         <div key={recipeId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 truncate" title={recipe.name}>{recipe.name}</h3>
              <div className="flex items-center gap-1">
                <button onClick={() => onEdit(recipeId)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors" title="Редагувати">✏️</button>
                <button onClick={() => onDelete(recipeId)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Видалити">🗑️</button>
              </div>
            </div>
            <div className="p-4 flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Інгредієнти (1 порція):</p>
              <ul className="space-y-1.5">
                {recipe.ingredients.slice(0, 5).map((ing, idx) => (
                   <li key={idx} className="text-sm text-gray-700 flex justify-between">
                     <span className="truncate pr-2">{ing.name}</span>
                     <span className="font-medium text-gray-500 whitespace-nowrap">{ing.amount} {ing.unit}</span>
                   </li>
                ))}
                {recipe.ingredients.length > 5 && (
                  <li className="text-xs text-gray-400 italic pt-1">
                    + ще {recipe.ingredients.length - 5} інгредієнтів...
                  </li>
                )}
              </ul>
            </div>
         </div>
       ))}
     </div>
  </div>
  );
}
