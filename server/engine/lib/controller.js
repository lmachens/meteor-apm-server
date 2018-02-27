var tracerParser = require('./parsers/tracer');
var methodMetricsParser = require('./parsers/methodMetrics');
var pubMetricsParser = require('./parsers/pubMetrics');
var stateManager = require('./stateManager');

var persisters = {
  collection: require('./persisters/collection'),
  trace: require('./persisters/trace')
};

module.exports = function(app, db) {
  var parsers = [
    {
      type: 'appStats',
      parser: require('./parsers/appStats'),
      persister: persisters.collection('appStats', db)
    },
    {
      type: 'methodRequests',
      parser: tracerParser('methodRequests'),
      persister: persisters.trace('methodTraces', db)
    },
    {
      type: 'pubRequests',
      parser: tracerParser('pubRequests'),
      persister: persisters.trace('pubTraces', db)
    },
    {
      type: 'errors',
      parser: require('./parsers/errorTraces'),
      persister: persisters.trace('errorTraces', db)
    },
    {
      type: 'methodMetrics',
      parser: require('./parsers/methodMetrics'),
      persister: persisters.collection('rawMethodsMetrics', db)
    },
    {
      type: 'pubMetrics',
      parser: require('./parsers/pubMetrics'),
      persister: persisters.collection('rawPubMetrics', db)
    },
    {
      type: 'hotSubs',
      parser: require('./parsers/hotSubs'),
      persister: persisters.collection('rawHotSubs', db)
    },
    {
      type: 'systemMetrics',
      parser: require('./parsers/systemMetrics'),
      persister: persisters.collection('rawSystemMetrics', db)
    },
    {
      type: 'errorMetrics',
      parser: require('./parsers/errorMetrics'),
      persister: persisters.collection('rawErrorMetrics', db)
    }
  ];

  app.use(function(req, res) {
    if (req.method == 'POST') {
      parsers.forEach(function(parserInfo) {
        var parsedData = parserInfo.parser(req.body);
        if (parsedData && parsedData.length > 0) {
          parserInfo.persister(req.app, parsedData);

          if (parserInfo.type == 'errors') {
            // track initial state for errors;
            stateManager.setState(db, req.app, 'initialErrorsReceived');
          }
        }
      });

      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end();
    } else {
      res.writeHead(400);
      res.end('cannot get  \n');
    }
  });
};
