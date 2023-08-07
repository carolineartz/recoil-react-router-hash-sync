import { useState } from 'react'
import './App.css'
import { Outlet, useSearchParams } from 'react-router-dom'

export const ReactRouterState = () => {
  const [searchParams] = useSearchParams()
  const [unrelatedState, setUnrelatedState] = useState(1)

  return (
    <div>
      <h3>react router</h3>
      <div>number: {searchParams.get('number')}</div>
      <div>name: {searchParams.get('name')}</div>
      <div>navigate: {searchParams.get('navigate')}</div>
      <hr />
      <br />
      <div>unrelated state: {unrelatedState}</div>
      <button onClick={() => setUnrelatedState(curr => curr + 1)}>+1 unrelated state</button>

      <Outlet />
    </div>
  )
}
