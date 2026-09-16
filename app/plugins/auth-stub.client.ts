// TEMPORÄR: ersetzt @nuxtjs/auth-next, bis Schritt 2 erledigt ist.
export default defineNuxtPlugin(() => {
  const warn = async () => console.warn('[auth] noch nicht migriert')
  const auth = reactive({
    loggedIn: false,
    user: null as null | { name?: string },
    $state: {},
    strategy: {
      idToken: { get: () => null },
      token: { get: () => null, status: () => 'stub' },
      refreshToken: { get: () => null }
    },
    loginWith: warn,
    logout: warn,
    fetchUser: warn,
    refreshTokens: warn,
    hasScope: (_s: string) => false
  })
  return { provide: { auth } }
})
