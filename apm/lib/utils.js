Utils = {};
Utils.prettyDate = function(date) {
  return moment(date).format('dddd, MMM DD, YYYY HH:mm');
};
