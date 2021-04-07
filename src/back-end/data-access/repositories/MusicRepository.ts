/* eslint-disable promise/catch-or-return */
import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import { MusicNoId, Music, NullMusic } from '../models/Music';
import BaseRepository from './BaseRepository';

export default class MusicRepository extends BaseRepository {
  static instance = new MusicRepository();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  public async add(music: MusicNoId): Promise<boolean> {
    try {
      const { db } = this.appDb;
      db.run(SQL`INSERT INTO Music(src) VALUES(${music.src})`);
      return true;
    } catch (error) {
      log.error(`${LogLocation.MusicRepository} ${error}`);
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
