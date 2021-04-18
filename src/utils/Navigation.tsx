/* eslint-disable no-plusplus */

import { PathData } from '../constants/RoutesInfo';

export default class Navigation {
  static history: any;

  static currentLocationPosition = 0;

  static lastLocationName: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static init(history: any) {
    this.history = history;
  }

  static replace(location: string) {
    this.history.replace(location);
    this.lastLocationName = location;
  }

  static push(location: string) {
    if (this.lastLocationName !== location) {
      this.history.push(location);
      this.lastLocationName = location;
      this.currentLocationPosition++;
    }
  }

  static pushPlaylist(id: number) {
    const newLocation = `${PathData.Playlist}/${id}`;
    if (this.history.location.pathname !== newLocation) {
      this.history.push(newLocation);
      this.lastLocationName = newLocation;
      this.currentLocationPosition++;
    }
  }

  static currentLocationIs(location: string) {
    return this.history.location.pathname === location;
  }

  static get currentLocationIsPlaylist() {
    return this.history.location.pathname.includes(PathData.Playlist);
  }

  static currentPlaylistLocationIs(id: number) {
    const location = `${PathData.Playlist}/${id}`;
    return this.history.location.pathname === location;
  }

  static get isFirstVisitedLocation() {
    return this.currentLocationPosition === 0;
  }

  static get isLastVisitedLocation() {
    return this.currentLocationPosition >= this.history.length - 1;
  }

  static goBack() {
    if (this.currentLocationPosition > 0) {
      this.currentLocationPosition--;
      this.history.goBack();
    }
  }

  static goForward() {
    if (this.currentLocationPosition < this.history.length) {
      this.currentLocationPosition++;
      this.history.goForward();
    }
  }
}
