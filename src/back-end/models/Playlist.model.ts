/* eslint-disable eqeqeq */
import { makeAutoObservable, runInAction } from 'mobx';
import { Music } from '.';
import PlaylistStore from '../store/PlaylistStore';
import DateUtils from '../utils/DateUtils';
import PlaylistEntry from './PlaylistEntry.model';

export default class Playlist {
  id = -1;

  name = '';

  created = new Date(Date.now());

  entries = Array<PlaylistEntry>();

  store: PlaylistStore;

  constructor(store: PlaylistStore) {
    makeAutoObservable(this);
    this.store = store;
  }

  get totalSongs(): number {
    return this.entries.length;
  }

  get totalSongsDuration(): string {
    let sumOfDurationSeconds = 0;
    this.entries.forEach((entry) => {
      if (entry.music) sumOfDurationSeconds += entry.music.durationSeconds;
    });
    return DateUtils.getTimeStringWitUnits(sumOfDurationSeconds);
  }

  get dateCreated(): string {
    return this.created.toLocaleDateString();
  }

  get isPlaylistEmpty() {
    return this.entries.length === 0;
  }

  updateFromDb(playlist: Playlist) {
    this.id = playlist.id;
    this.name = playlist.name;
    this.created = new Date(playlist.created);
  }

  setEntries(playlistEntries: PlaylistEntry[]) {
    playlistEntries.forEach((entry) => this.updateEntryFromDb(entry));
  }

  updateEntryFromDb(entryDb: PlaylistEntry) {
    let entry = this.entries.find((x) => x.id == entryDb.id);
    if (!entry) {
      entry = new PlaylistEntry(this);
      entry.updateFromDb(entryDb);
      entry.music = this.store.rootStore.musicStore.getById(entryDb.musicId);
      entry.playlist = this;
      this.entries.push(entry);
    }
  }

  async addEntryIfDoesntExist(musicId: number): Promise<boolean> {
    if (this.entries.some((x) => x.musicId == musicId)) return false;
    const music = this.store.rootStore.musicStore.getById(musicId);
    if (music) {
      const entry = new PlaylistEntry(this);
      runInAction(() => {
        entry.musicId = musicId;
        entry.playlistId = this.id;
      });
      const resultId = await this.store.repository.addEntry(entry);
      if (resultId !== 0) {
        runInAction(() => {
          entry.id = resultId;
          entry.music = music;
          this.entries.push(entry);
        });
      }
      return true;
    }
    return false;
  }

  removeEntry(playlistEntry: PlaylistEntry) {
    this.store.repository.removeEntry(playlistEntry);
    this.entries.splice(this.entries.indexOf(playlistEntry), 1);
    if (this.isPlaylistEmpty) this.remove();
  }

  remove() {
    if (!this.isPlaylistEmpty) this.entries.slice(0, this.entries.length);
    this.store.removePlaylist(this);
  }
}
