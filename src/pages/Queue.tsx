import React from 'react';
import PageTitle from '../components/PageTitle';
import Table from '../components/Table';
import { PagesClassNames } from '../constants/ClassNames';
import { useRootStore } from '../utils/StoreContext';

const Queue: React.FC = () => {
  const { musicStore } = useRootStore();

  return (
    <div>
      <div className={PagesClassNames.Queue}>
        {/* <PageTitle PageName="Play Queue" /> */}
        <h1 className="QueueHeader">Play Queue</h1>

        <div className="SectionDivider">
          <span>Now Playing</span>
        </div>

        <Table
          musicList={musicStore?.musicList.filter((_value, index) => {
            return index === 1;
          })}
        />

        <div className="SectionDivider">
          <span>Next Up</span>
        </div>

        <Table
          musicList={musicStore?.musicList.filter((_value, index) => {
            return index > 1;
          })}
        />
      </div>
    </div>
  );
};

export default Queue;
