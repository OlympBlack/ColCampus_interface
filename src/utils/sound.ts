/**
 * Synthétiseur de son de notification "Tok Tok" (double frappe bois / coup de porte)
 * Utilise l'API Web Audio native du navigateur pour garantir un fonctionnement
 * immédiat sans dépendance de fichier externe ni latence réseau.
 */
export function playTokTokSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    if (ctx.state === 'suspended') {
      void ctx.resume()
    }

    const now = ctx.currentTime

    // ── Premier "Tok" ──
    createKnock(ctx, now, 320, 0.065, 0.45)

    // ── Second "Tok" (90ms plus tard) ──
    createKnock(ctx, now + 0.09, 275, 0.08, 0.55)
  } catch (error) {
    console.warn('[TokTok] Audio notification failed:', error)
  }
}

function createKnock(
  ctx: AudioContext,
  startTime: number,
  freq: number,
  duration: number,
  volume: number
) {
  // Oscillateur triangulaire / sinus pour simuler la résonance du bois
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(freq, startTime)
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.3), startTime + duration)

  // Filtre passe-bas pour couper les fréquences agressives et donner un son sourd et chaud
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(900, startTime)
  filter.frequency.exponentialRampToValueAtTime(200, startTime + duration)

  // Enveloppe de gain percussive (attaque rapide + décroissance rapide)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.001, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  // Branchement de la chaîne audio
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration)
}
