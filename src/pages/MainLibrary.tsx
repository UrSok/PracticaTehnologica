/* eslint-disable class-methods-use-this */
import React from 'react';
import { Observer } from 'mobx-react-lite';
import { PagesClassNames } from '../constants/ClassNames';
import { StoreContext } from '../utils/StoreContext';
import { PlayingFromType } from '../back-end/models';
import RootStore from '../back-end/store/RootStore';
import DataList from '../components/DataList';
import ScrollToTop from '../components/ScrollToTop';
import StickyHeader from '../components/StickyHeader';

class MainLibrary extends React.Component {
  handlePlay(musicId: number, rootStore: RootStore) {
    const { playerStore } = rootStore as RootStore;
    playerStore.player.playCurrentMainLibrary(musicId);
  }

  render() {
    const { musicStore } = this.context as RootStore;
    return (
      <>
        <StickyHeader title="Main Library">
          <div />
        </StickyHeader>

        <div className={PagesClassNames.MainLibrary}>
          <ScrollToTop />
          <h1 className="InitialHeader">Main Library</h1>

          <Observer>
            {() => (
              <DataList
                data={musicStore.musicList}
                handleOnPlay={this.handlePlay}
              />
            )}
          </Observer>
        </div>
      </>
    );
  }
}

MainLibrary.contextType = StoreContext;

export default MainLibrary;
