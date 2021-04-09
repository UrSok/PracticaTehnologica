import { Observer } from 'mobx-react-lite';
import React from 'react';
import * as BsIcons from 'react-icons/bs';
import PageTitle from '../components/PageTitle';
import Table from '../components/Table';
import { PagesClassNames } from '../constants/ClassNames';
import { useRootStore } from '../utils/StoreContext';

const MainLibrary: React.FC = () => {
  const { musicStore } = useRootStore();
  return (
    <div className={PagesClassNames.MainLibrary}>
      <div className="">
        <PageTitle PageName="Main Library" />
      </div>

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

export default MainLibrary;
