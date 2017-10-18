import UpTimeMonitor from './uptime_monitor';

export default class Logic {
  constructor(config) {
    this.appDb = config.appDb;
    this.upTimeMonitor = new UpTimeMonitor(config);
  }

  getStatuses(collection, res, start, end) {
    let t = normalizeToMin(start);
    const minute = 1000 * 60;
    let resultPromises = [];

    while (t < end) {
      const promise = this.upTimeMonitor.getStatus(this.appDb, collection, res, t);
      resultPromises.push(promise);
      t += minute;
    }

    return Promise.all(resultPromises);
  }
}

function normalizeToMin(time) {
  var diff = time % (1000 * 60);
  return time - diff;
}
