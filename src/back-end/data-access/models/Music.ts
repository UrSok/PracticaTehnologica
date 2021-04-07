export interface Music {
  id: number;
  src: string;
}

export interface MusicWithMetadata {
  id: number;
  src: string;
  title: string;
  artists?: string[];
  album?: string;
  albumArt?: string;
}
export interface MusicNoId {
  src: string;
}

export const NullMusic: Music = {
  id: -1,
  src: '',
};

export const NullMusicWithMetadata: MusicWithMetadata = {
  id: -1,
  src: '',
  title: '',
};

export const NullMusicNoId: MusicNoId = {
  src: '',
};
