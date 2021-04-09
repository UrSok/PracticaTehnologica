/* eslint-disable max-classes-per-file */
import { makeAutoObservable, runInAction } from 'mobx';
import { Library, UserData } from '../models';
import ActionState from '../constants/ActionState';
// eslint-disable-next-line import/no-cycle
import RootStore from './RootStore';
import userDataRepository from '../data-access/repositories/UserDataRepository';

export default class UserDataStore {
  userData?: UserData;

  rootStore: RootStore;

  repository = userDataRepository;

  actionState = ActionState.Loading;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.loadUserData();
  }

  public async loadUserData() {
    this.actionState = ActionState.Loading;
    try {
      const userDada = await this.repository.get();
      runInAction(() => {
        this.userData = new UserData(this);
        this.userData.updateFromDb(userDada);
      });
      this.actionState = ActionState.Done;
    } catch (reason) {
      this.actionState = ActionState.Error;
    }
  }

  updateDb(userData: UserData) {
    this.repository.update(userData);
  }
}
