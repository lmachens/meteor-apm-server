Meteor.startup(() => {
    const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    setInterval(() => {   
        console.log('start incremental aggregation')     ;
        incrementalAggregation(db, PROFILES['1min'], PROVIDERS['errors']);
        incrementalAggregation(db, PROFILES['1min'], PROVIDERS['methods']);
        incrementalAggregation(db, PROFILES['1min'], PROVIDERS['pubsub']);
        incrementalAggregation(db, PROFILES['1min'], PROVIDERS['system']);
        incrementalAggregation(db, PROFILES['30min'], PROVIDERS['errors']);
        incrementalAggregation(db, PROFILES['30min'], PROVIDERS['methods']);
        incrementalAggregation(db, PROFILES['30min'], PROVIDERS['pubsub']);
        incrementalAggregation(db, PROFILES['30min'], PROVIDERS['system']);
        incrementalAggregation(db, PROFILES['3hour'], PROVIDERS['errors']);
        incrementalAggregation(db, PROFILES['3hour'], PROVIDERS['methods']);
        incrementalAggregation(db, PROFILES['3hour'], PROVIDERS['pubsub']);
        incrementalAggregation(db, PROFILES['3hour'], PROVIDERS['system']);
    }, 60000);
});