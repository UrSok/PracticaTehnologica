import AppDb from '../Database';

export default class BaseRepository {
  protected appDb;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected constructor() {
    this.appDb = AppDb.instance;
  }
}
