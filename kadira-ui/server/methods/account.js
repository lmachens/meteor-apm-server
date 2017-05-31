import LRU from 'lru-cache'

KadiraAccounts = {};
Stripe = StripeHelper.getStripe();

var usageCache = new LRU({max: 1000, maxAge: 1000 * 60 * 15});


KadiraAccounts._getMedianHostCount = function(hostUsageByTime, noDataCount) {
  hostUsageByTime = hostUsageByTime || [];
  if(hostUsageByTime.length === 0){
    return 0;
  }
  var values = _.chain(hostUsageByTime)
                  .pluck("count")
                  .sortBy(function(num) { return num})
                  .value();
  var missingDataArr = Array(noDataCount).fill(0);
  values = missingDataArr.concat(values);

  var half = Math.floor(values.length / 2);
  var median;
  if(values.length % 2) {
    median = values[half];
  } else {
    median = (values[half - 1] + values[half]) / 2
  }
  return Math.floor(median);
};

function getMetaData(user, otherInfo) {
  var metadata = {userId: user._id};
  if(user.billingInfo) {
    _.extend(metadata, user.billingInfo);
  } else {
    _.extend(metadata, otherInfo);
  }
  return metadata;
}

function getSubscriptionStartDate(user) {
  var start;
  if(user.stripe && user.stripe.subscriptionStart){
    start = user.stripe.subscriptionStart;
  } else if(user.stripe && !user.stripe.subscriptionStart) {
    // This is a temporary fix to set start time for already migrated users
    var subInfo = Stripe.customers.retrieveSubscription(
      user.stripe.customerId,
      user.stripe.subscriptionId
    );
    start = new Date(subInfo.start * 1000);
    Meteor.users.update({_id: user._id}, {$set: {
      "stripe.subscriptionStart": start
    }});
  } else {
    start = user.createdAt;
  }
  return start;
}

function getBillingStartDate(start) {
  var now = new Date();
  var billingStart = new Date(start);
  billingStart.setFullYear(now.getFullYear());
  billingStart.setMonth(now.getMonth());

  // start from previous month if we're behind billing date
  // e.g.
  //  billing on 10th Oct, current date is 8th October
  //  so current billing cycle starts from September
  if(now.getDate() < billingStart.getDate()) {
    billingStart.setMonth(billingStart.getMonth() - 1);
  }

  return billingStart;
}

function missingDataPointsCount(data, startDate, endDate) {
  // TODO use dates from start and end from billing cycle
  const timeDiff = endDate.getTime() - startDate.getTime();

  const count = Math.floor(timeDiff / (3600 * 1000));
  const diff = count - data.length;
  if(diff > 0) {
    return diff
  } else {
    return 0;
  }
}

function getBillingEndDate(start) {
  var d = getBillingStartDate(start);
  var mEndDate = moment(d).add(1, "months");
  return mEndDate.toDate();
}

function calculateTotalHostsUsage(usageByApp) {
  if(_.isEmpty(usageByApp)){
    return 0;
  }
  return _.reduce(usageByApp, function(total, count){ return total + count; });
}

function getAppsMap(userId) {
  var appsMap = {};
  Apps.find({
    owner: userId,
    plan:{$nin: ["free"]}
  }).fetch().forEach(function(app) {
    appsMap[app._id] = app;
  });
  return appsMap;
}

KadiraAccounts.checkIsAppDowngradable = function(app, plan) {
  var alertsGap = getAlertsGap(app._id, plan);
  if(alertsGap < 0) {
    var alerts = alertsGap * -1;
    throw new Meteor.Error(403, "You need remove " +
      alerts + " alert(s) from \'" + app.name +"\' to downgrade.");
  }

  var collaboratorsGap = getCollaboratorsGap(app._id, plan);
  console.log(app, plan, collaboratorsGap, alertsGap)
  if(collaboratorsGap < 0) {
    var collaborators = collaboratorsGap * -1;
    throw new Meteor.Error(403, "You need remove " +
      collaborators + " collaborator(s) from \'" +
      app.name +"\' to downgrade.");
  }
};
