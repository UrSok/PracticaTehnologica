import log from 'electron-log';
import { makeAutoObservable, runInAction } from 'mobx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as scanAsync from 'recursive-readdir-async';
import { Music } from '.';
import LibraryStore from '../store/LibraryStore';

export default class Library {
  id = -1;

  path = '';

  active = true;

  store: LibraryStore;

  constructor(store: LibraryStore) {
    makeAutoObservable(this);
    this.store = store;
  }

  updateFromDb(library: Library) {
    this.id = library.id;
    this.path = library.path;
    this.active = library.active;
  }

  toggleActive() {
    this.active = !this.active;
    this.store.repository.toggleActive(this);
  }

  async scanPath() {
    const supportedExtensionsRegex = new RegExp(`^.mp3|.ogg|.wav$`);
    const { musicStore } = this.store.rootStore;
    await scanAsync.list(
      this.path,
      {
        extensions: true,
      },
      async (file: any, index: number, total: number) => {
        if (
          !file.isDirectory &&
          supportedExtensionsRegex.test(file.extension)
        ) {
          // log.info(`${index}/${total}`, file.fullname);
          const music = new Music(musicStore);
          runInAction(() => {
            music.src = file.fullname;
            music.added = new Date(Date.now());
            musicStore.addMusicIfDoesntExist(music);
          });
        }
      }
    );
  }
}
