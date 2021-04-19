/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
import { makeAutoObservable } from 'mobx';
import ActionState from '../constants/ActionState';
import queueEntryRepository from '../data-access/repositories/QueueEntryRepository';
import {
  Music,
  PlayingFromType,
  PlaylistEntry,
  QueueEntry,
  QueueEntryState,
} from '../models';
// eslint-disable-next-line import/no-cycle
import RootStore from './RootStore';

export default class QueueStore {
  queue = Array<QueueEntry>();

  initialQueue = Array<QueueEntry>();

  priorityQueue = Array<QueueEntry>();

  rootStore: RootStore;

  repository = queueEntryRepository;

  actionState = ActionState.Loading;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.loadQueues();
  }

  get isQueueEmpty(): boolean {
    return this.queue.length === 0;
  }

  get isPriorityQueueEmpty(): boolean {
    return this.priorityQueue.length === 0;
  }

  get nextItemId(): number {
    const queueMax = this.isQueueEmpty
      ? 0
      : Math.max(...this.queue.map((x) => x.id));
    const priorityQueueMax = this.isPriorityQueueEmpty
      ? 0
      : Math.max(...this.priorityQueue.map((x) => x.id));
    return this.isQueueEmpty ? 1 : Math.max(queueMax, priorityQueueMax) + 1;
  }

  get isLastSong() {
    const index = this.currentQueueEntryIndex;
    return index === this.queue.length - 1;
  }

  get currentQueueEntryIndex(): number {
    if (!this.currentQueueEntry) return -1;
    return this.queue.indexOf(this.currentQueueEntry);
  }

  get currentQueueEntry(): QueueEntry | undefined {
    return this.queue.find(
      (x) =>
        x.state === QueueEntryState.WasPlaying ||
        x.state === QueueEntryState.Playing
    );
  }

  get currentQueueEntryOrQueueEntryPriority(): QueueEntry | undefined {
    if (
      !this.isPriorityQueueEmpty &&
      this.priorityQueue[0].state === QueueEntryState.Playing
    )
      return this.priorityQueue[0];
    return this.currentQueueEntry;
  }

  get isQueueEntryPriorityPlaying(): boolean {
    return this.priorityQueue.some((x) => x.state === QueueEntryState.Playing);
  }

  get prevQueueEntry(): QueueEntry | undefined {
    let index = this.currentQueueEntryIndex;
    index--;
    if (index <= 0) {
      index = this.queue.length - 1;
    }
    return this.queue[index];
  }

  get nextQueueEntry(): QueueEntry | undefined {
    if (!this.isPriorityQueueEmpty) return this.priorityQueue[0];
    let index = this.currentQueueEntryIndex;
    index++;
    if (index >= this.queue.length - 1) {
      index = 0;
    }
    return this.queue[index];
  }

  getQueueEntryByMusicId(musicId: number): QueueEntry | undefined {
    return this.queue.find((x) => x.musicId == musicId);
  }

  removePlayedQueueEntryPriority() {
    this.priorityQueue = this.priorityQueue.filter(
      (x) => x.state === QueueEntryState.None
    );
  }

  prevEntry() {
    if (!this.currentQueueEntryOrQueueEntryPriority) return;
    if (!this.currentQueueEntry) return;
    if (!this.prevQueueEntry) return;
    this.removePlayedQueueEntryPriority();
    if (this.currentQueueEntry.state === QueueEntryState.WasPlaying) {
      this.currentQueueEntry.setState(QueueEntryState.None);
    } else {
      const current = this.currentQueueEntry;
      const prev = this.prevQueueEntry;
      current.setState(QueueEntryState.None);
      prev.setState(QueueEntryState.Playing);
    }
    /* Save to DB */
  }

  nextEntry() {
    if (!this.currentQueueEntry) return;
    if (!this.nextQueueEntry) return;
    this.removePlayedQueueEntryPriority();
    if (this.isQueueEntryPriorityPlaying) {
      this.nextQueueEntry.setState(QueueEntryState.Playing);
    } else {
      const current = this.currentQueueEntry;
      const next = this.nextQueueEntry;
      current.setState(QueueEntryState.None);
      next.setState(QueueEntryState.Playing);
    }
    /* Save to DB */
  }

  private async loadQueues() {
    this.actionState = ActionState.Loading;
    try {
      const { shuffle } = this.rootStore.playerStore.player;
      const queue = await this.repository.getAll(shuffle);
      this.setQueue(queue);
      if (shuffle) {
        const initialQueue = await this.repository.getAll();
        this.setInitialQueue(initialQueue);
      }
      const priorityQueue = await this.repository.getAllPriority();
      this.setPriorityQueue(priorityQueue);
      this.actionState = ActionState.Done;
    } catch (reason) {
      this.actionState = ActionState.Error;
    }
  }

  private setQueue(queue: QueueEntry[]) {
    queue.forEach((queueEntry) => this.updateQueueEntryFromDb(queueEntry));
  }

  private updateQueueEntryFromDb(queueEntryDb: QueueEntry) {
    let queueEntry = this.queue.find((x) => x.id == queueEntryDb.id);
    if (!queueEntry) {
      queueEntry = new QueueEntry(this);
      queueEntry.updateFromDb(queueEntryDb);
      queueEntry.music = this.rootStore.musicStore.musicList.find(
        (x) => x.id == queueEntry?.musicId
      );
      this.queue.push(queueEntry);
    }
  }

  private setInitialQueue(queue: QueueEntry[]) {
    queue.forEach((queueEntry) =>
      this.updateInitialQueueEntryFromDb(queueEntry)
    );
  }

  private updateInitialQueueEntryFromDb(queueEntryDb: QueueEntry) {
    let queueEntry = this.initialQueue.find((x) => x.id == queueEntryDb.id);
    if (!queueEntry) {
      queueEntry = new QueueEntry(this);
      queueEntry.updateFromDb(queueEntryDb);
      queueEntry.music = this.rootStore.musicStore.musicList.find(
        (x) => x.id == queueEntry?.musicId
      );
      this.initialQueue.push(queueEntry);
    }
  }

  private setPriorityQueue(queue: QueueEntry[]) {
    queue.forEach((queueEntry) =>
      this.updatePriorityQueueEntryFromDb(queueEntry)
    );
  }

  private updatePriorityQueueEntryFromDb(queueEntryDb: QueueEntry) {
    let queueEntry = this.priorityQueue.find((x) => x.id == queueEntryDb.id);
    if (!queueEntry) {
      queueEntry = new QueueEntry(this);
      queueEntry.updateFromDb(queueEntryDb);
      queueEntry.music = this.rootStore.musicStore.musicList.find(
        (x) => x.id == queueEntry?.musicId
      );
      this.priorityQueue.push(queueEntry);
    }
  }

  async clearPriorityQueue() {
    this.priorityQueue = this.priorityQueue.filter(
      (x) => x.state === QueueEntryState.Playing
    );
    this.repository.replacePriorityQueue(this.priorityQueue);
  }

  async replaceQueueFromMainLibrary(musicList: Music[]) {
    this.queue = [];
    this.initialQueue = [];
    musicList.forEach((music, index) => {
      const queueEntry = new QueueEntry(this);
      queueEntry.id = index + 1;
      queueEntry.musicId = music.id;
      queueEntry.music = music;
      queueEntry.fromType = PlayingFromType.MainLibrary;
      this.queue.push(queueEntry);
    });
    this.updateQueuesDb();
  }

  async replaceQueueFromPlaylist(playlistEntry: PlaylistEntry[]) {
    this.queue = [];
    this.initialQueue = [];
    playlistEntry.forEach((entry, index) => {
      const queueEntry = new QueueEntry(this);
      queueEntry.id = index + 1;
      queueEntry.musicId = entry.musicId;
      queueEntry.music = entry.music;
      queueEntry.fromType = PlayingFromType.Playlist;
      queueEntry.fromId = entry.playlistId;
      this.queue.push(queueEntry);
    });
    this.updateQueuesDb();
  }

  async shuffleQueue() {
    this.initialQueue.splice(0, this.initialQueue.length, ...this.queue);
    for (let i = this.queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
    }
    this.repository.replaceShuffledQueue(this.queue);
    this.updateQueuesDb();
  }

  async unshuffleQueue() {
    this.queue.splice(0, this.queue.length, ...this.initialQueue);
    this.updateQueuesDb();
  }

  setPlayingByMusicId(musicId: number) {
    const queueEntry = this.queue.find((x) => x.musicId == musicId);
    if (!queueEntry) return;
    this.removePlayedQueueEntryPriority();
    if (
      this.currentQueueEntry &&
      this.currentQueueEntry.state === QueueEntryState.Playing
    )
      this.currentQueueEntry.setState(QueueEntryState.None);
    queueEntry.setState(QueueEntryState.Playing);
    this.updateQueuesDb();
    this.repository.replacePriorityQueue(this.priorityQueue);
  }

  setPlayingPriorityQueueEntryByIndex(index: number) {
    if (index < 0 || index >= this.priorityQueue.length) return;
    if (this.isQueueEntryPriorityPlaying && this.currentQueueEntry)
      this.currentQueueEntry.setState(QueueEntryState.WasPlaying);
    this.priorityQueue.slice(0, index);
    this.priorityQueue[0].setState(QueueEntryState.Playing);
    this.updateQueuesDb();
    this.repository.replacePriorityQueue(this.priorityQueue);
  }

  addPriorityQueue(
    musicId: number,
    fromType?: PlayingFromType,
    fromId?: number
  ) {
    const queueEntry = new QueueEntry(this);
    queueEntry.id = this.nextItemId;
    queueEntry.musicId = musicId;
    queueEntry.music = this.rootStore.musicStore.getById(musicId);
    queueEntry.fromType = fromType ?? PlayingFromType.MainLibrary;
    queueEntry.fromId = fromId;
    this.priorityQueue.push(queueEntry);
    this.repository.addPriorityQueueEntry(queueEntry);
  }

  updateQueuesDb() {
    if (this.rootStore.playerStore.player.shuffle) {
      this.repository.replaceShuffledQueue(this.queue);
      this.repository.replaceQueue(this.initialQueue);
    } else {
      this.repository.replaceShuffledQueue([]);
      this.repository.replaceQueue(this.queue);
    }
  }

  removeQueueEntry(queueEntry: QueueEntry) {
    this.queue.splice(this.queue.indexOf(queueEntry), 1);
    this.queue.splice(this.initialQueue.indexOf(queueEntry), 1);
    this.queue.splice(this.priorityQueue.indexOf(queueEntry), 1); // why do I do that ??
    this.updateQueuesDb();
    this.repository.replacePriorityQueue(this.priorityQueue);
  }
}
