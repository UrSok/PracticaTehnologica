/* eslint-disable import/no-cycle */
import { makeAutoObservable } from 'mobx';
import QueueStore from '../store/QueueStore';
import { Music, PlayingFromType, QueueEntryState } from '.';

export default class QueueEntry {
  id = -1;

  musicId = -1;

  music?: Music;

  fromType?: PlayingFromType;

  fromId?: number;

  state = QueueEntryState.None;

  store: QueueStore;

  constructor(store: QueueStore) {
    makeAutoObservable(this);
    this.store = store;
    this.fromType = PlayingFromType.None;
  }

  get fromName() {
    if (this.fromType === PlayingFromType.Playlist && this.fromId) {
      const { playlistStore } = this.store.rootStore;
      const playlist = playlistStore.getById(this.fromId);
      if (playlist) return playlist.name;
    }
    return 'Main Library';
  }

  setState(state: QueueEntryState) {
    this.state = state;
  }

  updateFromDb(queueEntry: QueueEntry) {
    this.id = queueEntry.id;
    this.musicId = queueEntry.musicId;
    this.fromType = queueEntry.fromType;
    this.fromId = queueEntry.fromId;
    this.state = queueEntry.state;
  }

  remove() {
    this.store.removeQueueEntry(this);
  }
}
