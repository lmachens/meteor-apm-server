var connect = require('connect');
var query = require('connect-query');
var http = require('http');
var bodyParser = require('body-parser');

var app = connect();

app.use(query());
app.use(bodyParser.json({ limit: '5mb' }));

if (process.env.FORWARD_URL) {
  console.log('>>> ', process.env.FORWARD_URL);
  var forwarder = require('./lib/middlewares/forward');
  app.use(forwarder(process.env.FORWARD_URL));
}

// add connect-ntp middleware, for the legacy support
// this does not works everywhere because, this doesn't
// works well with firewalls since this uses TCP over HTTP
app.use(require('connect-ntp')());

// new ntp middleware, simple sends the timestamp to the client
// this works well with firewalls, this is plain old HTTP
app.use(require('./lib/middlewares/simplentp')());
app.use(require('./lib/middlewares/cors-options'));

var port = process.env.ENGINE_PORT || 11011;
console.info('starting apm-engine on port', port);
http.createServer(app).listen(port);

// parse JSON data sent using XDR with has data type set to text/plain
// do this before appinfo otherwise required data will not be available
app.use('/errors', require('./lib/middlewares/plaintext-body'));

// extract appId and appSecret. Used by ratelimit.
app.use(require('./lib/middlewares/appinfo'));

// rate limit all requests from this point
// limit => 15 req/s, traces => 100 traces/request
// Note: Drops all requests without an appId.
app.use(
  require('./lib/middlewares/ratelimit')({
    limit: 30,
    resetInterval: 2000,
    limitTotalTraces: 200
  })
);

// error manager handles errors sent from client (GET and POST)
// all requests sent to /errors are considered as client side errors
// it should be used before using the authentication middleware
require('./lib/stateManager');
var errorManager = require('./lib/middlewares/error-manager');
const appDb = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
app.use('/errors', errorManager(appDb));

// authenticare middleware
// ping middleware must be used after the authentication middleware
app.use(require('./lib/middlewares/authenticate')(appDb));
app.use(require('./lib/middlewares/ping')());
app.use('/jobs', require('./lib/middlewares/jobs')(appDb));
require('./lib/controller')(app, appDb);

// error middleware
app.use(require('./lib/middlewares/onerror')());
