import React from 'react';
import { Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface WidgetVerificationProps {
    status: 'quarantaine' | 'pending_validation' | 'valide' | 'refuse' | string;
    documentsCount: number;
    adminComment?: string | null;
    onUploadClick: () => void;
}

export const WidgetVerification: React.FC<WidgetVerificationProps> = ({
    status,
    documentsCount,
    adminComment,
    onUploadClick
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'valide':
                return {
                    icon: <CheckCircle className="text-emerald-500" size={48} />,
                    title: 'Profil Vérifié',
                    desc: 'Votre identité a été validée. Vous avez accès à toutes les fonctionnalités.',
                    color: 'emerald'
                };
            case 'refuse':
                return {
                    icon: <AlertCircle className="text-rose-500" size={48} />,
                    title: 'Vérification Refusée',
                    desc: adminComment || 'Certains documents ne sont pas conformes. Veuillez les renvoyer.',
                    color: 'rose'
                };
            case 'pending_validation':
                return {
                    icon: <Clock className="text-amber-500" size={48} />,
                    title: 'En cours de validation',
                    desc: 'Nos administrateurs vérifient vos documents. Cela prend généralement moins de 24h.',
                    color: 'amber'
                };
            default:
                return {
                    icon: <Shield className="text-slate-400" size={48} />,
                    title: 'Profil Non Vérifié',
                    desc: 'Pour publier des annonces et contacter des clients, vous devez valider votre identité.',
                    color: 'slate'
                };
        }
    };

    const config = getStatusConfig();
    const progress = status === 'valide' ? 100 : status === 'pending_validation' ? 60 : documentsCount > 0 ? 30 : 0;

    return (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 text-center max-w-lg mx-auto">
            <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100">
                    {React.cloneElement(config.icon, { size: 28 })}
                </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-1.5">{config.title}</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">{config.desc}</p>

            <div className="bg-slate-50 rounded-lg border border-slate-200/80 p-4 mb-6 text-left">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progression de la vérification</span>
                    <span className="text-xs font-black text-slate-900">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${status === 'valide' ? 'bg-emerald-600' : 'bg-blue-600'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {status !== 'valide' && status !== 'pending_validation' && (
                <button
                    onClick={onUploadClick}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                >
                    Soumettre mes documents
                </button>
            )}

            {status === 'pending_validation' && (
                <div className="flex items-center justify-center gap-2 text-slate-700 font-semibold text-xs">
                    <Clock size={14} /> Demande en attente de traitement
                </div>
            )}
        </div>
    );
};
