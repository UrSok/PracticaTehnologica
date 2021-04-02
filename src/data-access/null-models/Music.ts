import { Music, MusicNoId, MusicWithMetadata } from '../models/Music';

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
