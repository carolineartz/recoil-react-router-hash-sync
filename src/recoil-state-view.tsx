import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { number, string } from '@recoiljs/refine'
import { urlHashQuerySyncEffect } from './recoil-url-hash-query-sync'
import { useQueryParamsNavigate } from './routing'
import { parseSearch } from './query-string-utils'

const getDefault = (key: string) => {
  const params = parseSearch()
  return params[key]
}

export const numberAtom = atom({
  key: 'number',
  default: (getDefault('number') ?? null) as number | null,
  effects: [urlHashQuerySyncEffect({ refine: number(), history: 'push', syncDefault: true })]
})

export const nameAtom = atom({
  key: 'name',
  default: (getDefault('name') ?? '') as string,
  effects: [urlHashQuerySyncEffect({ refine: string(), history: 'push', syncDefault: true })]
})

export const navigateAtom = atom({
  key: 'navigate',
  default: (getDefault('navigate') ?? '') as string,
  effects: [urlHashQuerySyncEffect({ refine: string(), history: 'push', syncDefault: true })]
})

// export const thingsAtom = atom({
//   key: 'things',
//   default: getDefault('things') as number[],
//   effects: [urlSyncEffect({ refine: array(number()), history: 'push', syncDefault: true, storeKey: 'filters' })]
// })

export const RecoilStateView = () => {
  const navigateQueryParam = useQueryParamsNavigate()
  const [number, setNumber] = useRecoilState(numberAtom)
  const [name, setName] = useRecoilState(nameAtom)
  const nav = useRecoilValue(navigateAtom)

  return (
    <div>
      <h3>recoil</h3>
      <div>number: {number}</div>
      <div>name: {name}</div>
      <div>navigate: {nav}</div>
      <br />
      <h3>update state</h3>
      Recoil (number):{' '}
      <button type="button" onClick={() => setNumber(c => (c ?? 0) + 1)}>
        +1
      </button>
      <div>
        Recoil (name): <input value={name} onChange={e => setName(e.target.value)}></input>
      </div>
      <div>
        Router (navigate): <input value={nav} onChange={e => navigateQueryParam('navigate', e.target.value)}></input>
      </div>
    </div>
  )
}
