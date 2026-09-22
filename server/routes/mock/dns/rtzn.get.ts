// Lokales Mock-Backend: GET /mock/dns/rtzn
export default defineEventHandler(() => [
  { root: 'example.com.', autodns: 'mock', acmedns: 'mock' },
  { root: 'example.org.', autodns: null, acmedns: 'mock' }
])
