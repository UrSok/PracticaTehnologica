/* eslint-disable import/no-cycle */
import LibraryStore from './LibraryStore';
import MusicStore from './MusicStore';
import PlayerStore from './PlayerStore';
import QueueStore from './QueueStore';
import UserDataStore from './UserDataStore';

export default class RootStore {
  libraryStore: LibraryStore;

  musicStore: MusicStore;

  userDataStore: UserDataStore;

  playerStore: PlayerStore;

  queueStore: QueueStore;

  constructor() {
    this.userDataStore = new UserDataStore(this);
    this.libraryStore = new LibraryStore(this);
    this.musicStore = new MusicStore(this);
    this.playerStore = new PlayerStore(this);
    this.queueStore = new QueueStore(this);
  }
}
