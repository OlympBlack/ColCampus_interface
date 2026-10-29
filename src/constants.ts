import type { UiIconName } from './components/UiIcons'
import type { AnnouncementType, UserRole } from './types'

export type CategoryFilterValue = 'ALL' | AnnouncementType

export const SIGNATURE_NAME = 'GBASSI Jules-christ'
export const SIGNATURE_URL = 'https://juleschrist-portfolio.vercel.app/'

export const CATEGORY_OPTIONS = [
  { value: 'ALL', label: 'Toutes les annonces', description: 'Une vue globale des chambres et colocations.', icon: 'all' },
  { value: 'CHAMBRE_VIDE', label: 'Chambres disponibles', description: 'Des chambres et studios a louer rapidement.', icon: 'bed' },
  { value: 'PLACE_LIBRE_HOTE', label: 'Places en colocation', description: 'Des places libres chez un hote deja installe.', icon: 'users' },
  { value: 'RECHERCHE_BINOME', label: 'Recherche de colocataire', description: 'Des profils qui cherchent un binome pour louer ensemble.', icon: 'search-user' },
] as const satisfies ReadonlyArray<{ value: CategoryFilterValue; label: string; description: string; icon: UiIconName }>

export interface RoomTypeOption {
  value: string
  label: string
  badgeLabel: string
  statusLabel: string
  description: string
  priceRange: string
  image: string
}

export const ROOM_TYPE_OPTIONS: readonly RoomTypeOption[] = [
  {
    value: 'ENTREE_COUCHEE_ORDINAIRE',
    label: 'Entrée couchée ordinaire',
    badgeLabel: 'Chambre disponible',
    statusLabel: 'Disponible',
    description: 'Chambre simple accessible avec sanitaires externes',
    priceRange: 'Dès 15 000 FCFA/mois',
    image: '/assets/images/categories/entree_couchee_ordinaire.jpg',
  },
  {
    value: 'ENTREE_COUCHEE_SANITAIRE',
    label: 'Entrée couchée sanitaire',
    badgeLabel: 'Chambre disponible',
    statusLabel: 'Disponible',
    description: 'Chambre autonome avec douche et WC intégrés',
    priceRange: 'Dès 25 000 FCFA/mois',
    image: '/assets/images/categories/entree_couchee_sanitaire.jpg',
  },
  {
    value: 'CHAMBRE_SALON_ORDINAIRE',
    label: 'Chambre salon ordinaire',
    badgeLabel: 'Chambre & Salon',
    statusLabel: 'Disponible',
    description: 'Chambre séparée et séjour convivial, sanitaire externe',
    priceRange: 'Dès 35 000 FCFA/mois',
    image: '/assets/images/categories/chambre_salon_ordinaire.jpg',
  },
  {
    value: 'CHAMBRE_SALON_SANITAIRE',
    label: 'Chambre salon sanitaire',
    badgeLabel: 'Chambre & Salon',
    statusLabel: 'Disponible',
    description: 'Appartement F2 avec sanitaires privés et cuisine',
    priceRange: 'Dès 45 000 FCFA/mois',
    image: '/assets/images/categories/chambre_salon_sanitaire.jpg',
  },
  {
    value: 'DEUX_CHAMBRES_SALON',
    label: '2 Chambres salon sanitaire',
    badgeLabel: 'Grande chambre',
    statusLabel: 'Disponible',
    description: '2 chambres + salon avec sanitaires, idéal pour binôme',
    priceRange: 'Dès 65 000 FCFA/mois',
    image: '/assets/images/categories/deux_chambres_salon.jpg',
  },
  {
    value: 'STUDIO_MEUBLE',
    label: 'Studio meublé',
    badgeLabel: 'Studio meublé',
    statusLabel: 'Disponible',
    description: 'Équipé prêt à vivre, lit, bureau et kitchenette',
    priceRange: 'Dès 50 000 FCFA/mois',
    image: '/assets/images/categories/studio_meuble.jpg',
  },
  {
    value: 'PLACE_COLOCATION',
    label: 'Place en colocation',
    badgeLabel: 'Place en colocation',
    statusLabel: 'Disponible',
    description: 'Place libre dans une chambre ou appartement partagé',
    priceRange: 'Dès 12 000 FCFA/mois',
    image: '/assets/images/categories/place_colocation.jpg',
  },
  {
    value: 'APPARTEMENT',
    label: 'Appartement / Villa',
    badgeLabel: 'Chambre spacieuse / Logement',
    statusLabel: 'Disponible',
    description: 'Chambre spacieuse tout confort dans zone sécurisée',
    priceRange: 'Dès 80 000 FCFA/mois',
    image: '/assets/images/categories/appartement_villa.jpg',
  },
] as const

