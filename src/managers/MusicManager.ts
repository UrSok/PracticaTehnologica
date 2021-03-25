/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable promise/always-return */
import { scanRecursively } from '@bartozzz/scan-dir';
import path from 'path';
import { Music, SrcType } from '../data-access/models/Music';
import { NullMusic } from '../data-access/null-models/Music';
import MusicRepository from '../data-access/repositories/MusicRepository';

export default class MusicManager {
  musicRepository = new MusicRepository();

  static queue = new Array<Music>();

  static currentlyPlayingPosition = -1;

  static get currentlyPlayingMusic(): Music {
    if (MusicManager.queue.length === 0) return NullMusic;
    return MusicManager.queue[MusicManager.currentlyPlayingPosition];
  }

  // Only mp3, wav, ogg for now.
  public addMusicFromPath(localPath: string) {
    const regExp = new RegExp('^.+[.mp3|.ogg|.wav]$');
    scanRecursively(localPath, (fpath) => {
      if (fpath.match(regExp)) {
        this.musicRepository
          .srcExists(fpath)
          .then((result) => {
            if (!result) {
              this.musicRepository.add({
                src: path.resolve(fpath),
                src_type: SrcType.Local,
              });
            }
          })
          .catch((reason) => {
            console.log(reason);
          });
      }
    });
  }

  public async queueAll(): Promise<boolean> {
    try {
      const result = await this.musicRepository.getAll();
      MusicManager.queue = result;
      MusicManager.currentlyPlayingPosition = 0;
      return true;
    } catch (error) {
      return false;
    }
  }

  public nextSong() {
    MusicManager.currentlyPlayingPosition++;
    if (MusicManager.queue.length === MusicManager.currentlyPlayingPosition)
      MusicManager.currentlyPlayingPosition = 0;
  }

  public prevSong() {
    MusicManager.currentlyPlayingPosition--;
    if (MusicManager.currentlyPlayingPosition === -1)
      MusicManager.currentlyPlayingPosition = MusicManager.queue.length - 1;
  }
}
