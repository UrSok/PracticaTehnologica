import { makeAutoObservable } from 'mobx';
import { Music, Playlist } from '.';
import DateUtils from '../utils/DateUtils';

export default class PlaylistEntry {
  id = -1;

  playlistId = -1;

  musicId = -1;

  music?: Music;

  added = new Date(Date.now());

  playlist: Playlist;

  constructor(playlist: Playlist) {
    makeAutoObservable(this);
    this.playlist = playlist;
  }

  get addedString(): string {
    return DateUtils.getDateDiffOrDateString(this.added);
  }

  updateFromDb(playlistEntry: PlaylistEntry) {
    this.id = playlistEntry.id;
    this.musicId = playlistEntry.musicId;
    this.playlistId = playlistEntry.playlistId;
    this.added = new Date(playlistEntry.added);
  }

  remove() {
    this.playlist.removeEntry(this);
  }
}
