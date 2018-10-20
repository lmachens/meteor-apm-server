/* eslint max-len: 0 */

var helpData = {
  'polled-documents': {
    title: 'About Fetched Documents',
    message: "This is the number of documents fetched from MongoDB via observers. Meteor fetches documents when: New observer is created, every 10s if observer does not use oplog, when oplog observer's buffer is empty.",
    options: {
      placement: 'top'
    }
  },
  'observer-changes': {
    title: 'About Observer Changes',
    message: 'This is the distribution of all the events fired from observers.',
    options: {
      placement: 'top'
    }
  },
  'oplog-notifications': {
    title: 'About Oplog Notification',
    message: 'This is the number of oplog notifications processed by your observers. It watches the MongoDB oplog to observe changes. When a change happens, it will receive it as a notification. The notification is attached to a collection. Then, it will forward this notification to most of the observers created for that collection.',
    options: {
      placement: 'top'
    }
  },
  'active-subs': {
    title: 'About Active Subs',
    message: 'This is the number of subscriptions available in the selected time range.',
    options: {
      placement: 'top'
    }
  },
  'total-reused-observer-handlers': {
    title: 'About Total/Reused Observer Handlers',
    message:
      'This is number observer handlers created in your app, compared with the reused handlers amoung them. If this value is closer to 100%, that means most of the observers are reused, which is the optimal case',
    options: {
      placement: 'top'
    }
  },
  'livequery-life-time': {
    title: 'About Observer Lifetime',
    message:
      'This is the lifetime of the observer from the time it was created to its destruction.',
    options: {
      placement: 'top'
    }
  }
};

InlineHelp.initHelp(helpData);
