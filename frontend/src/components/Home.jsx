import React from 'react'
import SideBar from './SideBar'
import ForgotPass from './ForgotPass'

const Home = () => {
  return (
    <div className='flex flex-1 bg-pink-200'>
      <aside className='flex-[0.15]'>
        <SideBar/>
      </aside>
      <main className='bg-[#c0c8ca] flex-1'>
        Home
      </main>
    </div>
  )
}

export default Home