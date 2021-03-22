/* eslint-disable no-console */

import React from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import './App.global.scss';
import Test from './pages/Test';
import PagesData from './constant_data/PagesData';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const location = useLocation();
  // const database = new Database();
  // const insert = database.insert('test');
  // const result = database.fetchAll();
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
            <Route path={PagesData[0].path} exact component={Home} />
            <Route path={PagesData[1].path} component={Test} />
          </Switch>
        </div>
        <MusicPlayer />
      </div>
    </div>
  );
}
