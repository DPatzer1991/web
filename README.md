## [Nuxt][1] SPA web client for DNS3L

`docker pull ghcr.io/dns3l/web`

Nuxt 4 · Vue 3 · Tailwind CSS 4 · Nuxt UI 4 · OIDC login via [oidc-client-ts][2] against Dex ([dns3l/auth][3])

[1]: https://nuxt.com/
[2]: https://github.com/authts/oidc-client-ts
[3]: https://github.com/dns3l/auth

> ### 🚧 Status of this branch
>
> **Tested:** the built-in mock backend, the OIDC login flow against the local
> Dex, and demo mode.
>
> **Not yet tested:** the live path against a real `dns3ld`. Request shapes,
> field names and error handling for that path were built from
> `public/openapi.yaml` and the daemon's source, not from a running instance.
> Treat everything about the live backend in this document as an assumption
> until someone has run it against a real environment — the first run will
> most likely turn up differences in error responses and in the exact root
> zone payload.

### ⚙️ Configuration

All settings are read at **runtime** – one image works for every environment.

| variable | note | default |
| --- | --- | --- |
| BASE_URL | base URL of the web client. **Set this in every deployment** – the default points at localhost, which would make visitors' browsers call their own machines | `http://localhost:3000` |
| API_URL | `dns3ld` API endpoint | `${BASE_URL}/api` |
| MOCK_URL | API mocking endpoint, used by the demo and in development | `${BASE_URL}/mock` |
| AUTH_URL | (DNS3L) OIDC provider discovery endpoint | `${BASE_URL}/auth/.well-known/openid-configuration` |
| CLIENT_ID | OIDC client ID (public client, PKCE) | `dns3l-app` |
| DAEMON_CLIENT_ID | audience for `dns3ld` token validation (https://github.com/dns3l/dns3l-core/issues/59) | `dns3ld` |

The container entrypoint maps these variables to Nuxt's runtime config
(`NUXT_PUBLIC_API_URL`, `NUXT_PUBLIC_AUTH_URL`, …). Outside the container,
set the `NUXT_PUBLIC_*` variables directly.

Additional runtime options:

| variable | note | default |
| --- | --- | --- |
| NUXT_PUBLIC_MOCK_AUTH | `true` = mock login instead of Dex (development and tests only) | `false` |
| NUXT_PUBLIC_SPEC_URL | OpenAPI document shown on `/swagger` | `/openapi.yaml` (bundled copy in `public/`) |

## 🧙‍♂️ Development

### 🧰 Environment

Recommended: the **Dev Container** in `.devcontainer/` (VS Code → *Reopen in
Container*). It provides Node 22, Yarn 4 via corepack, Chromium and the
recommended extensions.

Without the Dev Container you need **Node.js ≥ 22.19** and `corepack enable`
(Yarn 4 is pinned in `package.json`).

```bash
yarn install
```

### ⌨️ Commands

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

### 🔀 Which backend answers

One decision, made per request in `app/utils/apiSource.ts` and carried out in
`app/plugins/api.ts`:

| situation | backend | token |
| --- | --- | --- |
| `NUXT_PUBLIC_MOCK_AUTH=true` | mock | `Bearer demo` |
| demo visitor (`?demo=1`) | mock | `Bearer demo` |
| signed in through Dex | `dns3ld` | the user's ID token |
| not signed in | mock | none |

A company token is therefore never sent to the mock, and a demo request never
reaches the daemon. Signed-out visitors see example data so the landing page
is populated rather than empty.

### 🧪 Mock backend

`server/routes/mock/` implements the parts of the `dns3ld` API the web client
uses: CA list, certificates including claim, delete and PEM, info, root
zones. Data lives in memory (`server/utils/mockStore.ts`) and is reset on
restart or via `POST /mock/_reset`. As with the real backend, claim, delete
and PEM require a bearer token.

### 🦄 Demo mode

A visitor can try the application without an account. The Dex login page shows
a *Try demo* button when `DEMO_URL` is configured for that deployment; it
points at this client with `?demo=1` appended.

There is **no demo account** – no user in Dex, no password, no valid token.
The parameter puts the tab into a state where the application serves mock data
and treats a placeholder user as signed in.

Each visitor gets their own dataset. The browser generates a random id, keeps
it in `sessionStorage` and sends it as `X-Demo-Session`; the mock backend keys
its store by that id, so claims and deletions stay local to one visitor.

| property | value |
| --- | --- |
| scope | one browser tab (`sessionStorage`) |
| storage | memory of the Nitro process, not the daemon |
| idle timeout | 1 hour |
| concurrent sandboxes | 500, least recently used is evicted |
| certificates per sandbox | 100, further claims answer `429` |

Worth knowing: a restart clears every sandbox, a second tab counts as a second
visitor, and behind more than one replica the deployment needs session
affinity.

Where the demo is not wanted, leave `DEMO_URL` unset. The `/mock/` routes
still answer anyone who knows the path, so put a rate limit in front of them
in any environment reachable from outside.

### 🔐 Local Dex

`dev/auth.compose.yml` starts the same `ghcr.io/dns3l/auth` image as the DNS3L
stack – without LDAP, with mock logins. Run it **on the host**:

```bash
docker compose -f dev/auth.compose.yml up -d   # on the host
yarn dev:dex                                    # in the Dev Container
```

Login options: *Dex Mock* (no password), *Dex Mock…* / *Email* with `certbot`
/ `certbot@example.com` and password `secret`.


### 🗂️ Project structure

| path | content |
| --- | --- |
| `app/pages/`, `app/layouts/`, `app/components/` | Vue pages, layout and components |
| `app/plugins/auth.client.ts` | OIDC login (`$auth`), mock and demo login |
| `app/plugins/api.ts` | API client `$api` – picks the backend and attaches the token |
| `app/composables/` | shared data sources (`useCaList`, `useCertificates`, …), claim form, notifications |
| `app/utils/` | plain helpers: backend selection, demo session, error text, CA profiles |
| `app/middleware/auth.global.ts` | route protection (`definePageMeta({ auth: false })` for public pages) |
| `server/routes/mock/` | mock backend |
| `server/utils/mockStore.ts` | in-memory data, one sandbox per demo visitor |
| `public/` | static files incl. `openapi.yaml` |

`public/openapi.yaml` is a copy of the DNS3L API description. Update it when
the API changes:

```bash
curl -fsSL https://raw.githubusercontent.com/dns3l/dns3l/master/openapi.yaml -o public/openapi.yaml
```

### 🤖 AI assistance

Much of this repository was written with Claude with the model Opus 5 - high. The 80/20 rule describes it
well: the migration from Nuxt 2 to Nuxt 4, the new interface, the mock
backend, demo mode and the Dex login theme in [dns3l/auth][3] came together
fast that way.