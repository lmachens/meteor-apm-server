const minTimeShort = 60 * 1000;
const minTimeMedium = 30 * 60 * 1000;
const minTimeLong = 3 * 60 * 60 * 1000;

async function runShort() {
  const startTime = new Date();

  await incrementalAggregation(PROFILES['1min'], PROVIDERS['errors']);
  await incrementalAggregation(PROFILES['1min'], PROVIDERS['methods']);
  await incrementalAggregation(PROFILES['1min'], PROVIDERS['pubsub']);
  await incrementalAggregation(PROFILES['1min'], PROVIDERS['system']);

  var diff = Date.now() - startTime;
  // Call the next aggregation max. once in every {minTime} ms
  if (diff > minTimeShort) {
    runShort();
  } else {
    setTimeout(runShort, minTimeShort - diff);
  }
}

async function runMedium() {
  const startTime = new Date();

  await incrementalAggregation(PROFILES['30min'], PROVIDERS['errors']);
  await incrementalAggregation(PROFILES['30min'], PROVIDERS['methods']);
  await incrementalAggregation(PROFILES['30min'], PROVIDERS['pubsub']);
  await incrementalAggregation(PROFILES['30min'], PROVIDERS['system']);

  var diff = Date.now() - startTime;
  // Call the next aggregation max. once in every {minTime} ms
  if (diff > minTimeMedium) {
    runMedium();
  } else {
    setTimeout(runMedium, minTimeMedium - diff);
  }
}

async function runLong() {
  const startTime = new Date();

  await incrementalAggregation(PROFILES['3hour'], PROVIDERS['errors']);
  await incrementalAggregation(PROFILES['3hour'], PROVIDERS['methods']);
  await incrementalAggregation(PROFILES['3hour'], PROVIDERS['pubsub']);
  await incrementalAggregation(PROFILES['3hour'], PROVIDERS['system']);

  cleanup(startTime);

  var diff = Date.now() - startTime;
  // Call the next aggregation max. once in every {minTime} ms
  if (diff > minTimeLong) {
    runLong();
  } else {
    setTimeout(runLong, minTimeLong - diff);
  }
}

Meteor.startup(() => {
  runShort();
  runMedium();
  runLong();
});
