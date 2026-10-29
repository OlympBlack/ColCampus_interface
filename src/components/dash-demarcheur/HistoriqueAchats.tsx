import React, { useState } from 'react';
import type { TransactionCredit } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TablePagination } from '../TablePagination';

interface HistoriqueAchatsProps {
    transactions: TransactionCredit[];
}

export const HistoriqueAchats: React.FC<HistoriqueAchatsProps> = ({ transactions }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    return (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Historique des transactions</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                            <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-slate-500">Date</th>
                            <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-slate-500">Type</th>
                            <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-slate-500">Description</th>
                            <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right">Montant</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-xs">
                                    Aucune transaction enregistrée.
                                </td>
                            </tr>
                        ) : transactions
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map(t => (
                            <tr key={t.id} className="hover:bg-slate-50/40 transition-colors">
                                <td className="px-4 py-2.5 text-xs text-slate-600">
                                    {format(new Date(t.created_at || new Date()), 'PPp', { locale: fr })}
                                </td>
                                <td className="px-4 py-2.5">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${t.type === 'ACHAT' ? 'bg-slate-100 text-slate-800' :
                                        t.type === 'GRATUIT' ? 'bg-emerald-50 text-emerald-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 text-xs text-slate-700 font-medium">
                                    {t.description}
                                </td>
                                <td className={`px-4 py-2.5 text-xs font-bold text-right ${t.montant > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                    {t.montant > 0 ? '+' : ''}{t.montant} cr.
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TablePagination
                currentPage={currentPage}
                totalItems={transactions.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};
