var component = FlowComponents.define('app.settings.dialog', function() {});

component.state.apmEngineUrl =
  Meteor.settings.public.apmEngineUrl || 'https://apm-engine.YOUR_DOMAIN.com';

component.state.currentAppName = function() {
  var appId = FlowRouter.getParam('appId');
  var app = Apps.findOne({ _id: appId }, { fields: { name: 1 } });
  return app && app.name;
};

component.state.currentAppId = function() {
  return FlowRouter.getParam('appId');
};

component.state.currentAppSecret = function() {
  var appId = FlowRouter.getParam('appId');
  var app = Apps.findOne({ _id: appId }, { fields: { secret: 1 } });
  return app.secret;
};

component.action.updateAppName = function(appName) {
  var appId = FlowRouter.getParam('appId');
  Meteor.call('apps.updateName', appId, appName, function(err) {
    if (err) {
      growlAlert.error(err.reason);
    } else {
      growlAlert.success('Updated app successfully.');
    }
  });
};

component.action.regenerateAppSecret = function() {
  var appId = FlowRouter.getParam('appId');
  Meteor.call('apps.regenerateSecret', appId, function(err) {
    if (err) {
      growlAlert.error(err.reason);
    } else {
      growlAlert.success('Updated appSecret successfully.');
    }
  });
};

component.action.deleteApp = function(appName) {
  var appId = FlowRouter.getParam('appId');
  var app = Apps.findOne({ _id: appId }, { fields: { name: 1 } });
  if (app.name === appName) {
    Meteor.call('apps.delete', appId, function(err) {
      if (err) {
        growlAlert.error(err.reason);
      } else {
        growlAlert.success('App deletion successfully.');
        Meteor.setTimeout(function() {
          FlowRouter.go('/');
        }, 0);
      }
    });
  } else {
    growlAlert.success('Please enter app name correctly to delete this app.');
  }
};

component.state.isOwner = function() {
  var appId = FlowRouter.getParam('appId');
  var app = Apps.findOne(appId) || {};
  var owner = Meteor.users.findOne({ _id: app.owner });
  return !!owner;
};

component.action.resetView = function() {
  resetView();
};

function resetView() {
  $('.app-delete-hidden-control').hide();
  $('#regenerate-confirm').hide();
  $('#regenerate-confirm-cancel').hide();
  $('#delete-app').removeAttr('disabled');
}
