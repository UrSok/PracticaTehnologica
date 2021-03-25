import React, { useEffect } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import { PathData, PagesData } from './constants/RoutesInfo';
import './App.global.scss';
import Home from './pages/Home';
import Test from './pages/Test';
import MusicPlayer from './components/MusicPlayer';
import MusicManager from './managers/MusicManager';

export default function App() {
  const location = useLocation();
  useEffect(() => {
    new MusicManager().addMusicFromPath('music');
  }, []);
  return (
    <div className="App">
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
        <div className="Content">
          <Switch>
            <Route path={PathData.Home} exact component={Home} />
            <Route path={PathData.Test} component={Test} />
          </Switch>
        </div>
        <MusicPlayer />
      </div>
    </div>
  );
}
