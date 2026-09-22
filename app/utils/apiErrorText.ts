// Einheitlicher Fehlertext für Fehler aus $api (wie bisher: "404 Not Found [message]")
export const apiErrorText = (e: any): string => {
  if (e?.status) {
    const base = `${e.status} ${e.statusText ?? ''}`.trim()
    return e.data?.message ? `${base} [${e.data.message}]` : base
  }
  return 'Keine Verbindung zum Backend: ' + (e?.message ?? String(e))
}
