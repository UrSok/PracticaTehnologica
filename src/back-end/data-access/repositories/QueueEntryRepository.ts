/* eslint-disable no-plusplus */
import { Console } from 'console';
import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import { QueueEntry } from '../../models';
import BaseRepository from './BaseRepository';

export class QueueEntryRepository extends BaseRepository {
  private async add(queueEntry: QueueEntry) {
    const { db } = this.appDb;
    await db.run(
      SQL`INSERT INTO QueueEntry(id, musicId) VALUES(${queueEntry.id}, ${queueEntry.musicId})`
    );
  }

  async replaceQueue(queueEntries: QueueEntry[]) {
    const { db } = this.appDb;
    await db.run(SQL`DELETE FROM QueueEntry`);
    const query = SQL`INSERT INTO QueueEntry VALUES `;
    let index = 0;
    // eslint-disable-next-line no-restricted-syntax
    for await (const queueEntry of queueEntries) {
      query.append(SQL`(${queueEntry.id}, ${queueEntry.musicId})`);
      if (index !== queueEntries.length - 1) {
        query.append(', ');
      }
      index++;
    }
    await db.run(query);
  }

  async getAll(): Promise<QueueEntry[]> {
    try {
      const { db } = this.appDb;
      const result = await db.all<QueueEntry[]>(`SELECT * FROM QueueEntry`);
      if (result) {
        return result;
      }
      throw new Error('Cannot retrieve UserData');
    } catch (reason) {
      log.error(`${LogLocation.UserDataRepository} ${reason}`);
      return new Array<QueueEntry>();
    }
  }
}

const queueEntryRepository = new QueueEntryRepository();
export default queueEntryRepository;
