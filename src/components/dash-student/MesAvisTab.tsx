import { useMemo, useState } from 'react'
import type { AuthSession, Avis, AvisDraft } from '../../types'
import { deleteAvis, updateAvis } from '../../services/api'
import { useMyAvis } from '../../hooks/useAvis'
import { formatPrice, formatRoomType } from '../../utils/format'
import { AvisFormModal } from '../AvisFormModal'
import { UiIcon } from '../UiIcons'
import type { ToastDraft } from '../ToastViewport'

interface MesAvisTabProps {
  session: AuthSession
  onToast: (toast: ToastDraft) => void
}

const STATUS_STYLES: Record<Avis['statut'], { label: string; className: string }> = {
  ouverte: { label: 'Ouverte', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pourvue: { label: 'Pourvue', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  archivee: { label: 'Archivée', className: 'bg-amber-50 text-amber-700 border-amber-200' },
}

function toDraft(avis: Avis, overrides: Partial<AvisDraft> & { statut?: Avis['statut'] } = {}) {
  const base: AvisDraft = {
    universite_id: avis.universite_id ?? undefined,
    quartier: avis.quartier,
    type_chambre: avis.type_chambre ?? undefined,
    nombre_places: avis.nombre_places ?? undefined,
    budget_min: avis.budget_min ?? undefined,
    budget_max: avis.budget_max,
    date_souhaitee: avis.date_souhaitee ?? undefined,
    description: avis.description,
  }

  return { ...base, ...overrides }
}

function formatDate(value: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function MesAvisTab({ session, onToast }: MesAvisTabProps) {
  const { myAvis, openAvis, isLoading, reload } = useMyAvis(session)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Avis | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)

  const counts = useMemo(
    () => ({
      total: myAvis.length,
      ouvertes: myAvis.filter((item) => item.statut === 'ouverte').length,
      pourvues: myAvis.filter((item) => item.statut === 'pourvue').length,
    }),
    [myAvis]
  )

  function handleCreate() {
    setEditing(openAvis)
    setIsFormOpen(true)
  }

  function handleEdit(avis: Avis) {
    setEditing(avis)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setIsFormOpen(false)
    setEditing(null)
  }

  async function handleStatut(avis: Avis) {
    const nextStatut = avis.statut === 'ouverte' ? 'pourvue' : 'ouverte'
    setPendingId(avis.id)

    try {
      await updateAvis(session.token, avis.id, toDraft(avis, { statut: nextStatut }))
      onToast({
        tone: 'success',
        title: nextStatut === 'pourvue' ? 'Avis clôturé' : 'Avis réouvert',
        message:
          nextStatut === 'pourvue'
            ? 'Votre recherche est marquée comme pourvue et n’apparaît plus dans la liste publique.'
            : 'Votre recherche est de nouveau visible par les démarcheurs.',
      })
      reload()
    } catch (err: any) {
      onToast({
        tone: 'error',
        title: 'Mise à jour impossible',
        message: err?.payload?.message || err?.message || 'Impossible de mettre à jour votre avis.',
      })
    } finally {
      setPendingId(null)
    }
  }

  async function handleDelete(avis: Avis) {
    const confirmed = window.confirm('Supprimer définitivement cet avis et les discussions associées ?')
    if (!confirmed) return

    setPendingId(avis.id)

    try {
      await deleteAvis(session.token, avis.id)
      onToast({ tone: 'success', title: 'Avis supprimé', message: 'Votre avis a bien été retiré.' })
      reload()
    } catch (err: any) {
      onToast({
        tone: 'error',
        title: 'Suppression impossible',
        message: err?.payload?.message || err?.message || "Impossible de supprimer l'avis.",
      })
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Mes avis de recherche</h2>
          <p className="mt-1 text-xs text-slate-500">
            Publiez votre recherche de chambre, modifiez vos critères ou clôturez-la une fois votre logement trouvé.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#/avis"
            className="app-button app-button--outline app-button--sm"
            style={{ textDecoration: 'none' }}
          >
            Voir la liste publique
          </a>
          <button type="button" onClick={handleCreate} className="app-button app-button--sm">
            <UiIcon name="search-user" />
            {openAvis ? "Modifier l'avis ouvert" : 'Publier un avis'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total</div>
          <div className="mt-1 text-xl font-extrabold text-slate-900">{counts.total}</div>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ouverts</div>
          <div className="mt-1 text-xl font-extrabold text-emerald-600">{counts.ouvertes}</div>
        </div>
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pourvus</div>
          <div className="mt-1 text-xl font-extrabold text-slate-700">{counts.pourvues}</div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200/90 bg-white p-8 text-center text-sm text-slate-500">
          Chargement de vos avis…
        </div>
      ) : myAvis.length === 0 ? (
        <div className="rounded-xl border border-slate-200/90 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#f2f7e6] text-[#6f8d21]">
            <UiIcon name="search-user" className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Vous n'avez pas encore d'avis</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
            Décrivez la chambre que vous cherchez : les démarcheurs vérifiés vous contacteront via la messagerie sécurisée.
          </p>
          <button type="button" onClick={handleCreate} className="app-button app-button--sm mt-4">
            Publier mon premier avis
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {myAvis.map((avis) => {
            const status = STATUS_STYLES[avis.statut] ?? STATUS_STYLES.ouverte
            const isPending = pendingId === avis.id

            return (
              <article
                key={avis.id}
                className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="text-[11px] text-slate-400">Publié le {formatDate(avis.created_at)}</span>
                    </div>
                    <h3 className="mt-2 flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      <span className="text-[#a4c639]">
                        <UiIcon name="map-pin" />
                      </span>
                      {avis.quartier}
                      {avis.universite?.code ? (
                        <span className="text-xs font-medium text-slate-500">· {avis.universite.code}</span>
                      ) : null}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">{avis.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>{formatRoomType(avis.type_chambre) || 'Logement'}</span>
                      {avis.type_chambre === 'PLACE_COLOCATION' && avis.nombre_places ? (
                        <span>{avis.nombre_places} place{avis.nombre_places > 1 ? 's' : ''}</span>
                      ) : null}
                      <span className="font-semibold text-slate-900">
                        {avis.budget_min ? `${formatPrice(avis.budget_min)} - ` : ''}
                        {formatPrice(avis.budget_max)} / mois
                      </span>
                      {avis.date_souhaitee ? <span>Dès le {formatDate(avis.date_souhaitee)}</span> : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(avis)}
                      disabled={isPending}
                      className="app-button app-button--outline app-button--sm"
                    >
                      <UiIcon name="edit" />
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatut(avis)}
                      disabled={isPending}
                      className="app-button app-button--outline app-button--sm"
                    >
                      <UiIcon name={avis.statut === 'ouverte' ? 'check' : 'refresh'} />
                      {avis.statut === 'ouverte' ? 'Clôturer' : 'Réouvrir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(avis)}
                      disabled={isPending}
                      className="app-button app-button--outline app-button--sm text-rose-600"
                      title="Supprimer cet avis"
                    >
                      <UiIcon name="trash" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <AvisFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        session={session}
        initial={editing}
        onSaved={() => reload()}
        onToast={onToast}
      />
    </div>
  )
}
