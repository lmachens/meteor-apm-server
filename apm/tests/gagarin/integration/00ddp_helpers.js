DdpHelpers = {};

DdpHelpers.createUser = function(server, fields) {
  var userId = server.createUser(fields);
  return userId;
};

DdpHelpers.createApp = function(appName) {
  return this.call('apps.create', [appName]);
};
