import Alert from './alert';
import { EventEmitter } from 'events';
import _ from 'lodash';

const debug = require('debug')('alertsman:altersStore');

export default class AlertsStore extends EventEmitter {
  constructor(oplog) {
    super();
    this.oplog = oplog;
    this.reset = this.reset.bind(this);
    this.alerts = {};
    this.resetInterval = 1000 * 60 * 60; // Reset alerts ever hour

    this.alertsCol = Alerts;
  }

  load() {
    const promise = this.watchOplog();
    this.reset();
    this._resetHandler = setInterval(this.reset, this.resetInterval);
    return promise;
  }

  async reset() {
    const selector = { 'meta.enabled': true };
    const alerts = await this.alertsCol.find(selector).fetch();
    debug(`reset and load ${alerts.length} alerts`);

    // disable exisitng alerts
    _.each(this.alerts, alert => {
      this.emit('disabled', new Alert(alert));
    });
    this.alerts = {};

    // enable loaded alerts
    for (let a of alerts) {
      this.alerts[a._id] = a;
      this.emit('enabled', new Alert(a));
    }
  }

  stopReseting() {
    clearTimeout(this._resetHandler);
  }

  watchOplog() {
    const promise = this.oplog.tail().then(() => {
      this.oplog.on('op', data => {
        let op = {};

        if (data.op === 'i') {
          op.alertId = data.o._id;
          op.operation = 'insert';
          op.newAlert = data.o;
        } else if (data.op === 'd') {
          op.alertId = data.o._id;
          op.operation = 'delete';
        } else if (data.op === 'u') {
          op.alertId = data.o2._id;
          const update = data.o;

          for (let key in update) {
            if (!update.hasOwnProperty(key)) {
              continue;
            }

            if (key === '$set') {
              for (let field in update[key]) {
                if (!update[key].hasOwnProperty(field)) {
                  continue;
                }

                if (field === 'meta.enabled') {
                  if (update[key][field] === true) {
                    op.operation = 'setEnabled';
                  } else {
                    op.operation = 'setDisabled';
                  }
                } else if (field === 'lastCheckedDate') {
                  op.operation = 'updateLastCheckedDate';
                  op.lastCheckedDate = update[key][field];
                } else {
                  op.operation = 'other';
                  break;
                }
              }
            } else {
              op.operation = 'other';
              break;
            }
          }
        }
        this.onOplogOp(op);
      });
    });

    return promise;
  }

  async onOplogOp(op) {
    debug(`new alerts update type=${op.operation} id=${op.alertId}`);
    switch (op.operation) {
      case 'updateLastCheckedDate':
        if (this.alerts[op.alertId]) {
          this.alerts[op.alertId].lastCheckedDate = op.lastCheckedDate;
          this.emit('disabled', new Alert(this.alerts[op.alertId]));
          this.emit('enabled', new Alert(this.alerts[op.alertId]));
        }
        break;
      default:
        const selecter = { _id: op.alertId };
        const rawAlert = await this.alertsCol.findOne(selecter);
        const cachedAlert = this.alerts[op.alertId];
        // If the alert removed or disabled we need to branch it out.
        if (!rawAlert || !rawAlert.meta.enabled) {
          // If there is a cached alert already. Simply disable it
          if (cachedAlert) {
            this.emit('disabled', new Alert(cachedAlert));
          }
          return;
        }

        // For alerts which are enabled

        // If we've a cache, disable it
        if (cachedAlert) {
          this.emit('disabled', new Alert(cachedAlert));
        }

        // Assign the new rawAlert to cache and enable it
        this.alerts[op.alertId] = rawAlert;
        this.emit('enabled', new Alert(rawAlert));
    }
  }

  async setArmed(alert, isArmed) {
    const mutations = {};

    if (isArmed) {
      // If armed, we need to set the armedDate and
      // clear the `lastArmedClearedDate` if there is
      mutations.armedDate = new Date();
      mutations.lastArmedClearedDate = null;
    } else {
      // If armed state cleared, we need to remove the armedDate
      // and set the lastArmedClearedDate
      mutations.armedDate = null;
      mutations.lastArmedClearedDate = new Date();
    }

    await this.alertsCol.update(alert.getId(), {
      $set: mutations
    });
  }

  async updateLastCheckedDate(alert, lastCheckedDate = new Date()) {
    if (!(lastCheckedDate instanceof Date)) {
      throw new Error('Expect lastChecked as a Date object');
    }

    await this.alertsCol.update(alert.getId(), {
      $set: {
        lastCheckedDate
      }
    });
  }

  close() {
    this.removeAllListeners();
  }
}
