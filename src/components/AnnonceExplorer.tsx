import { CATEGORY_OPTIONS, type CategoryFilterValue } from '../constants'
import { useAnnouncements } from '../hooks/useAnnouncements'
import type { Annonce } from '../types'
import {
  formatAnnouncementType,
} from '../utils/format'
import { EmptyState, LoadingState } from './States'
import { UiIcon } from './UiIcons'
import { AnnonceCard as StandardAnnonceCard } from './AnnonceCard'

export interface ExplorerFilters {
  category: CategoryFilterValue
  propertyType: string
  quartier: string
  universite: string
  prixMin: string
  prixMax: string
}

interface AnnonceExplorerProps {
  title: string
  intro: string
  filters: ExplorerFilters
  onChangeFilters: (nextFilters: ExplorerFilters) => void
  onOpenFilters: () => void
  previewLimit?: number
}

function normalizeText(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function matchesPropertyType(annonce: Annonce, propertyType: string) {
  const query = propertyType.trim()

  if (!query) {
    return true
  }

  if (annonce.type_chambre) {
    if (
      annonce.type_chambre.toUpperCase() === query.toUpperCase() ||
      normalizeText(annonce.type_chambre).includes(normalizeText(query))
    ) {
      return true
    }
  }

  const haystack = normalizeText([
    annonce.titre,
    annonce.description,
    annonce.quartier,
    annonce.type_chambre,
    annonce.type_annonce,
    formatAnnouncementType(annonce.type_annonce),
  ].filter(Boolean).join(' '))

  return haystack.includes(normalizeText(query))
}

export function AnnonceCard({ annonce }: { annonce: Annonce }) {
  return <StandardAnnonceCard annonce={annonce} />
}

export function AnnonceExplorer({
  title,
  intro,
  filters,
  onChangeFilters,
  previewLimit,
}: AnnonceExplorerProps) {
  const { announcements, isLoading, error } = useAnnouncements({
    type_annonce: filters.category === 'ALL' ? undefined : filters.category,
    quartier: filters.quartier || undefined,
    universite: filters.universite || undefined,
    prix_min: filters.prixMin ? Number(filters.prixMin) : undefined,
    prix_max: filters.prixMax ? Number(filters.prixMax) : undefined,
  })

  const matchingAnnouncements = announcements.filter((annonce) => matchesPropertyType(annonce, filters.propertyType))
  const visibleAnnouncements = previewLimit ? matchingAnnouncements.slice(0, previewLimit) : matchingAnnouncements

  function resetFilters() {
    onChangeFilters({
      category: 'ALL',
      propertyType: '',
      quartier: '',
      universite: '',
      prixMin: '',
      prixMax: '',
    })
  }

  return (
    <section className={'section section--flat space-y-4 md:space-y-5'}>
      <div className={'section__header gap-4 md:gap-6'}>
        <div>
          <h4 className={'section__title'}>{title}</h4>
        </div>
        <p className={'section__intro'}>{intro}</p>
      </div>

      <div className={'scrollernavbar category-strip pb-1'}>
        {CATEGORY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type={'button'}
            className={'categoriebtn shrink-0 transition-all duration-200 md:hover:-translate-y-0.5'}
            data-active={filters.category === option.value}
            onClick={() => onChangeFilters({ ...filters, category: option.value })}
          >
            <span className={'cat-icon-bg'}><UiIcon name={option.icon} /></span>
            <span className={'titleh'}>{option.label}</span>
          </button>
        ))}
      </div>

      {/* <div className={'explorer-toolbar rounded-[20px] p-3 md:p-4'}>
        <div className={'explorer-toolbar__summary w-full md:w-auto'}>
          <span>{filters.propertyType || 'Tous les types'}</span>
          <span>{filters.quartier || 'Tous les quartiers'}</span>
          <span>{filters.prixMin || '0'} - {filters.prixMax || 'sans plafond'} cfa</span>
        </div>
        <div className={'explorer-toolbar__actions w-full md:w-auto'}>
          <button type={'button'} className={'button button--ghost button--fit'} onClick={onOpenFilters}>
            Filtrer
          </button>
          <button type={'button'} className={'button button--secondary button--fit'} onClick={resetFilters}>
            Reinitialiser
          </button>
        </div>
      </div> */}

      {error ? (
        <div className={'error-state'}>
          <strong>Connexion impossible</strong>
          <p>
            {error || 'Veuillez vérifier votre connexion Internet et réessayer.'}
          </p>
        </div>
      ) : null}

      {isLoading ? <LoadingState cards={previewLimit ?? 6} /> : null}

      {!isLoading && !error && visibleAnnouncements.length > 0 ? (
        <div className={'listing-grid items-stretch'}>
          {visibleAnnouncements.map((annonce) => (
            <AnnonceCard key={annonce.id} annonce={annonce} />
          ))}
        </div>
      ) : null}

      {!isLoading && !error && visibleAnnouncements.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : null}

      {previewLimit && matchingAnnouncements.length > previewLimit ? (
        <div className={'section__footer'}>
          <a className={'button button--secondary'} href={'#/recherche'}>
            Voir toutes les annonces
          </a>
        </div>
      ) : null}
    </section>
  )
}