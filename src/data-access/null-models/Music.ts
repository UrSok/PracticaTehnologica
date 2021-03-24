import { Music, MusicNoId } from '../models/Music';

export const NullMusic: Music = {
  id: -1,
  src: '',
  src_type: -1,
};

export const NullMusicNoId: MusicNoId = {
  src: '',
  src_type: -1,
};
