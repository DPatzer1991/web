import { d as defineEventHandler, g as getRouterParam } from '../../../../nitro/nitro.mjs';
import { m as mockCrts } from '../../../../_/mockStore.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const index_get = defineEventHandler((event) => {
  var _a;
  const ca = getRouterParam(event, "ca");
  return (_a = mockCrts[ca]) != null ? _a : [];
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
