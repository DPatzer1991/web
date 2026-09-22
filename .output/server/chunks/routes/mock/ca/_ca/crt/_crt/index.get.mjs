import { d as defineEventHandler, g as getRouterParam } from '../../../../../../nitro/nitro.mjs';
import { a as requireToken, b as mockPem } from '../../../../../../_/mockStore.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const index_get = defineEventHandler((event) => {
  requireToken(event);
  return mockPem(decodeURIComponent(getRouterParam(event, "crt")));
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
