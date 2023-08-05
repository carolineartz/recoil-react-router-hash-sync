import { number, string } from '@recoiljs/refine'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { atom, useRecoilState } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'

export const numberAtom = atom({
  key: 'number',
  default: 0,
  effects: [urlSyncEffect({ refine: number(), history: 'push' })]
})

export const nameAtom = atom({
  key: 'name',
  default: '',
  effects: [urlSyncEffect({ refine: string(), history: 'push' })]
})

export const navigateAtom = atom({
  key: 'navigate',
  default: '',
  effects: [urlSyncEffect({ refine: string(), history: 'push' })]
})

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
        <input
          value={name}
          onChange={e => {
            setName(e.target.value)
          }}
        ></input>
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
