import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const info_get = defineEventHandler(() => ({
  version: { daemon: "mock", api: "mock" },
  contact: {
    email: ["dns3l@example.com"],
    url: "https://github.com/dns3l"
  }
}));

export { info_get as default };
//# sourceMappingURL=info.get.mjs.map
