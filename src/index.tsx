import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { remote } from 'electron';
import App from './App';

const win = remote.getCurrentWindow();

window.onbeforeunload = () => {
  win.removeAllListeners();
};

function handleWindowControls() {
  // Make minimise/maximise/restore/close buttons work when they are clicked
  document!.getElementById('min-button').addEventListener('click', () => {
    win.minimize();
  });

  document.getElementById('max-button').addEventListener('click', () => {
    win.maximize();
  });

  document.getElementById('restore-button').addEventListener('click', () => {
    win.unmaximize();
  });

  document.getElementById('close-button').addEventListener('click', () => {
    win.close();
  });

  function toggleMaxRestoreButtons() {
    if (win.isMaximized()) {
      document.body.classList.add('maximized');
    } else {
      document.body.classList.remove('maximized');
    }
  }

  // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
  toggleMaxRestoreButtons();
  win.on('maximize', toggleMaxRestoreButtons);
  win.on('unmaximize', toggleMaxRestoreButtons);
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    handleWindowControls();
  }
};

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
