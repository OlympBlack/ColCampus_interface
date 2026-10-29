import { useMemo, useState, useEffect, type FormEvent } from 'react'
import { ArrowLeft, SlidersHorizontal, Search, RotateCcw, Sparkles } from 'lucide-react'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { useQuartierNames } from '../hooks/useUniversites'
import type { ExplorerFilters } from '../components/AnnonceExplorer'
import type { Annonce, AnnouncementType } from '../types'
import { AnnonceCard } from '../components/AnnonceCard'

interface SearchResultsPageProps {
  filters: ExplorerFilters
  onChangeFilters: (filters: ExplorerFilters) => void
  onOpenFilters: () => void
}

type CategoryTab = 'ALL' | AnnouncementType

function renderAnnonceCard(annonce: Annonce) {
  return <AnnonceCard key={annonce.id} annonce={annonce} />
}

export function SearchResultsPage({
  filters,
  onChangeFilters,
  onOpenFilters,
}: SearchResultsPageProps) {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<CategoryTab>('ALL')
  const quartierOptions = useQuartierNames(filters.universite || undefined)

  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default')

  // Local state for the inline quick-search bar
  const [inlineQuartier, setInlineQuartier] = useState(filters.quartier || '')
  const [inlinePrixMin, setInlinePrixMin] = useState(filters.prixMin || '')
  const [inlinePrixMax, setInlinePrixMax] = useState(filters.prixMax || '')

  useEffect(() => {
    setInlineQuartier(filters.quartier || '')
    setInlinePrixMin(filters.prixMin || '')
    setInlinePrixMax(filters.prixMax || '')
  }, [filters.quartier, filters.prixMin, filters.prixMax])

  // Fetch all announcements so we have the candidate pool to compute both exact matches and proximity offers
  const { announcements: allAnnouncements, isLoading } = useAnnouncements()

  // Client-side exact filtering
  const exactMatches = useMemo(() => {
    let list = allAnnouncements

    if (filters.prixMin) {
      const min = Number(filters.prixMin)
      if (!isNaN(min) && min > 0) {
        list = list.filter((a) => a.loyer >= min)
      }
    }

    if (filters.prixMax) {
      const max = Number(filters.prixMax)
      if (!isNaN(max) && max > 0) {
        list = list.filter((a) => a.loyer <= max)
      }
    }

    if (filters.quartier) {
      list = list.filter(
        (a) => a.quartier?.toLowerCase() === filters.quartier.toLowerCase()
      )
    }

    if (selectedCategoryTab !== 'ALL') {
      list = list.filter((a) => a.type_annonce === selectedCategoryTab)
    }

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.loyer - b.loyer)
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.loyer - a.loyer)
    }

    return list
  }, [allAnnouncements, filters, selectedCategoryTab, sortBy])

  // Intelligent Proximity Algorithm
  const proximityListings = useMemo(() => {
    if (allAnnouncements.length === 0) return []

    const minNum = filters.prixMin ? Number(filters.prixMin) : null
    const maxNum = filters.prixMax ? Number(filters.prixMax) : null
    const targetBudget =
      minNum !== null && maxNum !== null
        ? (minNum + maxNum) / 2
        : (maxNum ?? minNum ?? 25000)

    const exactIds = new Set(exactMatches.map((a) => a.id))
    let candidates = allAnnouncements.filter((a) => !exactIds.has(a.id))

    if (selectedCategoryTab !== 'ALL') {
      const sameCategoryList = candidates.filter((a) => a.type_annonce === selectedCategoryTab)
      if (sameCategoryList.length >= 2) {
        candidates = sameCategoryList
      }
    }

    const scored = candidates.map((item) => {
      const sameQuartier = Boolean(
        filters.quartier &&
        item.quartier?.toLowerCase() === filters.quartier.toLowerCase()
      )
      const priceDiff = Math.abs(item.loyer - targetBudget)

      // Score formula (lower is better): give significant bonus for same quartier
      let score = priceDiff
      if (sameQuartier) score -= 20000
      if (selectedCategoryTab !== 'ALL' && item.type_annonce === selectedCategoryTab) {
        score -= 8000
      }

      // Generate descriptive badge
      const diff = item.loyer - targetBudget
      let badge = ''

      if (sameQuartier) {
        if (diff === 0) {
          badge = `Même quartier (${item.quartier}) · Pile dans le budget`
        } else if (diff > 0) {
          badge = `Même quartier (${item.quartier}) · +${diff.toLocaleString('fr-FR')} F CFA`
        } else {
          badge = `Même quartier (${item.quartier}) · -${Math.abs(diff).toLocaleString('fr-FR')} F CFA`
        }
      } else {
        const inBudget =
          (minNum !== null && maxNum !== null && item.loyer >= minNum && item.loyer <= maxNum) ||
          (maxNum !== null && minNum === null && item.loyer <= maxNum) ||
          (minNum !== null && maxNum === null && item.loyer >= minNum)

        if (inBudget) {
          badge = `Dans votre budget (${item.quartier})`
        } else if (diff > 0) {
          badge = `+${diff.toLocaleString('fr-FR')} F CFA · ${item.quartier}`
        } else {
          badge = `-${Math.abs(diff).toLocaleString('fr-FR')} F CFA · ${item.quartier}`
        }
      }

      return {
        annonce: item,
        score,
        badge,
      }
    })

    scored.sort((a, b) => a.score - b.score)

    return scored.slice(0, 8)
  }, [allAnnouncements, exactMatches, filters, selectedCategoryTab])

  // Counts by category tab for exact matches
  const counts = useMemo(() => {
    let base = allAnnouncements
    if (filters.prixMin) {
      const min = Number(filters.prixMin)
      if (!isNaN(min) && min > 0) base = base.filter((a) => a.loyer >= min)
    }
    if (filters.prixMax) {
      const max = Number(filters.prixMax)
      if (!isNaN(max) && max > 0) base = base.filter((a) => a.loyer <= max)
    }
    if (filters.quartier) {
      base = base.filter(
        (a) => a.quartier?.toLowerCase() === filters.quartier.toLowerCase()
      )
    }

    return {
      all: base.length,
      chambre: base.filter((a) => a.type_annonce === 'CHAMBRE_VIDE').length,
      hote: base.filter((a) => a.type_annonce === 'PLACE_LIBRE_HOTE').length,
      binome: base.filter((a) => a.type_annonce === 'RECHERCHE_BINOME').length,
    }
  }, [allAnnouncements, filters])

  function updateFiltersAndHash(nextFilters: ExplorerFilters) {
    onChangeFilters(nextFilters)
    const params = new URLSearchParams()
    if (nextFilters.prixMin) params.set('prix_min', nextFilters.prixMin)
    if (nextFilters.prixMax) params.set('prix_max', nextFilters.prixMax)
    if (nextFilters.quartier) params.set('quartier', nextFilters.quartier)
    if (nextFilters.propertyType) params.set('type', nextFilters.propertyType)
    const qs = params.toString()
    window.location.hash = qs ? `#/recherche?${qs}` : '#/recherche'
  }

  function handleInlineSearchSubmit(e: FormEvent) {
    e.preventDefault()
    let min = inlinePrixMin.trim()
    let max = inlinePrixMax.trim()
    if (min && max && Number(min) > Number(max)) {
      const tmp = min
      min = max
      max = tmp
    }
    updateFiltersAndHash({
      ...filters,
      quartier: inlineQuartier.trim(),
      prixMin: min,
      prixMax: max,
    })
  }

  function handleResetAll() {
    updateFiltersAndHash({
      category: 'ALL',
      propertyType: '',
      quartier: '',
      universite: '',
      prixMin: '',
      prixMax: '',
    })
  }

  const hasBudgetFilter = Boolean(filters.prixMin || filters.prixMax)
  const budgetLabel = useMemo(() => {
    if (filters.prixMin && filters.prixMax) {
      return `${Number(filters.prixMin).toLocaleString('fr-FR')} - ${Number(filters.prixMax).toLocaleString('fr-FR')} F CFA`
    }
    if (filters.prixMin) {
      return `Dès ${Number(filters.prixMin).toLocaleString('fr-FR')} F CFA`
    }
    if (filters.prixMax) {
      return `Jusqu'à ${Number(filters.prixMax).toLocaleString('fr-FR')} F CFA`
    }
    return ''
  }, [filters.prixMin, filters.prixMax])

  return (
    <div className="search-results-page bg-slate-50 min-h-screen pb-16">
      {/* ── BARRE DE CONTRÔLE COMPACTE & ERGONOMIQUE (STICKY) ── */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 md:top-[64px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 space-y-2.5">
          
          {/* Ligne 1 : Navigation retour + Titre contextuel + Compteur + Boutons d'action */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <a
                href="#/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors shrink-0"
                title="Retour à l'accueil"
              >
                <ArrowLeft size={15} />
                <span className="hidden sm:inline">Accueil</span>
              </a>

              <span className="h-3.5 w-px bg-slate-200 hidden sm:inline-block" />

              <div className="flex items-center gap-2 truncate">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                  {filters.quartier ? `Chambres à ${filters.quartier}` : 'Résultats de recherche'}
                </h1>

                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isLoading
                    ? 'bg-slate-100 text-slate-500'
                    : exactMatches.length === 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {isLoading ? '...' : `${exactMatches.length} offre${exactMatches.length > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              {(hasBudgetFilter || filters.quartier) && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                  title="Réinitialiser tous les filtres"
                >
                  <RotateCcw size={13} />
                  <span>Effacer</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <SlidersHorizontal size={13} />
                <span className="hidden sm:inline">Tous les filtres</span>
                <span className="sm:hidden">Filtres</span>
              </button>
            </div>
          </div>

          {/* Ligne 2 : Barre de recherche intégrée épurée (1 seule rangée propre) */}
          <form
            onSubmit={handleInlineSearchSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1 rounded-2xl bg-slate-100/80 border border-slate-200"
          >
            {/* Quartier */}
            <div className="flex-1 min-w-[150px] flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                Quartier
              </span>
              <select
                value={inlineQuartier}
                onChange={(e) => setInlineQuartier(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="">Tous les quartiers</option>
                {quartierOptions.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {/* Budget Min */}
            <div className="w-full sm:w-36 flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                Min
              </span>
              <input
                type="number"
                min={0}
                step="any"
                value={inlinePrixMin}
                onChange={(e) => setInlinePrixMin(e.target.value)}
                placeholder="10 000"
                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none"
              />
              <span className="text-[10px] font-bold text-slate-400 ml-1">F</span>
            </div>

            {/* Budget Max */}
            <div className="w-full sm:w-36 flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                Max
              </span>
              <input
                type="number"
                min={0}
                step="any"
                value={inlinePrixMax}
                onChange={(e) => setInlinePrixMax(e.target.value)}
                placeholder="40 000"
                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none"
              />
              <span className="text-[10px] font-bold text-slate-400 ml-1">F</span>
            </div>

            {/* Bouton Appliquer */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition active:scale-95 cursor-pointer shadow-sm shadow-blue-500/20 shrink-0"
            >
              <Search size={13} />
              <span>Rechercher</span>
            </button>
          </form>

          {/* Ligne 3 : Catégories et Tri (compact, sans marges excessives) */}
          <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none max-w-full">
              <button
                type="button"
                onClick={() => setSelectedCategoryTab('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategoryTab === 'ALL'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                Toutes ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategoryTab('CHAMBRE_VIDE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategoryTab === 'CHAMBRE_VIDE'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                Chambres disponibles ({counts.chambre})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategoryTab('PLACE_LIBRE_HOTE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategoryTab === 'PLACE_LIBRE_HOTE'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                Places en colocation ({counts.hote})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategoryTab('RECHERCHE_BINOME')}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategoryTab === 'RECHERCHE_BINOME'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                Quêtes binômes ({counts.binome})
              </button>
            </div>

            {/* Tri compact */}
            <div className="shrink-0 ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600 transition cursor-pointer"
              >
                <option value="default">Trier : Récentes</option>
                <option value="price-asc">Prix : Croissant</option>
                <option value="price-desc">Prix : Décroissant</option>
              </select>
            </div>
          </div>

        </div>
      </header>

      {/* ── CONTENU PRINCIPAL DES ANNONCES ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2.5"></div>
            <p className="text-slate-500 font-medium text-xs sm:text-sm">Recherche des chambres en cours...</p>
          </div>
        ) : exactMatches.length === 0 ? (
          /* ── CAS 0 RÉSULTAT : BANNIÈRE ÉPURÉE + OFFRES PROCHES IMMÉDIATES ── */
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Search size={18} />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-1">
                      <span>0 résultat trouvé</span>
                    </div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      Aucune offre exacte pour ces critères
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mt-0.5">
                      Aucune chambre ne correspond exactement à votre budget
                      {budgetLabel ? <span> (<strong>{budgetLabel}</strong>)</span> : ''}
                      {filters.quartier ? <span> dans le quartier <strong>{filters.quartier}</strong></span> : ''}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onOpenFilters}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition active:scale-95 cursor-pointer"
                  >
                    Ajuster les critères
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                  >
                    Voir tout
                  </button>
                </div>
              </div>
            </div>

            {/* DANS LE MÊME TEMPS : OFFRES PROCHES DE SA RECHERCHE */}
            {proximityListings.length > 0 && (
              <section className="pt-1">
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/80">
                      <Sparkles size={14} />
                    </span>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Offres proches de votre recherche</span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {proximityListings.length}
                      </span>
                    </h2>
                  </div>
                </div>

                {/* Grille des offres proches */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                  {proximityListings.map(({ annonce, badge }) => (
                    <div key={annonce.id} className="flex flex-col h-full">
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span className="truncate">{badge}</span>
                        </span>
                      </div>
                      <div className="flex-1">
                        {renderAnnonceCard(annonce)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* ── CAS RÉSULTATS EXACTS TROUVÉS : GRILLE IMMÉDIATE SANS TITRE REDONDANT ── */
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
              {exactMatches.map((annonce) => renderAnnonceCard(annonce))}
            </div>

            {/* Recommandations proches si peu de résultats */}
            {exactMatches.length < 4 && proximityListings.length > 0 && (
              <section className="pt-6 border-t border-slate-200/80">
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="p-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/80">
                    <Sparkles size={14} />
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                    Offres proches pouvant vous intéresser
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                  {proximityListings.slice(0, 4).map(({ annonce, badge }) => (
                    <div key={annonce.id} className="flex flex-col h-full">
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span className="truncate">{badge}</span>
                        </span>
                      </div>
                      <div className="flex-1">
                        {renderAnnonceCard(annonce)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
