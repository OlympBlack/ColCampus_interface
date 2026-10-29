import { useEffect, useState, type FormEvent } from 'react'
import { useQuartierNames, useUniversites } from '../hooks/useUniversites'
import type { ExplorerFilters } from './FilterDrawer'
import { UiIcon } from './UiIcons'

const inputSurfaceClass =
  'min-w-0 flex-1 border-0 bg-transparent text-[0.95rem] font-medium text-slate-900 outline-none placeholder:text-slate-400'
const selectSurfaceClass =
  'min-w-0 flex-1 border-0 bg-transparent text-[0.95rem] font-medium text-slate-900 outline-none'

type HomeHeroProps = {
  filters: ExplorerFilters
  onChangeFilters: (nextFilters: ExplorerFilters) => void
  onOpenFilters: () => void
}

function parseAmount(value: string) {
  const next = Number(value)
  return Number.isFinite(next) && next > 0 ? Math.round(next) : 0
}

function normalizeRange(minValue: string, maxValue: string) {
  const min = parseAmount(minValue)
  const max = parseAmount(maxValue)

  if (min > 0 && max > 0 && min > max) {
    return { min: String(max), max: String(min) }
  }

  return { min: minValue, max: maxValue }
}

function HeroSelectField({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  icon: 'home' | 'map-pin'
  value: string
  onChange: (nextValue: string) => void
  options: readonly string[]
  placeholder: string
}) {
  return (
    <label className={'grid gap-1.5'}>
      <span className={'text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-500'}>{label}</span>
      <div
        className={
          'flex h-12 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-sm transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10'
        }
      >
        <span className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700'}>
          <UiIcon name={icon} />
        </span>
        <select value={value} onChange={(event) => onChange(event.target.value)} className={selectSurfaceClass}>
          <option value={''}>{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}

function HeroUniversityField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (nextValue: string) => void
  options: { code: string; label: string }[]
  placeholder: string
}) {
  return (
    <label className={'grid gap-1.5'}>
      <span className={'text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-500'}>Université</span>
      <div
        className={
          'flex h-12 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-sm transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10'
        }
      >
        <span className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700'}>
          <UiIcon name={'home'} />
        </span>
        <select value={value} onChange={(event) => onChange(event.target.value)} className={selectSurfaceClass}>
          <option value={''}>{placeholder}</option>
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}

function PriceStepperField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (nextValue: string) => void
  placeholder: string
}) {
  function changeBy(delta: number) {
    const current = parseAmount(value)
    const next = Math.max(0, current + delta)
    onChange(next === 0 ? '' : String(next))
  }

  return (
    <label className={'grid gap-1.5'}>
      <span className={'text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-500'}>{label}</span>
      <div
        className={
          'flex h-12 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 shadow-sm transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10'
        }
      >
        <button
          type={'button'}
          onClick={() => changeBy(-5000)}
          className={
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-blue-600 hover:shadow-sm'
          }
          aria-label={'Diminuer le montant'}
        >
          <UiIcon name={'minus'} />
        </button>
        <input
          type={'number'}
          min={0}
          step="any"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={inputSurfaceClass}
        />
        <button
          type={'button'}
          onClick={() => changeBy(5000)}
          className={
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-blue-600 hover:shadow-sm'
          }
          aria-label={'Augmenter le montant'}
        >
          <UiIcon name={'plus'} />
        </button>
      </div>
    </label>
  )
}

