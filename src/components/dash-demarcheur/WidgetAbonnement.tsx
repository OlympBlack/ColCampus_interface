import React from 'react';
import { ShieldCheck, Calendar, ArrowRight } from 'lucide-react';

interface WidgetAbonnementProps {
    abonnement: {
        nom_plan: string;
        statut: string;
        quota_total: number;
        quota_restante: number;
        date_expiration?: string;
    } | null;
    onUpgrade: () => void;
}

export const WidgetAbonnement: React.FC<WidgetAbonnementProps> = ({ abonnement, onUpgrade }) => {
    if (!abonnement) return null;

    const isActive = abonnement.nom_plan !== 'Gratuit';
    const percentage = abonnement.quota_total > 0
        ? Math.round((abonnement.quota_restante / abonnement.quota_total) * 100)
        : 0;

    return (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 p-4 sm:p-5 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">{abonnement.nom_plan}</h3>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Statut du compte</p>
                    </div>
                </div>
                {isActive && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold uppercase">
                        Actif
                    </span>
                )}
            </div>

            <div className="space-y-3 mb-4">
                <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-slate-500">Quota de publications</span>
                        <span className="text-slate-900 font-semibold">{abonnement.quota_restante} / {abonnement.quota_total}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${percentage > 20 ? 'bg-blue-600' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, Math.max(0, (abonnement.quota_restante / abonnement.quota_total) * 100))}%` }}
                        />
                    </div>
                </div>

                {abonnement.date_expiration && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={13} className="text-slate-400" />
                        Expire le <span className="text-slate-900 font-semibold">{new Date(abonnement.date_expiration).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            <button
                onClick={onUpgrade}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
                {isActive ? "Améliorer mon plan" : "Découvrir les plans"}
                <ArrowRight size={13} />
            </button>
        </div>
    );
};
