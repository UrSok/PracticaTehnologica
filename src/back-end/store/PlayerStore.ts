import { makeAutoObservable, runInAction } from 'mobx';
import ActionState from '../constants/ActionState';
import playerRepository from '../data-access/repositories/PlayerRepository';
import { Player } from '../models';
// eslint-disable-next-line import/no-cycle
import RootStore from './RootStore';

export default class PlayerStore {
  player: Player = new Player(this);

  reactPlayer?: any;

  rootStore: RootStore;

  repository = playerRepository;

  actionState = ActionState.Loading;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  async loadPlayer() {
    this.actionState = ActionState.Loading;
    try {
      const player = await this.repository.get();
      if (player) this.player.updateFromDb(player);
      this.actionState = ActionState.Done;
    } catch (reason) {
      this.actionState = ActionState.Error;
    }
  }

  async setReactPlayer(reactPlayer: any) {
    this.reactPlayer = reactPlayer;
  }

  updateDb(player: Player) {
    this.repository.update(player);
  }
}
