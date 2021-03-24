import SQL from 'sql-template-strings';
import AppDb from '../Database';
import { MusicNoId, Music } from '../models/Music';
import { NullMusic } from '../null-models/Music';

export default class MusicRepository {
  appDb = AppDb.instance;

  public add(music: MusicNoId): boolean {
    try {
      const { db } = this.appDb;
      db.run(
        SQL`INSERT INTO Music(src, src_type) VALUES(${music.src}, ${music.src_type})`
      );
      return true;
    } catch (error) {
      return false;
    }
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

  public async getById(id: number): Promise<Music> {
    try {
      const { db } = this.appDb;
      const result = await db.get<Music>(
        SQL`SELECT * FROM Music WHERE id = ${id}`
      );
      if (result === undefined) {
        return NullMusic;
      }
      return result;
    } catch (error) {
      return NullMusic;
    }
  }

  public async getBySrc(src: string): Promise<Music> {
    try {
      const { db } = this.appDb;
      const result = await db.get<Music>(
        SQL`SELECT * FROM Music WHERE src = ${src}`
      );
      if (result === undefined) {
        return NullMusic;
      }
      return result as Music;
    } catch (error) {
      return NullMusic;
    }
  }
}
