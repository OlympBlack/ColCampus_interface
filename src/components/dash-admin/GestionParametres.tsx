import React, { useEffect, useState, useRef } from 'react'
import {
  Settings,
  Building2,
  Phone,
  Mail,
  Upload,
  RotateCcw,
  Save,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Key,
  Eye,
  EyeOff,
  HelpCircle,
} from 'lucide-react'
import {
  fetchAdminPlatformSettings,
  updateAdminPlatformSettings,
  resetAdminPlatformSettings,
  type PlatformSettings,
} from '../../services/api'
import { broadcastSettingsUpdate } from '../../hooks/usePlatformSettings'
import type { ToastDraft } from '../ToastViewport'

interface GestionParametresProps {
  token: string
  onToast: (toast: ToastDraft) => void
}

export const GestionParametres: React.FC<GestionParametresProps> = ({ token, onToast }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // Form state
  const [nomPlateforme, setNomPlateforme] = useState('')
  const [slogan, setSlogan] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [campusLocalisation, setCampusLocalisation] = useState('')
  const [telephone, setTelephone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [emailContact, setEmailContact] = useState('')
  const [emailSupport, setEmailSupport] = useState('')
  const [signatureAuteur, setSignatureAuteur] = useState('')
  const [signatureUrl, setSignatureUrl] = useState('')
  const [signatureTexte, setSignatureTexte] = useState('')
  const [copyrightTexte, setCopyrightTexte] = useState('')

  // Clés API de Paiement (Kkiapay / Mobile Money)
  const [kkiapayPublicKey, setKkiapayPublicKey] = useState('')
  const [kkiapayPrivateKey, setKkiapayPrivateKey] = useState('')
  const [kkiapaySecretKey, setKkiapaySecretKey] = useState('')
  const [kkiapaySandbox, setKkiapaySandbox] = useState(true)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)

  // Logo file upload state
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAdminPlatformSettings(token)
      setNomPlateforme(data.nom_plateforme || '')
      setSlogan(data.slogan || '')
      setDescription(data.description || '')
      setLogoUrl(data.logo_url || '/assets/images/logo_colcampus.png')
      setCampusLocalisation(data.campus_localisation || '')
      setTelephone(data.telephone || '')
      setWhatsapp(data.whatsapp || '')
      setEmailContact(data.email_contact || '')
      setEmailSupport(data.email_support || '')
      setSignatureAuteur(data.signature_auteur || '')
      setSignatureUrl(data.signature_url || '')
      setSignatureTexte(data.signature_texte || '')
      setCopyrightTexte(data.copyright_texte || '')
      setKkiapayPublicKey(data.kkiapay_public_key || '')
      setKkiapayPrivateKey(data.kkiapay_private_key || '')
      setKkiapaySecretKey(data.kkiapay_secret_key || '')
      setKkiapaySandbox(data.kkiapay_sandbox !== undefined ? Boolean(data.kkiapay_sandbox) : true)
      setLogoFile(null)
      setLogoPreview(null)
    } catch (err: any) {
      onToast({
        tone: 'error',
        title: 'Erreur',
        message: err?.message || 'Impossible de charger les paramètres de la plateforme.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let res: { message: string; data: PlatformSettings }

      if (logoFile) {
        const formData = new FormData()
        formData.append('logo', logoFile)
        formData.append('nom_plateforme', nomPlateforme)
        formData.append('slogan', slogan)
        formData.append('description', description)
        formData.append('campus_localisation', campusLocalisation)
        formData.append('telephone', telephone)
        formData.append('whatsapp', whatsapp)
        formData.append('email_contact', emailContact)
        formData.append('email_support', emailSupport)
        formData.append('signature_auteur', signatureAuteur)
        formData.append('signature_url', signatureUrl)
        formData.append('signature_texte', signatureTexte)
        formData.append('copyright_texte', copyrightTexte)
        formData.append('kkiapay_public_key', kkiapayPublicKey)
        formData.append('kkiapay_private_key', kkiapayPrivateKey)
        formData.append('kkiapay_secret_key', kkiapaySecretKey)
        formData.append('kkiapay_sandbox', kkiapaySandbox ? '1' : '0')

        res = await updateAdminPlatformSettings(token, formData)
      } else {
        res = await updateAdminPlatformSettings(token, {
          nom_plateforme: nomPlateforme,
          slogan,
          description,
          logo_url: logoUrl,
          campus_localisation: campusLocalisation,
          telephone,
          whatsapp,
          email_contact: emailContact,
          email_support: emailSupport,
          signature_auteur: signatureAuteur,
          signature_url: signatureUrl,
          signature_texte: signatureTexte,
          copyright_texte: copyrightTexte,
          kkiapay_public_key: kkiapayPublicKey,
          kkiapay_private_key: kkiapayPrivateKey,
          kkiapay_secret_key: kkiapaySecretKey,
          kkiapay_sandbox: kkiapaySandbox,
        })
      }

      // Diffuser la mise à jour pour que tout le site prenne en compte instantanément
      broadcastSettingsUpdate(res.data)

      setLogoUrl(res.data.logo_url)
      setKkiapayPublicKey(res.data.kkiapay_public_key || '')
      setKkiapayPrivateKey(res.data.kkiapay_private_key || '')
      setKkiapaySecretKey(res.data.kkiapay_secret_key || '')
      setKkiapaySandbox(res.data.kkiapay_sandbox !== undefined ? Boolean(res.data.kkiapay_sandbox) : true)
      setLogoFile(null)
      setLogoPreview(null)

      onToast({
        tone: 'success',
        title: 'Paramètres mis à jour',
        message: 'Les nouveaux paramètres et clés API de paiement ont été enregistrés avec succès.',
      })
    } catch (err: any) {
      onToast({
        tone: 'error',
        title: 'Erreur d’enregistrement',
        message: err?.message || 'Impossible de sauvegarder les paramètres.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Voulez-vous réinitialiser tous les paramètres aux valeurs d’origine de ColEtuBenin ?')) {
      return
    }

    setIsResetting(true)
    try {
      const res = await resetAdminPlatformSettings(token)
      broadcastSettingsUpdate(res.data)

      setNomPlateforme(res.data.nom_plateforme)
      setSlogan(res.data.slogan)
      setDescription(res.data.description)
      setLogoUrl(res.data.logo_url)
      setCampusLocalisation(res.data.campus_localisation)
      setTelephone(res.data.telephone)
      setWhatsapp(res.data.whatsapp)
      setEmailContact(res.data.email_contact)
      setEmailSupport(res.data.email_support)
      setSignatureAuteur(res.data.signature_auteur)
      setSignatureUrl(res.data.signature_url)
      setSignatureTexte(res.data.signature_texte)
      setCopyrightTexte(res.data.copyright_texte)
      setKkiapayPublicKey(res.data.kkiapay_public_key || '')
      setKkiapayPrivateKey(res.data.kkiapay_private_key || '')
      setKkiapaySecretKey(res.data.kkiapay_secret_key || '')
      setKkiapaySandbox(res.data.kkiapay_sandbox !== undefined ? Boolean(res.data.kkiapay_sandbox) : true)
      setLogoFile(null)
      setLogoPreview(null)

      onToast({
        tone: 'success',
        title: 'Paramètres restaurés',
        message: 'Les valeurs par défaut de la plateforme ont été appliquées avec succès.',
      })
    } catch (err: any) {
      onToast({
        tone: 'error',
        title: 'Erreur',
        message: err?.message || 'Impossible de restaurer les paramètres par défaut.',
      })
    } finally {
      setIsResetting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Chargement des paramètres de la plateforme...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── En-tête de section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Paramètres généraux de la plateforme
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Personnalisez dynamiquement l’identité visuelle, les coordonnées, les mentions de bas de page et les contacts. Les modifications sont appliquées instantanément sur l’ensemble du site public.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting || isSubmitting}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Rétablir par défaut</span>
          </button>

          <a
            href="#/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <span>Voir le site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── 1. IDENTITÉ VISUELLE & LOGO ── */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Identité de la plateforme & Logo
              </h2>
              <p className="text-xs text-slate-500">Nom de la marque, slogan, localisation et logo officiel.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Logo actuel / Upload (4 cols) */}
            <div className="md:col-span-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Logo de la plateforme
              </label>

              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center group relative hover:bg-slate-100/70 transition-colors">
                <div className="w-full h-24 flex items-center justify-center p-2 mb-3 bg-white rounded-xl border border-slate-200/80 shadow-inner">
                  <img
                    src={logoPreview || logoUrl}
                    alt="Aperçu du logo"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/assets/images/logo_colcampus.png'
                    }}
                  />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-1.5 w-full">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{logoFile ? 'Changer de fichier' : 'Téléverser un logo'}</span>
                  </button>

                  <span className="text-[11px] text-slate-400">
                    PNG, SVG ou WEBP recommandé (max 5 Mo)
                  </span>
                </div>
              </div>

              {/* Saisie manuelle de l'URL du logo */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Ou URL directe de l'image :
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value)
                    setLogoPreview(null)
                  }}
                  placeholder="/assets/images/logo_colcampus.png"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Champs d'identité (8 cols) */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nom de la plateforme <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nomPlateforme}
                    onChange={(e) => setNomPlateforme(e.target.value)}
                    placeholder="Ex : ColEtuBenin"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Localisation / Badge Campus
                  </label>
                  <input
                    type="text"
                    value={campusLocalisation}
                    onChange={(e) => setCampusLocalisation(e.target.value)}
                    placeholder="Ex : Campus UAC, UNA, UNSTIM & UP • Bénin"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Slogan court
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Plateforme étudiante de colocation près des campus universitaires du Bénin"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description officielle (Footer & Réseaux)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez en 2 ou 3 phrases la mission de la plateforme pour les étudiants et bailleurs..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white resize-y"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. COORDONNÉES OFFICIELLES & CONTACTS ── */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Phone className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Coordonnées & Canaux de Contact
              </h2>
              <p className="text-xs text-slate-500">
                Numéros et emails officiels affichés sur la page Contact, le Footer et les boutons rapides.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Téléphone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Téléphone d'appel direct</span>
              </label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+229 01 54 47 00 02"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Numéro utilisé pour le bouton « Appel direct »
              </span>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Numéro WhatsApp officiel</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+229 01 54 47 00 02"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Raccordé automatiquement aux liens wa.me de l’application
              </span>
            </div>

            {/* Email de contact */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Adresse email générale</span>
              </label>
              <input
                type="email"
                value={emailContact}
                onChange={(e) => setEmailContact(e.target.value)}
                placeholder="contact@coletubenin.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Email de support */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Adresse email d'assistance technique</span>
              </label>
              <input
                type="email"
                value={emailSupport}
                onChange={(e) => setEmailSupport(e.target.value)}
                placeholder="support@coletubenin.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* ── 3. PASSERELLE DE PAIEMENT & CLÉS API (KKIAPAY / MOBILE MONEY) ── */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Passerelle de Paiement Mobile Money & Packs (Kkiapay)
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      kkiapaySandbox
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${kkiapaySandbox ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    {kkiapaySandbox ? 'Mode Sandbox (Test)' : 'Mode Production (Live)'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Gérez facilement les clés d'API Kkiapay pour les encaissements MTN Mobile Money, Moov Money et Cartes Bancaires.
                </p>
              </div>
            </div>

            {/* Toggle Sandbox / Live */}
            <div className="flex items-center gap-3 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setKkiapaySandbox(true)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  kkiapaySandbox
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Test (Sandbox)
              </button>
              <button
                type="button"
                onClick={() => setKkiapaySandbox(false)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !kkiapaySandbox
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Production (En direct)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Clé Publique (Public Key) */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  Clé Publique Kkiapay (Public Key)
                </span>
                <span className="text-[11px] font-medium text-slate-400 lowercase">exposée au widget frontend</span>
              </label>
              <input
                type="text"
                value={kkiapayPublicKey}
                onChange={(e) => setKkiapayPublicKey(e.target.value)}
                placeholder="Ex: aa4b4f9052d511f18d492b2bdfbe5c62"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400">
                Cette clé permet d'afficher la fenêtre de paiement Kkiapay lors de l'achat d'un pack de publication par un démarcheur ou une boutique.
              </p>
            </div>

            {/* Clé Privée (Private Key) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  Clé Privée (Private Key)
                </span>
                <span className="text-[11px] font-medium text-emerald-600">Sécurisée côté serveur</span>
              </label>
              <div className="relative">
                <input
                  type={showPrivateKey ? 'text' : 'password'}
                  value={kkiapayPrivateKey}
                  onChange={(e) => setKkiapayPrivateKey(e.target.value)}
                  placeholder="Ex: tpk_..."
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPrivateKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPrivateKey ? 'Masquer la clé' : 'Afficher la clé'}
                >
                  {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Utilisée par l'API pour vérifier les transactions en direct auprès de Kkiapay avant de créditer le compte.
              </p>
            </div>

            {/* Clé Secrète (Secret Key) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  Clé Secrète (Secret Key)
                </span>
                <span className="text-[11px] font-medium text-slate-400">Optionnelle</span>
              </label>
              <div className="relative">
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  value={kkiapaySecretKey}
                  onChange={(e) => setKkiapaySecretKey(e.target.value)}
                  placeholder="Ex: sec_..."
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-slate-50/50 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showSecretKey ? 'Masquer la clé' : 'Afficher la clé'}
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Clé secrète additionnelle pour la vérification des signatures de webhooks éventuels.
              </p>
            </div>
          </div>

          {/* Guide d'aide rapide */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 space-y-1">
              <p className="font-bold">Où trouver vos clés API Kkiapay ?</p>
              <p className="text-blue-800/90 leading-relaxed">
                Connectez-vous à votre tableau de bord <a href="https://kkiapay.me" target="_blank" rel="noreferrer" className="font-semibold underline hover:text-blue-950">Kkiapay (kkiapay.me)</a>, rendez-vous dans le menu <b>Développeurs &gt; Clés d'API</b>, puis copiez votre clé publique et votre clé privée correspondante (soit Sandbox pour vos tests, soit Production pour recevoir des paiements réels). Collez-les ici et cliquez sur <b>Enregistrer les paramètres</b> : la prise en compte est immédiate, aucune modification du code n'est nécessaire.
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. CRÉDITS & BAS DE PAGE ── */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Crédits Développeur & Pied de page
              </h2>
              <p className="text-xs text-slate-500">
                Informations affichées dans la sous-barre de pied de page (Footer).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Texte signature
              </label>
              <input
                type="text"
                value={signatureTexte}
                onChange={(e) => setSignatureTexte(e.target.value)}
                placeholder="Conçu & développé par"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Auteur / Développeur
              </label>
              <input
                type="text"
                value={signatureAuteur}
                onChange={(e) => setSignatureAuteur(e.target.value)}
                placeholder="GBASSI Jules-christ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lien Portfolio / Profil
              </label>
              <input
                type="url"
                value={signatureUrl}
                onChange={(e) => setSignatureUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Texte de Copyright
              </label>
              <input
                type="text"
                value={copyrightTexte}
                onChange={(e) => setCopyrightTexte(e.target.value)}
                placeholder="ColEtuBenin. Tous droits réservés."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* ── Bouton d'enregistrement flottant / bas de page ── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2.5 py-3.5 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Enregistrement en cours...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Enregistrer les paramètres</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
