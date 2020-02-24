import * as React from "react";
import * as ReactDOM from "react-dom";
import Peer from 'peerjs';
import {Link, BrowserRouter, Router, Switch, Route } from "react-router-dom";
import Room from "./components/Room";
import Menu from "./components/Menu";

function App() {  
  return (
    <Switch>
      <Route path="/room/:id">
        <Room isHost={false}></Room>
      </Route>
      <Route path="/host/:id">
        <Room isHost={true}></Room>
      </Route>
      <Route component={Menu} path="/"/>
    </Switch>
  )
}

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.querySelector("#root"))