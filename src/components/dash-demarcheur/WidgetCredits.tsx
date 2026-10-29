import React from 'react';
import { CreditCard, History, PlusCircle } from 'lucide-react';
import type { Portefeuille, TransactionCredit } from '../../types';

interface WidgetCreditsProps {
    portefeuille: Portefeuille & { transactions_recentes: TransactionCredit[] };
    onBuyMore: () => void;
    onViewHistory: () => void;
}

export const WidgetCredits: React.FC<WidgetCreditsProps> = ({ portefeuille, onBuyMore, onViewHistory }) => {
    if (!portefeuille) return null;

    return (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 p-4 sm:p-5 transition-all">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                        <CreditCard size={16} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-900 text-sm">Portefeuille Crédits</h3>
                        <p className="text-[11px] text-slate-500">Solde disponible</p>
                    </div>
                </div>
                <button
                    onClick={onBuyMore}
                    className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                >
                    <PlusCircle size={13} />
                    Acheter
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-blue-900 text-white">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">Restants</p>
                    <div className="flex items-end gap-1">
                        <span className="text-2xl font-black">{portefeuille.credits_restants}</span>
                        <span className="text-[11px] text-slate-400 mb-1">créds.</span>
                    </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">Dépensés</p>
                    <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-slate-700">{portefeuille.credits_utilises}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs px-0.5">
                    <span className="text-slate-500 font-medium">Historique récent</span>
                    <button onClick={onViewHistory} className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 text-[11px]">
                        Tout voir <History size={11} />
                    </button>
                </div>
                <div className="space-y-1.5">
                    {portefeuille.transactions_recentes.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic text-center py-2">Aucune transaction</p>
                    ) : portefeuille.transactions_recentes.slice(0, 3).map(t => (
                        <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-slate-800 truncate">{t.description}</p>
                                <p className="text-[9px] text-slate-400 uppercase font-bold">{t.type}</p>
                            </div>
                            <span className={`text-[11px] font-bold ${t.montant > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                {t.montant > 0 ? '+' : ''}{t.montant}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] px-0.5 text-slate-400 font-semibold uppercase tracking-wider">
                <span>Gratuits: <b className="text-slate-700">{portefeuille.credits_gratuits}</b></span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>Achetés: <b className="text-slate-700">{portefeuille.credits_achetes}</b></span>
            </div>
        </div>
    );
};
