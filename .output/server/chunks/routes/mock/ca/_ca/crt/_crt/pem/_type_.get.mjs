import { d as defineEventHandler, g as getRouterParam, c as createError, a as setHeader } from '../../../../../../../nitro/nitro.mjs';
import { a as requireToken, b as mockPem, t as trimDot } from '../../../../../../../_/mockStore.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _type__get = defineEventHandler((event) => {
  requireToken(event);
  const crt = decodeURIComponent(getRouterParam(event, "crt"));
  const type = getRouterParam(event, "type");
  const pem = mockPem(crt)[type];
  if (!pem) throw createError({ statusCode: 404, statusMessage: "Unknown PEM type" });
  setHeader(event, "Content-Type", "application/x-pem-file");
  setHeader(event, "Content-Disposition", `attachment; filename="${trimDot(crt)}.${type}.pem"`);
  return pem;
});

export { _type__get as default };
//# sourceMappingURL=_type_.get.mjs.map
