/* eslint max-len: 0 */

var helpData = {
  'pub-breakdown': {
    title: 'About Publications Breakdown',
    message:
      'Using the Publication Breakdown, you can drill down into publication-specific metrics.',
    options: {
      placement: 'top'
    }
  },
  'timeseries-subRate': {
    title: 'About Sub Rate',
    message: 'This chart shows the number of subscriptions received by minute.',
    options: {
      placement: 'bottom'
    }
  },
  'timeseries-pubsubResTimeWithTraces': {
    title: 'About Response Time with Traces',
    message: 'The Response Time is the time the server takes to execute your method or publication (it also includes the Wait Time). In publications, the Response Time is calculate until the server emits the ready message. Therefore, this is the time taken to fetch all the cursor data and push it to the client.',
    options: {
      placement: 'bottom'
    }
  },
  'summary-dashboardPubSub': {
    title: 'About PubSub Summery',
    message:
      'PubSub Summary shows the summary of the publications and subscriptions in the selected date range.',
    options: {
      placement: 'bottom'
    }
  }
};

InlineHelp.initHelp(helpData);
