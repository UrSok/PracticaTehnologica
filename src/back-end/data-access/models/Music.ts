export enum SrcType {
  Local = 0,
  Youtube = 1,
}

export interface Music {
  id: number;
  src: string;
  src_type: SrcType;
}

export interface MusicWithMetadata {
  id: number;
  src: string;
  src_type: SrcType;
  title: string;
  artists?: string[];
  album?: string;
  albumArt?: string;
}
export interface MusicNoId {
  src: string;
  src_type: SrcType;
}

export const NullMusic: Music = {
  id: -1,
  src: '',
  src_type: -1,
};

export const NullMusicWithMetadata: MusicWithMetadata = {
  id: -1,
  src: '',
  src_type: -1,
  title: '',
};

export const NullMusicNoId: MusicNoId = {
  src: '',
  src_type: -1,
};
