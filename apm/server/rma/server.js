import Fiber from 'fibers';

function runAll() {
  //console.log("start incremental aggregation");
  Fiber(() => {
    incrementalAggregation(PROFILES['1min'], PROVIDERS['errors']);
    incrementalAggregation(PROFILES['1min'], PROVIDERS['methods']);
    incrementalAggregation(PROFILES['1min'], PROVIDERS['pubsub']);
    incrementalAggregation(PROFILES['1min'], PROVIDERS['system']);
    incrementalAggregation(PROFILES['30min'], PROVIDERS['errors']);
    incrementalAggregation(PROFILES['30min'], PROVIDERS['methods']);
    incrementalAggregation(PROFILES['30min'], PROVIDERS['pubsub']);
    incrementalAggregation(PROFILES['30min'], PROVIDERS['system']);
    incrementalAggregation(PROFILES['3hour'], PROVIDERS['errors']);
    incrementalAggregation(PROFILES['3hour'], PROVIDERS['methods']);
    incrementalAggregation(PROFILES['3hour'], PROVIDERS['pubsub']);
    incrementalAggregation(PROFILES['3hour'], PROVIDERS['system']);
  }).run();
}

Meteor.startup(() => {
  setInterval(runAll, 60000);
});
