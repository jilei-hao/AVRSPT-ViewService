import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

/* Routes files import */
import Root from "./routes/root";
import Model from "./routes/model/model";
import Slices from "./routes/slices/slices";
import Volume from "./routes/volume/volume";
import Sandbox from "./routes/sandbox/sandbox";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/Model",
    element: <Model />,
  },
  {
    path: "/Slices",
    element: <Slices />,
  },
  {
    path: "/Volume",
    element: <Volume />,
  },
  {
    path: "/Sandbox",
    element: <Sandbox />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
