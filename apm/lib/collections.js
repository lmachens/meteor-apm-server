Apps = new Mongo.Collection("apps");
KadiraData.Apps = Apps;
PendingUsers = new Mongo.Collection("pendingUsers");
Alerts = new Mongo.Collection("alerts");
ErrorsMeta = new Mongo.Collection("errorsMeta");

MapReduceProfileConfig = new Mongo.Collection("mapReduceProfileConfig");
RawErrorMetrics = new Mongo.Collection("rawErrorMetrics");
ErrorMetrics = new Mongo.Collection("errorMetrics");
AppStats = new Mongo.Collection("appStats");
ProdStats = new Mongo.Collection("prodStats");
MethodsMetrics = new Mongo.Collection("methodsMetrics");
MethodTraces = new Mongo.Collection("methodsTraces");
RawMethodsMetrics = new Mongo.Collection("rawMethodsMetrics");
PubMetrics = new Mongo.Collection("pubMetrics");
RawPubMetrics = new Mongo.Collection("rawPubMetrics");
SystemMetrics = new Mongo.Collection("systemMetrics");
RawSystemMetrics = new Mongo.Collection("rawSystemMetrics");
RmaLogs = new Mongo.Collection("rmaLogs");

AppStats.rawCollection().createIndex({
  "value.appId": 1,
  "value.host": 1,
  "value.startTime": 1
});
SystemMetrics.rawCollection().createIndex({
  "value.appId": 1,
  "value.host": 1,
  "value.startTime": 1
});
MethodTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 });
PubTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 });
ErrorTraces.rawCollection().createIndex({ appId: 1, host: 1, startTime: 1 });
RawMethodsMetrics.rawCollection().createIndex({
  "value.appId": 1,
  "value.host": 1,
  "value.startTime": 1
});
MethodsMetrics.rawCollection().createIndex({
  "value.appId": 1,
  "value.host": 1,
  "value.startTime": 1
});
RawPubMetrics.rawCollection().createIndex({
  "value.appId": 1,
  "value.host": 1,
  "value.startTime": 1
});
PubMetrics.rawCollection().createIndex({
  "value.appId": 1,
  "value.host": 1,
  "value.startTime": 1
});
RawSystemMetrics.rawCollection().createIndex({
  "value.appId": 1,
  "value.host": 1,
  "value.startTime": 1
});
RawErrorMetrics.rawCollection().createIndex({
  "value.appId": 1,
  "value.host": 1,
  "value.startTime": 1
});
ErrorMetrics.rawCollection().createIndex({
  "value.appId": 1,
  "value.host": 1,
  "value.startTime": 1
});
ProdStats.rawCollection().createIndex({
  appId: 1,
  metric: 1
});
