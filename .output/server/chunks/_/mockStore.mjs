import { b as getHeader, c as createError } from '../nitro/nitro.mjs';

const day = 24 * 60 * 60 * 1e3;
const iso = (offsetDays) => new Date(Date.now() + offsetDays * day).toISOString();
let serialCounter = 1e6;
const mockCrt = (name, wildcard = false, from = -10, to = 80) => ({
  name: name.endsWith(".") ? name : name + ".",
  wildcard,
  renewCount: 0,
  serial: String(++serialCounter * 7919),
  claimedOn: iso(from),
  claimedBy: { name: "Mock User", email: "mock@example.com" },
  validFrom: iso(from),
  validTo: iso(to),
  valid: true
});
const initialCrts = () => ({
  le: [
    mockCrt("app.example.com"),
    mockCrt("api.example.com", false, -60, 30),
    mockCrt("example.com", true, -85, 5)
  ],
  step: [
    mockCrt("intern.example.org", false, -2, 88)
  ]
});
const mockCrts = initialCrts();
const resetMock = () => {
  for (const k of Object.keys(mockCrts)) delete mockCrts[k];
  Object.assign(mockCrts, initialCrts());
};
const trimDot = (n) => n.replace(/\.?$/, "");
const mockPem = (name) => {
  const block = (t) => `-----BEGIN ${t}-----
MOCK-${trimDot(name)}
-----END ${t}-----
`;
  const cert = block("CERTIFICATE");
  const chain = block("CERTIFICATE");
  return { cert, chain, key: block("PRIVATE KEY"), fullchain: cert + chain };
};
const requireToken = (event) => {
  var _a;
  const auth = (_a = getHeader(event, "authorization")) != null ? _a : "";
  if (!auth.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized", data: { code: 401, message: "missing bearer token" } });
  }
};

export { requireToken as a, mockPem as b, mockCrt as c, mockCrts as m, resetMock as r, trimDot as t };
//# sourceMappingURL=mockStore.mjs.map
