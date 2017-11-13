incrementalAggregation = function(PROFILE, PROVIDER) {
  var Log = { profile: PROFILE.name, provider: PROVIDER.name };

  var SourceCollection = PROFILE.resolution ? PROVIDER.collection : PROVIDER.rawCollection;
  var DestCollection = PROVIDER.collection;
  var scope = PROVIDER.scope;
  scope.PROFILE = PROFILE;

  var query = {
    'value.res': PROFILE.resolution || null,
    // this is to trick MongoDB and use the single compound index
    // for queries with appId and not
    // in this case, we need to get all the apps
    'value.appId': { $ne: 'c90153bf-147d-41e5-86e7-584872a61d2b' }
  };

  Log.startedAt = new Date();

  var profileConfigQuery = {
    profile: PROFILE.name,
    provider: PROVIDER.name
  };

  var config = MapReduceProfileConfig.findOne(profileConfigQuery);
  if (!config) {
    const now = new Date();
    const values = [
      { profile: '1min', provider: 'methods' },
      { profile: '1min', provider: 'errors' },
      { profile: '1min', provider: 'pubsub' },
      { profile: '1min', provider: 'system' },
      { profile: '3hour', provider: 'methods' },
      { profile: '3hour', provider: 'errors' },
      { profile: '3hour', provider: 'pubsub' },
      { profile: '3hour', provider: 'system' },
      { profile: '30min', provider: 'methods' },
      { profile: '30min', provider: 'errors' },
      { profile: '30min', provider: 'pubsub' },
      { profile: '30min', provider: 'system' }
    ];
    values.forEach(value => {
      MapReduceProfileConfig.insert({
        lastTime: now,
        profile: value.profile,
        provider: value.provider
      });
    });
    config = MapReduceProfileConfig.findOne(profileConfigQuery);
  }

  var lastTime = config.lastTime.getTime();

  // We must normalize the time. Otherwise, we'll be loading values for half of
  // single time range. It will leads for wrong counts.
  // That will lead to wrong rates. This will fix it.
  var begin = timeRound(lastTime - PROFILE.reverseMillis, PROFILE);

  query['value.startTime'] = {
    $gte: new Date(begin),
    $lt: Log.startedAt
  };
  //applying map reduce
  const options = {
    query: query,
    out: { merge: DestCollection._name },
    sort: {
      'value.res': 1,
      'value.startTime': 1
    },
    finalize: PROVIDER.finalize,
    scope: scope,
    jsMode: true
  };
  //console.log("  Using local MR");
  MapReduce(SourceCollection, DestCollection, PROVIDER.map, PROVIDER.reduce, options);
  Log.elapsedTime = Date.now() - Log.startedAt.getTime();

  var entry = DestCollection.findOne({
    // we are using following query and sort because of the index we are utilizing
    'value.res': PROFILE.name
  });

  // this is debug check to see whether we can use this
  if (entry) {
    var startFrom = normalizeToMin(Log.startedAt.getTime());

    var selector = profileConfigQuery;
    var modifier = {
      $set: {
        lastTime: startFrom
      }
    };

    MapReduceProfileConfig.update(selector, modifier, { upsert: true });
    RmaLogs.insert(Log);
  } else {
    console.log('very strange! - no entries found');
  }
};
