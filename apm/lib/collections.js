Apps = new Mongo.Collection('apps');
KadiraData.Apps = Apps;
PendingUsers = new Mongo.Collection('pendingUsers');
Alerts = new Mongo.Collection('alerts');
ErrorsMeta = new Mongo.Collection('errorsMeta');

MapReduceProfileConfig = new Mongo.Collection('mapReduceProfileConfig');
RawErrorMetrics = new Mongo.Collection('rawErrorMetrics');
ErrorTraces = new Mongo.Collection('errorTraces');
ErrorMetrics = new Mongo.Collection('errorMetrics');
AppStats = new Mongo.Collection('appStats');
ProdStats = new Mongo.Collection('prodStats');
MethodsMetrics = new Mongo.Collection('methodsMetrics');
MethodTraces = new Mongo.Collection('methodsTraces');
RawMethodsMetrics = new Mongo.Collection('rawMethodsMetrics');
PubTraces = new Mongo.Collection('pubTraces');
PubMetrics = new Mongo.Collection('pubMetrics');
RawPubMetrics = new Mongo.Collection('rawPubMetrics');
SystemMetrics = new Mongo.Collection('systemMetrics');
RawSystemMetrics = new Mongo.Collection('rawSystemMetrics');
RmaLogs = new Mongo.Collection('rmaLogs');

if (Meteor.isServer) {
  AppStats.rawCollection().createIndex(
    {
      'value.appId': 1,
      'value.host': 1,
      'value.startTime': 1
    },
    { background: true }
  );
  SystemMetrics.rawCollection().createIndex(
    {
      'value.appId': 1,
      'value.host': 1,
      'value.startTime': 1
    },
    { background: true }
  );
  MethodTraces.rawCollection().createIndex(
    { appId: 1, host: 1, startTime: 1 },
    { background: true }
  );
  PubTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 }, { background: true });
  ErrorTraces.rawCollection().createIndex(
    { appId: 1, host: 1, startTime: 1 },
    { background: true }
  );
  MethodsMetrics.rawCollection().createIndex(
    {
      'value.appId': 1,
      'value.host': 1,
      'value.startTime': 1
    },
    { background: true }
  );
  PubMetrics.rawCollection().createIndex(
    {
      'value.appId': 1,
      'value.host': 1,
      'value.startTime': 1
    },
    { background: true }
  );
  ErrorMetrics.rawCollection().createIndex(
    {
      'value.appId': 1,
      'value.host': 1,
      'value.startTime': 1
    },
    { background: true }
  );
  ProdStats.rawCollection().createIndex(
    {
      appId: 1,
      metric: 1
    },
    { background: true }
  );
}
