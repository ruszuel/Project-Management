import React, { useState } from 'react'
import logo from '../assets/images/logo.png'
import {RiCommandLine, RiExpandUpDownLine, RiTeamLine, RiUser3Line} from '@remixicon/react'
import SidebarItem from '../reusable/SidebarItem'
import SidebarModal from '../reusable/SidebarModal'

const SideBar = () => {
    const [visible, setVisible] = useState(false)
  return (
    <div className='flex flex-1 h-screen font-poppins'>
        {/* main container */}
        <aside className='flex-1 bg-white flex flex-col pb-2 border-r border-gray-400 relative'>
            {/* sidebar */}
            <section className='flex-1 flex flex-col gap-y-8'>
                <div className='flex items-center px-5 pt-5 gap-2'>
                    {/* Logo plus title */}
                    <RiCommandLine size={32} color='#1a2d42'/>
                    <div className='flex'>
                        <p className='font-medium text-[#2e4156] text-xl'>Project</p>
                        <p className='font-medium text-[#1a2d42] text-xl'>Sync</p>
                    </div>
                </div>
                <div className='w-full'>
                    {/* pages */}
                    <SidebarItem icon={'RiListCheck3'} item={'Project'}/>
                    <SidebarItem icon={'RiGroupLine'} item={'Members'}/>
                    <SidebarItem icon={'RiCommandLine'} item={'Placeholder'}/>
                    <SidebarItem icon={'RiCommandLine'} item={'Placeholder'}/>
                    <SidebarItem icon={'RiCommandLine'} item={'Placeholder'}/>
                </div>
            </section>
            <div className='px-5 flex-1 justify-end flex flex-col'>
                {/* profile */}
                <div className='flex justify-between items-center rounded-md bg-[#coc8ca] shadow-lg hover:bg-[#aab7b7] p-2 cursor-pointer' onClick={() => visible ? setVisible(false) : setVisible(true)}>
                    <div className='flex gap-4 items-center'>
                        <RiUser3Line size={22} color='black'/>
                        <div>
                            <p className='text-sm'>Juan Dela Cruz</p>
                            <p className='text-xs'>@juandz</p>
                        </div>
                    </div>
                    <RiExpandUpDownLine size={18} color='black' className='justify-self-end'/>
                </div>
            </div>
            {visible &&
                <div className='w-3/4 h-fit bg-white absolute bottom-2 ml-60 rounded-md z-10 shadow-lg p-1'>
                    <SidebarModal icon={'RiUser3Line'} item={'View profile'}/>  
                    <SidebarModal icon={'RiSettings4Line'} item={'Account Settings'}/>  
                    <SidebarModal icon={'RiLogoutBoxRLine'} item={'Log out '}/>  
                </div>
            }
        </aside>
        
    </div>
  )
}

export default SideBar