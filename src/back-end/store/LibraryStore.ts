/* eslint-disable max-classes-per-file */
import { makeAutoObservable, runInAction } from 'mobx';
import { Library } from '../models';
import ActionState from '../constants/ActionState';
// eslint-disable-next-line import/no-cycle
import RootStore from './RootStore';
import libraryRepository from '../data-access/repositories/LibraryRepository';

export default class LibraryStore {
  libraries = Array<Library>();

  rootStore: RootStore;

  repository = libraryRepository;

  actionState = ActionState.Loading;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  public async loadLibaries() {
    this.actionState = ActionState.Loading;
    try {
      const libraries = await this.repository.getAll();
      runInAction(() => {
        this.setLibraries(libraries);
      });
      this.actionState = ActionState.Done;
    } catch (reason) {
      this.actionState = ActionState.Error;
    }
  }

  private setLibraries(libraries: Library[]) {
    libraries.forEach((library) => this.updateLibraryFromDb(library));
  }

  private updateLibraryFromDb(libraryDb: Library) {
    // eslint-disable-next-line eqeqeq
    let library = this.libraries.find((x) => x.id == libraryDb.id);
    if (!library) {
      library = new Library(this);
      library.updateFromDb(libraryDb);
      this.libraries.push(library);
    }
  }

  addLibraryIfDoesntExist(library: Library) {
    if (!this.libraryExists(library)) {
      this.addLibrary(library);
      return true;
    }
    return false;
  }

  async addLibrary(library: Library) {
    // should I use it in firstlaunchwindow?
    const resultId = await this.repository.add(library.path);
    if (resultId !== 0) {
      library.id = resultId;
      runInAction(() => {
        this.libraries.push(library);
      });
    }
  }

  private libraryExists(library: Library): boolean {
    return this.libraries.some((x) => x.path === library.path);
  }

  scanPaths() {
    this.libraries.forEach((library) => {
      if (library.active) {
        library.scanPath();
      }
    });
  }
}
