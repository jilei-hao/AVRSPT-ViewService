import React from 'react'
import ReactDOM from 'react-dom'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

/* Routes files import */
import Root from "./routes/root.jsx";
import Model from "./routes/model/model";
import Slices from "./routes/slices/slices";
import Volume from "./routes/volume/volume";
import Sandbox from "./routes/sandbox/sandbox";

import styles from './app.module.css'

export default function App() {
  return (
    <Router>
      <div className={styles.vtk_viewport}>
        <Switch>
          <Route path="/model">
            <Model />
          </Route>
          <Route path="/slices">
            <Slices />
          </Route>
          <Route path="/volume">
            <Volume />
          </Route>
          <Route path="/sandbox">
            <Sandbox />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


ReactDOM.render(<App />, document.getElementById("root"));
