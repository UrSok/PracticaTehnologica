import path from 'path';
import { Library, LibraryNoPath } from '../data-access/models/Library';
import LibraryRepository from '../data-access/repositories/LibraryRepository';
import BaseManager from './BaseMananger';

export default class LibraryManager extends BaseManager {
  static instance: LibraryManager = new LibraryManager();

  private constructor() {
    super(LibraryRepository.instance);
  }

  public addPath(localPath: string) {
    const absolutePath = path.resolve(localPath);
    this.repository.addIfDoesntExists(absolutePath);
    console.log('test');
  }

  public activateDeactivateLibrary(library: LibraryNoPath) {
    this.repository.activateDeactivateLibrary(library);
  }

  public async getAll(): Promise<Library[]> {
    const libraries = await this.repository.getAll();
    return libraries;
  }
}
