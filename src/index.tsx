import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Titlebar, Color } from 'custom-electron-titlebar';
import App from './App';
import { store, StoreContext } from './utils/StoreContext';

let titlebar: Titlebar | undefined;

window.onload = () => {
  if (titlebar === undefined) {
    titlebar = new Titlebar({
      backgroundColor: Color.TRANSPARENT,
    });
  }
};

window.onunload = () => {
  store.playerStore.player.saveToDb();
};

render(
  <HashRouter>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </HashRouter>,
  document.getElementById('root')
);
