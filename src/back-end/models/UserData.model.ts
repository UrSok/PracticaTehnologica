import { makeAutoObservable } from 'mobx';
import UserDataStore from '../store/UserDataStore';

export enum Repeat {
  None = 0,
  All = 1,
  Once = 2,
}

export enum PlayingFromType {
  MainLibrary = 0,
  Playlist = 1,
}

export default class UserData {
  /* shuffle?: boolean;

  repeat?: Repeat;

  playingMusicId?: number;

  playingFromType?: PlayingFromType;

  playingFromId?: number; */

  scanOnStart?: boolean;

  firstLaunch = false;

  store?: UserDataStore;

  constructor(store: UserDataStore | undefined) {
    makeAutoObservable(this);
    this.store = store;
  }

  updateFromDb(userData: UserData) {
    this.scanOnStart = userData.scanOnStart;
    this.firstLaunch = userData.firstLaunch;
  }

  /* toggleShuffle() {
    this.shuffle = !this.shuffle;
    this.store?.updateDb(this);
  } */

  toggleScanOnStart() {
    this.scanOnStart = !this.scanOnStart;
    this.store?.updateDb(this);
  }

  toggleFirstLaunch() {
    this.firstLaunch = !this.firstLaunch;
    this.store?.updateDb(this);
  }
}

export const NullUserData = new UserData(undefined);
