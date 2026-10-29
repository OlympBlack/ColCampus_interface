import { useEffect, useState } from 'react'
import { getStoredCookieConsent, storeCookieConsent, type CookieConsentChoice } from '../services/consent'
import { UiIcon } from './UiIcons'

const LEGAL_LINKS = [
  { href: '#/politique-privee', label: 'Politique de confidentialite' },
  { href: '#/cgu', label: 'CGU' },
] as const

export function CookieBanner() {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(() => getStoredCookieConsent())

  useEffect(() => {
    setChoice(getStoredCookieConsent())
  }, [])

  function handleChoice(nextChoice: CookieConsentChoice) {
    storeCookieConsent(nextChoice)
    setChoice(nextChoice)
  }

  if (choice) {
    return null
  }

  return (
    <div className={'fixed inset-x-0 bottom-16 z-[80] px-3 md:bottom-6 md:px-4'}>
      <section
        className={'mx-auto flex max-h-[45vh] w-full max-w-5xl flex-col overflow-y-auto rounded-[24px] border border-[color:var(--border)] bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-md'}
        role={'region'}
        aria-label={'Gestion des cookies'}
      >
        <div
          className={
            'flex shrink-0 flex-col gap-3 bg-[linear-gradient(135deg,rgba(20,89,199,0.12),rgba(201,59,74,0.08))] px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between'
          }
        >
          <div className={'flex items-center gap-3'}>
            <span className={'grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[var(--primary-pale)] text-[var(--primary)]'}>
              <UiIcon name={'shield'} />
            </span>
            <div className={'min-w-0'}>
              <p className={'text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]'}>Confidentialite</p>
              <h2 className={'text-sm font-extrabold text-slate-900 sm:text-base'}>Nous respectons vos choix</h2>
            </div>
          </div>

          <div className={'flex flex-wrap gap-3'}>
            <button
              type={'button'}
              className={'inline-flex w-full items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-5 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50 sm:w-auto'}
              onClick={() => handleChoice('refused')}
            >
              Refuser
            </button>

            <button
              type={'button'}
              className={'inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(20,89,199,0.24)] transition hover:brightness-105 sm:w-auto'}
              onClick={() => handleChoice('accepted')}
            >
              <UiIcon name={'check'} />
              Accepter
            </button>
          </div>
        </div>

        <div className={'flex shrink-0 flex-col gap-3 px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6'}>
          <p className={'text-xs leading-5 text-[var(--muted)] sm:text-sm sm:leading-6'}>
            Nous utilisons des cookies essentiels pour faire fonctionner la plateforme, securiser votre session et memoriser vos preferences.
            Vous pouvez accepter ou refuser les cookies non essentiels.
          </p>

          <div className={'flex flex-wrap gap-2 text-xs font-semibold sm:gap-3 sm:text-sm'}>
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={'inline-flex items-center gap-2 rounded-full bg-[var(--primary-pale)] px-3 py-1.5 text-[var(--primary)] transition hover:brightness-95 sm:px-4 sm:py-2'}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
