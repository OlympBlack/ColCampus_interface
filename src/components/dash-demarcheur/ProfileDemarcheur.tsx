import React, { useState } from 'react';
import { User, Building2, ShieldCheck, Mail, Phone, MapPin, Camera, Check, AlertCircle, Loader2, Lock } from 'lucide-react';
import type { AuthSession, UpdateProfilePayload, KycDocumentDraft } from '../../types';
import { updateCurrentUser, uploadKycDocuments } from '../../services/api';

interface ProfileDemarcheurProps {
    session: AuthSession;
    onSessionChange: (session: AuthSession) => void;
    onToast: (toast: any) => void;
}

export const ProfileDemarcheur: React.FC<ProfileDemarcheurProps> = ({ session, onSessionChange, onToast }) => {
    const profil = session.user.profil ?? {};

    const [form, setForm] = useState({
        name: session.user.name ?? '',
        prenoms: session.user.prenoms ?? '',
        telephone: session.user.telephone ?? '',
        ifu: profil.ifu ?? '',
        nom_agence: profil.nom_agence ?? '',
        zone_activite: profil.zone_activite ?? '',
        adresse_physique: profil.adresse_physique ?? '',
        photo_profil: null as File | null,
    });

    const [submitting, setSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // KYC State
    const [kycRows, setKycRows] = useState<KycDocumentDraft[]>([
        { type_piece: 'IFU', numero_piece: '', fichier: null as any }
    ]);
    const [kycSubmitting, setKycSubmitting] = useState(false);
    const [kycSuccess, setKycSuccess] = useState(false);

    const handleFieldChange = (name: string, value: any) => {
        setForm(prev => ({ ...prev, [name]: value }));
        if (name === 'photo_profil' && value instanceof File) {
            setPhotoPreview(URL.createObjectURL(value));
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData: UpdateProfilePayload = {
                ...form,
                email: session.user.email ?? '',
            };
            const response = await updateCurrentUser(session.token, formData);
            onSessionChange({ ...session, user: response.user });
            onToast({ tone: 'success', title: 'Profil mis à jour', message: 'Vos informations d\'agence ont été enregistrées.' });
        } catch (error: any) {
            onToast({ tone: 'error', title: 'Erreur', message: error.message || 'Échec de la mise à jour' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleKycSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const readyDocs = kycRows.filter(r => r.numero_piece && r.fichier);
        if (readyDocs.length === 0) {
            onToast({ tone: 'warn', title: 'Documents manquants', message: 'Veuillez remplir le numéro et joindre le fichier.' });
            return;
        }
        setKycSubmitting(true);
        try {
            const response = await uploadKycDocuments(session.token, readyDocs);
            onSessionChange({ ...session, user: response.user });
            setKycSuccess(true);
            onToast({ tone: 'success', title: 'Documents envoyés', message: 'Votre dossier est en cours d\'examen.' });
        } catch (error: any) {
            onToast({ tone: 'error', title: 'Erreur d\'envoi', message: error.message || 'L\'envoi a échoué' });
        } finally {
            setKycSubmitting(false);
        }
    };

    const inputClasses = "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium";
    const labelClasses = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-0.5";
    const sectionClasses = "bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden p-5 sm:p-6 space-y-5";

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Header & Photo Section */}
            <div className={sectionClasses}>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 shadow-xs overflow-hidden flex items-center justify-center relative">
                            {photoPreview || session.user.photo_profil ? (
                                <img src={photoPreview || session.user.photo_profil || ''} alt="Profil" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-8 h-8 text-slate-400" />
                            )}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="w-6 h-6 text-white" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={e => handleFieldChange('photo_profil', e.target.files?.[0])}
                                />
                            </label>
                        </div>
                        {photoPreview && (
                            <button
                                onClick={() => { setPhotoPreview(null); handleFieldChange('photo_profil', null); }}
                                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow hover:bg-rose-600 transition-all"
                            >
                                <span className="text-sm leading-none">×</span>
                            </button>
                        )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Mon Profil Professionnel</h2>
                        <p className="text-xs text-slate-500 font-medium">Gérez votre identité et vos informations d'agence immobilière.</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                Profil {session.user.role}
                            </span>
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${session.user.statut_verification === 'valide'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                Statut: {session.user.statut_verification === 'valide' ? 'Vérifié' : 'En attente'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Information Sections */}
                <div className="space-y-8 lg:col-span-1">
                    {/* Personal Info */}
                    <form onSubmit={handleUpdateProfile} className={sectionClasses}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <User size={18} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Identité</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Prénom</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={form.prenoms}
                                            onChange={e => handleFieldChange('prenoms', e.target.value)}
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Nom</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={e => handleFieldChange('name', e.target.value)}
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>Email (Non modifiable)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                                    <input
                                        type="email"
                                        value={session.user.email || ''}
                                        disabled
                                        className={inputClasses + " bg-slate-100 text-slate-400 cursor-not-allowed"}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={form.telephone}
                                        onChange={e => handleFieldChange('telephone', e.target.value)}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Agency Info */}
                        <div className="pt-6 mt-6 border-t border-slate-50 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Building2 size={18} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Agence</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={labelClasses}>Nom de l'agence</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={form.nom_agence}
                                            onChange={e => handleFieldChange('nom_agence', e.target.value)}
                                            className={inputClasses}
                                            placeholder="Ex: Immobilier Pro"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>IFU</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={form.ifu}
                                                onChange={e => handleFieldChange('ifu', e.target.value)}
                                                className={inputClasses}
                                                placeholder="1234567890"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Zone d'activité</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={form.zone_activite}
                                                onChange={e => handleFieldChange('zone_activite', e.target.value)}
                                                className={inputClasses}
                                                placeholder="Ex : Abomey-Calavi, Porto-Novo, Abomey, Parakou"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>Adresse du bureau</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={form.adresse_physique}
                                            onChange={e => handleFieldChange('adresse_physique', e.target.value)}
                                            className={inputClasses}
                                            placeholder="Ville, quartier..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Enregistrer les modifications
                        </button>
                    </form>
                </div>

                {/* Right Column: Verification & Security */}
                <div className="space-y-6">
                    {/* Documents KYC */}
                    <div className={sectionClasses}>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                                <ShieldCheck size={16} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Vérification</h3>
                        </div>

                        {session.user.statut_verification === 'valide' ? (
                            <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-lg flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check size={14} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-emerald-900">Compte Vérifié</p>
                                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Vos documents ont été validés avec succès.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleKycSubmit} className="space-y-4">
                                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                                        <AlertCircle size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Vérification Requise</p>
                                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">Joignez votre document IFU pour permettre à l'administration de valider votre profil professionnel.</p>
                                    </div>
                                </div>

                                {kycRows.map((row, i) => (
                                    <div key={i} className="p-3.5 border border-slate-200/80 rounded-lg space-y-3 bg-slate-50/50">
                                        <div>
                                            <label className={labelClasses}>Type de pièce</label>
                                            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 uppercase">
                                                {row.type_piece}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Numéro de pièce</label>
                                            <input
                                                type="text"
                                                value={row.numero_piece}
                                                onChange={e => setKycRows(prev => prev.map((r, idx) => idx === i ? { ...r, numero_piece: e.target.value } : r))}
                                                className={inputClasses}
                                                placeholder="N° IFU"
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Fichier (Photo/Scann)</label>
                                            <input
                                                type="file"
                                                onChange={e => setKycRows(prev => prev.map((r, idx) => idx === i ? { ...r, fichier: e.target.files?.[0] || null as any } : r))}
                                                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 transition-all"
                                                accept="image/*,application/pdf"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="submit"
                                    disabled={kycSubmitting}
                                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {kycSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                    {kycSuccess ? 'Documents envoyés !' : 'Soumettre à nouveau'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Sécurité & Mot de passe */}
                    <div className={sectionClasses}>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                                <Lock size={16} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Sécurité</h3>
                        </div>

                        <div className="space-y-2.5">
                            <button className="w-full p-3 rounded-lg border border-slate-200/80 bg-slate-50/80 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between group shadow-xs">
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-slate-800">Mot de passe</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Modifier votre accès de connexion</p>
                                </div>
                                <div className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-400 group-hover:text-slate-900 flex items-center justify-center transition-colors text-xs">
                                    →
                                </div>
                            </button>

                            <button className="w-full p-3 rounded-lg border border-slate-200/80 bg-slate-50/80 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between group shadow-xs">
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-slate-800">Authentification Double Facteur</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Ajouter une couche de sécurité</p>
                                </div>
                                <div className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-bold uppercase">Désactivé</div>
                            </button>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className={sectionClasses}>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                                <AlertCircle size={16} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Zone de Danger</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Si vous souhaitez suspendre temporairement votre activité ou fermer votre compte agence, veuillez contacter le support technique ou utiliser le bouton ci-dessous.
                        </p>
                        <button className="w-full py-2.5 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-50 transition-colors">
                            Désactiver mon profil démarcheur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
