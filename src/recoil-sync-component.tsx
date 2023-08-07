import { ReactNode, useCallback, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { RecoilURLHashParamsSync } from './recoil-sync-url-hash'
import { useNav } from './routing'

export const RecoilSyncComponent = ({ children }: { children?: ReactNode }) => {
  const navigate = useNav()

  const listenChangeURL = useCallback((handleUpdate: () => void) => {
    const update = () => {
      console.log('>>>>>>>>>listenChangeURL', window.document.location.href)
      handleUpdate()
    }
    window.document.addEventListener('searchchanged', update)
    return () => window.document.removeEventListener('searchchanged', update)
  }, [])

  const replaceURL: any = useCallback(
    (urlString: string) => {
      console.log('replaceURL navigating', urlString)
      navigate(urlString, { replace: true })
    },
    [navigate]
  )

  const pushURL: any = useCallback(
    (urlString: string) => {
      console.log('pushURL navigating', urlString)
      navigate(urlString, { replace: false })
    },
    [navigate]
  )

  const serialize = useCallback((value: any) => {
    console.log('serializing', value)
    return value
  }, [])

  const deserialize = useCallback((value: any) => {
    console.log('deserializing', value)
    return value
  }, [])

  const browserInterface = useMemo(
    () => ({
      replaceURL,
      pushURL,
      listenChangeURL
    }),
    [replaceURL, pushURL, listenChangeURL]
  )

  return (
    <RecoilURLHashParamsSync
      location={{ part: 'queryParams' }}
      serialize={serialize}
      deserialize={deserialize}
      browserInterface={browserInterface}
    >
      <Outlet />
      {children}
    </RecoilURLHashParamsSync>
  )
}
