export function DeleteModal({ modal, recipesDb }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4" onClick={() => modal.setRecipeToDelete(null)}>
      <div role="alertdialog" aria-label="Видалити страву?" className="w-full max-w-sm rounded-[28px] border border-ink bg-paper p-6" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-3xl leading-none">ВИДАЛИТИ СТРАВУ?</h3>
        <p className="mt-4 font-serif text-xl leading-snug text-muted">
          Страва <span className="font-semibold text-ink">«{recipesDb[modal.recipeToDelete]?.name}»</span> зникне назавжди — разом із планувальником.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => modal.setRecipeToDelete(null)} className="rounded-full border border-ink px-5 py-2.5 text-[13px] font-bold hover:bg-ink/5">Скасувати</button>
          <button onClick={modal.confirmDeleteRecipe} className="rounded-full border border-ink bg-ink px-5 py-2.5 text-[13px] font-bold text-sun hover:opacity-90">Так, видалити</button>
        </div>
      </div>
    </div>
  );
}
