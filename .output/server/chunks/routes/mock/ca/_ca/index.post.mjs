import { d as defineEventHandler, g as getRouterParam, r as readBody, c as createError, s as setResponseStatus } from '../../../../nitro/nitro.mjs';
import { a as requireToken, m as mockCrts, t as trimDot, c as mockCrt } from '../../../../_/mockStore.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  requireToken(event);
  const ca = getRouterParam(event, "ca");
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.name)) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request", data: { message: "name missing" } });
  }
  const list = (_b = (_a = mockCrts)[ca]) != null ? _b : _a[ca] = [];
  if (list.some((c) => trimDot(c.name) === trimDot(body.name))) {
    setResponseStatus(event, 409);
    return { code: 409, message: "Certificate already exists" };
  }
  await new Promise((r) => setTimeout(r, 1500));
  const crt = mockCrt(body.name, !!body.wildcard, 0, 90);
  list.push(crt);
  setResponseStatus(event, 201);
  return crt;
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
