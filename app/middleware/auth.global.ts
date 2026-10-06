/**
 * Global authentication middleware.
 *
 * All routes require authentication by default.
 * Pages can opt out with:
 *
 * definePageMeta({ auth: false })
 */
export default defineNuxtRouteMiddleware((to) => {
  // Authentication redirects are handled only in the browser because
  // sessionStorage is not available during server-side rendering.
  if (import.meta.server) return
  // Allow routes that are explicitly marked as public.
  if (to.meta.auth === false) return
 
  const { $auth } = useNuxtApp()
  // Authenticated users may continue to the requested route.
  if ($auth.loggedIn) return

  // Remember the originally requested route so the user can be
  // redirected back to it after a successful login.
  sessionStorage.setItem('auth.redirect', to.fullPath)
  // Send unauthenticated users to the application's login/start page.
  return navigateTo('/')
})