export interface PropertyCollection {
  id: string
  slug: string
  title: string
  roomTypeValue: string
  fallbackCount: number
  priceRange: string
  image: string
  heroBanner: string
  description: string
  heroDescription: string
  features: string[]
  idealFor: string
  avgRent: string
}

export const PROPERTY_COLLECTIONS: readonly PropertyCollection[] = [
  {
    id: 'entree-couchee-ordinaire',
    slug: 'entree-couchee-ordinaire',
    title: 'Entrée couchée ordinaire',
    roomTypeValue: 'ENTREE_COUCHEE_ORDINAIRE',
    fallbackCount: 38,
    priceRange: 'Dès 15 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    description: 'Chambre simple accessible avec sanitaires externes',
    heroDescription: 'Une option économique très prisée des étudiants, sur tous les campus du Bénin. Chambre simple et aérée permettant de se loger à petit prix tout en restant proche de son campus.',
    features: ['Loyer très abordable', 'Proximité immédiate du campus', 'Cour sécurisée', 'Compteur conventionnel / carte'],
    idealFor: 'Étudiants L1 / L2 à budget optimisé',
    avgRent: '15 000 - 22 000 FCFA',
  },
  {
    id: 'entree-couchee-sanitaire',
    slug: 'entree-couchee-sanitaire',
    title: 'Entrée couchée sanitaire',
    roomTypeValue: 'ENTREE_COUCHEE_SANITAIRE',
    fallbackCount: 54,
    priceRange: 'Dès 25 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
    description: 'Chambre autonome avec douche et WC intégrés',
    heroDescription: 'Le standard le plus recherché par les étudiants. Bénéficiez d’une intimité et d’un confort total avec vos sanitaires privés directement à l’intérieur de votre chambre.',
    features: ['Douche & WC internes', 'Autonomie & Intimité totale', 'Compteur prépayé SBEE', 'Forage ou SONEB'],
    idealFor: 'Étudiants et jeunes diplômés',
    avgRent: '25 000 - 35 000 FCFA',
  },
  {
    id: 'chambre-salon-ordinaire',
    slug: 'chambre-salon-ordinaire',
    title: 'Chambre salon ordinaire',
    roomTypeValue: 'CHAMBRE_SALON_ORDINAIRE',
    fallbackCount: 26,
    priceRange: 'Dès 35 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    description: 'Chambre séparée et salon convivial, sanitaire externe',
    heroDescription: 'Deux pièces distinctes qui vous permettent de séparer votre espace nuit de votre espace travail et salon de réception, avec sanitaires externes bien entretenus.',
    features: ['Salon spacieux', 'Chambre indépendante', 'Environnement calme', 'Terrasse privative'],
    idealFor: 'Étudiants en fin de cycle, couples étudiants',
    avgRent: '35 000 - 45 000 FCFA',
  },
  {
    id: 'chambre-salon-sanitaire',
    slug: 'chambre-salon-sanitaire',
    title: 'Chambre salon sanitaire',
    roomTypeValue: 'CHAMBRE_SALON_SANITAIRE',
    fallbackCount: 47,
    priceRange: 'Dès 45 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
    description: 'Appartement F2 avec salon, cuisine et sanitaires privés',
    heroDescription: 'Un vrai chez-soi avec un salon accueillant, une chambre intime, une salle d’eau complète et un coin cuisine dédié. Idéal pour un cadre d’études hautement confortable.',
    features: ['Sanitaires privés', 'Coin cuisine carrelé', 'Accès facile voie pavée', 'Eau courante en continu'],
    idealFor: 'Master, doctorants, professionnels',
    avgRent: '45 000 - 60 000 FCFA',
  },
  {
    id: 'deux-chambres-salon',
    slug: 'deux-chambres-salon',
    title: '2 Chambres salon sanitaire',
    roomTypeValue: 'DEUX_CHAMBRES_SALON',
    fallbackCount: 29,
    priceRange: 'Dès 65 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80',
    description: 'Grande chambre / logement 3 pièces avec sanitaires et commodités',
    heroDescription: 'Grand ensemble composé de 2 chambres et d’un vaste salon. Parfait pour mutualiser les frais de loyer avec un colocataire ou un ami de promotion.',
    features: ['2 chambres séparées', 'Grand séjour lumineux', 'Garage / parking moto', 'Balcon ou véranda'],
    idealFor: 'Binôme de colocataires, petites familles',
    avgRent: '65 000 - 90 000 FCFA',
  },
  {
    id: 'studio-meuble',
    slug: 'studio-meuble',
    title: 'Studio meublé',
    roomTypeValue: 'STUDIO_MEUBLE',
    fallbackCount: 33,
    priceRange: 'Dès 50 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    description: 'Équipé prêt à vivre (lit, bureau, kitchenette, wifi)',
    heroDescription: 'Posez simplement vos valises ! Studio entièrement équipé avec literie confortable, bureau de travail, ustensiles et appareils électroménagers essentiels.',
    features: ['Tout équipé prêt à habiter', 'Connexion Wifi', 'Bureau de travail', 'Nettoyage & entretien inclus'],
    idealFor: 'Étudiants étrangers, stagiaires, résidences temporaires',
    avgRent: '50 000 - 85 000 FCFA',
  },
  {
    id: 'place-en-colocation',
    slug: 'place-en-colocation',
    title: 'Place en colocation',
    roomTypeValue: 'PLACE_COLOCATION',
    fallbackCount: 41,
    priceRange: 'Dès 12 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80',
    description: 'Place libre dans une chambre ou appartement partagé',
    heroDescription: 'Trouvez une chambre chaleureuse et divisez votre loyer et vos factures. Rejoignez des étudiants sérieux pour partager un quotidien studieux et solidaire.',
    features: ['Loyer très réduit', 'Factures divisées', 'Esprit d’entraide', 'Entièrement compatible bourses'],
    idealFor: 'Étudiants cherchant à réduire leurs charges',
    avgRent: '12 000 - 20 000 FCFA',
  },
  {
    id: 'appartement-villa',
    slug: 'appartement-villa',
    title: 'Appartement / Villa',
    roomTypeValue: 'APPARTEMENT',
    fallbackCount: 22,
    priceRange: 'Dès 80 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
    description: 'Chambre spacieuse tout confort dans zone sécurisée',
    heroDescription: 'Des biens immobiliers de qualité supérieure, situés dans des quartiers résidentiels calmes proches des campus d’Abomey-Calavi, Porto-Novo, Abomey et Parakou, avec finitions modernes et gardiennage.',
    features: ['Finition haut standing', 'Gardiennage 24h/24', 'Parking sécurisé', 'Espace vert / cour spacieuse'],
    idealFor: 'Cadres, familles, regroupements d’étudiants',
    avgRent: '80 000 - 150 000 FCFA',
  },
  {
    id: 'residences-universitaires',
    slug: 'residences-universitaires',
    title: 'Résidences universitaires',
    roomTypeValue: 'RESIDENCE',
    fallbackCount: 35,
    priceRange: 'Dès 20 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80',
    description: 'Mini-cités d’étudiants avec forages et cadre studieux',
    heroDescription: 'Immeubles réservés aux étudiants universitaires. Bénéficiez d’un cadre d’études paisible, d’une entraide académique directe et de forages d’eau garantis.',
    features: ['Cadre 100% étudiant', 'Groupes de travail', 'Forage d’eau sur place', 'Ambiance studieuse'],
    idealFor: 'Tous les étudiants des campus du Bénin',
    avgRent: '20 000 - 32 000 FCFA',
  },
  {
    id: 'chambres-climatisees',
    slug: 'chambres-climatisees',
    title: 'Chambres climatisées',
    roomTypeValue: 'CLIMATISEE',
    fallbackCount: 18,
    priceRange: 'Dès 40 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80',
    description: 'Fraîcheur et confort thermique garanti toute l’année',
    heroDescription: 'Restez au frais pour vos sessions de révisions intensives durant les saisons chaudes. Chambres isolées et climatisées avec installations électriques fiables.',
    features: ['Climatiseur neuf installé', 'Isolation phonique', 'Compteur prépayé', 'Environnement premium'],
    idealFor: 'Étudiants exigeants et travailleurs en télétravail',
    avgRent: '40 000 - 65 000 FCFA',
  },
  {
    id: 'proche-campus',
    slug: 'proche-campus',
    title: 'Chambres proches campus',
    roomTypeValue: 'PROCHE_CAMPUS',
    fallbackCount: 62,
    priceRange: 'Dès 15 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80',
    description: 'Moins de 5 min à pied des portails de votre campus',
    heroDescription: 'Zéro franc de frais de zem (taxi-moto) pour aller en amphi ! Chambres idéalement positionnées à quelques pas des entrées principales de l’université.',
    features: ['0 FCFA de transport quotidien', 'Accès direct aux amphis', 'Rentrée tardive en toute sécurité', 'Zone vivante et commerçante'],
    idealFor: 'Étudiants avec cours réguliers matin et soir',
    avgRent: '18 000 - 35 000 FCFA',
  },
  {
    id: 'concessions-et-maisons',
    slug: 'concessions-et-maisons',
    title: 'Concessions & Maisons',
    roomTypeValue: 'CONCESSION',
    fallbackCount: 27,
    priceRange: 'Dès 50 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    heroBanner: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    description: 'Cour fermée, garage moto sécurisé et calme absolu',
    heroDescription: 'Maisons clôturées offrant une cour extérieure aérée, parking sécurisé pour vos deux-roues et tranquillité dans les quartiers calmes de la commune.',
    features: ['Cour clôturée avec portail', 'Garage moto sécurisé', 'Espace extérieur aéré', 'Calme et sécurité'],
    idealFor: 'Colocations d’amis, passionnés d’espaces calmes',
    avgRent: '50 000 - 80 000 FCFA',
  },
] as const

