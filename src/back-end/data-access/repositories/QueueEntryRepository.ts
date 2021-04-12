/* eslint-disable no-plusplus */
import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import { QueueEntry } from '../../models';
import BaseRepository from './BaseRepository';

export class QueueEntryRepository extends BaseRepository {
  async replaceQueue(queueEntries: QueueEntry[]) {
    const { db } = this.appDb;
    await db.run(SQL`DELETE FROM QueueEntry`);
    if (queueEntries.length === 0) return;
    const query = SQL`INSERT INTO QueueEntry VALUES `;
    let index = 0;
    // eslint-disable-next-line no-restricted-syntax
    for await (const queueEntry of queueEntries) {
      query.append(
        SQL`(${queueEntry.id}, ${queueEntry.musicId}, ${queueEntry.fromType}, ${queueEntry.fromId}, ${queueEntry.state})`
      );
      if (index !== queueEntries.length - 1) {
        query.append(', ');
      }
      index++;
    }
    await db.run(query);
  }

  async replaceShuffledQueue(queueEntries: QueueEntry[]) {
    const { db } = this.appDb;
    await db.run(SQL`DELETE FROM QueueEntryShuffled`);
    if (queueEntries.length === 0) return;
    const query = SQL`INSERT INTO QueueEntryShuffled VALUES `;
    let index = 0;
    // eslint-disable-next-line no-restricted-syntax
    for await (const queueEntry of queueEntries) {
      query.append(
        SQL`(${queueEntry.id}, ${queueEntry.musicId}, ${queueEntry.fromType}, ${queueEntry.fromId}, ${queueEntry.state})`
      );
      if (index !== queueEntries.length - 1) {
        query.append(', ');
      }
      index++;
    }
    await db.run(query);
  }

  async getAll(shuffled = false): Promise<QueueEntry[]> {
    try {
      const { db } = this.appDb;
      const result = await db.all<QueueEntry[]>(
        `SELECT * FROM ${!shuffled ? 'QueueEntry' : 'QueueEntryShuffled'}`
      );
      if (result) {
        return result;
      }
      throw new Error('Cannot retrieve Queue');
    } catch (reason) {
      log.error(`${LogLocation.UserDataRepository} ${reason}`);
      return new Array<QueueEntry>();
    }
  }

  async getAllPriority(): Promise<QueueEntry[]> {
    try {
      const { db } = this.appDb;
      const result = await db.all<QueueEntry[]>(
        `SELECT * FROM QueueEntryPriority`
      );
      if (result) {
        return result;
      }
      throw new Error('Cannot retrieve Queue');
    } catch (reason) {
      log.error(`${LogLocation.UserDataRepository} ${reason}`);
      return new Array<QueueEntry>();
    }
  }
}

const queueEntryRepository = new QueueEntryRepository();
export default queueEntryRepository;
