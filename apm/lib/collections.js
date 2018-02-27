Apps = new Mongo.Collection('apps');
KadiraData.Apps = Apps;
PendingUsers = new Mongo.Collection('pendingUsers');
Alerts = new Mongo.Collection('alerts');
ErrorsMeta = new Mongo.Collection('errorsMeta');

MapReduceProfileConfig = new Mongo.Collection('mapReduceProfileConfig');
ErrorTraces = new Mongo.Collection('errorTraces');
ErrorMetrics = new Mongo.Collection('errorMetrics');
AppStats = new Mongo.Collection('appStats');
MethodsMetrics = new Mongo.Collection('methodsMetrics');
MethodTraces = new Mongo.Collection('methodsTraces');
RawErrorMetrics = new Mongo.Collection('rawErrorMetrics');
RawMethodsMetrics = new Mongo.Collection('rawMethodsMetrics');
RawPubMetrics = new Mongo.Collection('rawPubMetrics');
RawSystemMetrics = new Mongo.Collection('rawSystemMetrics');
PubTraces = new Mongo.Collection('pubTraces');
PubMetrics = new Mongo.Collection('pubMetrics');
SystemMetrics = new Mongo.Collection('systemMetrics');
RmaLogs = new Mongo.Collection('rmaLogs');

if (Meteor.isServer) {
  const idIndex = {
    'id.appId': 1,
    'id.host': 1,
    'id.time': -1,
    'id.res': 1
  };
  const aggregationMetricsIndex = {
    'value.res': 1,
    'value.appId': 1,
    'value.startTime': -1
  };
  const cleanupMetricsIndex = {
    'value.startTime': 1
  };
  SystemMetrics.rawCollection().createIndex(idIndex);
  MethodsMetrics.rawCollection().createIndex(idIndex);
  PubMetrics.rawCollection().createIndex(idIndex);
  ErrorMetrics.rawCollection().createIndex(idIndex);
  SystemMetrics.rawCollection().createIndex(aggregationMetricsIndex);
  MethodsMetrics.rawCollection().createIndex(aggregationMetricsIndex);
  PubMetrics.rawCollection().createIndex(aggregationMetricsIndex);
  ErrorMetrics.rawCollection().createIndex(aggregationMetricsIndex);
  SystemMetrics.rawCollection().createIndex(cleanupMetricsIndex);
  MethodsMetrics.rawCollection().createIndex(cleanupMetricsIndex);
  PubMetrics.rawCollection().createIndex(cleanupMetricsIndex);
  ErrorMetrics.rawCollection().createIndex(cleanupMetricsIndex);

  AppStats.rawCollection().createIndex({
    'value.res': 1,
    'value.appId': 1,
    'value.host': 1,
    'value.startTime': -1
  });

  MethodTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 });
  PubTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 });
  ErrorTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 });
  
  // Essential indexes to keep CPU load down                                                                           
  ErrorMetrics.rawCollection().createIndex({id:1});                                                                    
  SystemMetrics.rawCollection().createIndex({id:1});                                                                   
  MethodsMetrics.rawCollection().createIndex({id:1});                                                                  
  PubMetrics.rawCollection().createIndex({id:1}); 
}
