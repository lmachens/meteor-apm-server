/* eslint max-len:0 */

import { Email } from 'meteor/email';
import Fiber from 'fibers';
import { fromString } from 'html-to-text';
import { isSlackUrl } from './utils';
import { parse } from 'url';
import promiseRetry from 'promise-retry';

const debug = require('debug')('alertsman:messenger');
const { error, info } = console;

const retryOptions = {
  retries: 5,
  factor: 2,
  randomize: true,
  minTimeout: 1000
};

export default class Messenger {
  constructor(mailUrl, options = {}) {
    this.mailUrl = mailUrl || 'smtp://user:pass@smtp.host:465';
    this.loggingOnly = options.loggingOnly;

    const { auth, port, hostname } = parse(this.mailUrl);

    const smtpOptions = {
      host: hostname,
      secure: port === '465',
      port: port || 25,
      auth: { user: auth.split(':')[0], pass: auth.split(':')[1] }
    };
  }

  sendTriggered(alert, checkedResult) {
    debug(`alert triggered: id=${alert.getId()}`);
    const emailPayload = alert.getEmailInfoForTriggered(checkedResult);
    const webHookPayload = alert.getInfo();
    return alert.getSlackInfoForTriggered(checkedResult).then(slackPayload => {
      webHookPayload.status = 'triggered';
      webHookPayload.result = checkedResult;
      webHookPayload.triggered = Date.now();
      const triggers = alert.getTriggers();
      return this._processTriggers(triggers, emailPayload, webHookPayload, slackPayload);
    });
  }

  sendCleared(alert) {
    debug(`alert cleared: id=${alert.getId()}`);
    const emailPayload = alert.getEmailInfoForCleared();
    const webHookPayload = alert.getInfo();
    return alert.getSlackInfoForCleared().then(slackPayload => {
      webHookPayload.status = 'cleared';
      webHookPayload.triggered = Date.now();
      const triggers = alert.getTriggers();
      return this._processTriggers(triggers, emailPayload, webHookPayload, slackPayload);
    });
  }

  _processTriggers(triggers, emailPayload, webHookPayload, slackPayload) {
    const triggerPromises = [];

    triggers.forEach(trigger => {
      switch (trigger.type) {
        case 'email':
          const { subject, body } = emailPayload;
          trigger.params.addresses.forEach(address => {
            triggerPromises.push(this._sendEmail(address, subject, body));
          });
          break;
        case 'webhook':
          trigger.params.urls.forEach(url => {
            let payload = webHookPayload;
            if (isSlackUrl(url)) {
              payload = slackPayload;
            }
            triggerPromises.push(this._callWebhook(url, payload));
          });
          break;
        default:
          throw new Error(`Unknown trigger type: ${trigger.type}`);
      }
    });

    return Promise.all(triggerPromises);
  }

  _sendEmail(address, subject, message) {
    if (this.loggingOnly) {
      info(`Sending Email: to=${address} subject=${subject}`);
      return Promise.resolve(true);
    }

    const mailOptions = {
      from: 'Kadira Alerts <alerts-noreply@kadira.io>',
      to: address,
      subject,
      text: fromString(message),
      html: message
    };

    let retryPromise = promiseRetry(retry => {
      try {
        Fiber(() => {
          return Email.send(mailOptions);
        }).run();
      } catch (error) {
        retry(error);
      }
    }, retryOptions);

    return retryPromise.catch(err => {
      error(`Sending email failed: ${err.stack}`);
    });
  }

  _callWebhook(uri, params) {
    if (this.loggingOnly) {
      info(`Calling Webhook: uri=${uri}`);
      return Promise.resolve(true);
    }

    let retryPromise = promiseRetry(retry => {
      try {
        return HTTP.post(uri, { uri, data: params });
      } catch (e) {
        console.error(e);
        retry();
      }
    }, retryOptions);

    let promise = retryPromise.catch(err => {
      error(`Calling webhook failed: ${err.stack}`);
    });

    return promise;
  }
}
