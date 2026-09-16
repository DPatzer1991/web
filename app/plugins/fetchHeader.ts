export default defineNuxtPlugin(() => ({
  provide: {
    fetchHeader: (t?: string | null, m = 'GET', b?: unknown) => {
      const i: RequestInit & { headers: Record<string, string> } = {
        method: m,
        headers: { 'Content-Type': 'application/json' }
      }
      if (t) i.headers.Authorization = 'Bearer ' + t
      if (b) i.body = JSON.stringify(b)
      return i
    }
  }
}))