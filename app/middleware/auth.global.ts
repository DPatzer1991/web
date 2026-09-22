// Ersetzt router: { middleware: ['auth'] } aus Nuxt 2.
// Alle Seiten sind geschützt, außer sie setzen definePageMeta({ auth: false }).
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  if (to.meta.auth === false) return

  const { $auth } = useNuxtApp()
  if ($auth.loggedIn) return

  // Ziel merken (wie rewriteRedirects), zurück zur Startseite
  sessionStorage.setItem('auth.redirect', to.fullPath)
  return navigateTo('/')
})
