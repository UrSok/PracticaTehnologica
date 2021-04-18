/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import React from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from 'react-pro-sidebar';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Scrollbars, ScrollValues } from 'rc-scrollbars';
import * as Ioios from 'react-icons/io';
import { RiTestTubeFill } from 'react-icons/ri';
import { Observer } from 'mobx-react-lite';
import {
  PathData,
  PagesData,
  SettingsPage,
  PlaylistPage,
} from './constants/RoutesInfo';
import './App.global.scss';
import MusicPlayer from './components/MusicPlayer';
import MainLibrary from './pages/MainLibrary';
import Queue from './pages/Queue';
import Navigation from './utils/Navigation';
import IconButton from './components/IconButton';
import Settings from './pages/Settings';
import { AppClassNames, ButtonsClassNames } from './constants/ClassNames';
import Playlist from './pages/Playlist';
import FirstLaunchWindow from './components/FirstLaunchWindow';
import { StoreContext } from './utils/StoreContext';
import RootStore from './back-end/store/RootStore';
import GlobalRefs from './utils/Ref';

interface Props {
  history: any;
  location: any;
  match: any;
}

// eslint-disable-next-line @typescript-eslint/ban-types
class App extends React.Component<Props, {}> {
  async componentDidMount() {
    this.launch();
  }

  // eslint-disable-next-line class-methods-use-this
  onScroll(values: ScrollValues) {
    const pageHeader = document.querySelector('.StickyHeader');
    const playlistHeader = document.querySelector('.PlaylistHeader');
    const tableHeader = document.querySelector('.Head');
    // console.log(values.scrollHeight, values.scrollTop);

    // if (!pageHeader) return;
    if (values.top > 0) {
      // if (pageHeader.classList.contains('Scrolled')) return;
      pageHeader?.classList.add('Scrolled');
      playlistHeader?.classList.add('PlaylistHeaderScrolled');
      tableHeader?.classList.add('StickyTableHeader');
      // console.log(playButtonPlaylist);
    } else {
      pageHeader?.classList.remove('Scrolled');
      playlistHeader?.classList.remove('PlaylistHeaderScrolled');
      tableHeader?.classList.remove('StickyTableHeader');
      // console.log(playButtonPlaylist?.className.includes('PlaylistHeaderScrolled'));
    }
    // console.log(pageHeader);
  }

  launch = async () => {
    const { libraryStore } = this.context as RootStore;
    await libraryStore.loadLibaries();
    libraryStore.scanPaths();
    /* const { libraryStore, userDataStore } = this.context as RootStore;
    console.log(userDataStore.userData?.firstLaunch);
    if (!userDataStore.userData?.firstLaunch) {
    } */
  };

  handleScroll = (e: React.UIEvent<HTMLElement>) => {
    // 250px priorityQueue
    // 250px + 160px + priorityQueueLength * 50
    const { queueStore } = this.context as RootStore;
    const scrollTop = GlobalRefs.scrollRef.getScrollTop();
    if (GlobalRefs.musicListRef) {
      GlobalRefs.musicListRef._onScrollVertical(e);
    }
    if (GlobalRefs.priorityQueueEntriesRef) {
      GlobalRefs.priorityQueueEntriesRef.scrollTo(scrollTop - 250);
    }
    if (GlobalRefs.queueEntriesRef) {
      const diffScroll = 250 + 160 + 50 * queueStore.priorityQueue.length;
      GlobalRefs.queueEntriesRef.scrollTo(scrollTop - diffScroll);
    }
  };

  render() {
    const { userDataStore, playlistStore } = this.context as RootStore;
    const { history } = this.props;
    if (!Navigation.history) {
      Navigation.init(history);
      Navigation.replace(PathData.MainLibrary);
    }
    return (
      <div className={AppClassNames.Main}>
        <Observer>
          {() => (
            <div>
              {userDataStore.userData?.firstLaunch ? (
                <FirstLaunchWindow />
              ) : null}
            </div>
          )}
        </Observer>
        <ProSidebar>
          <SidebarHeader>
            <div className={AppClassNames.HeaderBar}>
              <IconButton
                icon={
                  <Ioios.IoIosArrowBack className={ButtonsClassNames.Icon} />
                }
                onClick={() => Navigation.goBack()}
                disabled={Navigation.isFirstVisitedLocation}
              />
              <IconButton
                icon={
                  <Ioios.IoIosArrowForward className={ButtonsClassNames.Icon} />
                }
                onClick={() => Navigation.goForward()}
                disabled={Navigation.isLastVisitedLocation}
              />
            </div>
            <Menu iconShape="round">
              {PagesData.map((item) => {
                const isActive = Navigation.currentLocationIs(item.path);
                return (
                  <MenuItem
                    key={item.key}
                    active={isActive}
                    icon={isActive ? item.iconActive : item.icon}
                    onClick={() => Navigation.push(item.path)}
                  />
                );
              })}
            </Menu>
          </SidebarHeader>
          <SidebarContent>
            <Scrollbars autoHide>
              <Observer>
                {() => (
                  <Menu iconShape="round">
                    {playlistStore.playlists.map((playlist, index) => {
                      const { id } = playlist;
                      return (
                        <MenuItem
                          key={id}
                          active={Navigation.currentPlaylistLocationIs(id)}
                          icon={
                            Navigation.currentPlaylistLocationIs(id)
                              ? PlaylistPage.iconActive
                              : PlaylistPage.icon
                          }
                          onClick={() => Navigation.pushPlaylist(id)}
                        >
                          <div className="pro-icon-number">{index + 1}</div>
                        </MenuItem>
                      );
                    })}
                  </Menu>
                )}
              </Observer>
            </Scrollbars>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="round">
              <MenuItem
                key={SettingsPage.key}
                active={Navigation.currentLocationIs(SettingsPage.path)}
                icon={
                  Navigation.currentLocationIs(SettingsPage.path)
                    ? SettingsPage.iconActive
                    : SettingsPage.icon
                }
                onClick={() => Navigation.push(SettingsPage.path)}
              />
            </Menu>
          </SidebarFooter>
        </ProSidebar>
        <div className={AppClassNames.MainContent}>
          <Scrollbars
            autoHide
            onUpdate={this.onScroll}
            onScroll={this.handleScroll}
            ref={(node) => {
              GlobalRefs.scrollRef = node;
            }}
          >
            <div className={AppClassNames.Content}>
              <Switch>
                <Route path={PathData.MainLibrary} component={MainLibrary} />
                <Route path={PathData.Settings} component={Settings} />
                <Route path={PathData.Queue} component={Queue} />
                <Route path={`${PathData.Playlist}/:id`} component={Playlist} />
              </Switch>
            </div>
          </Scrollbars>
          <MusicPlayer />
        </div>
      </div>
    );
  }
}

App.contextType = StoreContext;

export default withRouter(App);
