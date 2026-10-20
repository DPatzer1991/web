export default defineEventHandler(() => [
  {
    root: 'example.com.',
    autodns: 'mock',
    acmedns: 'mock',
    ca: ['letsencrypt', 'letsencrypt-staging']
  },
  {
    root: 'telekom.example.',
    autodns: null,
    acmedns: 'mock',
    ca: ['telesec']
  },
  {
    root: 'internal.example.',
    autodns: 'mock',
    acmedns: 'mock',
    ca: ['internal']
  }
])