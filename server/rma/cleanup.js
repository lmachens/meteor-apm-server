// Set maximum metrics lifetime (Default 7 days)
const metricsLifetime = Meteor.settings.metricsLifetime || 1000 * 60 * 60 * 24 * 7;
const rawCollections = [RawErrorMetrics, RawMethodsMetrics, RawPubMetrics, RawSystemMetrics];
const collections = [ErrorMetrics, MethodsMetrics, PubMetrics, SystemMetrics];

cleanup = function(startTime) {
  var startAt = Date.now();
  let removed = 0;
  rawCollections.forEach(
    rawCollection =>
      (removed += rawCollection.remove({
        'value.startTime': {
          $lt: startTime
        }
      }))
  );

  const dateLessThan = new Date(startTime.getTime() - metricsLifetime);
  collections.forEach(
    collection =>
      (removed += collection.remove({
        'value.startTime': {
          $lt: dateLessThan
        }
      }))
  );
  var diff = Date.now() - startAt;
  console.log(`   cleaned up ${removed} in ${diff} ms`);
};
