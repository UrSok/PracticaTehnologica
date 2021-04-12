import React from 'react';
import * as BsIcons from 'react-icons/bs';
import { PagesClassNames } from '../constants/ClassNames';
import { useRootStore } from '../utils/StoreContext';
import PlaylistHeader from '../components/PlaylistHeader';
import RootStore from '../back-end/store/RootStore';
import MusicList from '../components/MusicList';
import { PlayingFromType } from '../back-end/models';

const Playlist: React.FC = () => {
  const { musicStore } = useRootStore() as RootStore;
  return (
    <div className={PagesClassNames.Playlist}>
      <PlaylistHeader />
      <MusicList
        musicList={musicStore.musicList}
        playingFromType={PlayingFromType.Playlist}
      />
    </div>
  );
};

export default Playlist;
