import React from 'react';
import * as BsIcons from 'react-icons/bs';
import PageTitle from '../components/PageTitle';
import Table from '../components/Table';
import MusicManager from '../managers/MusicManager';

const MainLibrary: React.FC = () => {
  return (
    <div>
      <div className="">
        <PageTitle PageName="Main Library" />
      </div>

      <div className="Input">
        <div className="Filter">
          <BsIcons.BsSearch className="icon" />
          <input className="FilterInput" type="text" placeholder="Filter" />
        </div>
      </div>
      <Table musicList={MusicManager.queue} />
    </div>
  );
};

export default MainLibrary;
