export enum TableName {
  Library = 'Library',
  Music = 'Music',
  Playlist = 'Playlist',
  PlaylistMusic = 'PlaylistMusic',
}

export enum LibraryField {
  Id = 'id',
  Path = 'path',
  Active = 'active',
}

export enum MusicField {
  Id = 'id',
  Src = 'src',
  SrcType = 'src_type',
  Added = 'added',
}

export enum PlaylistField {
  Id = 'id',
  Name = 'name',
  Created = 'created',
}

export enum PlaylistMusicField {
  Id = 'id',
  PlaylistId = 'playlist_id',
  MusicId = 'music_id',
  Added = 'added',
}
