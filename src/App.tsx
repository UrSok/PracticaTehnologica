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
import { Scrollbars } from 'rc-scrollbars';
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

  launch = async () => {
    const { libraryStore } = this.context as RootStore;
    await libraryStore.loadLibaries();
    libraryStore.scanPaths();
    /* const { libraryStore, userDataStore } = this.context as RootStore;
    console.log(userDataStore.userData?.firstLaunch);
    if (!userDataStore.userData?.firstLaunch) {
    } */
  };

  render() {
    const { userDataStore } = this.context as RootStore;
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
            <Menu iconShape="round">
              {PagesData.map((item) => {
                const isActive = Navigation.currentLocationIs(item.path);
                return (
                  <>
                    <div className={AppClassNames.HeaderBar}>
                      <IconButton
                        icon={
                          <Ioios.IoIosArrowBack
                            className={ButtonsClassNames.Icon}
                          />
                        }
                        onClick={() => Navigation.goBack()}
                        disabled={Navigation.isFirstVisitedLocation()}
                      />
                      <IconButton
                        icon={
                          <Ioios.IoIosArrowForward
                            className={ButtonsClassNames.Icon}
                          />
                        }
                        onClick={() => Navigation.goForward()}
                        disabled={Navigation.isLastVisitedLocation()}
                      />
                    </div>
                    <MenuItem
                      key={item.key}
                      active={isActive}
                      icon={isActive ? item.iconActive : item.icon}
                      onClick={() => Navigation.push(item.path)}
                    />
                  </>
                );
              })}
            </Menu>
          </SidebarHeader>
          <SidebarContent>
            <Scrollbars autoHide>
              <Menu iconShape="round">
                {/* TEST DATA */}
                <MenuItem
                  key={PlaylistPage.key}
                  active={Navigation.currentLocationIs(PlaylistPage.path)}
                  icon={
                    Navigation.currentLocationIs(PlaylistPage.path)
                      ? PlaylistPage.iconActive
                      : PlaylistPage.icon
                  }
                  onClick={() => Navigation.push(PlaylistPage.path)}
                />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                <MenuItem active={false} icon={<RiTestTubeFill />} />
                {/* TEST DATA END */}
              </Menu>
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
          {/* // previous position of arrow buttons
          <div className={AppClassNames.HeaderBar}>
            <IconButton
              icon={<Ioios.IoIosArrowBack className={ButtonsClassNames.Icon} />}
              onClick={() => Navigation.goBack()}
              disabled={Navigation.isFirstVisitedLocation()}
            />
            <IconButton
              icon={
                <Ioios.IoIosArrowForward className={ButtonsClassNames.Icon} />
              }
              onClick={() => Navigation.goForward()}
              disabled={Navigation.isLastVisitedLocation()}
            />
          </div> */}
          <Scrollbars autoHide>
            <div className={AppClassNames.Content}>
              <Switch>
                {/* // testing the FirstLaunchWindow page
                <Route
                  path={PathData.Home}
                  exact
                  component={FirstLaunchWindow}
                /> */}
                {/* <Route
                  path={PathData.RecentlyPlayed}
                  component={RecentlyPlayed}
                /> */}
                <Route path={PathData.MainLibrary} component={MainLibrary} />
                <Route path={PathData.Settings} component={Settings} />
                <Route path={PathData.Queue} component={Queue} />
                <Route path={PathData.Playlist} component={Playlist} />
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
