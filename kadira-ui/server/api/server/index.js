/* eslint max-len:0 */

import {handleAuth, loadExplorer, sendPong} from './transports/http';

import {MongoClient} from 'mongodb';
import Promise from 'bluebird';
import {configureAuth} from './authlayer';
import cors from 'cors';
import express from 'express';
import http from 'http';
import {loadSchemas} from './schemas';

const logger = console;

(async () => {
  try {
    const {
      API_PORT, AUTH_SECRET, MAIL_URL, JWT_SECRET, JWT_LIFETIME
    } = process.env;

    const appDb = await Promise.promisify(MongoClient.connect)(process.env.MONGO_URL);

    const schemas = loadSchemas({
      appDb,
      mailUrl: MAIL_URL
    });

    configureAuth({
      secret: JWT_SECRET,
      lifetime: JWT_LIFETIME,
    });

    const server = http.createServer();
    const app = express();

    // Configurations for CORS
    const corsOptions = { origin: true, credentials: true };
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));

    server.on('request', app);

    app.use('/auth', handleAuth(appDb));
    app.use('/ping', sendPong());
    app.use('/:schema?', loadExplorer(AUTH_SECRET, schemas));

    server.listen(API_PORT);
    logger.log(`Fetchman started on port: ${API_PORT}`);
  } catch (ex) {
    console.log('EEEEEE', ex)
    setTimeout(() => {throw ex;});
  }
})();
