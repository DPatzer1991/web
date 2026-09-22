## [Nuxt][1] SPA web client for DNS3L

`docker pull ghcr.io/dns3l/web`

Nuxt 4 · Vue 3 · Tailwind CSS 3 · daisyUI 2 · OIDC login via [oidc-client-ts][2] against Dex ([dns3l/auth][3])

[1]: https://nuxt.com/
[2]: https://github.com/authts/oidc-client-ts
[3]: https://github.com/dns3l/auth

### Configuration

All settings are read at **runtime** – one image works for every environment.

| variable | note | default |
| --- | --- | --- |
| ENVIRONMENT | `production` or other deployments | |
| BASE_URL | base URL of the web client | `http://localhost:3000` |
| API_URL | `dns3ld` API endpoint | `${BASE_URL}/api` |
| MOCK_URL | API mocking endpoint for development | `${BASE_URL}/mock` |
| AUTH_URL | (DNS3L) OIDC provider discovery endpoint | `${BASE_URL}/auth/.well-known/openid-configuration` |
| CLIENT_ID | OIDC client ID (public client, PKCE) | `dns3l-app` |
| DAEMON_CLIENT_ID | audience for `dns3ld` token validation (https://github.com/dns3l/dns3l-core/issues/59) | `dns3ld` |

The container entrypoint maps these variables to Nuxt's runtime config (`NUXT_PUBLIC_API_URL`, `NUXT_PUBLIC_AUTH_URL`, …). Outside the container you can set the `NUXT_PUBLIC_*` variables directly.

Additional runtime options:

| variable | note | default |
| --- | --- | --- |
| NUXT_PUBLIC_MOCK_AUTH | `true` = mock login instead of Dex (development/tests only) | `false` |
| NUXT_PUBLIC_SPEC_URL | OpenAPI document shown on `/swagger` | `/openapi.yaml` (bundled copy in `public/`) |

## Development

### Environment

Recommended: the **Dev Container** in `.devcontainer/` (VS Code → *Reopen in Container*). It provides Node 22, Yarn 4 via corepack, Chromium for end-to-end tests and the recommended extensions (Vue, Playwright, Vitest).

Without the Dev Container you need **Node.js ≥ 22.19** and `corepack enable` (Yarn 4 is pinned in `package.json`).

```bash
yarn install
```

### Commands

| command | backend | login | purpose |
| --- | --- | --- | --- |
| `yarn dev:mock` | built-in mock (`/mock`) | mock user | **daily development**, no further services needed |
| `yarn dev:dex` | built-in mock (`/mock`) | local Dex on port 5556 | test the real OIDC login flow |
| `yarn dev` | `NUXT_PUBLIC_API_URL` | `NUXT_PUBLIC_AUTH_URL` | against a real DNS3L environment |
| `yarn build` / `yarn start` | runtime config | runtime config | production build and server (`.output/`) |

Against a real environment:

```bash
NUXT_PUBLIC_API_URL=https://<dns3l>/api \
NUXT_PUBLIC_AUTH_URL=https://<dns3l>/auth/.well-known/openid-configuration \
yarn dev
```

### Mock backend

`server/routes/mock/` implements the parts of the `dns3ld` API the web client uses (CA list, certificates incl. claim/delete/PEM, info, root zones). Data lives in memory (`server/utils/mockStore.ts`) and is reset on restart or via `POST /mock/_reset`. Like the real backend, claim, delete and PEM endpoints require a bearer token.

### Local Dex

`dev/auth.compose.yml` starts the same `ghcr.io/dns3l/auth` image as the DNS3L stack – without LDAP, with mock logins. Run it **on the host** (the Dev Container has no Docker):

```bash
docker compose -f dev/auth.compose.yml up -d   # on the host
yarn dev:dex                                    # in the Dev Container
```

Login options: *Dex Mock* (no password), *Dex Mock…* / *Email* with `certbot` / `certbot@example.com` and password `secret`.

### Tests

| command | what |
| --- | --- |
| `yarn test` | unit tests (Vitest in a Nuxt environment, `test/unit/`) |
| `yarn test:watch` | unit tests in watch mode |
| `yarn test:e2e` | builds the app and runs the Playwright end-to-end tests (`e2e/`) against mock backend + mock login on port 3100 |
| `yarn playwright test` | end-to-end tests without rebuilding |
| `yarn test:e2e:report` | open the last Playwright report |

In the Dev Container (Alpine) Playwright uses the system Chromium automatically. Watch or debug tests in your host browser via port 9323:

```bash
yarn playwright test --ui --ui-host=0.0.0.0 --ui-port=9323
```

Both test suites run in GitHub Actions on every pull request and branch push (`.github/workflows/test.yml`).

### Project structure

| path | content |
| --- | --- |
| `app/pages/`, `app/layouts/`, `app/components/` | Vue pages, layout and components |
| `app/plugins/auth.client.ts` | OIDC login (`$auth`), mock login |
| `app/plugins/api.ts` | API client `$api` (base URL + bearer token) |
| `app/composables/` | shared data sources (`useCaList`, `useCertificates`, …), notifications |
| `app/middleware/auth.global.ts` | route protection (`definePageMeta({ auth: false })` for public pages) |
| `server/` | mock backend |
| `public/` | static files incl. `openapi.yaml` |
| `test/unit/`, `e2e/` | unit and end-to-end tests |

`public/openapi.yaml` is a copy of the DNS3L API description. Update it when the API changes:

```bash
curl -fsSL https://raw.githubusercontent.com/dns3l/dns3l/master/openapi.yaml -o public/openapi.yaml
```
