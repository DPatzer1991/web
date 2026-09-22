import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { m as mockCrts } from '../../_/mockStore.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const ca_get = defineEventHandler(() => {
  var _a, _b, _c, _d;
  return [
    {
      id: "le",
      name: "Let's Encrypt",
      desc: "Public ACME CA (Mock)",
      type: "public",
      acme: true,
      enabled: true,
      logo: "/le.png",
      url: "https://letsencrypt.org",
      roots: "https://letsencrypt.org/certificates/",
      totalValid: ((_a = mockCrts.le) != null ? _a : []).length,
      totalIssued: ((_b = mockCrts.le) != null ? _b : []).length + 1
    },
    {
      id: "step",
      name: "Step CA",
      desc: "Private ACME CA (Mock)",
      type: "private",
      acme: true,
      enabled: true,
      logo: "/ss.png",
      url: "https://smallstep.com",
      roots: "",
      totalValid: ((_c = mockCrts.step) != null ? _c : []).length,
      totalIssued: ((_d = mockCrts.step) != null ? _d : []).length
    }
  ];
});

export { ca_get as default };
//# sourceMappingURL=ca.get.mjs.map
