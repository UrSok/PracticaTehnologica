import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.scss';

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" />
      </Switch>
    </div>
  );
}
