/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
import { makeAutoObservable } from 'mobx';
import { Music, PlayingFromType, Playlist, PlaylistEntry, Repeat } from '.';
import PlayerStore from '../store/PlayerStore';
import DateUtils from '../utils/DateUtils';
import { QueueEntryState } from './enums';

export default class Player {
  playing = false;

  shuffle = false;

  repeat = Repeat.None;

  played = 0;

  volume = 1;

  muted = false;

  playingFromType = PlayingFromType.None;

  playingFromId?: number;

  store: PlayerStore;

  constructor(store: PlayerStore) {
    makeAutoObservable(this);
    this.store = store;
  }

  get currentPlayingMusic(): Music | undefined {
    const { queueStore, musicStore } = this.store.rootStore;
    const queueEntry = queueStore.currentQueueEntryOrQueueEntryPriority;
    if (queueEntry) return musicStore.getById(queueEntry.musicId);
    return undefined;
  }

  get timeString(): string {
    const music = this.currentPlayingMusic;
    if (!music) return '';
    return DateUtils.getTimeString(this.played * music.durationSeconds);
  }

  updateFromDb(player: Player) {
    this.shuffle = player.shuffle;
    this.repeat = player.repeat;
    this.playingFromType = player.playingFromType;
    this.playingFromId = player.playingFromId;
    this.played = player.played;
    this.volume = player.volume;
  }

  seekTo(value: number) {
    this.store.reactPlayer.seekTo(value);
    this.setProgress(value);
  }

  seekToSavedProgress() {
    this.store.reactPlayer.seekTo(this.played);
  }

  toggleMute() {
    this.muted = !this.muted;
    this.store.updateDb(this);
  }

  togglePlaying() {
    this.playing = !this.playing;
  }

  Play() {
    this.playing = true;
  }

  Pause() {
    this.playing = false;
  }

  toggleShuffle() {
    const { queueStore } = this.store.rootStore;
    this.shuffle = !this.shuffle;
    if (this.shuffle) {
      queueStore.shuffleQueue();
    } else {
      queueStore.unshuffleQueue();
    }
    this.store.updateDb(this);
  }

  setRepeatAll() {
    this.repeat = Repeat.All;
    this.store.updateDb(this);
  }

  toggleRepeat() {
    this.repeat++;
    if (this.repeat > 2) this.repeat = 0;
    this.store.updateDb(this);
  }

  setVolume(volume: number) {
    this.volume = volume;
  }

  setVolumeAndSave(volume: number) {
    this.volume = volume;
    this.store.updateDb(this);
  }

  saveToDb() {
    this.store.updateDb(this);
  }

  setProgress(played: number) {
    this.played = played;
  }

  playCurrentMainLibrary(musicId?: number) {
    const { queueStore, musicStore } = this.store.rootStore;
    if (this.playingFromType === PlayingFromType.MainLibrary) {
      if (queueStore.currentQueueEntry)
        queueStore.currentQueueEntry.setState(QueueEntryState.None);
      // What's the point of the shit above?
    } else {
      queueStore.replaceQueueFromMainLibrary(musicStore.musicList);
      this.playingFromType = PlayingFromType.MainLibrary;
      this.playingFromId = undefined;
      if (this.shuffle) queueStore.shuffleQueue();
    }
    const playMusicId =
      musicId ??
      musicStore.musicList[
        Math.floor(Math.random() * musicStore.musicList.length)
      ].id;
    queueStore.setPlayingByMusicId(playMusicId);
    queueStore.updateQueuesDb();
    this.Play();
    if (this.repeat === Repeat.Track) {
      this.setRepeatAll();
    }
  }

  playCurrentPlaylist(playlist: Playlist, musicId?: number) {
    const { queueStore } = this.store.rootStore;
    if (
      this.playingFromType === PlayingFromType.Playlist &&
      this.playingFromId === playlist.id
    ) {
      console.log('same shit'); // Remove later
    } else {
      queueStore.replaceQueueFromPlaylist(playlist.entries);
      this.playingFromType = PlayingFromType.Playlist;
      this.playingFromId = playlist.id;
      if (this.shuffle) queueStore.shuffleQueue();
    }
    const playMusicId =
      musicId ??
      playlist.entries[Math.floor(Math.random() * playlist.entries.length)]
        .musicId;
    queueStore.setPlayingByMusicId(playMusicId);
    queueStore.updateQueuesDb();
    this.Play();
    if (this.repeat === Repeat.Track) {
      this.setRepeatAll();
    }
  }

  prevSong() {
    const { queueStore } = this.store.rootStore;
    if (this.played <= 0.1) {
      queueStore.prevEntry();
      if (this.repeat === Repeat.Track) this.setRepeatAll();
      if (!this.playing) this.Play();
    } else {
      this.seekTo(0);
    }
  }

  nextSong(forced = false) {
    const { queueStore } = this.store.rootStore;
    this.seekTo(0);
    if (this.repeat === Repeat.Track) {
      if (forced) {
        this.Play();
        this.setRepeatAll();
      } else return;
    } else if (
      !forced &&
      this.repeat === Repeat.None &&
      queueStore.isLastSong
    ) {
      this.playing = false;
      return;
    }
    queueStore.nextEntry();
  }
}
