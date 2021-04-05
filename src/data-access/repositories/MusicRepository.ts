/* eslint-disable promise/catch-or-return */
import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import AppDb from '../Database';
import { MusicNoId, Music, NullMusic } from '../models/Music';

export default class MusicRepository {
  appDb = AppDb.instance;

  public add(music: MusicNoId): boolean {
    const { db } = this.appDb;
    let result = false;
    db.run(
      SQL`INSERT INTO Music(src, src_type) VALUES(${music.src}, ${music.src_type})`
    )
      .catch((reason) => {
        log.error(`${LogLocation.MusicRepository} ${reason}`);
      })
      .finally(() => {
        result = true;
      });
    return result;
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
      log.error(`${LogLocation.MusicRepository} ${error}`);
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
      log.error(`${LogLocation.MusicRepository} ${error}`);
      return NullMusic;
    }
  }

  public async srcExists(src: string): Promise<boolean> {
    try {
      const { db } = this.appDb;
      const result = await db.get<Music>(
        SQL`SELECT * FROM Music WHERE src LIKE ${src}`
      );
      if (result === undefined) return false;
      return true;
    } catch (error) {
      log.error(`${LogLocation.MusicRepository} ${error}`);
      return false;
    }
  }
}
