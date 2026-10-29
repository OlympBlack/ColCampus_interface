import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useQuartierNames, useUniversites } from '../hooks/useUniversites'
import type { ExplorerFilters } from './AnnonceExplorer'
import { UiIcon } from './UiIcons'

export type { ExplorerFilters }

// Reusing modern fields styling from Hero
const inputSurfaceClass = 'min-w-0 flex-1 border-0 bg-transparent text-[0.95rem] font-medium text-slate-900 outline-none placeholder:text-slate-400'
const selectSurfaceClass = 'min-w-0 flex-1 border-0 bg-transparent text-[0.95rem] font-medium text-slate-900 outline-none'

interface FilterDrawerProps {
  isOpen: boolean
  filters: ExplorerFilters
  onClose: () => void
  onApply: (nextFilters: ExplorerFilters) => void
}

function createEmptyFilters(): ExplorerFilters {
  return {
    category: 'ALL',
    propertyType: '',
    quartier: '',
    universite: '',
    prixMin: '',
    prixMax: '',
  }
}

function DrawerSelectField({ label, icon, value, onChange, options, placeholder }: any) {
  return (
    <label className={'grid gap-1.5'}>
      <span className={'text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-500'}>{label}</span>
      <div className={'flex h-12 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-sm transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10'}>
        <span className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700'}>
          <UiIcon name={icon} />
        </span>
        <select value={value} onChange={(event) => onChange(event.target.value)} className={selectSurfaceClass}>
          <option value={''}>{placeholder}</option>
          {options.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </label>
  )
}

function DrawerPriceStepperField({ label, value, onChange, placeholder }: any) {
  function changeBy(delta: number) {
    const current = Number(value) || 0
    const next = Math.max(0, current + delta)
    onChange(next === 0 ? '' : String(next))
  }

  return (
    <label className={'grid gap-1.5'}>
      <span className={'text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-500'}>{label}</span>
      <div className={'flex h-12 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 shadow-sm transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10'}>
        <button type={'button'} onClick={() => changeBy(-5000)} className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-blue-600 hover:shadow-sm'} aria-label="Diminuer">
          <UiIcon name={'minus'} />
        </button>
        <input type={'number'} min={0} step="any" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputSurfaceClass} />
        <button type={'button'} onClick={() => changeBy(5000)} className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-blue-600 hover:shadow-sm'} aria-label="Augmenter">
          <UiIcon name={'plus'} />
        </button>
      </div>
    </label>
  )
}

