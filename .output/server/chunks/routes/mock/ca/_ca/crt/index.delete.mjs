import { d as defineEventHandler, g as getRouterParam, s as setResponseStatus } from '../../../../../nitro/nitro.mjs';
import { a as requireToken, t as trimDot, m as mockCrts } from '../../../../../_/mockStore.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const index_delete = defineEventHandler((event) => {
  var _a;
  requireToken(event);
  const ca = getRouterParam(event, "ca");
  const crt = decodeURIComponent(getRouterParam(event, "crt"));
  const list = (_a = mockCrts[ca]) != null ? _a : [];
  const i = list.findIndex((c) => trimDot(c.name) === trimDot(crt));
  if (i < 0) {
    setResponseStatus(event, 404);
    return { code: 404, message: "Certificate not found" };
  }
  list.splice(i, 1);
  return { code: 200, message: "deleted" };
});

export { index_delete as default };
//# sourceMappingURL=index.delete.mjs.map
