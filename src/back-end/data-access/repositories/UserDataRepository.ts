import log from 'electron-log';
import SQL from 'sql-template-strings';
import LogLocation from '../../constants/LogLocation';
import { NullUserData, UserData } from '../../models';
import BaseRepository from './BaseRepository';

export class UserDataRepository extends BaseRepository {
  public async update(userData: UserData): Promise<number> {
    const { db } = this.appDb;
    const result = await db.run(SQL`UPDATE UserData SET
      scanOnStart = ${userData.scanOnStart},
      firstLaunch = ${userData.firstLaunch}`);
    return result.changes ?? 0;
  }

  public async get(): Promise<UserData> {
    try {
      const { db } = this.appDb;
      const result = await db.get<UserData>(`SELECT * FROM UserData`);
      if (result) {
        return result;
      }
      throw new Error('Cannot retrieve UserData');
    } catch (reason) {
      log.error(`${LogLocation.UserDataRepository} ${reason}`);
      return NullUserData;
    }
  }
}

const userDataRepository = new UserDataRepository();
export default userDataRepository;
