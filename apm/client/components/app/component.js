var mainNavigation = [
  {
    section: 'dashboard',
    label: 'Dashboard',
    component: 'app.dashboard',
    defaultSubNav: 'overview'
  },
  {
    section: 'errors',
    label: 'Errors',
    component: 'app.errors',
    defaultSubNav: 'overview'
  }
];

var component = FlowComponents.define('app', function() {
  this.autorun(function() {
    var app = this.getCurrentApp() || {};
    var appId = app._id;
    var appSecret = app.secret;
    this.set('appId', appId);
    this.set('secret', appSecret);
  });
});

component.state.navs = function() {
  var section = FlowRouter.getParam('section');
  var appId = FlowRouter.getParam('appId');
  UrlStateManager.watch();

  mainNavigation.forEach(function(nav) {
    nav.active = nav.section === section ? true : false;
    var defaults = {
      subSection: nav.defaultSubNav
    };
    nav.url = UrlStateManager.pathTo(appId, nav.section, null, defaults);
  });
  return mainNavigation;
};

component.state.hasNoData = function() {
  var app = this.getCurrentApp();
  return !app || !app.initialDataReceived;
};

component.state.hasNoApp = function() {
  return !this.getCurrentApp();
};

component.state.isLoading = function() {
  return true;
};

component.prototype.getCurrentApp = function() {
  var appId = FlowRouter.getParam('appId');
  var fields = { initialDataReceived: 1, secret: 1 };
  var app = Apps.findOne({ _id: appId }, { fields: fields });
  return app;
};

component.state.sectionComponent = function() {
  var section = FlowRouter.getParam('section');
  var component = '';
  mainNavigation.forEach(function(buttonInfo) {
    if (buttonInfo.section === section) {
      component = buttonInfo.component;
    }
  });
  return component;
};

component.state.ranges = function() {
  var rangesArr = [];
  var rangesInfo = KadiraData.Ranges.all;
  for (var range in rangesInfo) {
    rangesArr.push({
      label: i18n(rangesInfo[range].label),
      value: rangesInfo[range].value
    });
  }
  return rangesArr;
};

component.state.selectedRange = function() {
  var range = this.getRange();
  return range;
};

component.state.canShowHostSelector = function() {
  var routeName = FlowRouter.current().route.name;
  var currentSection = FlowRouter.getParam('section');
  var unAllowedSections = ['errors'];

  var canShow = unAllowedSections.reduce(function(prev, section) {
    if (routeName === 'app' && section !== currentSection) {
      return prev && true;
    } else {
      return false;
    }
  }, true);

  return canShow;
};

component.action.setRangeQueryParam = function(range) {
  FlowRouter.setQueryParams({ range: range });
};

component.extend(Mixins.Params);
