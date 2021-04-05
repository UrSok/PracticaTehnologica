/* eslint-disable no-underscore-dangle */
import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import log from 'electron-log';
import LogLocation from '../constants/LogLocation';

export default class AppDb {
  private _db!: Database;

  get db(): Database {
    return this._db;
  }

  static instance: AppDb = new AppDb();

  private constructor() {
    this._db = new Database<sqlite3.Database, sqlite3.Statement>({
      filename: 'data.db',
      driver: sqlite3.cached.Database,
    });
    this._db.open();
  }

  static async init() {
    AppDb.instance = new AppDb();
    this.instance.db.migrate().catch((reason) => {
      log.error(`${LogLocation.Database} ${reason}`);
    });
  }
}
