export enum SrcType {
  Local = 0,
  Youtube = 1,
}

export interface Music {
  id: number;
  src: string;
  src_type: SrcType;
}

export interface MusicNoId {
  src: string;
  src_type: SrcType;
}
