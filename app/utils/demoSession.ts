const KEY = 'dns3l.demo-session'

/**
 * Identifies one demo visitor. Not a credential - it only selects which
 * in-memory dataset the mock serves. Lives in sessionStorage, so a reload
 * keeps the sandbox and closing the tab starts over.
 */
export function demoSessionId(): string {
  try {
    let id = sessionStorage.getItem(KEY)
    if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(KEY, id) }
    return id
  } catch { return 'demo-shared' }
}

/** Called on logout so the next demo starts from the initial dataset. */
export function clearDemoSession(): void {
  try { sessionStorage.removeItem(KEY) } catch {}
}