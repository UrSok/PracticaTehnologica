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

// remove this interface maybe
export interface MusicNoId {
  src: string;
  src_type: SrcType;
}
