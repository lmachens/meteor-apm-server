import { inflateEvents, stringifyStacks } from './utils/trace';

import { setDefinition } from './';

setDefinition('meteor-error-trace', async function(dl, args) {
  const _id = String(args.traceId);
  const result = await dl.findOne('errorTraces', { _id });

  if (!result) {
    return null;
  }

  return await inflateEvents(stringifyStacks(result));
});
