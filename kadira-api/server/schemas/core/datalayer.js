import LRU from 'lru-cache';
import Promise from 'bluebird';
import { UserError } from 'graphql-errors';

// global var!
let datalayer;

export function setDataLayer(dl) {
  datalayer = dl;
}

export function getDataLayer() {
  return datalayer;
}

export function initDataLayer(config) {
  datalayer = new DataLayer(config);
}

export class DataLayer {
  constructor({appDb}) {
    this.appDb = appDb;
    this.appColl = appDb.collection('apps');

    const HOUR = 1000 * 60 * 60;
    this._shardCache = new LRU({max: 5000, maxAge: HOUR});
  }

  async findShard(appId) {
    if (this._shardCache.has(appId)) {
      return this._shardCache.get(appId);
    }

    const app = await this.appColl.findOne({_id: appId});
    if (!app) {
      throw new UserError(`App does not exists: ${appId}`);
    }

    this._shardCache.set(appId, app.shard);
    return app.shard;
  }

  findOne(shard, collectionName, query) {
    const coll = this.appDb.collection(collectionName);
    return Promise.promisify(coll.findOne.bind(coll))(query);
  }

  find(shard, collectionName, query, options) {
    const coll = this.appDb.collection(collectionName);
    const cursor = coll.find(query, options);
    return Promise.promisify(cursor.toArray.bind(cursor))();
  }

  findOnAppDb(collectionName, query, options) {
    const coll = this.appDb.collection(collectionName);
    const cursor = coll.find(query, options);
    return Promise.promisify(cursor.toArray.bind(cursor))();
  }

  aggregate(shard, collectionName, pipes) {
    const coll = this.appDb.collection(collectionName);
    return Promise.promisify(coll.aggregate.bind(coll))(pipes);
  }
}
