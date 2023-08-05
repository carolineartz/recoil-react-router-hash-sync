import { ReactNode } from 'react'
import {
  Route,
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  BrowserRouter,
  createHashRouter,
  HashRouter,
  createRoutesFromElements
} from 'react-router-dom'
import { Action, To, createBrowserHistory, createPath, parsePath } from '@remix-run/router'
import App from './App'
import { View } from './view'

// export const history = createBrowserHistory()

// export const router = createHashRouter(createRoutesFromElements(
//   <Route path="/" element={<App />}>
//     <Route path="page-1/*">
//       <Route path="view-1" index element={<View1 />} />
//       <Route path="view-2" element={<View2 />} />
//     </Route>
//     <Route path="page-2/*">
//       <Route path="view-1" index element={<View1 />} />
//       <Route path="view-2" element={<View2 />} />
//     </Route>
//   </Route>
// ))

export const Routing = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <HashRouter window={window}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="view" index element={<View />} />
          </Route>
        </Routes>
        {children}
      </HashRouter>
    </>
  )
}

// <HistoryRouter
//   history={createBrowserHistory()}
// history={{
//   push: (to: To, state?: any) => {
//     console.log('pushing', to)
//     window.history.pushState(state, '', typeof to === 'string' ? to : createPath(to))
//   },
//   replace: (to: To, state?: any) => {
//     console.log('pushing', to)
//     window.history.replaceState(state, '', typeof to === 'string' ? to : createPath(to))
//   },
//   listen: (handler: any) => {
//     const callback = (e: any) => {
//       console.log('calling handler in router', e)
//       handler()
//     }

//     document.addEventListener('urlchange', callback)

//     return () => {
//       document.removeEventListener('urlchange', callback)
//     }
//   },
//   createURL: (to: To) => {
//     const path = typeof to === 'string' ? to : createPath(to)
//     return new URL(`${window.location.origin}${path}`)
//   },
//   action: Action.Push,
//   location: {
//     pathname: window?.location?.pathname,
//     search: window?.location?.search,
//     hash: window?.location?.hash,
//     state: window?.history?.state,
//     key: ''
//   },
//   createHref: (to: To) => {
//     const path = typeof to === 'string' ? to : createPath(to)
//     return path
//   },
//   encodeLocation: (location: any) => {
//     return location
//   },
//   go: (delta: number) => {
//     window.history.go(delta)
//   }
//   // parseURL: (url: string) => {
//   //   const { pathname, search, hash } = parsePath(url)
//   //   return {
//   //     pathname,
//   //     search,
//   //     hash,
//   //     state: window.history.state,
//   //     key: ''
//   //   }
//   // },

//   // ...createBrowserHistory()
// }}
// ></HistoryRouter>

// export const hashRouter = createHashRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />}>
//       <Route path="page-1/*">
//         <Route path="view-1" index element={<View1 />} />
//         <Route path="view-2" element={<View2 />} />
//       </Route>
//       <Route path="page-2/*">
//         <Route path="view-1" index element={<View1 />} />
//         <Route path="view-2" element={<View2 />} />
//       </Route>
//     </Route>
//   )
// )
