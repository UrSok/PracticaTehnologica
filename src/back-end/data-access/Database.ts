import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import log from 'electron-log';
import LogLocation from '../constants/LogLocation';

export default class AppDb {
  private privateDb: Database;

  get db(): Database {
    return this.privateDb;
  }

  static instance: AppDb = new AppDb();

  private constructor() {
    this.privateDb = new Database<sqlite3.Database, sqlite3.Statement>({
      filename: 'data.db',
      driver: sqlite3.cached.Database,
    });
    this.privateDb.open();
  }

  static async init() {
    AppDb.instance = new AppDb();
    this.instance.db.migrate().catch((reason) => {
      log.error(`${LogLocation.Database} ${reason}`);
    });
  }
}
