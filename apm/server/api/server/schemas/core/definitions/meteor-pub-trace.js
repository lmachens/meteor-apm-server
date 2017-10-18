import { inflateEvents } from './utils/trace';
import { setDefinition } from './';

setDefinition('meteor-pub-trace', async function(dl, args) {
  const _id = String(args.traceId);
  const result = await dl.findOne('pubTraces', { _id });

  if (!result) {
    return null;
  }

  return inflateEvents(result);
});
