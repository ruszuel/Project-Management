import React from 'react'
import * as Icons from '@remixicon/react'

const SidebarItem = (props) => {
    const Icon = Icons[props.icon]
  return (
    <div className='flex items-center gap-x-3 px-5 py-3 hover:bg-[#aab7b7] cursor-pointer'>
        {Icon && <Icon size={20} color='#1a2d42'/>}
        <p className='text-base'>{props.item}</p>
    </div>
  )
}

export default SidebarItem