export function HomeHero({ filters, onChangeFilters, onOpenFilters }: HomeHeroProps) {
  const [quartier, setQuartier] = useState('')
  const [universite, setUniversite] = useState('')
  const { universities } = useUniversites()
  const quartierOptions = useQuartierNames(universite || undefined)
  const [prixMin, setPrixMin] = useState('')
  const [prixMax, setPrixMax] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    setQuartier(filters.quartier)
    setUniversite(filters.universite)
    setPrixMin(filters.prixMin)
    setPrixMax(filters.prixMax)
    setHasSearched(Boolean(filters.propertyType || filters.quartier || filters.universite || filters.prixMin || filters.prixMax))
  }, [filters])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalized = normalizeRange(prixMin, prixMax)
    const nextFilters: ExplorerFilters = {
      ...filters,
      quartier: quartier.trim(),
      universite: universite.trim(),
      prixMin: normalized.min,
      prixMax: normalized.max,
    }

    setPrixMin(normalized.min)
    setPrixMax(normalized.max)
    setHasSearched(Boolean(nextFilters.propertyType || nextFilters.quartier || nextFilters.universite || nextFilters.prixMin || nextFilters.prixMax))
    onChangeFilters(nextFilters)

    const params = new URLSearchParams()
    if (nextFilters.prixMin) params.set('prix_min', nextFilters.prixMin)
    if (nextFilters.prixMax) params.set('prix_max', nextFilters.prixMax)
    if (nextFilters.quartier) params.set('quartier', nextFilters.quartier)
    if (nextFilters.universite) params.set('universite', nextFilters.universite)
    if (nextFilters.propertyType) params.set('type', nextFilters.propertyType)
    const qs = params.toString()
    window.location.hash = qs ? `#/recherche?${qs}` : '#/recherche'
  }

  function handleReset() {
    const nextFilters: ExplorerFilters = {
      ...filters,
      propertyType: '',
      quartier: '',
      universite: '',
      prixMin: '',
      prixMax: '',
    }

    setQuartier('')
    setUniversite('')
    setPrixMin('')
    setPrixMax('')
    setHasSearched(false)
    onChangeFilters(nextFilters)
  }

  const searchSummary = hasSearched
    ? [
        filters.propertyType || 'Tous les types',
        universite || 'Toutes les universités',
        quartier || 'Tous les quartiers',
        prixMin ? `${Number(prixMin).toLocaleString('fr-FR')} FCFA` : 'Sans minimum',
        prixMax ? `${Number(prixMax).toLocaleString('fr-FR')} FCFA` : 'Sans maximum',
      ].join(' | ')
    : "Filtrez par université, quartier et budget pour trouver la perle rare en quelques secondes."

  return (
    <section className={'home-search-strip relative z-20'}>
      <div className={'container'}>
        <form
          onSubmit={handleSubmit}
          className={
            'hero-search-form -mt-10 sm:-mt-12 rounded-[18px] sm:rounded-[24px] bg-white p-3 sm:p-4 text-left shadow-[0_18px_48px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/70'
          }
        >
          <div
            className={
              'grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_repeat(2,minmax(0,0.85fr))_auto] xl:items-end'
            }
          >
            <HeroUniversityField
              value={universite}
              onChange={(value) => {
                setUniversite(value)
                setQuartier('')
              }}
              options={universities.map((u) => ({
                code: u.code,
                label: `${u.code} — ${u.ville}`,
              }))}
              placeholder={'Toutes les universités'}
            />
            <HeroSelectField
              label={'Quartier'}
              icon={'map-pin'}
              value={quartier}
              onChange={setQuartier}
              options={quartierOptions}
              placeholder={'Choisir un quartier'}
            />
            <PriceStepperField label={'Prix minimum'} value={prixMin} onChange={setPrixMin} placeholder={'12000'} />
            <PriceStepperField label={'Prix maximum'} value={prixMax} onChange={setPrixMax} placeholder={'45000'} />
            <button
              type={'submit'}
              className={
                'inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-500'
              }
            >
              <span>Rechercher</span>
              <UiIcon name={'search'} />
            </button>
          </div>

          <div
            className={'mt-3 flex flex-col gap-2.5 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between'}
          >
            <p className={'text-xs text-slate-500 sm:text-sm line-clamp-2'}>{searchSummary}</p>
            <div className={'flex items-center gap-2 shrink-0'}>
              <button
                type={'button'}
                onClick={onOpenFilters}
                className={
                  'inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 active:scale-95'
                }
              >
                <UiIcon name={'bed'} />
                Filtres avancés
              </button>
              <button
                type={'button'}
                onClick={handleReset}
                className={
                  'inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95'
                }
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
