import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Route, Routes } from 'react-router-dom'
import { RecoilSyncComponent } from './recoil-sync'
import { RecoilRoot } from 'recoil'
import { View } from './view'
import { Routing } from './routing'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <Routing>
        <RecoilSyncComponent />
      </Routing>
    </RecoilRoot>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
