/* eslint-disable import/no-cycle */
import { makeAutoObservable } from 'mobx';
import QueueStore from '../store/QueueStore';
import { PlayingFromType, QueueEntryState } from '.';

export default class QueueEntry {
  id = -1;

  musicId = -1;

  fromType?: PlayingFromType;

  fromId?: number;

  state = QueueEntryState.None;

  store: QueueStore;

  constructor(store: QueueStore) {
    makeAutoObservable(this);
    this.store = store;
    this.fromType = PlayingFromType.None;
  }

  remove() {
    this.store.removeQueueEntry(this); // implement later
  }

  /* save(): string {
    // make one for priorityQueue as well
    // return this.store.addQueueEntry(this);
  } */

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
}
