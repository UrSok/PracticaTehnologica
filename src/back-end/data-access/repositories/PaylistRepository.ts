import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import { Playlist } from '../../models';
import PlaylistEntry from '../../models/PlaylistEntry.model';
import BaseRepository from './BaseRepository';

export class PlaylistRepository extends BaseRepository {
  async create(playlist: Playlist): Promise<number> {
    const { db } = this.appDb;
    const result = await db.run(
      SQL`INSERT INTO Playlist(name, created) VALUES(${playlist.name}, ${playlist.created})`
    );
    return result.lastID ?? 0;
  }

  async addEntry(playlistEntry: PlaylistEntry): Promise<number> {
    try {
      const { db } = this.appDb;
      const result = await db.run(
        SQL`INSERT INTO PlaylistMusic(playlistId, musicId, added) VALUES(${playlistEntry.playlistId}, ${playlistEntry.musicId}, ${playlistEntry.added})`
      );
      return result.lastID ?? 0;
    } catch (reason) {
      log.error(`${LogLocation.PlaylistRepository} ${reason}`);
      return 0;
    }
  }

  async removeEntry(playlistEntry: PlaylistEntry) {
    try {
      const { db } = this.appDb;
      db.run(SQL`DELETE FROM PlaylistMusic WHERE id = ${playlistEntry.id}`);
    } catch (reason) {
      log.error(`${LogLocation.PlaylistRepository} ${reason}`);
    }
  }

  async removeEntriesByPlaylistId(playlistId: number) {
    try {
      const { db } = this.appDb;
      db.run(SQL`DELETE FROM PlaylistMusic WHERE playlistId = ${playlistId}`);
    } catch (reason) {
      log.error(`${LogLocation.PlaylistRepository} ${reason}`);
    }
  }

  async removePlaylist(playlist: Playlist) {
    try {
      const { db } = this.appDb;
      await this.removeEntriesByPlaylistId(playlist.id);
      db.run(SQL`DELETE FROM Playlist WHERE id = ${playlist.id}`);
    } catch (reason) {
      log.error(`${LogLocation.PlaylistRepository} ${reason}`);
    }
  }

  async getAll(): Promise<Playlist[]> {
    try {
      const { db } = this.appDb;
      const result = await db.all<Playlist[]>(`SELECT * FROM Playlist`);
      if (result) {
        return result;
      }
      throw new Error('Cannot retrieve Playlist');
    } catch (reason) {
      log.error(`${LogLocation.PlaylistRepository} ${reason}`);
      return new Array<Playlist>();
    }
  }

  async getAllPlaylistEntries(playlistId: number): Promise<PlaylistEntry[]> {
    try {
      const { db } = this.appDb;
      const result = await db.all<PlaylistEntry[]>(
        `SELECT * FROM PlaylistMusic
         WHERE playlistId = ${playlistId}`
      );
      if (result) {
        return result;
      }
      throw new Error('Cannot retrieve PlaylistMusic');
    } catch (reason) {
      log.error(`${LogLocation.PlaylistRepository} ${reason}`);
      return new Array<PlaylistEntry>();
    }
  }

  async updateName(playlist: Playlist) {
    try {
      const { db } = this.appDb;
      await this.removeEntriesByPlaylistId(playlist.id);
      db.run(SQL`UPDATE Playlist
        set name = ${playlist.name}
        WHERE id = ${playlist.id}`);
    } catch (reason) {
      log.error(`${LogLocation.PlaylistRepository} ${reason}`);
    }
  }
}

const playlistRepository = new PlaylistRepository();
export default playlistRepository;
