const {
  launch,
  attachConsole,
  check,
  summary,
  sleep,
  goTo,
  login,
  gotoSession,
  STUDENT,
  APP_URL,
} = require('./helpers.cjs')

async function run() {
  const browser = await launch()
  const page = await browser.newPage()
  const errors = []
  attachConsole(page, errors)

  try {
    // 1. Home page loads with hero
    await goTo(page, '#/')
    await page.waitForSelector('#top .item-1 h6', { timeout: 15000 })
    const heroText = await page.$eval('#top .item-1 h6', (el) => el.textContent || '')
    check('Accueil: hero ColCampus affiché', /ColCampus/i.test(heroText))

    // 2. Catalogue exposes announcement links (data loads async)
    await page.waitForSelector('a[href^="#/annonces/"]', { timeout: 15000 })
    const cards = await page.$$('a[href^="#/annonces/"]')
    check('Catalogue: annonces listées', cards.length > 0)

    // 3. Login
    await login(page, STUDENT)
    check('Login: session persistée', await page.evaluate(() => Boolean(localStorage.getItem('colcampus.session') || localStorage.getItem('coluac.session'))))

    // Header popovers (only rendered on public pages)
    await sleep(1200)
    await goTo(page, '#/')
    await page.waitForSelector('button[aria-label="Ouvrir la messagerie"]', { timeout: 15000 })

    // 4. Notifications popover (real click)
    await page.click('button[aria-label="Ouvrir les notifications"]')
    await sleep(600)
    const notifOpen = await page.evaluate(() =>
      Array.from(document.querySelectorAll('*')).some((el) =>
        /Notifications/i.test(el.textContent || '') && el.children.length === 0,
      ),
    )
    check('Header: popover notifications ouvre', notifOpen)
    await page.click('button[aria-label="Ouvrir les notifications"]').catch(() => {})
    await sleep(200)

    // 5. Messenger popover (real click)
    await page.click('button[aria-label="Ouvrir la messagerie"]')
    await page.waitForSelector('.colcampus-messenger', { timeout: 15000 })
    check('Header: popover messagerie ouvre', true)
    await page.click('button[aria-label="Ouvrir la messagerie"]').catch(() => {})
    await sleep(200)

    // 6. Dashboard (allow auth transition to settle)
    await gotoSession(page, '#/dashboard/etudiant')
    await sleep(1800)
    check('Dashboard: accessible après login', await page.evaluate(() => location.hash.startsWith('#/dashboard')))
    const spaceLabel = await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('span'))
      return spans.map((s) => (s.textContent || '').trim()).find((t) => t.startsWith('Espace')) || ''
    })
    check('Dashboard: espace étudiant', /Espace/.test(spaceLabel))

    // 7. Detail page of a known announcement
    await goTo(page, '#/')
    await page.waitForSelector('a[href^="#/annonces/"]', { timeout: 15000 })
    await goTo(page, '#/annonces/1')
    await page.waitForFunction(() => /#\/annonces\/1/.test(location.hash), { timeout: 15000 })
    await page.waitForFunction(
      () => document.body.textContent.includes('Chambre carree avec douche interne'),
      { timeout: 15000 },
    )
    check('Détail annonce: rendu', true)

    // 8. No console errors
    const realErrors = errors.filter(
      (e) => !/favicon|Humans|net::ERR_|WebSocket|websocket|ws:\/\/|wss:\/\//.test(e),
    )
    check('Console: zéro erreur (hors websocket/favicon)', realErrors.length === 0)
    if (realErrors.length) console.log(realErrors.slice(0, 5))
  } finally {
    await browser.close()
  }

  return summary('auth-e2e')
}

run().then((ok) => process.exit(ok ? 0 : 1))
