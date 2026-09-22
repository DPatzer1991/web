// App-weite Meldung, die im Header angezeigt wird.
// Beispiel:  useNotification().notify('Gespeichert', 'info')
export type NotificationType = 'info' | 'warning' | 'error'

export interface AppNotification {
  message: string
  type: NotificationType
}

// ein gemeinsamer Timer, damit eine neue Meldung den Ablauf der alten ersetzt
let timer: ReturnType<typeof setTimeout> | undefined

export const useNotification = () => {
  const current = useState<AppNotification | null>('app-notification', () => null)

  const clear = () => {
    current.value = null
  }

  // timeout in ms; 0 = bleibt stehen, bis sie geschlossen wird
  const notify = (message: string, type: NotificationType = 'info', timeout = 8000) => {
    current.value = { message, type }
    if (timer) clearTimeout(timer)
    if (timeout > 0) timer = setTimeout(clear, timeout)
  }

  return { current, notify, clear }
}
