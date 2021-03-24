import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';

export default class AppDb {
  private db!: Database;

  static instance: AppDb = new AppDb();

  private constructor() {
    this.db = new Database<sqlite3.Database, sqlite3.Statement>({
      filename: 'data.db',
      driver: sqlite3.cached.Database,
    });
    this.db.open();
  }

  public Migrate() {
    this.db.migrate();
  }
}
