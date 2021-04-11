import SQL from 'sql-template-strings';
import { Music } from '../../models';
import BaseRepository from './BaseRepository';

export class MusicRepository extends BaseRepository {
  async add(music: Music): Promise<number> {
    const { db } = this.appDb;
    const result = await db.run(
      SQL`INSERT INTO Music(src, added) VALUES(${music.src}, ${music.added})`
    );
    return result.lastID ?? 0;
  }

  async getAll(): Promise<Music[]> {
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
