import { makeAutoObservable, runInAction } from 'mobx';
import * as musicMedatada from 'music-metadata';
import MusicStore from '../store/MusicStore';
import getTimeString from '../utils/utils';

export default class Music {
  id = -1;

  src = '';

  title = '';

  artists?: string[];

  album?: string;

  albumArt?: string;

  added?: Date;

  durationSeconds = 0;

  store?: MusicStore;

  constructor(store: MusicStore | undefined) {
    makeAutoObservable(this);
    this.store = store;
  }

  get addedString(): string {
    const { added } = this;
    if (added !== undefined) {
      const currentDate = new Date(Date.now());
      const milliseconds = currentDate.getTime() - added?.getTime();
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds > 0 && seconds < 60) return '1< minute ago';
      if (minutes > 0 && minutes < 60)
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      if (hours > 0 && hours < 24)
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (days > 0 && days < 14) return `${days} day${days > 1 ? 's' : ''} ago`;
      return added.toLocaleDateString();
    }
    return '';
  }

  get durationString(): string {
    return getTimeString(this.durationSeconds);
  }

  updateFromDb(music: Music) {
    this.id = music.id;
    this.src = music.src;
    this.title = music.title;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.added = new Date(music.added!);
  }

  private getTitleWithoutFileExtension(): string {
    const fileNameWithExtenston = this.src.split('/').reverse()[0];
    const extenstion = fileNameWithExtenston.split('.').reverse()[0];
    const fileName = fileNameWithExtenston.replace(`.${extenstion}`, '');
    return fileName;
  }

  async updateMedatada() {
    const metadata = await musicMedatada.parseFile(this.src);
    runInAction(() => {
      this.title =
        metadata.common.title !== undefined
          ? metadata.common.title
          : this.getTitleWithoutFileExtension();
      this.artists = metadata.common.artists;
      this.album = metadata.common.album;
      this.albumArt =
        metadata.common.picture !== undefined
          ? `data:${
              metadata.common.picture[0].format
            };base64,${metadata.common.picture[0].data.toString('base64')}`
          : undefined;
      this.durationSeconds = metadata.format.duration ?? 0;
    });
  }
}

export const NullMusic = new Music(undefined);
