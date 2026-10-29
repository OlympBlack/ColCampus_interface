const {
  launch,
  attachConsole,
  check,
  summary,
  sleep,
  goTo,
  login,
  STUDENT,
  API_URL,
  APP_URL,
} = require('./helpers.cjs')

async function apiLogin(creds) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  })
  if (!res.ok) throw new Error(`login failed ${res.status}`)
  return res.json()
}

async function run() {
  const browser = await launch()
  const page = await browser.newPage()
  const errors = []
  attachConsole(page, errors)

  const createdAnnonceIds = []
  let adminSession = null

  try {
    adminSession = await apiLogin(STUDENT)

    // Find an announcement NOT owned by the logged-in student (to contact the owner)
    const listRes = await fetch(`${API_URL}/annonces`)
    const list = await listRes.json()
    const others = (list.data || []).filter((a) => a.user?.id && a.user.id !== adminSession.user.id)
    check('Préparation: annonce d\'autrui trouvée', others.length > 0)
    const target = others[0]

    await login(page, STUDENT)
    check('Login étudiant OK', await page.evaluate(() => Boolean(localStorage.getItem('colcampus.session') || localStorage.getItem('coluac.session'))))
    await sleep(1200)

    // ── Messaging flow ─────────────────────────────
    await page.goto(`${APP_URL}/#/annonces/${target.id}`, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => /#\/annonces\/\d+/.test(location.hash), { timeout: 15000 })
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('button')).some((b) => /Contacter/i.test(b.textContent || '')),
      { timeout: 20000 },
    )

    // Open contact modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        /Contacter/i.test(b.textContent || ''),
      )
      if (btn) btn.click()
    })
    await page.waitForSelector('div[aria-label="Contacter l\'annonceur"]', { timeout: 15000 })
    check('Messagerie: modale contact ouverte', true)

    // Click internal chat option
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button.colcampus-opt-btn')).find((b) =>
        /Chat interne/i.test(b.textContent || ''),
      )
      if (btn) btn.click()
    })
    await page.waitForSelector('.colcampus-messenger', { timeout: 15000 })
    await page.waitForSelector('.colcampus-messenger input[placeholder^="Écrivez à"]', { timeout: 20000 })
    check('Messagerie: fil de discussion ouvert', true)

    // Send a message
    const messageText = `Message e2e ${Date.now()}`
    await page.type('.colcampus-messenger input[placeholder^="Écrivez à"]', messageText)
    await page.click('.colcampus-messenger button[type="submit"][aria-label="Envoyer"]')
    await page.waitForFunction(
      (text) => {
        const root = document.querySelector('.colcampus-messenger')
        return root && root.textContent.includes(text)
      },
      { timeout: 20000 },
      messageText,
    )
    check('Messagerie: message envoyé et affiché', true)

    // Verify persistence via API (conversations are exposed via the dashboard payload)
    const convId = await page.evaluate(async (apiBase) => {
      const raw = localStorage.getItem('colcampus.session') || localStorage.getItem('coluac.session')
      if (!raw) return null
      const token = JSON.parse(raw).token
      const res = await fetch(`${apiBase}/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      const convs = data.data?.mes_conversations || []
      const withMsg = convs.find((c) => c.last_message && c.last_message.content)
      return withMsg ? withMsg.conversation.id : null
    }, API_URL)
    check('Messagerie: conversation listée côté API', convId !== null)
    if (convId) {
      const persisted = await page.evaluate(
        async (apiBase, id, text) => {
          const raw = localStorage.getItem('colcampus.session') || localStorage.getItem('coluac.session')
          const token = JSON.parse(raw).token
          const res = await fetch(`${apiBase}/conversations/${id}`, { headers: { Authorization: `Bearer ${token}` } })
          const data = await res.json()
          return JSON.stringify(data.data?.messages || '').includes(text)
        },
        API_URL,
        convId,
        messageText,
      )
      check('Messagerie: message persisté', persisted)
    } else {
      check('Messagerie: message persisté', false)
    }

    // Close messenger
    await page.evaluate(() => {
      const root = document.querySelector('.colcampus-messenger')
      const close = root && root.querySelector('button[aria-label="Fermer"], button[aria-label="Retour"]')
      if (close) close.click()
    })
    await page.keyboard.press('Escape').catch(() => {})

    // ── Publication flow ───────────────────────────
    await goTo(page, '#/publier')
    await page.waitForFunction(() => location.hash.includes('/publier'), { timeout: 15000 })
    await page.waitForSelector('form.publish-form', { timeout: 15000 })

    const nextBtn = 'form.publish-form button[type="submit"]'
    async function clickContinue() {
      await page.evaluate((sel) => {
        const btns = Array.from(document.querySelectorAll(sel))
        const btn = btns.find((b) => /Continuer/.test(b.textContent || ''))
        if (btn) btn.click()
      }, nextBtn)
      await sleep(500)
    }

    // Step 1: type (default preselected)
    await clickContinue()

    // Step 2: infos
    await page.waitForSelector('input[placeholder^="Ex : Chambre salon"]', { timeout: 15000 })
    await page.type('input[placeholder^="Ex : Chambre salon"]', `Annonce e2e ${Date.now()}`)
    await page.type('form.publish-form textarea', 'Description générée automatiquement par le test e2e.')
    await page.type('input[placeholder="Ex : 25000"]', '25000')
    await page.type('input[placeholder="Ex : 10000"]', '10000')
    await clickContinue()

    // Step 3: medias
    await page.waitForSelector('form.publish-form input[type="file"]', { timeout: 15000 })
    const fileInput = await page.$('form.publish-form input[type="file"]')
    await fileInput.uploadFile(require('path').resolve(__dirname, 'fixtures', 'test-photo.png'))
    await sleep(500)
    check('Publication: photo téléversée', true)
    await clickContinue()

    // Step 4: localisation — select université then quartier
    await page.waitForSelector('xpath=//label[span[text()="Université"]]/select', { timeout: 15000 })
    const univSelect = await page.$('xpath=//label[span[text()="Université"]]/select')
    const univOptions = await page.evaluate(
      (sel) => Array.from(sel.options).map((o) => ({ value: o.value, text: o.textContent })).filter((o) => o.value),
      univSelect,
    )
    check('Publication: universités disponibles', univOptions.length >= 4)
    await univSelect.select(univOptions[0].value)
    // wait for quartier options to load
    await page.waitForFunction(
      () => {
        const label = Array.from(document.querySelectorAll('label')).find(
          (l) => l.querySelector('span') && l.querySelector('span').textContent === 'Quartier',
        )
        const sel = label && label.querySelector('select')
        return sel && !sel.disabled && sel.options.length > 1
      },
      { timeout: 20000 },
    )
    const quartierSelect = await page.$('xpath=//label[span[text()="Quartier"]]/select')
    const quartierOptions = await page.evaluate(
      (sel) => Array.from(sel.options).map((o) => o.value).filter((v) => v),
      quartierSelect,
    )
    check('Publication: quartiers chargés (API)', quartierOptions.length > 0)
    await quartierSelect.select(quartierOptions[0])
    await clickContinue()

    // Step 5: recap + publish
    await page.waitForSelector('xpath=//button[contains(., "Publier l\'annonce")]', { timeout: 15000 })
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('form.publish-form button[type="submit"]')).find((b) =>
        /Publier l'annonce/.test(b.textContent || ''),
      )
      if (btn) btn.click()
    })
    await page.waitForSelector('article[role="status"]', { timeout: 25000 })
    await page.waitForFunction(() => location.hash.startsWith('#/dashboard'), { timeout: 25000 })
    check('Publication: succès + redirection dashboard', true)

    // Verify the announcement exists via API
    const created = await page.evaluate(async (apiBase) => {
      const raw = localStorage.getItem('colcampus.session') || localStorage.getItem('coluac.session')
      const token = JSON.parse(raw).token
      const res = await fetch(`${apiBase}/annonces`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      const mine = (data.data || []).filter((a) => a.user?.id === JSON.parse(raw).user.id)
      return mine.map((a) => a.id)
    }, API_URL)
    check('Publication: annonce visible', created.length > 0)
    createdAnnonceIds.push(...created)

    // Cleanup: delete created announcements
    await page.evaluate(
      async (apiBase, ids) => {
        const raw = localStorage.getItem('colcampus.session') || localStorage.getItem('coluac.session')
        const token = JSON.parse(raw).token
        for (const id of ids) {
          await fetch(`${apiBase}/annonces/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {})
        }
      },
      API_URL,
      createdAnnonceIds,
    )
    check('Nettoyage: annonces e2e supprimées', true)

    const realErrors = errors.filter(
      (e) => !/favicon|net::ERR_|WebSocket|websocket|ws:\/\/|wss:\/\//.test(e),
    )
    check('Console: zéro erreur', realErrors.length === 0)
    if (realErrors.length) console.log(realErrors.slice(0, 5))
  } finally {
    await browser.close()
  }

  return summary('messaging-publish-e2e')
}

run().then((ok) => process.exit(ok ? 0 : 1))
