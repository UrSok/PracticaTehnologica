import AppDb from '../Database';

export default class BaseRepository {
  protected appDb = AppDb.instance;
}
