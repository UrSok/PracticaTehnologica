import React from 'react';
import { PlayingFromType } from '../back-end/models';
import RootStore from '../back-end/store/RootStore';
import MusicList from '../components/MusicList';
import PageTitle from '../components/PageTitle';
import { PagesClassNames } from '../constants/ClassNames';
import { useRootStore } from '../utils/StoreContext';

const Queue: React.FC = () => {
  const { musicStore } = useRootStore() as RootStore;

  return (
    <div>
      <div className={PagesClassNames.Queue}>
        {/* <PageTitle PageName="Play Queue" /> */}
        <h1 className="QueueHeader">Play Queue</h1>

        <div className="SectionDivider">
          <span>Now Playing</span>
        </div>

        <MusicList
          musicList={musicStore?.musicList.filter((_value, index) => {
            return index === 1;
          })}
          playingFromType={PlayingFromType.None}
        />

        <div className="SectionDivider">
          <span>Next Up</span>
        </div>

        <MusicList
          musicList={musicStore?.musicList.filter((_value, index) => {
            return index > 1;
          })}
          playingFromType={PlayingFromType.None}
        />
      </div>
    </div>
  );
};

export default Queue;