// Fallback multi-campus utilisé uniquement lorsque l'API découpage est indisponible.
// Les quartiers réels sont chargés dynamiquement via /quartiers (filtrables par université).
export const QUARTIER_OPTIONS = [
  // UAC — Abomey-Calavi
  'Zogbadje',
  'Tankpe',
  'Togoudo',
  'Calavi-Bas',
  'Arconville',
  'Kpota',
  // Cotonou (facultés, écoles, FSS, ENEAM)
  'Cadjehoun',
  'Akpakpa',
  'Fidjrosse',
  'Menontin',
  'Gbegamey',
  'Agla',
  // UNA — Porto-Novo
  'Akpassa Odo Oba',
  'Djegbe',
  'Ouando',
  'Adjegounle',
  // UNSTIM — Abomey
  'Akouessa',
  'Dokon',
  'Sonou Akouta',
  // UP — Parakou
  'Albarika',
  'Bakinkoura',
  'Banikanni-Douwerou',
  'Zongo',
]

export const NIVEAU_OPTIONS = ['L1', 'L2', 'L3', 'M1', 'M2'] as const

export const SEXE_OPTIONS = ['M', 'F'] as const

export const STUDENT_PREFERENCE_OPTIONS = [
  'Non-fumeur',
  'Calme',
  'Travailleur',
  'Social',
  'Sportif',
  'Cuisinier',
] as const

export const KYC_DOCUMENT_OPTIONS = [
  { value: 'CARTE_ETUDIANT', label: 'Carte etudiant' },
  { value: 'CIP', label: 'CIP' },
  { value: 'IFU', label: 'IFU' },
  { value: 'RCCM', label: 'RCCM' },
] as const

export const ROLE_OPTIONS = [
  { value: 'etudiant', label: 'Etudiant', description: 'Trouver une chambre, une place libre ou un binome.' },
] as const satisfies ReadonlyArray<{ value: UserRole; label: string; description: string }>
