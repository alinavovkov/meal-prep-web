export function DeleteModal({ modal, recipesDb }) {
  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xl">⚠️</div>
        <h3 className="text-lg font-bold text-gray-900">Видалити страву?</h3>
      </div>
      <p className="text-gray-600 mb-6 text-sm">
        Ви впевнені, що хочете назавжди видалити страву <span className="font-bold">"{recipesDb[modal.recipeToDelete]?.name}"</span>? 
        Вона також зникне з вашого планувальника.
      </p>
      <div className="flex justify-end gap-3">
        <button onClick={() => modal.setRecipeToDelete(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm">
          Скасувати
        </button>
        <button onClick={modal.confirmDeleteRecipe} className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-sm shadow-sm">
          Так, видалити
        </button>
      </div>
    </div>
  </div>
  );
}
