Apps = new Mongo.Collection("apps");
KadiraData.Apps = Apps;
PendingUsers = new Mongo.Collection("pendingUsers");
Alerts = new Mongo.Collection("alerts");
ErrorsMeta = new Mongo.Collection("errorsMeta");

MapReduceProfileConfig = new Mongo.Collection("mapReduceProfileConfig");
RawErrorMetrics = new Mongo.Collection("rawErrorMetrics");
ErrorMetrics = new Mongo.Collection("errorMetrics");
ProdStats = new Mongo.Collection("prodStats");
MethodsMetrics = new Mongo.Collection("methodsMetrics");
RawMethodsMetrics = new Mongo.Collection("rawMethodsMetrics");
PubMetrics = new Mongo.Collection("pubMetrics");
RawPubMetrics = new Mongo.Collection("rawPubMetrics");
SystemMetrics = new Mongo.Collection("systemMetrics");
RawSystemMetrics = new Mongo.Collection("rawSystemMetrics");
RmaLogs = new Mongo.Collection("rmaLogs");