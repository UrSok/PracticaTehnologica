import { makeAutoObservable } from 'mobx';
import UserDataStore from '../store/UserDataStore';

export default class UserData {
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
