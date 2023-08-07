import { useCallback, useRef } from 'react'
import { Route, Routes, useNavigate, NavigateFunction } from 'react-router-dom'
import { View } from './view'
import { RecoilSyncComponent } from './recoil-sync-component'

export const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<RecoilSyncComponent />}>
        <Route path="view" index element={<View />} />
      </Route>
    </Routes>
  )
}

export const useNav = (): ReturnType<typeof useNavigate> => {
  const navRef = useRef(useNavigate())
  const originalNavigate = navRef.current

  // @ts-ignore fix typing being weird but this is correct
  const navigate: NavigateFunction = useCallback(
    (to, opts) => {
      originalNavigate(to, opts)

      window.document.dispatchEvent(
        new CustomEvent('searchchanged', {
          detail: { search: window.document.location.hash.split('?')?.[1] ?? '', origin: 'router' }
        })
      )
    },
    [originalNavigate]
  )

  return navigate
}
