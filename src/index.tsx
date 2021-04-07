import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Titlebar, Color } from 'custom-electron-titlebar';
import App from './App';

// eslint-disable-next-line no-new
new Titlebar({
  backgroundColor: Color.TRANSPARENT,
});

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
