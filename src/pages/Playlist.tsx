import React from 'react';
import * as BsIcons from 'react-icons/bs';
import { PagesClassNames } from '../constants/ClassNames';
import { useRootStore } from '../utils/StoreContext';
import PlaylistHeader from '../components/PlaylistHeader';
import RootStore from '../back-end/store/RootStore';
import MusicList from '../components/MusicList';
import { PlayingFromType } from '../back-end/models';
import ScrollToTop from '../components/ScrollToTop';
import DataList from '../components/DataList';

const Playlist: React.FC = () => {
  const { musicStore } = useRootStore() as RootStore;
  return (
    <div className={PagesClassNames.Playlist}>
      <ScrollToTop />
      <PlaylistHeader />
      <DataList
        data={musicStore.musicList}
        playingFromType={PlayingFromType.Playlist}
        handleOnPlay={() => {}}
      />
    </div>
  );
};

export default Playlist;
