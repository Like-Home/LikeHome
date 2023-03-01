import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { RecoilRoot } from 'recoil';
import IndexPage from './pages/index'
import AuthPage from './pages/auth'

import './index.scss'

import ErrorLayout from "./layouts/error";
import RootLayout from './layouts/root'

// ensures a CSRF token is set in the cookies
fetch('/api/csrf')

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorLayout />,
    children: [
      {
        path: '/',
        element: <IndexPage />,
      },
      {
        path: '/auth',
        element: <AuthPage />,
      }
    ],

  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
)
