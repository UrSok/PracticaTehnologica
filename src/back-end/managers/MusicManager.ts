/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable promise/always-return */
import * as musicMedatada from 'music-metadata';
import {
  Music,
  MusicWithMetadata,
  NullMusicWithMetadata,
} from '../data-access/models/Music';
import MusicRepository from '../data-access/repositories/MusicRepository';

export default class MusicManager {
  private repository = MusicRepository.instance;

  queue = new Array<MusicWithMetadata>();

  currentlyPlayingPosition = -1;

  static instance = new MusicManager();

  get currentlyPlayingMusic(): MusicWithMetadata {
    if (this.queue.length === 0) return NullMusicWithMetadata;
    return this.queue[this.currentlyPlayingPosition];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

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
