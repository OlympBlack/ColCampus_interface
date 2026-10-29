import { useEffect, useState } from 'react'

/**
 * Preloader du template (reprise du HTML/CSS d'origine).
 * Affiche au chargement de l'application puis se masque en fondu.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 500)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div id="preloader" style={{ transition: 'opacity 0.4s' }}>
      <div className="jumper">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
