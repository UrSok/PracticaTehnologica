/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
import { makeAutoObservable } from 'mobx';
import { Music } from '.';
import PlayerStore from '../store/PlayerStore';
import getTimeString from '../utils/utils';
import { NullMusic } from './Music.model';

export enum Repeat {
  None = 0,
  All = 1,
  Track = 2,
}

export enum PlayingFromType {
  MainLibrary = 0,
  Playlist = 1,
}

export default class Player {
  playing = false;

  shuffle = false;

  repeat = Repeat.None;

  playingQueueEntryId?: number;

  playingFromType?: PlayingFromType;

  playingFromId?: number;

  played = 0;

  volume = 1;

  muted = false;

  store?: PlayerStore;

  constructor(store: PlayerStore | undefined) {
    makeAutoObservable(this);
    this.store = store;
  }

  get currentPlayingMusic(): Music {
    const queueEntry = this.store?.rootStore.queueStore.queue.find(
      (x) => x.id == this.playingQueueEntryId
    );
    let music: Music | undefined;
    if (queueEntry)
      music = this.store?.rootStore.musicStore.getById(queueEntry.musicId);
    if (music) return music;
    return NullMusic;
  }

  get timeString(): string {
    return getTimeString(
      this.played * this.currentPlayingMusic.durationSeconds
    );
  }

  updateFromDb(player: Player) {
    this.shuffle = player.shuffle;
    this.repeat = player.repeat;
    this.playingQueueEntryId = player.playingQueueEntryId;
    this.playingFromType = player.playingFromType;
    this.playingFromId = player.playingFromId;
    this.played = player.played;
    this.volume = player.volume;
  }

  seekTo(value: number) {
    this.store?.reactPlayer.seekTo(value);
    this.setProgress(value);
  }

  toggleMute() {
    this.muted = !this.muted;
    this.store?.updateDb(this);
  }

  togglePlaying() {
    this.playing = !this.playing;
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
    this.store?.updateDb(this);
  }

  setRepeatAll() {
    this.repeat = Repeat.All;
    this.store?.updateDb(this);
  }

  toggleRepeat() {
    this.repeat++;
    if (this.repeat > 2) this.repeat = 0;
    this.store?.updateDb(this);
  }

  setVolume(volume: number) {
    this.volume = volume;
  }

  setVolumeAndSave(volume: number) {
    this.volume = volume;
    this.store?.updateDb(this);
  }

  setProgressAndSave(played: number) {
    this.played = played;
    this.store?.updateDb(this);
  }

  setProgress(played: number) {
    this.played = played;
  }

  setPlayingQueueEntryId(playingQueueEntryId: number) {
    this.playingQueueEntryId = playingQueueEntryId;
    this.store?.updateDb(this);
  }

  setPlayingFromType(playingFromType: PlayingFromType) {
    this.playingFromType = playingFromType;
    this.store?.updateDb(this);
  }

  setPlayingFromId(playingFromId: number) {
    this.playingFromId = playingFromId;
    this.store?.updateDb(this);
  }

  setNewPlayingQueue(
    playingFromType: PlayingFromType,
    playingQueueEntryId: number
  ) {
    this.playingFromType = playingFromType;
    this.playingQueueEntryId = playingQueueEntryId;
    this.store?.updateDb(this);
  }

  queueAll() {
    this.store?.rootStore.queueStore.replaceQueue(
      this.store?.rootStore.musicStore.musicList
    );
    this.setNewPlayingQueue(
      PlayingFromType.MainLibrary,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.store!.rootStore.queueStore.queue[0].id!
    );
  }

  prevSong() {
    if (this.repeat === Repeat.Track) this.setRepeatAll();
    if (this.played <= 0.1) {
      const queueEntry = this.store?.rootStore.queueStore.getPrevQueueEntry(
        this.playingQueueEntryId!
      );
      this.setPlayingQueueEntryId(queueEntry!.id!);
    } else {
      this.seekTo(0);
    }
  }

  nextSong(forced = false) {
    if (forced) this.setRepeatAll();
    if (this.repeat === Repeat.Track) {
      this.seekTo(0);
      return;
    }
    if (
      this.repeat === Repeat.None &&
      this.store?.rootStore.queueStore.isLastSong(this.playingQueueEntryId!)
    ) {
      this.playing = false;
      this.seekTo(0);
      return;
    }
    const queueEntry = this.store?.rootStore.queueStore.getNextQueueEntry(
      this.playingQueueEntryId!
    );
    this.setPlayingQueueEntryId(queueEntry!.id!);
  }
}

export const NullPlayer = new Player(undefined);
