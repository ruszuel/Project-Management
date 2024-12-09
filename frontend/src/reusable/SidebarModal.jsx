import React from 'react'
import * as Icons from '@remixicon/react'

const SidebarModal = (props) => {
    const Icon = Icons[props.icon]
  return (
    <div className='flex items-center gap-x-3 px-2 py-1 hover:bg-[#aab7b7] cursor-pointer rounded-sm' onClick={props.onClick}>
        {Icon && <Icon size={16} color='#1a2d42'/>}
        <p className='text-sm'>{props.item}</p>
    </div>
  )
}

export default SidebarModal