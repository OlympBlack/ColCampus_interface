const puppeteer = require('puppeteer')

const APP_URL = process.env.E2E_APP_URL || 'http://127.0.0.1:5173'
const API_URL = process.env.E2E_API_URL || 'http://127.0.0.1:8001/api'

const STUDENT = { email: 'sika.adam@etudiant.uac.bj', password: 'password123' }
const OWNER = { email: 'marc.agossou@immo.bj', password: 'password123' }

async function launch() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--no-proxy-server',
      '--window-size=1280,900',
    ],
    defaultViewport: { width: 1280, height: 900 },
  })
  return browser
}

function attachConsole(page, errors) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  page.on('pageerror', (err) => errors.push(String(err)))
}

let passed = 0
let failed = 0
const failures = []

function check(name, condition) {
  if (condition) {
    passed += 1
    console.log(`  PASS  ${name}`)
  } else {
    failed += 1
    failures.push(name)
    console.log(`  FAIL  ${name}`)
  }
}

function summary(label) {
  console.log(`\n${label}: ${passed}/${passed + failed} PASS`)
  if (failures.length) {
    console.log('Failures:')
    failures.forEach((f) => console.log(`  - ${f}`))
  }
  return failed === 0
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForHash(page, predicate, timeout = 15000) {
  await page.waitForFunction(predicate, { timeout })
}

async function goTo(page, hash) {
  await page.goto(`${APP_URL}/${hash}`, { waitUntil: 'domcontentloaded' })
}

async function login(page, creds = STUDENT) {
  await goTo(page, '#/connexion')
  await page.waitForSelector('form input[name="email"]', { timeout: 15000 })
  await page.type('form input[name="email"]', creds.email)
  await page.type('form input[name="password"]', creds.password)
  await page.click('form button[type="submit"]')
  await page.waitForFunction(
    () => Boolean(localStorage.getItem('colcampus.session') || localStorage.getItem('coluac.session')),
    { timeout: 25000 },
  )
  await page.waitForSelector('button[aria-label="Ouvrir la messagerie"]', { timeout: 15000 })
}

async function gotoSession(page, hash) {
  await page.evaluate((h) => {
    window.location.hash = h
  }, hash)
  await page.waitForFunction((h) => location.hash.startsWith(h), { timeout: 15000 }, hash)
}

module.exports = {
  puppeteer,
  APP_URL,
  API_URL,
  STUDENT,
  OWNER,
  launch,
  attachConsole,
  check,
  summary,
  sleep,
  waitForHash,
  goTo,
  login,
  gotoSession,
  getResults: () => ({ passed, failed, failures }),
}
