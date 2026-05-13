export async function register() {
  if (process.env.NODE_ENV !== 'development') return

  const originalFetch = globalThis.fetch
  let requestCount = 0
  const requestLog = {}
  let flushTimer = null

  const flush = () => {
    const sorted = Object.entries(requestLog).sort((a, b) => b[1] - a[1])
    const coreBase = process.env.CORE_API_BASE_URL ?? ''

    console.log(`\n\x1b[33m[FETCH MONITOR]\x1b[0m ${requestCount} outgoing requests so far`)
    sorted.slice(0, 15).forEach(([url, count]) => {
      const label = url.replace(coreBase, '[CORE]').replace(/\?.*/, (qs) => qs.length > 60 ? qs.slice(0, 60) + '…' : qs)
      console.log(`  \x1b[36m${String(count).padStart(3)}x\x1b[0m  ${label}`)
    })
    console.log('')
  }

  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === 'string' ? input
      : input instanceof URL ? input.href
      : input.url

    requestCount++
    requestLog[url] = (requestLog[url] ?? 0) + 1

    // Debounce so we print once per burst, not on every single request
    if (flushTimer) clearTimeout(flushTimer)
    flushTimer = setTimeout(flush, 800)

    return originalFetch(input, init)
  }

  console.log('\x1b[33m[FETCH MONITOR]\x1b[0m Request counter active — summary prints after each burst of fetches')
}
