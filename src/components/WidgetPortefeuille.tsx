import { useState } from 'react'
import { CreditCard, History, PlusCircle } from 'lucide-react'
import type { Portefeuille, TransactionCredit } from '../types'

interface WidgetPortefeuilleProps {
  portefeuille: Portefeuille
  onBuyMore: () => void
  transactions?: TransactionCredit[]
}

const TRANSACTION_BADGE: Record<TransactionCredit['type'], string> = {
  GRATUIT: 'app-badge app-badge--muted',
  ACHAT: 'app-badge app-badge--success',
  UTILISATION: 'app-badge app-badge--warning',
  REMBOURSEMENT: 'app-badge app-badge--muted',
}

const TRANSACTION_LABEL: Record<TransactionCredit['type'], string> = {
  GRATUIT: 'Gratuit',
  ACHAT: 'Achat',
  UTILISATION: 'Utilisation',
  REMBOURSEMENT: 'Remboursement',
}

export function WidgetPortefeuille({ portefeuille, onBuyMore, transactions }: WidgetPortefeuilleProps) {
  const [showHistory, setShowHistory] = useState(false)

  if (!portefeuille) return null

  return (
    <section className="app-panel">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <span
            className="d-inline-grid"
            style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--primary-pale)', color: 'var(--primary)', placeItems: 'center' }}
          >
            <CreditCard size={20} />
          </span>
          <div>
            <h3 className="h6 fw-bold mb-0">Crédits de Publication</h3>
            <p className="mb-0" style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              Gérez votre quota d'annonces
            </p>
          </div>
        </div>
        <button type="button" className="button button--primary" onClick={onBuyMore}>
          <PlusCircle size={16} />
          Acheter
        </button>
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <div className="app-panel app-panel--muted h-100" style={{ padding: 16 }}>
            <p className="mb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--muted)' }}>
              Restants
            </p>
            <p className="mb-0 fw-bold" style={{ fontSize: '1.9rem', color: 'var(--text)' }}>
              {portefeuille.credits_restants}
            </p>
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="app-panel app-panel--muted h-100" style={{ padding: 16 }}>
            <p className="mb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--muted)' }}>
              Utilisés
            </p>
            <p className="mb-0 fw-bold" style={{ fontSize: '1.9rem', color: 'var(--muted)' }}>
              {portefeuille.credits_utilises}
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pt-3" style={{ borderTop: '1px solid #f0f0f0', fontSize: '0.82rem' }}>
        <div className="d-flex flex-column gap-1">
          <span style={{ color: 'var(--muted)' }}>
            Gratuits : <b>{portefeuille.credits_gratuits}</b>
          </span>
          <span style={{ color: 'var(--muted)' }}>
            Achetés : <b>{portefeuille.credits_achetes}</b>
          </span>
        </div>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => setShowHistory((value) => !value)}
          aria-expanded={showHistory}
        >
          <History size={14} />
          {showHistory ? 'Masquer historique' : 'Historique'}
        </button>
      </div>

      {showHistory && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #f0f0f0' }}>
          {transactions && transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th className="text-end">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <span className={TRANSACTION_BADGE[transaction.type]}>
                          {TRANSACTION_LABEL[transaction.type]}
                        </span>
                      </td>
                      <td>{transaction.description ?? '—'}</td>
                      <td className={`text-end fw-bold ${transaction.montant > 0 ? 'text-success' : ''}`}>
                        {transaction.montant > 0 ? `+${transaction.montant}` : transaction.montant} cr.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mb-0 text-center" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              Aucune opération enregistrée pour le moment.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
