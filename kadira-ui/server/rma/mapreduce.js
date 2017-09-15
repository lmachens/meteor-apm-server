MapReduce = function (SourceColl, OutCollection, map, reduce, options) {
  var finalize = options.finalize;
  var query = options.query;
  var mrContext = options.scope || {};
  var statMap = {};

  for(var key in mrContext) {
    this[key] = mrContext[key];
  }
  this['emit'] = function() {};
  
  var emittedData = {};
  var data = SourceColl.find(query);
  var count = data.count();  
  var startAt = Date.now();
  //console.log("   need to fetch: " + count, SourceColl._name);

  data.forEach(function(d) {
    var response = map.call(d);
    var k = JSON.stringify(response[0]);
    if(!emittedData[k]) {
      emittedData[k] = [];
    }

    // hacking mapreduce to monitor app stats
    var statId = {
      time: new Date(startAt),
      appId: response[0].appId,
      metric: OutCollection._name,
      res: response[0].res
    };

    var strStatId = statId.time.getTime() + statId.appId + statId.metric + statId.res;

    if (statMap[strStatId]) {
      statMap[strStatId].count += 1;
    } else {
      statMap[strStatId] = statId;
      statMap[strStatId].count = 1;
      statMap[strStatId].id = strStatId;
    }

    emittedData[k].push(response[1]);
  });

  //var diff = Date.now() - startAt;
  //console.log("   fetched in: " + diff + " ms");

  var bulk = OutCollection.rawCollection().initializeOrderedBulkOp();

  var empty = true;
  for (var k in emittedData) {
    empty = false;
    var key = JSON.parse(k);
    key.time = new Date(key.time);
    var reducedData = reduce(key, emittedData[k]);
    var finalValue = finalize(key, reducedData);
    bulk.find({id: key}).upsert().updateOne({$set: {value: finalValue}});
  }
  
  startAt = Date.now();
  //console.log(startAt);
  if (!empty) {
    Meteor.wrapAsync(bulk.execute, bulk)();
  }
  // inserting stats
  var statBulk = ProdStats.rawCollection().initializeUnorderedBulkOp();
  empty = true;
  for (var statStr in statMap) {
    empty = false;
    if (statMap.hasOwnProperty(statStr)) {
      statBulk.insert(statMap[statStr]);
    }
  }
  if (!empty) {
    Meteor.wrapAsync(statBulk.execute, statBulk)();
  }
  diff = Date.now() - startAt;
  //console.log("   writing completed in: " + diff + " ms");
};
