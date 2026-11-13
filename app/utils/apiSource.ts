import type { NuxtApp } from '#app'

export type ApiSource = 'mock' | 'live'

const DEMO_KEY = 'dns3l.demo'

/**
 * True while this tab is in demo mode.
 *
 * Entered through ?demo=1 - the "Try demo" link on the login page - and kept
 * in sessionStorage for the rest of the tab's life. Deliberately not
 * localStorage: a demo should end when the tab closes, not stick to the
 * machine.
 */
export function isDemo(): boolean {
  if (import.meta.server) return false
  try {
    if (new URLSearchParams(location.search).get('demo') === '1') {
      sessionStorage.setItem(DEMO_KEY, '1')
    }
    return sessionStorage.getItem(DEMO_KEY) === '1'
  } catch {
    // Private mode or blocked storage: fall back to the query parameter.
    return new URLSearchParams(location.search).get('demo') === '1'
  }
}

/**
 * Leaves demo mode. Called when a real sign-in completes, so nobody keeps
 * looking at invented certificates while holding a company session.
 */
export function endDemo() {
  try { sessionStorage.removeItem(DEMO_KEY) } catch { /* ignore */ }
  clearDemoSession() 
}

/**
 * Decides which backend serves the current request.
 *
 * Order matters:
 *   1. a mock-auth instance is mock throughout
 *   2. a demo is mock as well - and it is checked before the session, because
 *      a demo visitor *is* signed in as the mock user and would otherwise be
 *      sent to the live backend without a token
 *   3. a real session goes to dns3ld with the user's bearer token
 *   4. everyone else gets the mock, so the pages are populated instead of empty
 *
 * A real sign-in clears the demo flag (see handleCallback), so step 2 can
 * never shadow a company session.
 *
 * This is a presentation decision only. The daemon authorizes every live
 * request on its own, so nothing decided here grants access to anything.
 */
export function apiSource(nuxtApp: NuxtApp): ApiSource {
  const cfg = useRuntimeConfig().public
  if (cfg.mockAuth) return 'mock'
  if (isDemo()) return 'mock'
  return nuxtApp.$auth?.loggedIn ? 'live' : 'mock'
}