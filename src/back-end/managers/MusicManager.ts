/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable promise/always-return */
import { scanRecursively } from '@bartozzz/scan-dir';
import path from 'path';
import log from 'electron-log';
import * as musicMedatada from 'music-metadata';
import {
  Music,
  MusicWithMetadata,
  NullMusicWithMetadata,
  SrcType,
} from '../data-access/models/Music';
import MusicRepository from '../data-access/repositories/MusicRepository';
import LogLocation from '../constants/LogLocation';

export default class MusicManager {
  private repository = MusicRepository.instance;

  queue = new Array<MusicWithMetadata>();

  currentlyPlayingPosition = -1;

  get currentlyPlayingMusic(): MusicWithMetadata {
    if (this.queue.length === 0) return NullMusicWithMetadata;
    return this.queue[this.currentlyPlayingPosition];
  }

  // Only mp3, wav, ogg for now.
  public addMusicFromPath(localPath: string) {
    const regExp = new RegExp('^.+[.mp3|.ogg|.wav]$');
    scanRecursively(localPath, (fpath) => {
      if (fpath.match(regExp)) {
        const absolutePath = path.resolve(fpath);
        this.repository
          .srcExists(absolutePath)
          .then((result: any) => {
            log.info(
              `${LogLocation.MusicManager} ${
                result ? 'Found an old file' : 'Found a new file'
              }: ${absolutePath}`
            );
            if (!result) {
              this.repository.add({
                src: absolutePath,
                src_type: SrcType.Local,
              });
            }
          })
          .catch((reason: any) => {
            log.error(`${LogLocation.MusicManager} ${reason}`);
          });
      }
    });
  }

  private getFileNameWithoutExtension(src: string) {
    const fileNameWithExtenston = src.split('\\').reverse()[0];
    const extenstion = fileNameWithExtenston.split('.').reverse()[0];
    const fileName = fileNameWithExtenston.replace(`.${extenstion}`, '');
    return fileName;
  }

  private async getMusicWithMetadata(music: Music): Promise<MusicWithMetadata> {
    const metadata = await musicMedatada.parseFile(music.src);
    return {
      ...music,
      title:
        metadata.common.title !== undefined
          ? metadata.common.title
          : this.getFileNameWithoutExtension(music.src),
      artists: metadata.common.artists,
      album: metadata.common.album,
      albumArt:
        metadata.common.picture !== undefined
          ? `data:${
              metadata.common.picture[0].format
            };base64,${metadata.common.picture[0].data.toString('base64')}`
          : metadata.common.picture,
    };
  }

  private async getMusicArrayWithMetadata(
    musicList: Array<Music>
  ): Promise<MusicWithMetadata[]> {
    const result = await Promise.all(
      musicList.map(async (music) => {
        const musicWithMetadata = await this.getMusicWithMetadata(music);
        return musicWithMetadata;
      })
    );
    return result;
  }

  public async queueAll() {
    const musicList = await this.repository.getAll();
    this.queue = await this.getMusicArrayWithMetadata(musicList);
    this.currentlyPlayingPosition = 0;
  }

  public nextSong() {
    this.currentlyPlayingPosition++;
    if (this.queue.length === this.currentlyPlayingPosition)
      this.currentlyPlayingPosition = 0;
  }

  public prevSong() {
    this.currentlyPlayingPosition--;
    if (this.currentlyPlayingPosition === -1)
      this.currentlyPlayingPosition = this.queue.length - 1;
  }
}
