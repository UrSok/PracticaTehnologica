/* eslint-disable class-methods-use-this */
import { Music, QueueEntry, PlaylistEntry } from '../back-end/models';

export default class TypesUtils {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static isQueueEntry(data: any) {
    if (data instanceof QueueEntry) return true;
    return false;
  }

  static isMusic(data: any) {
    if (data instanceof Music) return true;
    return false;
  }

  static isArray(data: any) {
    if (data instanceof Array) return true;
    return false;
  }

  static isPlaylistEntry(data: any) {
    if (data instanceof PlaylistEntry) return true;
    return false;
  }

  static isPlaylistEntryArray(data: any) {
    if (this.isArray(data)) {
      if (data.length > 0 && this.isPlaylistEntry(data[0])) return true;
    }
    return false;
  }

  static isQueueEntryArray(data: any) {
    if (this.isArray(data)) {
      if (data.length > 0 && this.isQueueEntry(data[0])) return true;
    }
    return false;
  }

  static isMusicArray(data: any) {
    if (this.isArray(data)) {
      if (data.length > 0 && this.isMusic(data[0])) return true;
    }
    return false;
  }
}
