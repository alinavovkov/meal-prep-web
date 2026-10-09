export function RecipeModal({ modal }) {
  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{modal.editingRecipeId ? 'Редагувати страву' : 'Додати нову страву'}</h2>
          <button onClick={() => modal.setIsAddRecipeModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold p-2">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Назва страви</label>
            <input type="text" value={modal.newRecipeName} onChange={(e) => modal.setNewRecipeName(e.target.value)} placeholder="Наприклад: Картопля по-селянськи" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
            <label className="block text-sm font-medium text-emerald-800 mb-2">✨ Розумне додавання (вставте скопійовані інгредієнти)</label>
            <div className="flex gap-2">
              <textarea value={modal.smartText} onChange={(e) => modal.setSmartText(e.target.value)} placeholder="Вставте текст тут..." className="flex-1 border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[42px] resize-y bg-white" rows="2" />
              <button onClick={modal.handleSmartImport} disabled={!modal.smartText.trim()} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors whitespace-nowrap self-start">Розпізнати</button>
            </div>
            {modal.smartError && <p className="text-red-500 text-xs mt-1">{modal.smartError}</p>}
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-medium text-gray-700">Інгредієнти (на 1 порцію)</label>
              <button onClick={modal.handleAddIngredientRow} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">+ Додати рядок</button>
            </div>
            <div className="space-y-2">
              {modal.newRecipeIngredients.map((ing, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input type="text" value={ing.name} onChange={(e) => modal.handleIngredientChange(index, 'name', e.target.value)} placeholder="Назва продукту" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="w-20">
                    <input type="number" value={ing.amount} onChange={(e) => modal.handleIngredientChange(index, 'amount', e.target.value)} placeholder="К-ть" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="w-20">
                    <select value={ing.unit} onChange={(e) => modal.handleIngredientChange(index, 'unit', e.target.value)} className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option value="г">г</option><option value="мл">мл</option><option value="шт">шт</option><option value="ст.л">ст.л</option><option value="ч.л">ч.л</option>
                    </select>
                  </div>
                  <button onClick={() => modal.handleRemoveIngredientRow(index)} className="p-2 text-red-400 hover:text-red-600 transition-colors" disabled={modal.newRecipeIngredients.length === 1}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => modal.setIsAddRecipeModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">Скасувати</button>
          <button onClick={modal.handleSaveRecipe} disabled={!modal.newRecipeName.trim()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">Зберегти страву</button>
        </div>
      </div>
    </div>
  </div>
  );
}
