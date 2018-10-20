/* eslint max-len: 0 */

var helpData = {
  'kd-event-stream': {
    title: 'About Event Stream',
    message:
      'This is list of all the events happening in your client side app. List will update as you do actions on your app. These events include route changes, methods and subscriptions, data updates, DOM events, and many other key events.',
    options: {
      placement: 'bottom'
    }
  },
  'kd-event-stream-filters': {
    title: 'About Event Stream Filters',
    message:
      'There may be a lot of events in your app. So, you may need to filter events by types.',
    options: {
      placement: 'top'
    }
  }
};

InlineHelp.initHelp(helpData);
