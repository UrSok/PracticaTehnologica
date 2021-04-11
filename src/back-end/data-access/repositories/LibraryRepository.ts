import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import { Library } from '../../models';
import BaseRepository from './BaseRepository';

export class LibraryRepository extends BaseRepository {
  async add(path: string): Promise<number> {
    const { db } = this.appDb;
    const result = await db.run(SQL`INSERT INTO Library(path) VALUES(${path})`);
    return result.lastID ?? 0;
  }

  async toggleActive(library: Library): Promise<boolean> {
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

  async getAll(): Promise<Library[]> {
    try {
      const { db } = this.appDb;
      const result = await db.all<Library[]>(`SELECT * FROM Library`);
      return result;
    } catch (error) {
      log.error(`${LogLocation.LibraryRepository} ${error}`);
      return new Array<Library>();
    }
  }
}

const libraryRepository = new LibraryRepository();
export default libraryRepository;
