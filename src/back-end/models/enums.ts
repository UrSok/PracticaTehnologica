export enum Repeat {
  None = 0,
  All = 1,
  Track = 2,
}

export enum PlayingFromType {
  None = 0,
  MainLibrary = 1,
  Playlist = 2,
  PriorityQueue = 3,
}

export enum QueueEntryState {
  WasPlaying = -1,
  None = 0,
  Playing = 1,
}
