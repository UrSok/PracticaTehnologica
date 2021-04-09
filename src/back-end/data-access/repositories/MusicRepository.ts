/* eslint-disable promise/catch-or-return */
import SQL from 'sql-template-strings';
import { Music } from '../../models';
import BaseRepository from './BaseRepository';

export class MusicRepository extends BaseRepository {
  public async add(src: string): Promise<number> {
    // send date to db as well.
    const { db } = this.appDb;
    const result = await db.run(SQL`INSERT INTO Music(src) VALUES(${src})`);
    return result.lastID ?? 0;
  }

  public async getAll(): Promise<Music[]> {
    try {
      const { db } = this.appDb;
      const result = await db.all<Music[]>(`SELECT * FROM Music`);
      return result;
    } catch (error) {
      return new Array<Music>();
    }
  }
}

const musicRepository = new MusicRepository();
export default musicRepository;
