import path from 'path';
import { Library, LibraryNoPath } from '../data-access/models/Library';
import LibraryRepository from '../data-access/repositories/LibraryRepository';

export default class LibraryManager {
  private repository: LibraryRepository;

  static instance: LibraryManager = new LibraryManager();

  private constructor() {
    this.repository = new LibraryRepository();
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
