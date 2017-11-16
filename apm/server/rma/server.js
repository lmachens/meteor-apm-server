async function runAll() {
  const startTime = new Date();
  await incrementalAggregation(PROFILES['1min'], PROVIDERS['errors']);
  await incrementalAggregation(PROFILES['1min'], PROVIDERS['methods']);
  await incrementalAggregation(PROFILES['1min'], PROVIDERS['pubsub']);
  await incrementalAggregation(PROFILES['1min'], PROVIDERS['system']);
  await incrementalAggregation(PROFILES['30min'], PROVIDERS['errors']);
  await incrementalAggregation(PROFILES['30min'], PROVIDERS['methods']);
  await incrementalAggregation(PROFILES['30min'], PROVIDERS['pubsub']);
  await incrementalAggregation(PROFILES['30min'], PROVIDERS['system']);
  await incrementalAggregation(PROFILES['3hour'], PROVIDERS['errors']);
  await incrementalAggregation(PROFILES['3hour'], PROVIDERS['methods']);
  await incrementalAggregation(PROFILES['3hour'], PROVIDERS['pubsub']);
  await incrementalAggregation(PROFILES['3hour'], PROVIDERS['system']);

  cleanup(startTime);

  runAll();
}

Meteor.startup(() => {
  runAll();
});
