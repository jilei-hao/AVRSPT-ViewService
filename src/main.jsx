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

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//   },
//   {
//     path: "/Model",
//     element: <Model />,
//   },
//   {
//     path: "/Slices",
//     element: <Slices />,
//   },
//   {
//     path: "/Volume",
//     element: <Volume />,
//   },
//   {
//     path: "/Sandbox",
//     element: <Sandbox />,
//   }
// ]);
export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
        </Switch>
      </div>
    </Router>
  );
}


ReactDOM.render(<App />, document.getElementById("root"));
