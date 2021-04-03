import React from 'react';
import * as BsIcons from 'react-icons/bs';
import PageTitle from '../components/PageTitle';
import IconButton from '../components/IconButton';
import Table from '../components/Table';
import MusicManager from '../managers/MusicManager';
import '../scss/_Table.scss';
import '../scss/_MainLibrary.scss';

const handleStartSeeking = () => {
  console.log('aight');
};

const MainLibrary: React.FC = () => {
  return (
    <div className="StickyHeader">
      <PageTitle PageName="Main Library" />

      <div className="Input">
        <IconButton
          icon={<BsIcons.BsSearch className="icon" />}
          onClick={handleStartSeeking}
        />
        <input type="text" placeholder="Filter" value="" />
      </div>
      <Table musicList={MusicManager.queue} />
    </div>
  );
};

export default MainLibrary;
