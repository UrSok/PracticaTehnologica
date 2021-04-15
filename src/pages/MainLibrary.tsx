import React from 'react';
import { Observer } from 'mobx-react-lite';
import { Scrollbars, ScrollValues } from 'rc-scrollbars';
import { StickyContainer, Sticky } from 'react-sticky';
import PageTitle from '../components/PageTitle';
import { PagesClassNames } from '../constants/ClassNames';
import { useRootStore } from '../utils/StoreContext';
import { PlayingFromType } from '../back-end/models';
import RootStore from '../back-end/store/RootStore';
import MusicList from '../components/MusicList';

const hasSpacewithHeader = true;
const space = 10;

const getTopValue = () => {
  if (hasSpacewithHeader) return 60;
  return 0;
};

const MainLibrary: React.FC = () => {
  const { musicStore } = useRootStore() as RootStore;
  return (
    <div className={PagesClassNames.MainLibrary}>
      <StickyContainer>
        {/* <Sticky topOffset={40} relative bottomOffset={80}>
          {({ style, distanceFromTop, isSticky }) => (
            <h1
              style={{
                ...style,
                // distanceFromTop: space,
                marginTop: isSticky ? getTopValue() : 0,
              }}
            >
              Sticky element
            </h1>
          )}
        </Sticky> */}

        <div className="StickyHeader" id="stickySection">
          <h1 id="header">Main Library</h1>
          {/* <PageTitle PageName="Main Library" /> */}
        </div>
        <Observer>
          {() => (
            <MusicList
              musicList={musicStore.musicList}
              playingFromType={PlayingFromType.MainLibrary}
            />
          )}
        </Observer>
      </StickyContainer>
    </div>
  );
};

const pageHeader = document.querySelector('.StickyHeader');

window.onscroll = () => {
  console.log('test');
  if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
    pageHeader?.classList.add('Scrolled');
  } else {
    pageHeader?.classList.remove('Scrolled');
  }
};

let scroll = 0;

window.addEventListener('scroll', function () {
  scroll = Math.floor(window.pageYOffset);
  if (scroll > 0) {
    pageHeader?.classList.add('--scrolled');
  } else {
    pageHeader?.classList.remove('--scrolled');
  }
});
export default MainLibrary;
