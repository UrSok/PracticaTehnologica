import React from 'react';
import * as BsIcons from 'react-icons/bs';
import { PagesClassNames } from '../constants/ClassNames';
import Table from '../components/Table';
import { useRootStore } from '../utils/StoreContext';
import PlaylistHeader from '../components/PlaylistHeader';

const Playlist: React.FC = () => {
  const { musicStore } = useRootStore();
  return (
    <div className={PagesClassNames.Playlist}>
      <PlaylistHeader />

      <div className="Input">
        <div className="Filter">
          <BsIcons.BsSearch className="icon" />
          <input className="FilterInput" type="text" placeholder="Filter" />
        </div>
      </div>
      <Table musicList={musicStore?.musicList} />
    </div>
  );
};

export default Playlist;
