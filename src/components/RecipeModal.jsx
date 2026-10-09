import { MEAL_TYPES } from '../lib/planner';
import { PHOTO_OPTIONS, img } from '../data/photos';
import { CloseIcon } from './Icons';

const input = 'rounded-full border border-ink bg-white/60 px-4 py-2 text-sm outline-none focus:bg-white';
const label = 'mb-1.5 block text-[10px] font-bold tracking-[0.12em] text-muted';
const chip = (active) => `rounded-full border border-ink px-3.5 py-1.5 text-xs font-bold ${active ? 'bg-ink text-sun' : 'hover:bg-ink/5'}`;

export function RecipeModal({ modal }) {
  const { recipeMeta, setRecipeMeta } = modal;
  const setMeta = (patch) => setRecipeMeta({ ...recipeMeta, ...patch });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 lg:items-center lg:p-4" onClick={() => modal.setIsAddRecipeModalOpen(false)}>
      <div
        role="dialog" aria-label={modal.editingRecipeId ? 'Редагувати страву' : 'Додати нову страву'}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-[28px] border border-ink bg-paper lg:rounded-[28px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink px-6 py-4">
          <h2 className="font-display text-3xl leading-none">{modal.editingRecipeId ? 'РЕДАГУВАТИ СТРАВУ' : 'НОВА СТРАВА'}</h2>
          <button onClick={() => modal.setIsAddRecipeModalOpen(false)} aria-label="Закрити" className="rounded-full p-2 hover:bg-ink/10"><CloseIcon /></button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
          <div>
            <label className={label} htmlFor="recipe-name">НАЗВА СТРАВИ</label>
            <input id="recipe-name" type="text" value={modal.newRecipeName} onChange={e => modal.setNewRecipeName(e.target.value)} placeholder="Наприклад: Картопля по-селянськи" className={`${input} w-full font-serif text-xl`} />
          </div>

          <div>
            <span className={label}>ПРИЙОМ ЇЖІ</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setMeta({ mealType: '' })} aria-pressed={!recipeMeta.mealType} className={chip(!recipeMeta.mealType)}>Будь-який</button>
              {MEAL_TYPES.map(m => <button key={m} onClick={() => setMeta({ mealType: m })} aria-pressed={recipeMeta.mealType === m} className={chip(recipeMeta.mealType === m)}>{m}</button>)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <label className={label} htmlFor="recipe-minutes">ЧАС, ХВ</label>
              <input id="recipe-minutes" type="number" min="0" value={recipeMeta.minutes} onChange={e => setMeta({ minutes: e.target.value })} className={`${input} w-full`} />
            </div>
            <div>
              <label className={label} htmlFor="recipe-kcal">ККАЛ НА ПОРЦІЮ</label>
              <input id="recipe-kcal" type="number" min="0" value={recipeMeta.kcal} onChange={e => setMeta({ kcal: e.target.value })} className={`${input} w-full`} />
            </div>
            <label className="col-span-2 flex items-end gap-2 pb-2 text-sm font-bold sm:col-span-1">
              <input type="checkbox" checked={recipeMeta.vegetarian} onChange={e => setMeta({ vegetarian: e.target.checked })} className="h-5 w-5 accent-ink" />
              Вегетаріанська
            </label>
          </div>

          <div>
            <label className={label} htmlFor="recipe-desc">КОРОТКИЙ ОПИС</label>
            <textarea id="recipe-desc" rows={2} value={recipeMeta.description} onChange={e => setMeta({ description: e.target.value })} className="w-full resize-y rounded-2xl border border-ink bg-white/60 px-4 py-2 font-serif text-lg outline-none focus:bg-white" />
          </div>

          <div>
            <span className={label}>ФОТО (ПРИКЛАДИ)</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button onClick={() => setMeta({ photo: null })} aria-pressed={!recipeMeta.photo} className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink text-[10px] font-bold ${!recipeMeta.photo ? 'bg-ink text-sun' : ''}`}>немає</button>
              {PHOTO_OPTIONS.map(p => (
                <button
                  key={p} onClick={() => setMeta({ photo: p })} aria-label={`Фото: ${p}`} aria-pressed={recipeMeta.photo === p}
                  className={`h-14 w-14 shrink-0 rounded-full bg-cover bg-center ${recipeMeta.photo === p ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'border border-ink'}`}
                  style={{ backgroundImage: `url(${img(p)})` }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-ink bg-sun/50 p-3.5">
            <label className="mb-2 block text-xs font-bold" htmlFor="smart-text">✨ Розумне додавання — вставте скопійовані інгредієнти</label>
            <div className="flex gap-2">
              <textarea id="smart-text" value={modal.smartText} onChange={e => modal.setSmartText(e.target.value)} placeholder="Вставте текст тут..." rows={2} className="min-h-[42px] flex-1 resize-y rounded-2xl border border-ink bg-white px-3 py-2 text-sm outline-none" />
              <button onClick={modal.handleSmartImport} disabled={!modal.smartText.trim()} className="self-start whitespace-nowrap rounded-full border border-ink bg-sun px-4 py-2 text-xs font-bold disabled:opacity-40">Розпізнати</button>
            </div>
            {modal.smartError && <p className="mt-1 text-xs font-semibold text-red-700">{modal.smartError}</p>}
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-[10px] font-bold tracking-[0.12em] text-muted">ІНГРЕДІЄНТИ (НА 1 ПОРЦІЮ)</span>
              <button onClick={modal.handleAddIngredientRow} className="text-xs font-bold text-royal hover:underline">+ Додати рядок</button>
            </div>
            <div className="flex flex-col gap-2">
              {modal.newRecipeIngredients.map((ing, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="text" value={ing.name} onChange={e => modal.handleIngredientChange(index, 'name', e.target.value)} placeholder="Назва продукту" aria-label="Назва продукту" className={`${input} min-w-0 flex-1`} />
                  <input type="number" value={ing.amount} onChange={e => modal.handleIngredientChange(index, 'amount', e.target.value)} placeholder="К-ть" aria-label="Кількість" className={`${input} w-20 shrink-0`} />
                  <select value={ing.unit} onChange={e => modal.handleIngredientChange(index, 'unit', e.target.value)} aria-label="Одиниця" className="w-[72px] shrink-0 rounded-full border border-ink bg-white/60 px-2 py-2 text-sm outline-none">
                    <option value="г">г</option><option value="мл">мл</option><option value="шт">шт</option><option value="ст.л">ст.л</option><option value="ч.л">ч.л</option>
                  </select>
                  <button onClick={() => modal.handleRemoveIngredientRow(index)} disabled={modal.newRecipeIngredients.length === 1} aria-label="Видалити рядок" className="shrink-0 rounded-full p-1.5 text-muted hover:text-ink disabled:opacity-30"><CloseIcon size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-ink px-6 py-4">
          {modal.editingRecipeId
            ? <button onClick={() => modal.setRecipeToDelete(modal.editingRecipeId)} className="rounded-full px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-700/10">Видалити страву</button>
            : <span />}
          <div className="flex gap-3">
            <button onClick={() => modal.setIsAddRecipeModalOpen(false)} className="rounded-full border border-ink px-5 py-2.5 text-[13px] font-bold hover:bg-ink/5">Скасувати</button>
            <button onClick={modal.handleSaveRecipe} disabled={!modal.newRecipeName.trim()} className="rounded-full border border-ink bg-sun px-5 py-2.5 text-[13px] font-bold hover:brightness-95 disabled:opacity-40">Зберегти страву</button>
          </div>
        </div>
      </div>
    </div>
  );
}
