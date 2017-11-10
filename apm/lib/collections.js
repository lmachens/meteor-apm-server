Apps = new Mongo.Collection('apps');
KadiraData.Apps = Apps;
PendingUsers = new Mongo.Collection('pendingUsers');
Alerts = new Mongo.Collection('alerts');
ErrorsMeta = new Mongo.Collection('errorsMeta');

MapReduceProfileConfig = new Mongo.Collection('mapReduceProfileConfig');
ErrorTraces = new Mongo.Collection('errorTraces');
ErrorMetrics = new Mongo.Collection('errorMetrics');
AppStats = new Mongo.Collection('appStats');
ProdStats = new Mongo.Collection('prodStats');
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
  const metricsIndex = {
    'value.res': 1,
    'value.appId': 1,
    'value.startTime': 1
  };
  SystemMetrics.rawCollection().createIndex(metricsIndex);
  MethodsMetrics.rawCollection().createIndex(metricsIndex);
  PubMetrics.rawCollection().createIndex(metricsIndex);
  ErrorMetrics.rawCollection().createIndex(metricsIndex);

  AppStats.rawCollection().createIndex({
    'value.res': 1,
    'value.appId': 1,
    'value.host': 1,
    'value.startTime': 1
  });

  MethodTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 });
  PubTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 }, { background: true });
  ErrorTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 });

  ProdStats.rawCollection().createIndex({
    appId: 1,
    metric: 1
  });
}
