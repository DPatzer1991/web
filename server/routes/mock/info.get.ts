// Lokales Mock-Backend: GET /mock/info
export default defineEventHandler(() => ({
  version: { daemon: 'mock', api: 'mock' },
  contact: {
    email: ['dns3l@example.com'],
    url: 'https://github.com/dns3l'
  }
}))
