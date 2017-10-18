PermissionsMananger.defineAction('data_access', ['collaborator', 'owner', 'admin']);

Apps = new Meteor.Collection('apps');
Apps.remove({});

// create the root user
Meteor.users.remove({});
RootUserId = Accounts.createUser({ username: 'root', password: 'toor' });

createAppForUser(RootUserId, 'appId');

GetClient = function() {
  var client = DDP.connect(process.env.ROOT_URL);

  var loginInfo = {
    user: { username: 'root' },
    password: 'toor'
  };

  Meteor.wrapAsync(client.call, client)('login', loginInfo);
  return client;
};

function createAppForUser(userId, appId) {
  appId = appId || Random.id();
  Apps.insert({ _id: appId, owner: userId });
  return appId;
}
CreateAppForUser = createAppForUser;

// DataColl = new Mongo.Collection('data-coll');

GetRawDataColl = function(appId) {
  var dbConn = KadiraData.getConnectionForApp(appId);
  var mongoDataColl = dbConn.collection('data-coll');
  return mongoDataColl;
};

var dbConn = KadiraData.getConnectionForApp('appId');
var mongoBrowserDataColl = dbConn.collection('browser-data-coll');
// send data to the browser
SetBrowserData = function() {
  var payload = { _id: 'one', aa: 10 };
  Meteor.wrapAsync(mongoBrowserDataColl.remove, mongoBrowserDataColl)({});
  Meteor.wrapAsync(mongoBrowserDataColl.insert, mongoBrowserDataColl)(payload);
};
SetBrowserData();

KadiraData.defineMetrics('browser-metrics', mongoBrowserDataColl.collectionName, function() {
  return [{ $match: {} }];
});
KadiraData.defineTraces('browser-traces', mongoBrowserDataColl.collectionName, function() {
  //to delay in "Client - fetchTraces - fetch traces with time related data - not caching" test
  Meteor._sleepForMs(200);
  return [{ $match: {} }];
});
