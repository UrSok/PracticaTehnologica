/* eslint-disable eqeqeq */
import { makeAutoObservable, runInAction } from 'mobx';
import ActionState from '../constants/ActionState';
import playlistRepository from '../data-access/repositories/PaylistRepository';
import { Playlist } from '../models';
import PlaylistEntry from '../models/PlaylistEntry.model';
// eslint-disable-next-line import/no-cycle
import RootStore from './RootStore';

export default class PlaylistStore {
  playlists = Array<Playlist>();

  rootStore: RootStore;

  repository = playlistRepository;

  actionState = ActionState.Loading;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  async loadPlaylists() {
    this.actionState = ActionState.Loading;
    try {
      const playlists = await this.repository.getAll();
      this.setPlaylists(playlists);
      await this.loadPlaylistEntries();
      this.actionState = ActionState.Done;
    } catch (reason) {
      this.actionState = ActionState.Error;
    }
  }

  private setPlaylists(playlists: Playlist[]) {
    playlists.forEach((playlist) => this.updatePlaylistFromDb(playlist));
  }

  private updatePlaylistFromDb(playlistDb: Playlist) {
    // eslint-disable-next-line eqeqeq
    let playlist = this.playlists.find((x) => x.id == playlistDb.id);
    if (!playlist) {
      playlist = new Playlist(this);
      playlist.updateFromDb(playlistDb);
      this.playlists.push(playlist);
    }
  }

  private async loadPlaylistEntries() {
    // eslint-disable-next-line no-restricted-syntax
    for await (const playlist of this.playlists) {
      const entries = await this.repository.getAllPlaylistEntries(playlist.id);
      playlist.setEntries(entries);
    }
  }

  async createPlaylist(musicId: number): Promise<number> {
    const playlist = new Playlist(this);
    playlist.name = `New Playlist ${this.playlists.length + 1}`;
    playlist.created = new Date(Date.now());
    const playlistId = await this.repository.create(playlist);
    playlist.id = playlistId;
    if (playlistId !== 0) {
      const entry = new PlaylistEntry(playlist);
      runInAction(() => {
        entry.playlistId = playlist.id;
        entry.musicId = musicId;
        entry.music = this.rootStore.musicStore.musicList.find(
          (x) => x.id == entry.musicId
        );
      });
      const entryId = await this.repository.addEntry(entry);
      if (entryId !== 0) {
        runInAction(() => {
          entry.id = entryId;
          playlist.entries.push(entry);
          this.playlists.push(playlist);
        });
        return playlistId;
      }
    }
    return 0;
  }

  getById(id: number): Playlist | undefined {
    return this.playlists.find((x) => x.id == id);
  }

  removePlaylist(playlist: Playlist) {
    this.playlists.splice(this.playlists.indexOf(playlist), 1);
    this.repository.removePlaylist(playlist); // add removing option to remove queue entries as well
  }
}
