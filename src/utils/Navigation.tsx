/* eslint-disable no-plusplus */

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

  static currentLocationIs(location: string) {
    return this.history.location.pathname === location;
  }

  static isFirstVisitedLocation() {
    return this.currentLocationPosition === 0;
  }

  static isLastVisitedLocation() {
    return this.currentLocationPosition === this.history.length - 1;
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