export function FilterDrawer({ isOpen, filters, onClose, onApply }: FilterDrawerProps) {
  const [draft, setDraft] = useState(filters)
  const { universities } = useUniversites()
  const quartierOptions = useQuartierNames(draft.universite || undefined)

  // Empecher le scroll en arriere-plan quand la vraie modale popup est active, uniquement sur mobile
  useEffect(() => {
    if (isOpen) {
      setDraft(filters)
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [filters, isOpen])

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onApply(draft)
    onClose()

    const params = new URLSearchParams()
    if (draft.prixMin) params.set('prix_min', draft.prixMin)
    if (draft.prixMax) params.set('prix_max', draft.prixMax)
    if (draft.quartier) params.set('quartier', draft.quartier)
    if (draft.universite) params.set('universite', draft.universite)
    if (draft.propertyType) params.set('type', draft.propertyType)
    const qs = params.toString()
    window.location.hash = qs ? `#/recherche?${qs}` : '#/recherche'
  }

  const contentMobile = (
    <div className={'fixed inset-0 z-[999] flex flex-col justify-end transition-all md:hidden'} style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
      {/* Backdrop sombre avec blur (SaaS style) */}
      <div
        className={'absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-[hero-fade-up_0.2s_ease-out_both]'}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (bottom sheet sur mobile) */}
      <div className={'relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-slate-50 shadow-2xl animate-[hero-fade-up_0.35s_cubic-bezier(0.2,0.8,0.2,1)_both]'} onClick={e => e.stopPropagation()}>
        {/* Header Drawer */}
        <div className={'flex shrink-0 items-center justify-between border-b border-slate-200/60 bg-white px-6 py-4'}>
          <h2 className={'text-[1.1rem] font-bold text-slate-900'}>Options de filtrage</h2>
          <button
            type={'button'}
            onClick={onClose}
            className={'flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:scale-95'}
          >
            <UiIcon name="plus" className="rotate-45" /> {/* Use plus rotated as X */}
          </button>
        </div>

        {/* Content Drawer */}
        <div className={'flex-1 overflow-y-auto px-5 py-6 colcampus-scroll'}>
          <form id="global-filter-form-mobile" onSubmit={applyFilters} className={'flex flex-col gap-6'}>
            <DrawerSelectField
              label={'Université'}
              icon={'home'}
              value={draft.universite}
              onChange={(val: string) => setDraft({ ...draft, universite: val, quartier: '' })}
              options={universities.map((u) => u.code)}
              placeholder={'Toutes les universités'}
            />
            <DrawerSelectField
              label={'Votre quartier idéal'}
              icon={'map-pin'}
              value={draft.quartier}
              onChange={(val: string) => setDraft({ ...draft, quartier: val })}
              options={quartierOptions}
              placeholder={'Tous les quartiers'}
            />
            <DrawerPriceStepperField
              label={'Budget mensuel minimum'}
              value={draft.prixMin}
              onChange={(val: string) => setDraft({ ...draft, prixMin: val })}
              placeholder={'Ex: 12000'}
            />
            <DrawerPriceStepperField
              label={'Budget mensuel maximum'}
              value={draft.prixMax}
              onChange={(val: string) => setDraft({ ...draft, prixMax: val })}
              placeholder={'Ex: 45000'}
            />
          </form>
        </div>

        {/* Footer actions Drawer */}
        <div className={'shrink-0 border-t border-slate-200/80 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]'}>
          <div className={'flex gap-3'}>
            <button
              type={'button'}
              onClick={() => setDraft(createEmptyFilters())}
              className={'flex-1 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95'}
            >
              Effacer tout
            </button>
            <button
              type={'submit'}
              form="global-filter-form-mobile"
              onClick={(e) => {
                e.preventDefault()
                applyFilters(e as any)
              }}
              className={'flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95 cursor-pointer'}
            >
              <UiIcon name="search" />
              Rechercher
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const contentDesktop = (
    <div className="filter-wrapper showfilter hidden md:block">
      <button type="button" className="filter-pannel-background" onClick={onClose} aria-label="Fermer le panneau de filtre" />
      <aside className="filter-pannel" aria-label="Filtrer les annonces">
        <div className="filter-header">Filtres des annonces</div>

        <form className="filter-form" onSubmit={applyFilters}>
          <div className="filter-container">
            <label className="field">
              <span>Université</span>
              <select
                value={draft.universite}
                onChange={(event) => setDraft({ ...draft, universite: event.target.value, quartier: '' })}
              >
                <option value="">Toutes les universités</option>
                {universities.map((universite) => (
                  <option key={universite.code} value={universite.code}>
                    {universite.code} — {universite.ville}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Quartier</span>
              <select value={draft.quartier} onChange={(event) => setDraft({ ...draft, quartier: event.target.value })}>
                <option value="">Tous les quartiers</option>
                {quartierOptions.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Budget minimum</span>
              <input
                type="number"
                min="0"
                step="any"
                value={draft.prixMin}
                onChange={(event) => setDraft({ ...draft, prixMin: event.target.value })}
                placeholder="12000"
              />
            </label>

            <label className="field">
              <span>Budget maximum</span>
              <input
                type="number"
                min="0"
                step="any"
                value={draft.prixMax}
                onChange={(event) => setDraft({ ...draft, prixMax: event.target.value })}
                placeholder="45000"
              />
            </label>
          </div>

          <div className="filter-bottom">
            <button
              type="button"
              className="button button--ghost button--fit"
              onClick={() => setDraft(createEmptyFilters())}
            >
              Effacer
            </button>
            <button type="submit" className="button button--primary button--fit">
              Appliquer
            </button>
          </div>
        </form>
      </aside>
    </div>
  )

  return (
    <>
      {createPortal(contentMobile, document.body)}
      {contentDesktop}
    </>
  )
}