import { inflateEvents } from './utils/trace';
import { setDefinition } from './';

setDefinition('meteor-method-trace', async function(dl, args) {
  const _id = String(args.traceId);
  const result = await dl.findOne('methodTraces', { _id });

  if (!result) {
    return null;
  }

  return inflateEvents(result);
});
