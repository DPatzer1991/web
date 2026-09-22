import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { r as resetMock } from '../../_/mockStore.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _reset_post = defineEventHandler(() => {
  resetMock();
  return { reset: true };
});

export { _reset_post as default };
//# sourceMappingURL=_reset.post.mjs.map
