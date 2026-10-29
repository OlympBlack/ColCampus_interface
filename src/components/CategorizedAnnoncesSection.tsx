import { useMemo } from 'react'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { CategoryRowSection } from './AnnonceCategorizedCards'

export function CategorizedAnnoncesSection() {
  const { announcements, isLoading } = useAnnouncements()

  const demarcheurListings = useMemo(() => {
    return announcements.filter((a) => a.type_annonce === 'CHAMBRE_VIDE')
  }, [announcements])

  const colocationListings = useMemo(() => {
    return announcements.filter((a) => a.type_annonce === 'PLACE_LIBRE_HOTE')
  }, [announcements])

  const binomeListings = useMemo(() => {
    return announcements.filter((a) => a.type_annonce === 'RECHERCHE_BINOME')
  }, [announcements])

  if (isLoading && announcements.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 text-sm">
        Chargement des annonces...
      </div>
    )
  }

  return (
    <div className="categorized-annonces-sections space-y-4 sm:space-y-6 pt-4">
      {/* ── 1. CHAMBRES PROPOSÉES PAR DÉMARCHEURS & PROPRIÉTAIRES ── */}
      <CategoryRowSection
        categoryType="CHAMBRE_VIDE"
        title="Chambres vérifiées disponibles à louer"
        subtitle="Chambres, studios et appartements proposés par les démarcheurs certifiés sur les campus du Bénin."
        categorySlug="logements-demarcheurs"
        ctaText="Explorer toutes les chambres à louer"
        announcements={demarcheurListings}
      />

      {/* ── 2. ÉTUDIANT AYANT DÉJÀ UNE CHAMBRE ET CHERCHANT UN COLOCATAIRE ── */}
      <CategoryRowSection
        categoryType="PLACE_LIBRE_HOTE"
        title="Chambres déjà louées cherchant un colocataire"
        subtitle="Rejoignez un étudiant déjà installé dans sa chambre pour partager l’espace et les frais."
        categorySlug="places-colocation"
        ctaText="Voir toutes les places en colocation"
        announcements={colocationListings}
      />

      {/* ── 3. ÉTUDIANT SANS CHAMBRE CHERCHANT UN BINÔME POUR LOUER ENSEMBLE ── */}
      <CategoryRowSection
        categoryType="RECHERCHE_BINOME"
        title="Étudiants en quête de binôme pour louer ensemble"
        subtitle="Associez-vous avec un autre étudiant pour prospecter et prendre une chambre à deux."
        categorySlug="recherches-binomes"
        ctaText="Voir toutes les demandes de binômes"
        announcements={binomeListings}
      />
    </div>
  )
}
