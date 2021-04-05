import path from 'path';
import { Library, LibraryNoPath } from '../data-access/models/Library';
import LibraryRepository from '../data-access/repositories/LibraryRepository';

export default class LibraryManager {
  private repository = LibraryRepository.instance;

  static instance: LibraryManager = new LibraryManager();

  public async addPath(localPath: string): Promise<string> {
    const absolutePath = path.resolve(localPath);
    const result = await this.repository.addIfDoesntExists(absolutePath);
    if (result) return absolutePath;
    return '';
  }

  public async activateDeactivateLibrary(
    library: LibraryNoPath
  ): Promise<boolean> {
    const result = await this.repository.activateDeactivateLibrary(library);
    return result;
  }

  public async getAll(): Promise<Library[]> {
    const libraries = await this.repository.getAll();
    return libraries;
  }

  public async getById(id: number): Promise<Library> {
    const library = await this.repository.getById(id);
    return library;
  }

  public async getByPath(localPath: string): Promise<Library> {
    const library = await this.repository.getByPath(localPath);
    return library;
  }
}
