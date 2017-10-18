var component = FlowComponents.define('app.hostSelector', function() {
  this.autorun(function() {
    this.nameForMetric = 'hosts';
    var dataKey = 'hosts';

    var args = this.getArgs();
    this.kdFindMetrics(this.nameForMetric, dataKey, args);
  });
});

component.extend(KadiraData.FlowMixin);
component.extend(Mixins.Params);

component.state.selectedHost = function() {
  var host = FlowRouter.getQueryParam('host') || 'All Hosts';
  return host;
};

component.state.hosts = function() {
  var data = this.kdMetrics(this.nameForMetric).fetch() || [];

  var retObj = [
    {
      label: 'All Hosts',
      value: 'All Hosts'
    }
  ];

  data.forEach(function(d) {
    var obj = {
      label: d._id,
      value: d._id
    };
    retObj.push(obj);
  });

  return retObj;
};

component.state.isSelected = function(value) {
  return value === this.get('selectedHost');
};

component.state.selectedLabel = function() {
  var data = this.get('hosts') || [];
  data[0] = data[0] || {};
  var selecteValue = this.get('selectedHost') || data[0].value;
  var label;
  data.forEach(function(d) {
    if (d.value === selecteValue) {
      label = d.label;
    }
  });
  return label;
};

component.action.selectItem = function(selectedValue) {
  this.set('selected', selectedValue);

  if (selectedValue === 'All Hosts') {
    FlowRouter.setQueryParams({ host: null });
  } else {
    FlowRouter.setQueryParams({ host: selectedValue });
  }
};
