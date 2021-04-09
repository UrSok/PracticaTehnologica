/* eslint-disable import/no-cycle */
import LibraryStore from './LibraryStore';
import MusicStore from './MusicStore';
import UserDataStore from './UserDataStore';

export default class RootStore {
  libraryStore: LibraryStore;

  musicStore: MusicStore;

  userDataStore: UserDataStore;

  constructor() {
    this.libraryStore = new LibraryStore(this);
    this.musicStore = new MusicStore(this);
    this.userDataStore = new UserDataStore(this);
  }
}
