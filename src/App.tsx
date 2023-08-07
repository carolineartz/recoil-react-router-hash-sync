import React, { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

function App() {
  // const { search } = useLocation()
  const [searchParams] = useSearchParams()
  // console.log('*************search', search)
  const hash = window.location.hash
  console.log('HASH', hash)

  // const navigate = useNavigate()

  // useEffect(() => {
  //   // console.log('search changed', searchParams)

  //   console.log('DISPATCHING EVENT searchchanged', search)
  //   window.document.dispatchEvent(new CustomEvent('searchchanged', { detail: { search: search, origin: 'router' } }))
  //   // const url = window.location.href
  //   // window.location.search = search
  //   // window.dispatchEvent(new Event('popstate'))
  //   // window.location.href = url
  // }, [search])

  // useEffect(() => {
  //   window.addEventListener('searchchanged', e => {
  //     console.log('searchchanged', e)
  //   })
  // }, [])

  // useEffect(() => {
  //   const handleSearchChange = (e: CustomEvent) => {
  //     if (e.detail.origin === 'router') return

  //     console.log('react router handleSearchChange', e.detail)

  //     // sync navigation state from recoil update
  //     navigate(e.detail.location.href)
  //   }

  //   // @ts-ignore
  //   window.addEventListener('searchchanged', handleSearchChange)

  //   return () => {
  //     // @ts-ignore
  //     window.removeEventListener('searchchanged', handleSearchChange)
  //   }
  // }, [navigate])

  return (
    <div>
      <h3>react router</h3>
      <div>number: {searchParams.get('number')}</div>
      <div>name: {searchParams.get('name')}</div>
      <div>navigate: {searchParams.get('navigate')}</div>
      {/* <div>pathname: {location.pathname}</div>
      <div>search: {location.search}</div>
      <div>hash: {location.hash}</div> */}

      <Outlet />
    </div>
  )
}

export default App
