import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import type { Annonce, AnnouncementType } from '../types'
import { AnnonceCard } from './AnnonceCard'

import { BinomeCard } from './BinomeCard'

/* ─────────────────────────────────────────────────────────────
   Compatibilité des composants de cartes catégorisées :
   - Chambres & colocations : AnnonceCard (avec photos)
   - Recherche de binôme : BinomeCard (profil étudiant sans fausse photo)
   ───────────────────────────────────────────────────────────── */
export function DemarcheurLogementCard({ annonce }: { annonce: Annonce }) {
  return <AnnonceCard annonce={annonce} />
}

export function ColocationHoteCard({ annonce }: { annonce: Annonce }) {
  return <AnnonceCard annonce={annonce} />
}

export function RechercheBinomeCard({ annonce }: { annonce: Annonce }) {
  return <BinomeCard annonce={annonce} />
}

/* ─────────────────────────────────────────────────────────────
   4. LIGNE DÉFILABLE AVEC FLÈCHES POUR LA PAGE D'ACCUEIL
   ───────────────────────────────────────────────────────────── */
interface CategoryRowSectionProps {
  categoryType: AnnouncementType
  title: string
  subtitle: string
  categorySlug: string
  ctaText: string
  announcements: Annonce[]
}

export function CategoryRowSection({
  title,
  subtitle,
  categorySlug,
  ctaText,
  announcements,
}: CategoryRowSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Met à jour l'état activé/désactivé des boutons gauche/droite
  function checkScrollability() {
    const el = scrollRef.current
    if (!el) return
    const tolerance = 4
    setCanScrollLeft(el.scrollLeft > tolerance)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance)
  }

  useEffect(() => {
    checkScrollability()
    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', checkScrollability, { passive: true })
    window.addEventListener('resize', checkScrollability)

    return () => {
      el.removeEventListener('scroll', checkScrollability)
      window.removeEventListener('resize', checkScrollability)
    }
  }, [announcements])

  function scroll(direction: 'left' | 'right') {
    if (!scrollRef.current) return
    const offset = direction === 'left' ? -360 : 360
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  if (announcements.length === 0) {
    return null
  }

  return (
    <section className="category-row-section py-8 sm:py-10 border-b border-slate-100 last:border-b-0 px-1 sm:px-2">
      {/* En-tête de la section avec titre & sous-titre */}
      <div className="mb-5 text-left">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-normal">
          {subtitle}
        </p>
      </div>

      {/* Conteneur de la ligne avec boutons flottants à gauche et à droite */}
      <div className="relative">
        {/* Bouton fléché gauche (défile UNIQUEMENT vers la gauche) */}
        <button
          type="button"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200/90 text-slate-800 flex items-center justify-center transition-all ${
            canScrollLeft
              ? 'opacity-100 hover:text-slate-950 shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.22)] hover:scale-105 active:scale-95 cursor-pointer'
              : 'opacity-30 cursor-not-allowed shadow-none'
          }`}
          aria-label="Défiler vers la gauche"
          title="Défiler vers la gauche"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>

        {/* Ligne défilable d'annonces au format standard .service-item */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar py-2 px-1 snap-x"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {announcements.map((annonce) => (
            <div
              key={annonce.id}
              className="w-[300px] sm:w-[340px] md:w-[360px] shrink-0 snap-start flex flex-col"
            >
              <AnnonceCard annonce={annonce} />
            </div>
          ))}
        </div>

        {/* Bouton fléché droit (défile UNIQUEMENT vers la droite) */}
        <button
          type="button"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200/90 text-slate-800 flex items-center justify-center transition-all ${
            canScrollRight
              ? 'opacity-100 hover:text-slate-950 shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.22)] hover:scale-105 active:scale-95 cursor-pointer'
              : 'opacity-30 cursor-not-allowed shadow-none'
          }`}
          aria-label="Défiler vers la droite"
          title="Défiler vers la droite"
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </div>

      {/* Bouton CTA centré en bas de la ligne pour explorer toute la catégorie */}
      <div className="mt-6 text-center">
        <a
          href={`#/annonces/${categorySlug}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all group active:scale-98"
        >
          <span>{ctaText}</span>
          <ArrowRight size={14} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  )
}
