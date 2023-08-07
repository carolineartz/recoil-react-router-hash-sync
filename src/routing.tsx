import { useCallback, useRef } from 'react'
import { Route, Routes, useNavigate, NavigateFunction } from 'react-router-dom'
import { RecoilStateView } from './recoil-state-view'
import { RecoilSyncComponent } from './recoil-sync-component'
import { parseSearch, stringifyParams } from './query-string-utils'

export const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<RecoilSyncComponent />}>
        <Route path="view" index element={<RecoilStateView />} />
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

export const useQueryParamsNavigate = () => {
  const navigateFn = useNav()

  return (key: string, val: any) => {
    const params = parseSearch()
    params[key] = val
    const newSearch = stringifyParams(params)
    const [, pathAndSearch] = window.location.href.split('/#')
    const [pathname] = pathAndSearch.split('?')

    navigateFn({ pathname, search: '?' + newSearch })
  }
}
