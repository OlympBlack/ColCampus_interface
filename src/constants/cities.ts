import type { Annonce } from '../types'

export interface BeninCity {
  slug: string
  name: string
  universiteCode: string
  campusName: string
  universiteFull: string
  description: string
  image: string
  fallbackCount: number
  startingPrice: string
  popularQuartiers: string[]
}

export const BENIN_CITIES: readonly BeninCity[] = [
  {
    slug: 'abomey-calavi',
    name: 'Abomey-Calavi',
    universiteCode: 'UAC',
    campusName: 'Campus UAC',
    universiteFull: "Université d'Abomey-Calavi",
    description: 'Le premier pôle universitaire du Bénin. Grand choix de chambres, studios et colocations à quelques minutes des amphis.',
    image: '/assets/images/les%20portails%20campus/portail_uac.png',
    fallbackCount: 12,
    startingPrice: '14 000 FCFA',
    popularQuartiers: ['Zogbadje', 'Tankpe', 'Togoudo', 'Arconville', 'Bidossessi', 'Houeto', 'Djekpota'],
  },
  {
    slug: 'cotonou',
    name: 'Cotonou',
    universiteCode: 'COTONOU',
    campusName: 'Facultés & Grandes Écoles',
    universiteFull: 'Grandes Écoles & Facultés (ENEAM, FSS, etc.)',
    description: 'La métropole économique : logements modernes proches des facultés médicales, écoles de gestion et instituts.',
    image: '/assets/images/les%20portails%20campus/portail_cotonou.jpeg',
    fallbackCount: 8,
    startingPrice: '16 000 FCFA',
    popularQuartiers: ['Cadjehoun', 'Gbegamey', 'Menontin', 'Akpakpa', 'Agla', 'Fidjrosse'],
  },
  {
    slug: 'parakou',
    name: 'Parakou',
    universiteCode: 'UP',
    campusName: 'Campus UP',
    universiteFull: 'Université de Parakou',
    description: 'Le carrefour du Septentrion. Logements abordables et cadre de vie convivial pour les étudiants de l’UP.',
    image: '/assets/images/les%20portails%20campus/portail_up.jpeg',
    fallbackCount: 6,
    startingPrice: '12 000 FCFA',
    popularQuartiers: ['Albarika', 'Banikanni', 'Bakinkoura', 'Zongo'],
  },
  {
    slug: 'abomey',
    name: 'Abomey',
    universiteCode: 'UNSTIM',
    campusName: 'Campus UNSTIM',
    universiteFull: 'Université Nationale des Sciences, Technologies, Ingénierie et Mathématiques',
    description: 'Cité royale et universitaire dédiée aux sciences, technologies et à l’ingénierie au cœur du Zou.',
    image: '/assets/images/les%20portails%20campus/portail_unstim.jpg',
    fallbackCount: 5,
    startingPrice: '12 000 FCFA',
    popularQuartiers: ['Djegbe', 'Agblome', 'Dokon', 'Akouessa'],
  },
  {
    slug: 'porto-novo',
    name: 'Porto-Novo',
    universiteCode: 'UNA',
    campusName: 'Campus UNA',
    universiteFull: "Université Nationale d'Agriculture",
    description: 'Capitale administrative et haut lieu agronomique. Quartiers calmes et paisibles propices aux études supérieures.',
    image: '/assets/images/les%20portails%20campus/portail_una.jpeg',
    fallbackCount: 5,
    startingPrice: '15 000 FCFA',
    popularQuartiers: ['Adjina Nord', 'Oganla Nord', 'Ouando', 'Djegbe', 'Akpassa Odo Oba'],
  },
]

export function normalizeStr(str?: string | null): string {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function matchesCity(annonce: Annonce, city: BeninCity): boolean {
  // 1. Match direct sur le code universite
  if (annonce.universite?.code && city.universiteCode) {
    if (annonce.universite.code.toUpperCase() === city.universiteCode.toUpperCase()) {
      return true
    }
  }

  // 2. Match direct sur universite.ville
  if (annonce.universite?.ville) {
    const v = normalizeStr(annonce.universite.ville)
    const target = normalizeStr(city.name)
    if (v === target) return true
  }

  // 3. Match sur les quartiers phares de la ville
  if (annonce.quartier) {
    const qNorm = normalizeStr(annonce.quartier)
    if (city.popularQuartiers.some((q) => normalizeStr(q) === qNorm)) {
      return true
    }
  }

  // 4. Match textuel sur titre ou description ou quartier
  const full = normalizeStr(`${annonce.titre} ${annonce.description} ${annonce.quartier}`)

  if (city.slug === 'abomey') {
    if (full.includes('calavi')) return false
    return full.includes('abomey') || full.includes('unstim')
  }

  if (city.slug === 'abomey-calavi') {
    return full.includes('calavi') || full.includes('uac') || full.includes('zogbadje') || full.includes('tankpe')
  }

  if (city.slug === 'cotonou') {
    return full.includes('cotonou') || full.includes('eneam') || full.includes('fss')
  }

  if (city.slug === 'parakou') {
    return full.includes('parakou') || full.includes('albarika') || full.includes('banikanni') || full.includes('up')
  }

  if (city.slug === 'porto-novo') {
    return full.includes('porto novo') || full.includes('una') || full.includes('ouando') || full.includes('oganla')
  }

  return false
}
