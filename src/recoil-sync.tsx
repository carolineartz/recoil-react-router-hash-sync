import { ReactNode, useCallback, useEffect } from 'react'
import { RecoilURLSyncJSON, RecoilURLSync } from 'recoil-sync'
// import { history } from './routing'
import { useLocation, createPath, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { RecoilURLHashParamsSync } from './recoil-sync-url-hash'
// import { filtersAtom } from './recoil-atoms'
// import mapKeys from 'lodash.mapkeys'

let callback: any = undefined

export const RecoilSyncComponent = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate()
  // const location = useLocation()
  // console.log(location)
  // const setFilters = useSetRecoilState(filtersAtom)
  // const [filters, setFilters] = useRecoilState(filtersAtom())
  // const [num, setNum] = useRecoilState(filtersAtom('num'))

  // useEffect(() => {
  //   console.log('location changed', num)
  //   document.dispatchEvent(new Event('hashchange'))

  //   return () => {
  //     document.removeEventListener('hashchange', callback)
  //   }
  // }, [location])

  // value is an object
  // const serialize = useCallback((value: any) => {
  //   let val = value.filters ?? value
  //   console.log('value', val)

  //   val = mapKeys(val, (_, key) => {
  //     if (key.startsWith('filters__')) {
  //       return key.replace('filters__"', '').slice(0, -1)
  //     }
  //     return key
  //   })

  //   // val = transform(val, (result: any, value: any, key: any) => {}, {})

  //   let path = window.location.pathname
  //   const filters = ((val as any) ?? {}) as object
  //   let result = path
  //   if (Object.keys(filters).length > 0) {
  //     const search = '?' + queryString.stringify(filters)
  //     console.log('serializing', val, '/#' + path + search)
  //     result = '/#' + path + search
  //   }

  //   return result
  // }, [])

  // // value is a string
  // const deserialize = useCallback((value: string) => {
  //   let result = {}

  //   if (value.includes('?')) {
  //     const search = value.split('?')[1]
  //     result = queryString.parse(search as any, { parseNumbers: true, parseBooleans: true })
  //     console.log('deserializing', value, result)
  //   }
  //   return result as any
  // }, [])

  // useEffect(() => {
  //   setFilters(deserialize(location.search))
  // }, [])

  return (
    <RecoilURLHashParamsSync
      location={{ part: 'queryParams' }}
      serialize={(value: any) => {
        return String(value)
      }}
      deserialize={(value: any) => {
        return String(value)
      }}
      browserInterface={{
        replaceURL: (urlString: string) => {
          const browserUrl = new URL(urlString)
          console.log('replaceURL navigating', `${browserUrl.pathname}${browserUrl.search}`)

          // console.log('replaceURL', url)
          // window.history.replaceState(null, '', url)
          navigate(`${browserUrl.pathname}${browserUrl.search}`, { replace: true })
        },
        // replaceURL: (url: string) => window.history.replaceState(null, '', url),
        pushURL: (urlString: string) => {
          // console.log('pushURL', url)
          const browserUrl = new URL(urlString)
          console.log('pushURL navigating', `${browserUrl.pathname}${browserUrl.search}`)
          navigate(`${browserUrl.pathname}${browserUrl.search}`, { replace: false })
          // window.history.pushState(null, '', url)
        },
        // pushURL: (url: string) => window.history.pushState(null, '', url),

        // @ts-ignore
        // getURL: () => {
        //   // const baseLoc = window.document.location

        //   // @ts-ignore
        //   // const url: URL = new URL(window.document.location)
        //   // const {hash, search, href} = url
        //   console.log('get url', window.document.location.href.replace('/#/', '/'))
        //   return window.document.location.href.replace('/#/', '/')
        // },
        listenChangeURL: (handleUpdate: () => void) => {
          const update = () => {
            console.log('listenChangeURL', window.document.location.href)
            handleUpdate()
          }
          window.addEventListener('searchchanged', update)
          return () => window.removeEventListener('searchchanged', update)
        }
      }}
    >
      {children}
    </RecoilURLHashParamsSync>
  )
  // const
  // return (
  //   <RecoilURLSync
  //     // value is an object
  // serialize={(value: any) => {
  //   return String(value)
  // }}
  // deserialize={(value: any) => {
  //   return String(value)
  // }}
  //     // value is a string
  //     // deserialize={deserialize}
  //     location={{ part: 'queryParams' }}
  // browserInterface={{
  //   replaceURL: (urlString: string) => {
  //     const browserUrl = new URL(urlString)
  //     console.log('navigating', browserUrl)

  //     // console.log('replaceURL', url)
  //     // window.history.replaceState(null, '', url)
  //     navigate(`${browserUrl.pathname}${browserUrl.search}`, { replace: true })
  //   },
  //   // replaceURL: (url: string) => window.history.replaceState(null, '', url),
  //   pushURL: (urlString: string) => {
  //     // console.log('pushURL', url)
  //     const browserUrl = new URL(urlString)
  //     console.log('navigating', `${browserUrl.pathname}${browserUrl.search}`)
  //     navigate(`${browserUrl.pathname}${browserUrl.search}`, { replace: false })
  //     // window.history.pushState(null, '', url)
  //   },
  //   // pushURL: (url: string) => window.history.pushState(null, '', url),

  //   // @ts-ignore
  //   getURL: () => {
  //     // const baseLoc = window.document.location

  //     // @ts-ignore
  //     // const url: URL = new URL(window.document.location)
  //     // const {hash, search, href} = url
  //     console.log('get url', window.document.location.href.replace('/#/', '/'))
  //     return window.document.location.href.replace('/#/', '/')
  //   },
  //   listenChangeURL: (handleUpdate: () => void) => {
  //     const update = () => {
  //       console.log('listenChangeURL', window.document.location.href)
  //       handleUpdate()
  //     }
  //     window.addEventListener('searchchanged', update)
  //     return () => window.removeEventListener('searchchanged', update)
  //   }
  // }}
  //   >
  //     {children}
  //   </RecoilURLSync>
  // )
}

// getURL() {
//   // debugger
//   console.group()
//   console.log('rr location', location)
//   console.log('window.location', window.location)
//   console.groupEnd()
//   // const loc = location // react router dom
//   // const { pathname, search, hash } = loc
//   if (!window.location.href.includes('#')) {
//     const { host, href, origin } = window.location
//     const url = origin + '/#' + href.split(host)[1]
//     console.log('url', url)
//     return url
//   } else {
//     return window.location.origin + createPath(location)
//   }

//   // const [base, rest] = window.location.href.split('/#/')
//   // return base + '/' + rest
//   // return window.location.href
// },
// pushURL(url) {
//   console.log('url', url)
//   return url
// },
// replaceURL(url) {
//   console.log('url', url)
//   return
// },
// getURL() {
//   // debugger
//   console.log('getting url', window.location.href)
//   const [hash, params] = window.location.hash.split('?')
//   const newUrl = window.location.origin + '/' + hash + (params ? '?' + params : '')
//   console.log('newUrl', newUrl)
//   return newUrl
//   // return window.location.href
// },
