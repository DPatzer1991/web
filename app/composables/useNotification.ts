/**
 * Global application notification displayed in the shared UI,
 * for example in the application header.
 *
 * Example:
 * useNotification().notify('Saved', 'info')
 */
export type NotificationType = 'info' | 'warning' | 'error'

export interface AppNotification {
  message: string
  type: NotificationType
}

/**
 * Shared auto-dismiss timer.
 *
 * When a new notification is shown, the previous timer is cancelled
 * so it cannot dismiss the new notification prematurely.
 */
let timer: ReturnType<typeof setTimeout> | undefined

export const useNotification = () => {

    /**
   * Shared notification state.
   * Components using the same Nuxt state key access the same notification.
   */
  const current = useState<AppNotification | null>('app-notification', () => null)
  /**
   * Removes the currently displayed notification.
   */
  const clear = () => {
    current.value = null
  }

  /**
   * Displays a notification.
   *
   * @param message Text shown to the user.
   * @param type Visual severity of the notification.
   * @param timeout Auto-dismiss delay in milliseconds.
   *                Use 0 to keep the notification visible until closed manually.
   */
  const notify = (message: string, type: NotificationType = 'info', timeout = 8000) => {
    current.value = { message, type }
    if (timer) clearTimeout(timer)
    if (timeout > 0) timer = setTimeout(clear, timeout)
  }

  return { current, notify, clear }
}
