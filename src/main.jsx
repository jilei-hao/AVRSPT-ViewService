import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

/* Routes files import */
import Root from "./routes/root";
import App from "./routes/app";
import ModelView from './routes/model-view';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/model-view/:dsid",
    element: <ModelView />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
