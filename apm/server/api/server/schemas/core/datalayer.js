import LRU from 'lru-cache';
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
  constructor({ appDb }) {
    this.appDb = appDb;
    this.appColl = appDb.collection('apps');
  }

  async findOne(collectionName, query) {
    const coll = this.appDb.collection(collectionName);
    return await coll.findOne(query);
  }

  async find(collectionName, query, options) {
    const coll = this.appDb.collection(collectionName);
    const cursor = coll.find(query, options);
    return await cursor.toArray();
  }

  async findOnAppDb(collectionName, query, options) {
    const coll = this.appDb.collection(collectionName);
    const cursor = coll.find(query, options);
    return await cursor.toArray();
  }

  async aggregate(collectionName, pipes) {
    const coll = this.appDb.collection(collectionName);
    const cursor = coll.aggregate(pipes);
    return await cursor.toArray();
  }
}
