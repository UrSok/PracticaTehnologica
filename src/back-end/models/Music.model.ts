import { makeAutoObservable, runInAction } from 'mobx';
import log from 'electron-log';
import * as musicMedatada from 'music-metadata';
import MusicStore from '../store/MusicStore';
import DateUtils from '../utils/DateUtils';

export default class Music {
  id = -1;

  src = '';

  title = '';

  artists?: string[];

  album?: string;

  albumArt?: string;

  added = new Date(Date.now());

  durationSeconds = 0;

  store: MusicStore;

  constructor(store: MusicStore) {
    makeAutoObservable(this);
    this.store = store;
  }

  get addedString(): string {
    return DateUtils.getDateDiffOrDateString(this.added);
  }

  get durationString(): string {
    return DateUtils.getTimeString(this.durationSeconds);
  }

  get artistsString(): string {
    if (!this.artists) return '';
    return this.artists.join(', ');
  }

  get albumString(): string {
    if (!this.album) return '';
    return this.album;
  }

  get artistsAlbumString(): string {
    const artists = this.artistsString;
    return `${artists} ${this.artists && this.album ? '-' : ''} ${
      this.albumString
    }`;
  }

  updateFromDb(music: Music) {
    this.id = music.id;
    this.src = music.src;
    this.title = music.title;
    this.added = new Date(music.added);
  }

  private getTitleWithoutFileExtension(): string {
    const fileNameWithExtenston = this.src.split('/').reverse()[0];
    const extenstion = fileNameWithExtenston.split('.').reverse()[0];
    const fileName = fileNameWithExtenston.replace(`.${extenstion}`, '');
    return fileName;
  }

  async updateMedatada(): Promise<boolean> {
    return musicMedatada
      .parseFile(this.src)
      .then((metadata) => {
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
        return true;
      })
      .catch((reason) => {
        log.error(reason);
        this.store.removeMusic(this);
        return false;
      });
  }
}
