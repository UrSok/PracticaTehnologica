import React from 'react';
import PageTitle from '../components/PageTitle';
import { PagesClassNames } from '../constants/ClassNames';
import { useRootStore } from '../utils/StoreContext';
import { PlayingFromType } from '../back-end/models';
import RootStore from '../back-end/store/RootStore';
import MusicList from '../components/MusicList';

const MainLibrary: React.FC = () => {
  const { musicStore } = useRootStore() as RootStore;
  return (
    <div className={PagesClassNames.MainLibrary}>
      <div className="">
        <PageTitle PageName="Main Library" />
      </div>
      <MusicList
        musicList={musicStore.musicList}
        playingFromType={PlayingFromType.MainLibrary}
      />
    </div>
  );
};

export default MainLibrary;
