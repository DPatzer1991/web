/**
 * Mock implementation of the DNS3L `/dns/rtzn` endpoint.
 *
 * Returns a small set of test root zones for local development.
 * The response mirrors the backend structure used by the frontend
 * to determine available AutoDNS and ACME-DNS capabilities per zone.
 */

export default defineEventHandler(() => [
  { root: 'example.com.', autodns: 'mock', acmedns: 'mock' },
  { root: 'example.org.', autodns: null, acmedns: 'mock' }
])
