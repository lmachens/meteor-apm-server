Template["app.hostSelector"].events({
  "click .drop-down-item": function (e) {
    e.preventDefault();
    FlowComponents.callAction("selectItem", this.value);
  }
});