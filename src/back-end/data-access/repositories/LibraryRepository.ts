/* eslint-disable promise/catch-or-return */
import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import { Library, LibraryNoPath, NullLibrary } from '../models/Library';
import BaseRepository from './BaseRepository';

export default class LibraryRepository extends BaseRepository {
  static instance = new LibraryRepository();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  public async addIfDoesntExists(path: string): Promise<boolean> {
    try {
      const { db } = this.appDb;
      const fileExists = await this.pathExists(path);
      if (!fileExists) {
        await db.run(SQL`INSERT INTO Library(path) VALUES(${path})`);
        return true;
      }
      return false;
    } catch (error) {
      log.error(`${LogLocation.LibraryRepository} ${error}`);
      return false;
    }
  }

  public async activateDeactivateLibrary(
    library: LibraryNoPath
  ): Promise<boolean> {
    try {
      const { db } = this.appDb;
      await db.run(
        SQL`UPDATE Library SET active = ${library.active}
          WHERE id = ${library.id}`
      );
      return true;
    } catch (error) {
      log.error(`${LogLocation.LibraryRepository} ${error}`);
      return false;
    }
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
