import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { HashRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import { RecoilSyncComponent } from './recoil-sync'
import { RecoilRoot } from 'recoil'
import { View } from './view'
import { router } from './routing'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
      {/* <RecoilSyncComponent /> */}
    </RecoilRoot>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

// const Routing = ({children}: {children: ReactNode}) => {

// }
