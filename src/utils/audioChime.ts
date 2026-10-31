/**
 * Synthétiseur Web Audio API pour le son magique "cloohummmm"
 * Aucune dépendance réseau, aucun fichier externe nécessaire,
 * fonctionne immédiatement sur mobile et desktop.
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return null
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioCtx()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return audioCtx
  } catch {
    return null
  }
}

// Déverrouillage automatique dès le premier contact de l'utilisateur avec l'écran
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext()
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
    } catch {
      // ignore
    }
  }

  window.addEventListener('click', unlockAudio, { passive: true })
  window.addEventListener('touchstart', unlockAudio, { passive: true })
  window.addEventListener('keydown', unlockAudio, { passive: true })
}

/**
 * Joue le son de notification "cloohummmm"
 * - Attaque douce et clochette "cloo" (560Hz -> 440Hz)
 * - Résonance magique et traînée chaleureuse "hummmm" (330Hz -> 220Hz avec harmonique 880Hz)
 */
export function playMagicChime() {
  const ctx = getAudioContext()
  if (!ctx) return

  // S'assurer que le contexte est actif
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }

  try {
    const now = ctx.currentTime

    // Volume général bien audible sur haut-parleur mobile
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.4, now)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35)
    masterGain.connect(ctx.destination)

    // 1. Voix "cloo" (onde sinusoïdale chaude avec glissando descendant)
    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(580, now)
    osc1.frequency.exponentialRampToValueAtTime(440, now + 0.16)

    const gain1 = ctx.createGain()
    gain1.gain.setValueAtTime(0.001, now)
    gain1.gain.linearRampToValueAtTime(0.85, now + 0.035)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.45)
    osc1.connect(gain1)
    gain1.connect(masterGain)

    // 2. Voix "hummmm" (onde triangle pour texture riche, résonance feutrée)
    const osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(440, now + 0.06)
    osc2.frequency.linearRampToValueAtTime(329.63, now + 0.35) // E4
    osc2.frequency.linearRampToValueAtTime(220, now + 1.1)    // A3

    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0.001, now)
    gain2.gain.setValueAtTime(0.001, now + 0.06)
    gain2.gain.linearRampToValueAtTime(0.55, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.25)
    osc2.connect(gain2)
    gain2.connect(masterGain)

    // 3. Harmonique chatoyante "magic sparkle"
    const osc3 = ctx.createOscillator()
    osc3.type = 'sine'
    osc3.frequency.setValueAtTime(880, now + 0.04)
    osc3.frequency.exponentialRampToValueAtTime(1174.66, now + 0.2) // D6

    const gain3 = ctx.createGain()
    gain3.gain.setValueAtTime(0.001, now)
    gain3.gain.setValueAtTime(0.001, now + 0.04)
    gain3.gain.linearRampToValueAtTime(0.25, now + 0.1)
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.85)
    osc3.connect(gain3)
    gain3.connect(masterGain)

    osc1.start(now)
    osc1.stop(now + 0.5)

    osc2.start(now + 0.06)
    osc2.stop(now + 1.35)

    osc3.start(now + 0.04)
    osc3.stop(now + 0.9)
  } catch (e) {
    console.warn('Audio chime play warning:', e)
  }
}
