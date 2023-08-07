import { number, string, object, array } from '@recoiljs/refine'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { atom, atomFamily, useRecoilState } from 'recoil'
import { urlSyncEffect } from './recoil-sync-url-hash'
import { urlSyncEffect as sourceUrlSyncEffect } from 'recoil-sync'
import queryString from 'query-string'
import { memo, useCallback } from 'react'
import { useNav } from './routing'

const parseSearch = () => {
  const search = window.document.location.href.split('?')[1]
  return queryString.parse(search, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'none'
  })
}

const stringifyParams = (params: any) => {
  return queryString.stringify(params, {
    arrayFormat: 'none',
    skipEmptyString: true,
    skipNull: true
  })
}

const getDefault = (key: string) => {
  const params = parseSearch()
  return params[key]
}

export const numberAtom = atom({
  key: 'number',
  default: (getDefault('number') ?? null) as number | null,
  effects: [urlSyncEffect({ refine: number(), history: 'push', syncDefault: true })]
})

export const nameAtom = atom({
  key: 'name',
  default: (getDefault('name') ?? '') as string,
  effects: [urlSyncEffect({ refine: string(), history: 'push', syncDefault: true })]
})

export const navigateAtom = atom({
  key: 'navigate',
  default: (getDefault('navigate') ?? '') as string,
  effects: [urlSyncEffect({ refine: string(), history: 'push', syncDefault: true })]
})

// export const thingsAtom = atom({
//   key: 'things',
//   default: getDefault('things') as number[],
//   effects: [urlSyncEffect({ refine: array(number()), history: 'push', syncDefault: true, storeKey: 'filters' })]
// })

// export const urlStateAtom = atom({
//   key: 'search',
//   default: window.location.href.split('?')[1]
// })

// export const filtersAtomFamily = atomFamily<{
//   number: number
//   name: string
//   navigate: string
//   things: number[]
// }, any>({
//   key: 'filters',
//   default: (param: string) => {
//     const search = window.document.location.href.split('?')[1]
//     const params = queryString.parse(search, {
//       parseNumbers: true,
//       parseBooleans: true,
//       arrayFormat: 'none'
//     })

//     return params[param]
//   },
//   effects: [
//     urlSyncEffect({
//       refine: object({
//         number: number(),
//         name: string(),
//         navigate: string(),
//         things: array(number())
//       }),
//       history: 'push'
//     })
//   ]
// })

export const View = memo(() => {
  const navigate = useNav()
  // const navigate = useNavigate()

  // const [, setSearchParams] = useSearchParams()
  const [number, setNumber] = useRecoilState(numberAtom)
  const [name, setName] = useRecoilState(nameAtom)
  const [nav, setNav] = useRecoilState(navigateAtom)

  const getNavPath = useCallback((nav: string) => {
    const params = parseSearch()
    params.navigate = nav
    const newSearch = stringifyParams(params)
    console.log('window.location.href', window.location.href)
    const [, pathAndSearch] = window.location.href.split('/#')
    const [path] = pathAndSearch.split('?')

    // const result = (window.location.hash.split('?')[0] + '?' + stringifyParams(params)).substring(1)

    console.log('path search', path, newSearch)

    // const search = '?' + queryString.stringify({ name })
    return [path, newSearch]
  }, [])

  const setNumberValue = useCallback(() => {
    // const number = e.target.value
    setNumber(c => (c ?? 0) + 1)
  }, [setNumber])

  return (
    <div>
      <h3>recoil</h3>
      <div>number: {number}</div>
      <div>name: {name}</div>
      <div>navigate: {nav}</div>
      <br />
      <button type="button" onClick={setNumberValue}>
        +1
      </button>
      <p>See the url hash, change it there</p>
      <div>
        <input value={name} onChange={e => setName(e.target.value)}></input>
      </div>
      <div>
        <input
          value={nav}
          onChange={e => {
            const [pathname, search] = getNavPath(e.target.value)
            navigate({ pathname, search: '?' + search })
            // navigate(getNavPath(e.target.value))
            // setSearchParams(curr => {
            //   const params = new URLSearchParams(curr)
            //   params.set('navigate', e.target.value)
            //   return params
            //   // ...curr,
            //   // navigate: e.target.value
            // })
            // navigate(e.target.value)
            // setName(e.target.value)
          }}
        ></input>
        <div>recoil state for nav: {nav}</div>
      </div>
    </div>
  )
})
