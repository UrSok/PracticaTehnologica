import React, { useEffect } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Switch, Route, Link, useLocation, Redirect } from 'react-router-dom';
import { Scrollbars } from 'rc-scrollbars';
import { PathData, PagesData } from './constants/RoutesInfo';
import './App.global.scss';
import Home from './pages/Home';
import MusicPlayer from './components/MusicPlayer';
import MusicManager from './managers/MusicManager';
import RecentlyPlayed from './pages/RecentlyPlayed';
import MainLibrary from './pages/MainLibrary';

export default function App() {
  const location = useLocation();
  useEffect(() => {
    new MusicManager().addMusicFromPath('music');
  }, []);
  return (
    <div className="App">
      <Redirect to="/" />
      <ProSidebar>
        <Menu iconShape="round">
          {PagesData.map((item) => {
            return (
              <MenuItem
                key={item.key}
                active={location.pathname === item.path}
                icon={
                  location.pathname === item.path ? item.iconActive : item.icon
                }
              >
                <Link to={item.path} />
              </MenuItem>
            );
          })}
        </Menu>
      </ProSidebar>
      <div className="MainContent">
        <Scrollbars autoHide>
          <div className="Content">
            <Switch>
              <Route path={PathData.Home} exact component={Home} />
              <Route
                path={PathData.RecentlyPlayed}
                component={RecentlyPlayed}
              />
              <Route path={PathData.MainLibrary} component={MainLibrary} />
            </Switch>
          </div>
        </Scrollbars>
        <MusicPlayer />
      </div>
    </div>
  );
}
