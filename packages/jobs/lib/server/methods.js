var AWS = Npm.require('aws-sdk');

var createAWSFile = function(jobId, callback) {
  callback = callback || function() {};
  var s3 = new AWS.S3();

  AWS.config.region = 'us-east-1';
  var params = {
    Bucket: 'profdata.kadira.io',
    ContentType: 'application/json',
    ACL: 'public-read'
  };
  params['Key'] = jobId + '.js';

  s3.getSignedUrl('putObject', params, callback);
};

var createAWSFileAsync = Meteor.wrapAsync(createAWSFile);

Meteor.methods({
  createOrUpdateJob: _createOrUpdateJob,
  deleteJob: _deleteJob
});

function _deleteJob(jobId) {
  check(jobId, String);
  var job = JobsCollection.findOne({ _id: jobId }, { fields: { appId: 1 } });
  if (!job) {
    throw new Meteor.Error(403, 'jobId ' + jobId + ' not found');
  }

  JobsCollection.remove(jobId);
}

function _createOrUpdateJob(jobId, jobInfo) {
  check(jobId, String);
  check(jobInfo, Object);
  check(jobInfo.appId, String);
  check(jobInfo['data.name'], String);
  check(jobInfo['data.duration'], Match.Optional(Match.Integer));
  check(jobInfo.type, String);

  var isValidName = Validations.checkName(jobInfo['data.name']);
  if (!isValidName) {
    throw new Meteor.Error(403, i18n('alerts.invalid_job_name'));
  }

  var createdAt = new Date();
  jobInfo.updatedAt = new Date();

  var url = createAWSFileAsync(jobId);
  jobInfo['data.uploadUrl'] = url;
  var fields = { $set: jobInfo, $setOnInsert: { createdAt: createdAt } };
  JobsCollection.update({ _id: jobId }, fields, { upsert: true });
}
