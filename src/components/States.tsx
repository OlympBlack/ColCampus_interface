export function LoadingState({ cards = 6 }: { cards?: number }) {
  return (
    <div className="listing-grid" aria-busy="true">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="loading-card">
          <div className="loading-card__media" />
          <div className="loading-card__line loading-card__line--wide" />
          <div className="loading-card__line" />
          <div className="loading-card__line loading-card__line--short" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="empty-state">
      <strong>Aucune annonce ne correspond a vos filtres.</strong>
      <p>Elargissez la zone ou le budget pour voir d'autres resultats.</p>
      <button type="button" className="button button--primary button--fit" onClick={onReset}>
        Reinitialiser les filtres
      </button>
    </div>
  )
}
