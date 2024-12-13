import React from 'react'
import SideBar from './components/SideBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-1'>
        <aside className='flex-[0.15]'>
          <SideBar/>
        </aside>
        <main className='flex-grow'>
          <Outlet/>
        </main>
    </div>
  )
}

export default Layout