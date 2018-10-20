/* eslint max-len: 0 */

var helpData = {
  'timeseries-pubsubResTime': {
    title: 'About Average Response Time',
    message:
      'This chart shows the average response time for sending the initial data set for subscriptions. We calculate this metric when we detect this.ready() for a publication. This chart shows you whether your subscriptions are slow to process initially. ﻿',
    options: {
      placement: 'bottom'
    }
  },
  'timeseries-memory': {
    title: 'About Memory Usage / Host',
    message:
      'This charts shows the average memory usage across all the hosts in the given time range. We use RSS as the memory usage.',﻿
    url: 'https://en.wikipedia.org/wiki/Resident_set_size',
    options: {
      placement: 'bottom'
    }
  },
  'timeseries-sessions': {
    title: 'About Total Sessions',
    message: 'This chart shows the total number of sessions in the given time range.',
    options: {
      placement: 'bottom'
    }
  },
  'timeseries-methodResTime': {
    title: 'About Average Response Time',
    message: 'This chart shows response time for method calls for the selected date range. The X-axis contains the date and the Y-axis contains the response time in milliseconds. ',
    options: {
      placement: 'bottom'
    }
  },
  'timeseries-pcpu': {
    title: 'About CPU Usage',
    message:
      'This charts shows the CPU usage in percent of your app. We are using the usage npm module to track the correct CPU usage. ',
    url: 'https://github.com/arunoda/node-usage',
    options: {
      placement: 'bottom'
    }
  },
  'timeseries-createdObservers': {
    title: 'About Created Observers',
    message: 'This chart shows total number of new Observers created in the given time range. Even though there are e.g. 1000 observers, actual number of observers will be less than 1000 because of  observer reuse. If there are identical cursors then existing observers are reused. New observers reflects the actual number of observers initiated.',
    options: {
      placement: 'bottom'
    }
  },
  'summary-dashboardOverview': {
    title: 'About Dashboard Summary',
    message: 'Dashboard Summary is a set of important performance metrics for your application.',
    options: {
      placement: 'bottom'
    }
  }
};

InlineHelp.initHelp(helpData);
