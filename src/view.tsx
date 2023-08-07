import { number, string, object, array } from '@recoiljs/refine'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { atom, atomFamily, useRecoilState } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'
import queryString from 'query-string'

const getDefault = (key: string) => {
  const search = window.document.location.href.split('?')[1]
  const params = queryString.parse(search, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'none'
  })

  return params[key]
}

export const numberAtom = atom({
  key: 'number',
  default: getDefault('number') as number,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })]
})

export const nameAtom = atom({
  key: 'name',
  default: getDefault('name') as string,
  effects: [urlSyncEffect({ refine: string(), history: 'push' })]
})

export const navigateAtom = atom({
  key: 'navigate',
  default: getDefault('navigate') as string,
  effects: [urlSyncEffect({ refine: string(), history: 'push' })]
})

export const thingsAtom = atom({
  key: 'things',
  default: getDefault('things') as number[],
  effects: [urlSyncEffect({ refine: array(number()), history: 'push' })]
})

export const urlStateAtom = atom({
  key: 'search',
  default: window.location.href.split('?')[1]
})

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

export const View = () => {
  // const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()
  const [number, setNumber] = useRecoilState(numberAtom)
  const [name, setName] = useRecoilState(nameAtom)
  const [nav, setNav] = useRecoilState(navigateAtom)

  return (
    <div>
      <h3>recoil</h3>
      <div>number: {number}</div>
      <div>name: {name}</div>
      <div>navigate: {nav}</div>
      <br />
      <br />
      <br />
      <button type="button" onClick={() => setNumber(c => c + 1)}>
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
            setSearchParams(curr => {
              const params = new URLSearchParams(curr)
              params.set('navigate', e.target.value)
              return params
              // ...curr,
              // navigate: e.target.value
            })
            // navigate(e.target.value)
            // setName(e.target.value)
          }}
        ></input>
        <div>recoil state for nav: {nav}</div>
      </div>
    </div>
  )
}
