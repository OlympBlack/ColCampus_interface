import type { UserRole } from '../types'

export function getDashboardPath(role?: UserRole | string | null) {
  if (role === 'admin') return '/dashboard/admin'
  if (role === 'demarcheur') return '/dashboard/demarcheur'
  if (role === 'boutique') return '/dashboard/boutique'
  return '/dashboard/etudiant'
}

export function getRoleLabel(role: UserRole) {
  if (role === 'admin') return 'Administrateur'
  if (role === 'demarcheur') return 'Démarcheur'
  if (role === 'boutique') return 'Boutique'
  return 'Étudiant'
}

export function getRoleDashboardTitle(role: UserRole) {
  if (role === 'admin') return 'Administration de la Plateforme'
  if (role === 'demarcheur') return 'Espace Démarcheur'
  if (role === 'boutique') return 'Espace Boutique'
  return 'Espace Étudiant & Colocation'
}
