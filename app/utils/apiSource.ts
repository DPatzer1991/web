import type { NuxtApp } from '#app'

export type ApiSource = 'mock' | 'live'

/**
 * Single place that answers one question: should this request be served by
 * the built-in mock backend or by the real dns3l daemon?
 *
 * Why this exists at all
 * ----------------------
 * The project used to make that choice once, at process start, through the
 * NUXT_PUBLIC_API_URL environment variable (see the dev:mock script). That is
 * fine for local development but not for a deployed instance that should show
 * a populated UI to a visitor who is not signed in, and real certificates to
 * someone who is. The decision therefore has to move from "per deployment" to
 * "per request", which is what this function enables.
 *
 * The three cases
 * ---------------
 * 1. mockAuth is on  -> the whole instance runs on demo data. This also covers
 *    the signed-in mock user, who holds a fake token that the real daemon
 *    would reject anyway.
 * 2. nobody signed in -> demo data. The landing page would otherwise show
 *    empty cards, because every real endpoint requires a bearer token.
 * 3. a real session   -> the real backend, with the user's ID token attached.
 *
 * What this is NOT
 * ----------------
 * This is a presentation decision, never a security boundary. It runs in the
 * browser and anyone can change it. That is acceptable because the mock serves
 * invented data only, and because dns3ld authorizes every live request on its
 * own, independently of anything decided here.
 */
export function apiSource(nuxtApp: NuxtApp): ApiSource {
  const cfg = useRuntimeConfig().public
  if (cfg.mockAuth) return 'mock'
  return nuxtApp.$auth?.loggedIn ? 'live' : 'mock'
}