/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
import { makeAutoObservable } from 'mobx';
import ActionState from '../constants/ActionState';
import musicRepository from '../data-access/repositories/MusicRepository';
import queueEntryRepository from '../data-access/repositories/QueueEntryRepository';
import { Music, NullQueueEntry, QueueEntry, Repeat } from '../models';
// eslint-disable-next-line import/no-cycle
import RootStore from './RootStore';

export default class QueueStore {
  queue = Array<QueueEntry>();

  rootStore: RootStore;

  repository = queueEntryRepository;

  actionState = ActionState.Loading;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.loadQueue();
  }

  private async loadQueue() {
    this.actionState = ActionState.Loading;
    try {
      const queue = await this.repository.getAll();
      this.setQueue(queue);
      this.actionState = ActionState.Done;
    } catch (reason) {
      this.actionState = ActionState.Error;
    }
  }

  private setQueue(queue: QueueEntry[]) {
    queue.forEach((queueEntry) => this.updateQueueEntryFromDb(queueEntry));
  }

  private updateQueueEntryFromDb(queueEntryDb: QueueEntry) {
    // eslint-disable-next-line eqeqeq
    let queueEntry = this.queue.find((x) => x.id == queueEntryDb.id);
    if (!queueEntry) {
      queueEntry = new QueueEntry(this);
      queueEntry.updateFromDb(queueEntryDb);
      this.queue.push(queueEntry);
    }
  }

  removeQueueEntry(queueEntry: QueueEntry) {
    this.queue.splice(this.queue.indexOf(queueEntry), 1);
    this.repository.replaceQueue(this.queue);
  }

  public replaceQueue(musicList: Music[]) {
    this.queue = [];
    musicList.forEach((music, index) => {
      const queueEntry = new QueueEntry(this);
      queueEntry.id = index + 1;
      queueEntry.musicId = music.id;
      this.queue.push(queueEntry);
    });
    if (this.queue.length > 0) this.repository.replaceQueue(this.queue);
  }

  getIndexById(id: number): number {
    return this.queue.findIndex((x) => x.id == id);
  }

  isLastSong(id: number) {
    const index = this.queue.findIndex((x) => x.id == id);
    return index === this.queue.length - 1;
  }

  getPrevQueueEntry(id: number): QueueEntry {
    let index = this.getIndexById(id);
    index--;
    if (index <= 0) {
      index = this.queue.length - 1;
    }
    return this.queue[index];
  }

  getNextQueueEntry(id: number): QueueEntry {
    let index = this.getIndexById(id);
    index++;
    if (index >= this.queue.length - 1) {
      index = 0;
    }
    return this.queue[index];
  }

  /* Implement the logic for adding QueueEntries */
}
