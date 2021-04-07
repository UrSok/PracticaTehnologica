import React, { useEffect } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Switch, Route, Link, useLocation, useHistory } from 'react-router-dom';
import { Scrollbars } from 'rc-scrollbars';
import * as Ioios from 'react-icons/io';
import { PathData, PagesData } from './constants/RoutesInfo';
import './App.global.scss';
import Home from './pages/Home';
import MusicPlayer from './components/MusicPlayer';
import MusicManager from './managers/MusicManager';
import RecentlyPlayed from './pages/RecentlyPlayed';
import MainLibrary from './pages/MainLibrary';
import Queue from './pages/Queue';
import Navigation from './utils/Navigation';
import IconButton from './components/IconButton';
import Settings from './pages/Settings';
import LibraryManager from './managers/LibraryMananger';
import { AppClassNames, ButtonsClassNames } from './constants/ClassNames';
import Playlist from './pages/Playlist';

export default function App() {
  const location = useLocation();
  const history = useHistory();
  if (!Navigation.history) {
    Navigation.init(history);
    Navigation.replace(PathData.Home);
  }
  useEffect(() => {
    LibraryManager.instance.addPath('music');
  }, []);
  // console.log(history);
  return (
    <div className={AppClassNames.Main}>
      <ProSidebar>
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
      </ProSidebar>
      <div className={AppClassNames.MainContent}>
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
        </div>
        <Scrollbars autoHide>
          <div className={AppClassNames.Content}>
            <Switch>
              <Route path={PathData.Home} exact component={Home} />
              <Route
                path={PathData.RecentlyPlayed}
                component={RecentlyPlayed}
              />
              <Route path={PathData.MainLibrary} component={MainLibrary} />
              <Route path={PathData.Settings} component={Settings} />
              <Route path={PathData.Queue} component={Queue} />
              <Route path={PathData.Albums} component={Playlist} />
            </Switch>
          </div>
        </Scrollbars>
        <MusicPlayer />
      </div>
    </div>
  );
}
