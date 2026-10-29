import { useMemo, useState } from 'react'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { useQuartierNames } from '../hooks/useUniversites'
import { useCollections } from '../hooks/useCollections'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { AnnonceCard } from '../components/AnnonceCard'
import { CollectionsSection } from '../components/CollectionsSection'
import type { Annonce, PropertyCollection } from '../types'

interface CollectionDetailPageProps {
  slug: string
}

function normalizeKey(str?: string | null): string {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function matchesCollection(annonce: Annonce, collection: PropertyCollection): boolean {
  const roomType = collection.room_type_value ?? collection.roomTypeValue
  const targetKey = normalizeKey(roomType || collection.slug || collection.title)
  const annonceTypeKey = normalizeKey(annonce.type_chambre)

  // 1. Direct match sur le type de chambre
  if (targetKey && annonceTypeKey && targetKey === annonceTypeKey) {
    return true
  }

  // 2. Colocation / Places libres
  if (targetKey === 'PLACE_COLOCATION' || targetKey === 'PLACE_EN_COLOCATION') {
    return (
      annonceTypeKey === 'PLACE_COLOCATION' ||
      annonce.type_annonce === 'PLACE_LIBRE_HOTE'
    )
  }

  // 3. Studio meublé
  if (targetKey === 'STUDIO_MEUBLE' || targetKey === 'STUDIO') {
    return annonceTypeKey.includes('STUDIO')
  }

  // 4. Deux chambres salon
  if (
    targetKey === 'DEUX_CHAMBRES_SALON' ||
    targetKey === '2_CHAMBRES_SALON' ||
    targetKey === '2_CHAMBRES_SALON_SANITAIRE'
  ) {
    return (
      annonceTypeKey === 'DEUX_CHAMBRES_SALON' ||
      annonceTypeKey === '2_CHAMBRES_SALON'
    )
  }

  // 5. Appartement / Villa
  if (targetKey === 'APPARTEMENT' || targetKey === 'APPARTEMENT_VILLA') {
    return (
      annonceTypeKey.includes('APPARTEMENT') ||
      annonceTypeKey.includes('VILLA')
    )
  }

  // 6. Collections thématiques spécifiques
  if (targetKey === 'CLIMATISEE' || targetKey === 'CHAMBRES_CLIMATISEES') {
    const text = `${annonce.titre} ${annonce.description}`.toLowerCase()
    return text.includes('climatis') || text.includes('clim ')
  }

  if (targetKey === 'PROCHE_CAMPUS' || targetKey === 'PROCHE_CAMPUS_UAC' || targetKey === 'PROCHE_UAC' || targetKey === 'LOGEMENTS_PROCHES_UAC') {
    const text = `${annonce.titre} ${annonce.description} ${annonce.quartier}`.toLowerCase()
    return text.includes('campus') || text.includes('proche') || text.includes('uac') || text.includes('una') || text.includes('unstim')
  }

  if (targetKey === 'RESIDENCE' || targetKey === 'RESIDENCES_UNIVERSITAIRES') {
    const text = `${annonce.titre} ${annonce.description}`.toLowerCase()
    return text.includes('residence') || text.includes('résidence') || text.includes('cite') || text.includes('cité')
  }

  if (targetKey === 'CONCESSION' || targetKey === 'CONCESSIONS_ET_MAISONS') {
    const text = `${annonce.titre} ${annonce.description}`.toLowerCase()
    return text.includes('concession') || text.includes('maison') || text.includes('cour unique')
  }

  return false
}

export function CollectionDetailPage({ slug }: CollectionDetailPageProps) {
  const { collections } = useCollections()
  const quartierOptions = useQuartierNames()

  const collection = useMemo(() => {
    return collections.find((c) => c.slug === slug) ?? collections[0]
  }, [collections, slug])

  const { announcements, isLoading } = useAnnouncements()

  // Filtres locaux
  const [selectedQuartier, setSelectedQuartier] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default')

  // Annonces de la collection
  const collectionListings = useMemo(() => {
    let list = announcements.filter((a) => matchesCollection(a, collection))

    if (selectedQuartier) {
      list = list.filter((a) => a.quartier?.toLowerCase() === selectedQuartier.toLowerCase())
    }

    if (maxPrice) {
      const maxVal = Number(maxPrice)
      if (!isNaN(maxVal) && maxVal > 0) {
        list = list.filter((a) => a.loyer <= maxVal)
      }
    }

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.loyer - b.loyer)
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.loyer - a.loyer)
    }

    return list
  }, [announcements, collection, selectedQuartier, maxPrice, sortBy])

  function handleResetFilters() {
    setSelectedQuartier('')
    setMaxPrice('')
    setSortBy('default')
  }

  function handleScrollDown() {
    const el = document.getElementById('collection-listings')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const hasActiveFilters = Boolean(selectedQuartier || maxPrice || sortBy !== 'default')

  return (
    <div className="collection-detail-page bg-slate-50 min-h-screen">
      {/* ── HERO BANNER MODERNE & LISIBLE ── */}
      <section className="relative bg-slate-950 text-white overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4">
        {/* Image de fond avec filtre clair et dégradé subtil */}
        <div className="absolute inset-0 z-0">
          <img
            src={collection?.heroBanner || collection?.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80'}
            alt={collection?.title}
            className="w-full h-full object-cover opacity-55 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Fil d'ariane & retour au centre */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300 mb-4 sm:mb-5">
            <a href="#/" className="hover:text-white transition-colors">
              Accueil
            </a>
            <span>/</span>
            <a href="#/collections" className="hover:text-white transition-colors">
              Collections
            </a>
            <span>/</span>
            <span className="text-[#a4c639] font-semibold">{collection?.title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans uppercase mb-3 text-center drop-shadow-md">
            {collection?.title}
          </h1>

          <p className="max-w-2xl text-slate-200 text-sm sm:text-base leading-relaxed text-center drop-shadow-sm">
            {collection?.heroDescription || collection?.description || 'Trouvez la chambre idéale adaptée à votre budget et à vos besoins, près de votre campus.'}
          </p>

          {/* Bouton fléché vers le bas montrant les offres, flèche en ROUGE */}
          <div className="mt-7 sm:mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleScrollDown}
              className="group inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black border border-white/30 backdrop-blur-md text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
              title="Voir les offres disponibles ci-dessous"
            >
              <span className="text-white group-hover:text-black transition-colors">Voir les offres disponibles</span>
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-red-600 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                <ChevronDown className="w-4 h-4 stroke-[3] animate-bounce" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── LISTINGS CONTAINER ── */}
      <main id="collection-listings" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 scroll-mt-6">
        {/* Barre de filtres */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-8 space-y-4">
          {hasActiveFilters && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Filtres appliqués</span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Réinitialiser les filtres</span>
              </button>
            </div>
          )}

          {/* Grille de contrôles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quartier</label>
              <select
                value={selectedQuartier}
                onChange={(e) => setSelectedQuartier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-600 transition outline-none"
              >
                <option value="">Tous les quartiers</option>
                {quartierOptions.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Budget maximum</label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-600 transition outline-none"
              >
                <option value="">Tous les prix</option>
                <option value="20000">Moins de 20 000 FCFA</option>
                <option value="30000">Moins de 30 000 FCFA</option>
                <option value="45000">Moins de 45 000 FCFA</option>
                <option value="60000">Moins de 60 000 FCFA</option>
                <option value="80000">Moins de 80 000 FCFA</option>
                <option value="120000">Moins de 120 000 FCFA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-blue-600 transition outline-none"
              >
                <option value="default">Recommandés / Récents</option>
                <option value="price-asc">Prix le plus bas d'abord</option>
                <option value="price-desc">Prix le plus haut d'abord</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grille d'annonces */}
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#a4c639] border-t-transparent" />
            <p className="text-sm text-slate-500 mt-3 font-medium">Chargement des biens de la collection...</p>
          </div>
        ) : collectionListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {collectionListings.map((annonce) => (
              <AnnonceCard key={annonce.id} annonce={annonce} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-bold mb-4">
              🏡
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucun bien ne correspond à vos filtres</h3>
            <p className="text-sm text-slate-500 mt-2">
              Nous n'avons pas trouvé de chambre pour cette collection avec les critères sélectionnés. Vous pouvez
              réinitialiser vos filtres ou publier une annonce.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl bg-[#a4c639] text-white font-medium text-xs hover:bg-[#8aad2a] transition shadow-sm cursor-pointer"
              >
                Voir tous les biens de cette collection
              </button>
              <a
                href="#/publier"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
              >
                Publier une annonce
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ── AUTRES COLLECTIONS EN BAS ── */}
      <footer className="border-t border-slate-200/80 bg-white py-12 px-4 sm:px-6">
        <CollectionsSection
          title={
            <>
              Quelle autre <span style={{ color: '#ed563b' }}>chambre</span> recherchez-vous ?
            </>
          }
          subtitle="Explorez les différentes typologies de chambres disponibles autour des campus universitaires du Bénin"
        />
      </footer>
    </div>
  )
}
