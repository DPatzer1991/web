import type { Ca } from '~/composables/useDns3l'

export type CaProfile = {
  tags: string[]
  goodFor: string[]
  chooseWhen: string
}

/**
 * Per-CA overrides, keyed by the CA id from the backend configuration.
 *
 * Needed for everything the API cannot express - the validation level (DV,
 * OV) above all. Ids differ per installation, so entries that do not match
 * are simply unused and the derived defaults below take over.
 */
export const caOverrides: Record<string, Partial<CaProfile>> = {
  letsencrypt: {
    tags: ['DV']
  },
  telesec: {
    tags: ['DV / OV'],
    goodFor: [
      'Customer-facing Telekom services',
      'Certificates with organization validation (OV)',
      'Contracts that require a European CA'
    ],
    chooseWhen: 'Compliance, customers or contracts require a German / European trust service provider.'
  }
}

/**
 * Heuristic for test and staging environments.
 *
 * The API has no field for it: a staging CA looks exactly like a production
 * one. The only hint is the wording the operator chose, so id, name and
 * description are scanned for the usual markers. Deliberately narrow - a
 * false positive changes advisory text only, never behaviour.
 */
const STAGING = /\b(staging|sandbox|testing|test|preprod|pilot)\b/i
const isStaging = (ca: Ca) => STAGING.test(`${ca.id} ${ca.name} ${ca.desc ?? ''}`)

/**
 * Builds the descriptive part of a CA card from what the backend reports.
 *
 * Reliable signals, in order:
 *   - `type`  : 'private' means not publicly trusted
 *   - `acme`  : false means a legacy CA without automated issuance
 *   - wording : the staging heuristic above
 *
 * Anything stronger would need new fields in dns3l-core. A CA this build has
 * never seen therefore still gets a complete, truthful description.
 */
export function describeCa(ca: Ca): CaProfile {
  const priv = ca.type === 'private'
  const staging = isStaging(ca)

  const tags: string[] = []
  if (staging) tags.push('not trusted')
  else if (priv) tags.push('internal only')

  let goodFor: string[]
  let chooseWhen: string

  if (staging) {
    goodFor = [
      'Testing your automation and CI pipelines',
      'First steps with DNS3L',
      'Trying new setups without rate limits'
    ]
    chooseWhen = 'Before production, so mistakes never hit the live CA rate limits.'
  } else if (priv) {
    goodFor = [
      'Internal-only services and admin tools',
      'mTLS between microservices',
      'Dev and test environments'
    ]
    chooseWhen = 'Only your own systems need to trust it and the name must never appear publicly.'
  } else if (!ca.acme) {
    goodFor = [
      'Certificates with extended validation requirements',
      'Cases where a contract or policy prescribes this CA',
      'Long-lived certificates outside the ACME world'
    ]
    chooseWhen = 'A policy or contract requires exactly this certificate authority.'
  } else {
    goodFor = [
      'Public web apps, portals and APIs',
      'Internal services via Split DNS',
      'Many hosts behind one ingress (wildcard)'
    ]
    chooseWhen = 'Production: browsers or external clients must trust the certificate.'
  }

  const o = caOverrides[ca.id]
  return {
    tags: o?.tags ?? tags,
    goodFor: o?.goodFor ?? goodFor,
    chooseWhen: o?.chooseWhen ?? chooseWhen
  }
}