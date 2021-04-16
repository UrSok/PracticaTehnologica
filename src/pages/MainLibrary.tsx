/* eslint-disable class-methods-use-this */
import React from 'react';
import { Observer } from 'mobx-react-lite';
import { PagesClassNames } from '../constants/ClassNames';
import { StoreContext } from '../utils/StoreContext';
import { PlayingFromType } from '../back-end/models';
import RootStore from '../back-end/store/RootStore';
import DataList from '../components/DataList';
import ScrollToTop from '../components/ScrollToTop';

class MainLibrary extends React.Component {
  handlePlay(musicId: number, rootStore: RootStore) {
    const { playerStore } = rootStore as RootStore;
    playerStore.player.playCurrentMainLibrary(musicId);
  }

  render() {
    const { musicStore } = this.context as RootStore;
    return (
      <div className={PagesClassNames.MainLibrary}>
        <ScrollToTop />
        <div className="StickyHeader">
          <h1>Main Library</h1>
        </div>
        <Observer>
          {() => (
            <DataList
              data={musicStore.musicList}
              playingFromType={PlayingFromType.MainLibrary}
              handleOnPlay={this.handlePlay}
            />
          )}
        </Observer>
      </div>
    );
  }
}

MainLibrary.contextType = StoreContext;

export default MainLibrary;
