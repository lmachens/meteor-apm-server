MapReduce = function(SourceColl, OutCollection, map, reduce, options) {
  var finalize = options.finalize;
  var query = options.query;
  var mrContext = options.scope || {};

  for (let key in mrContext) {
    this[key] = mrContext[key];
  }
  this['emit'] = function() {};

  var emittedData = {};
  var data = SourceColl.find(query);
  var count = data.count();
  var startAt = Date.now();

  data.fetch().forEach(function(d) {
    var response = map.call(d);
    var k = JSON.stringify(response[0]);
    if (!emittedData[k]) {
      emittedData[k] = [];
    }

    emittedData[k].push(response[1]);
  });

  var diff = Date.now() - startAt;
  console.log(`   fetched ${count} of ${SourceColl._name} in ${diff} ms'`);

  var bulk = OutCollection.rawCollection().initializeOrderedBulkOp();

  var empty = true;
  for (var k in emittedData) {
    empty = false;
    var key = JSON.parse(k);
    key.time = new Date(key.time);
    var reducedData = reduce(key, emittedData[k]);
    var finalValue = finalize(key, reducedData);
    bulk
      .find({ id: key })
      .upsert()
      .updateOne({ $set: { value: finalValue } });
  }

  startAt = Date.now();
  if (!empty) {
    Meteor.wrapAsync(bulk.execute, bulk)();
  }
  diff = Date.now() - startAt;
  console.log(`   writing completed in ${diff} ms`);
};
