/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as scanAsync from 'recursive-readdir-async';
import log from 'electron-log';
import path from 'path';
import LogLocation from '../constants/LogLocation';
import { Library, LibraryNoPath } from '../data-access/models/Library';
import LibraryRepository from '../data-access/repositories/LibraryRepository';
import MusicRepository from '../data-access/repositories/MusicRepository';
import { MusicNoId, SrcType } from '../data-access/models/Music';

export default class LibraryManager {
  private repository = LibraryRepository.instance;

  static instance: LibraryManager = new LibraryManager();

  public async addPath(localPath: string): Promise<string> {
    const absolutePath = path.resolve(localPath);
    const result = await this.repository.addIfDoesntExist(absolutePath);
    if (result) return absolutePath;
    return '';
  }

  // Only mp3, wav, ogg for now.
  public async scanPath(localPath: string) {
    const musicRepository = MusicRepository.instance;
    const regExp = new RegExp(`^.mp3|.ogg|.wav$`);
    await scanAsync.list(
      localPath,
      {
        extensions: true,
        include: ['.mp3', '.ogg', '.wav'],
      },
      async (file: any, index: any, total: any) => {
        if (regExp.test(file.extension)) {
          const srcExists = await musicRepository.srcExists(file.fullname);
          log.info(
            `${LogLocation.MusicManager} ${
              srcExists ? 'Found an old file' : 'Found a new file'
            }: ${file.fullname}`
          );
          if (!srcExists) {
            const music: MusicNoId = {
              src: file.fullname,
              src_type: SrcType.Local,
            };
            musicRepository.add(music);
          }
        }
      }
    );
  }

  public async scanAllPaths(): Promise<boolean> {
    try {
      const libraryRepository = LibraryRepository.instance;
      const libraries = await libraryRepository.getAll();
      libraries.forEach((item) => {
        if (item.active) this.scanPath(item.path);
      });
      return true;
    } catch (error) {
      log.error(`${LogLocation.LibraryManager} ${error}`);
      return false;
    }
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
