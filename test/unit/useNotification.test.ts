import { describe, it, expect, vi, afterEach } from 'vitest'

describe('useNotification', () => {
  afterEach(() => {
    useNotification().clear()
    vi.useRealTimers()
  })

  it('zeigt eine Meldung und blendet sie nach der Zeit aus', () => {
    vi.useFakeTimers()
    const n = useNotification()
    n.notify('Gespeichert', 'info', 1000)
    expect(n.current.value).toEqual({ message: 'Gespeichert', type: 'info' })
    vi.advanceTimersByTime(1001)
    expect(n.current.value).toBeNull()
  })

  it('timeout 0 = bleibt stehen, bis clear() aufgerufen wird', () => {
    vi.useFakeTimers()
    const n = useNotification()
    n.notify('Sitzung abgelaufen', 'warning', 0)
    vi.advanceTimersByTime(60_000)
    expect(n.current.value?.message).toBe('Sitzung abgelaufen')
    n.clear()
    expect(n.current.value).toBeNull()
  })

  it('eine neue Meldung ersetzt die alte samt Ablaufzeit', () => {
    vi.useFakeTimers()
    const n = useNotification()
    n.notify('Erste', 'info', 1000)
    vi.advanceTimersByTime(800)
    n.notify('Zweite', 'error', 1000)
    vi.advanceTimersByTime(800)
    expect(n.current.value?.message).toBe('Zweite')
  })

  it('ist app-weit geteilt', () => {
    useNotification().notify('Hallo', 'info', 0)
    expect(useNotification().current.value?.message).toBe('Hallo')
  })
})
