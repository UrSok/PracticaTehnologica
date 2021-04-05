/* eslint-disable promise/catch-or-return */
import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import AppDb from '../Database';
import { Library, LibraryNoPath, NullLibrary } from '../models/Library';

export default class LibraryRepository {
  appDb = AppDb.instance;

  public async addIfDoesntExists(path: string): Promise<boolean> {
    const { db } = this.appDb;
    let result = false;
    const fileExists = await this.pathExists(path);
    if (!fileExists) {
      db.run(SQL`INSERT INTO Library(path) VALUES(${path})`)
        .catch((reason) => {
          log.error(`${LogLocation.LibraryRepository} ${reason}`);
        })
        .finally(() => {
          result = true;
        });
    }
    return result;
  }

  public async activateDeactivateLibrary(library: LibraryNoPath) {
    const { db } = this.appDb;
    let result = false;
    db.run(
      SQL`UPDATE Library SET active = ${library.active}
      WHERE id = ${library.id}`
    )
      .catch((reason) => {
        log.error(`${LogLocation.LibraryRepository} ${reason}`);
      })
      .finally(() => {
        result = true;
      });
    return result;
  }

  public async getAll(): Promise<Library[]> {
    try {
      const { db } = this.appDb;
      const result = await db.all<Library[]>(`SELECT * FROM Library`);
      return result;
    } catch (error) {
      log.error(`${LogLocation.LibraryRepository} ${error}`);
      return new Array<Library>();
    }
  }

  public async getById(id: number): Promise<Library> {
    try {
      const { db } = this.appDb;
      const result = await db.get<Library>(
        SQL`SELECT * FROM Library WHERE id = ${id}`
      );
      if (result === undefined) {
        return NullLibrary;
      }
      return result;
    } catch (error) {
      log.error(`${LogLocation.LibraryRepository} ${error}`);
      return NullLibrary;
    }
  }

  public async getByPath(path: string): Promise<Library> {
    try {
      const { db } = this.appDb;
      const result = await db.get<Library>(
        SQL`SELECT * FROM Library WHERE path = ${path}`
      );
      if (result === undefined) {
        return NullLibrary;
      }
      return result as Library;
    } catch (error) {
      log.error(`${LogLocation.LibraryRepository} ${error}`);
      return NullLibrary;
    }
  }

  public async pathExists(path: string): Promise<boolean> {
    try {
      const { db } = this.appDb;
      const result = await db.get<Library>(
        SQL`SELECT * FROM Library WHERE path LIKE ${path}`
      );
      if (result === undefined) return false;
      return true;
    } catch (error) {
      log.error(`${LogLocation.LibraryRepository} ${error}`);
      return false;
    }
  }
}
