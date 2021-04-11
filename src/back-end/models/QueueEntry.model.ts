import { makeAutoObservable } from 'mobx';
import QueueStore from '../store/QueueStore';

export default class QueueEntry {
  id = -1;

  musicId = 0;

  store?: QueueStore;

  constructor(store: QueueStore | undefined) {
    makeAutoObservable(this);
    this.store = store;
  }

  remove() {
    this.store?.removeQueueEntry(this); // implement later
  }

  updateFromDb(queueEntry: QueueEntry) {
    this.id = queueEntry.id;
    this.musicId = queueEntry.musicId;
  }
}

export const NullQueueEntry = new QueueEntry(undefined);
