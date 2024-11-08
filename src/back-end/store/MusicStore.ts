/* eslint-disable eqeqeq */
import { makeAutoObservable, runInAction } from 'mobx';
import ActionState from '../constants/ActionState';
import musicRepository from '../data-access/repositories/MusicRepository';
import { Music } from '../models';
// eslint-disable-next-line import/no-cycle
import RootStore from './RootStore';

export default class MusicStore {
  musicList = Array<Music>();

  rootStore: RootStore;

  repository = musicRepository;

  actionState = ActionState.Loading;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  async loadMusicList() {
    this.actionState = ActionState.Loading;
    try {
      const musicList = await this.repository.getAll();
      this.setMusicList(musicList);
      this.actionState = ActionState.Done;
    } catch (reason) {
      this.actionState = ActionState.Error;
    }
  }

  private async setMusicList(musicList: Music[]) {
    musicList.forEach((music) => this.updateMusicFromDb(music));
  }

  private async updateMusicFromDb(musicDb: Music) {
    // eslint-disable-next-line eqeqeq
    let music = this.musicList.find((x) => x.id == musicDb.id);
    if (!music) {
      music = new Music(this);
      music.updateFromDb(musicDb);
      music.updateMedatada();
      this.musicList.push(music);
    }
  }

  addMusicIfDoesntExist(music: Music) {
    if (!this.musicExists(music)) {
      this.addMusic(music);
    }
  }

  private async addMusic(music: Music) {
    const resultId = await this.repository.add(music);
    if (resultId !== 0) {
      music.id = resultId;
      music.updateMedatada();
      runInAction(() => {
        this.musicList.push(music);
      });
    }
  }

  removeMusic(music: Music) {
    this.musicList.splice(this.musicList.indexOf(music), 1);
    this.repository.remove(music);
  }

  private musicExists(music: Music): boolean {
    return this.musicList.some((x) => x.src === music.src);
  }

  getById(id: number): Music | undefined {
    return this.musicList.find((x) => x.id == id);
  }
}
