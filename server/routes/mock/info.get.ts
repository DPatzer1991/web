/**
 * Local mock endpoint for DNS3L backend information.
 *
 * Returns static application metadata that mirrors the response shape
 * of the real `/info` backend endpoint.
 *
 * This allows the frontend to be developed and tested locally without
 * requiring a running DNS3L backend.
 */

export default defineEventHandler(() => ({
  version: { daemon: 'mock', api: 'mock' },
  contact: {
    email: ['dns3l@example.com'],
    url: 'https://github.com/dns3l'
  }
}))
