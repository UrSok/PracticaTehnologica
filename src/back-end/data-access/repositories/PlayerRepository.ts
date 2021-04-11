import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import { Player, NullPlayer } from '../../models';
import BaseRepository from './BaseRepository';

export class PlayerRepository extends BaseRepository {
  async update(player: Player): Promise<number> {
    const { db } = this.appDb;
    const result = await db.run(SQL`UPDATE Player SET
      shuffle = ${player.shuffle},
      repeat = ${player.repeat},
      playingQueueEntryId = ${player.playingQueueEntryId},
      playingFromType = ${player.playingFromType},
      playingFromId = ${player.playingFromId},
      played = ${player.played},
      volume = ${player.volume},
      muted = ${player.muted}`);
    return result.changes ?? 0;
  }

  async get(): Promise<Player> {
    try {
      const { db } = this.appDb;
      const result = await db.get<Player>(`SELECT * FROM Player`);
      if (result) {
        return result;
      }
      throw new Error('Cannot retrieve Player');
    } catch (reason) {
      log.error(`${LogLocation.PlayerRepository} ${reason}`);
      return NullPlayer;
    }
  }
}

const playerRepository = new PlayerRepository();
export default playerRepository;
