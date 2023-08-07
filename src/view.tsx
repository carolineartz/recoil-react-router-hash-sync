import { useCallback } from 'react'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { number, string } from '@recoiljs/refine'
import queryString from 'query-string'
import { urlSyncEffect } from './recoil-sync-url-hash'
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

export const View = () => {
  const navigate = useNav()
  const [number, setNumber] = useRecoilState(numberAtom)
  const [name, setName] = useRecoilState(nameAtom)
  const nav = useRecoilValue(navigateAtom)

  const getNavPath = useCallback((nav: string) => {
    const params = parseSearch()
    params.navigate = nav
    const newSearch = stringifyParams(params)
    const [, pathAndSearch] = window.location.href.split('/#')
    const [path] = pathAndSearch.split('?')

    return [path, newSearch]
  }, [])

  return (
    <div>
      <h3>recoil</h3>
      <div>number: {number}</div>
      <div>name: {name}</div>
      <div>navigate: {nav}</div>
      <br />
      <button type="button" onClick={() => setNumber(c => (c ?? 0) + 1)}>
        +1
      </button>
      <div>
        <input value={name} onChange={e => setName(e.target.value)}></input>
      </div>
      <div>
        <input
          value={nav}
          onChange={e => {
            const [pathname, search] = getNavPath(e.target.value)
            navigate({ pathname, search: '?' + search })
          }}
        ></input>
      </div>
    </div>
  )
}
