import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TablePaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
  className?: string
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  className = '',
}) => {
  if (totalItems <= 0) return null

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-600 ${className}`}
    >
      <div className="font-medium">
        Affichage de <span className="font-semibold text-slate-900">{startItem}</span> à{' '}
        <span className="font-semibold text-slate-900">{endItem}</span> sur{' '}
        <span className="font-semibold text-slate-900">{totalItems}</span> résultat{totalItems > 1 ? 's' : ''}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Page précédente"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1.5 py-1 text-slate-400">
                  ...
                </span>
              )
            }
            const pageNum = page as number
            const isActive = pageNum === currentPage
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[28px] h-7 px-1 flex items-center justify-center rounded-md text-xs font-semibold border transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Page suivante"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
