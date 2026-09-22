import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const rtzn_get = defineEventHandler(() => [
  { root: "example.com.", autodns: "mock", acmedns: "mock" },
  { root: "example.org.", autodns: null, acmedns: "mock" }
]);

export { rtzn_get as default };
//# sourceMappingURL=rtzn.get.mjs.map
