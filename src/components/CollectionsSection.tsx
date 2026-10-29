import { useMemo, type ReactNode } from 'react'
import { useCollections } from '../hooks/useCollections'
import { useAnnouncements } from '../hooks/useAnnouncements'
import type { Annonce, PropertyCollection } from '../types'

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

  // 1. Direct match sur le type de chambre (ex: CHAMBRE_SALON_ORDINAIRE === CHAMBRE_SALON_ORDINAIRE)
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

export function CollectionsSection({ title, subtitle }: { title?: ReactNode; subtitle?: string }) {
  const { collections } = useCollections()
  const { announcements } = useAnnouncements()

  const activeCollections = useMemo(() => {
    return collections.filter((c) => c.is_active !== false)
  }, [collections])

  // Compute live count per collection while respecting fallback counts
  const countsBySlug = useMemo(() => {
    const map: Record<string, number> = {}
    activeCollections.forEach((col) => {
      const liveMatches = announcements.filter((a) => matchesCollection(a, col)).length
      map[col.slug] = liveMatches > 0 ? liveMatches : (col.properties_count ?? col.fallback_count ?? col.fallbackCount ?? 0)
    })
    return map
  }, [activeCollections, announcements])

  function handleSelectCollection(collection: PropertyCollection) {
    window.location.hash = `#/collections/${collection.slug}`
  }

  return (
    <section className="collections-section py-8 sm:py-12 px-4 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
          {title ? (
            title
          ) : (
            <>
              Quelle <span style={{ color: '#ed563b' }}>chambre</span> recherchez-vous aujourd'hui ?
            </>
          )}
        </h2>
        <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-500 max-w-2xl mx-auto font-normal">
          {subtitle ?? 'Trouvez la chambre idéale sur votre campus, à Abomey-Calavi, Porto-Novo, Abomey ou Parakou, en explorant nos collections adaptées à votre budget étudiant.'}
        </p>
      </div>

      {/* ── Collections Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {activeCollections.map((col) => {
          const count = countsBySlug[col.slug] ?? col.fallbackCount ?? 0

          return (
            <article
              key={col.id}
              onClick={() => handleSelectCollection(col)}
              className="collection-card"
            >
              {/* Thumbnail */}
              <div className="collection-thumb">
                <img
                  src={col.image}
                  alt={col.title}
                  loading="lazy"
                />
              </div>

              {/* Text Info */}
              <div className="collection-info">
                <h3>{col.title}</h3>
                <p>
                  {count} {count > 1 ? 'Propriétés' : 'Propriété'}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
