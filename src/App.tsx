import React from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import { PathData, PagesData } from './constants/RoutesInfo';
import './App.global.scss';

export default function App() {
  const location = useLocation();
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
            <Route path={PathData.Home} exact />
            <Route path={PathData.Test} />
          </Switch>
        </div>
      </div>
    </div>
  );
}
