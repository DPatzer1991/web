// Provides access to the shared API client registered by plugins/api.ts.
// This keeps API access consistent across components and composables.
export const useApi = () => useNuxtApp().$api
