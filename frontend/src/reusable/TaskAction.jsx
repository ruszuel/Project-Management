import { RiDeleteBack2Line, RiEdit2Line, RiSettingsLine } from '@remixicon/react'
import React, { useState } from 'react'

const MemberAction = (props) => {
  const [clicked, setClicked] = useState(false)

  return (
    <div className='flex justify-center relative h-full'>
      <RiSettingsLine size={18} onClick={() => clicked ? setClicked(false) : setClicked(true)} />
      {clicked &&
        <div className='absolute -left-10 top-6 h-fit bg-white rounded-md shadow-md z-30'>
          <div className=' p-3 w-32 hover:bg-gray-200 cursor-pointer flex justify-between items-center' onClick={props.edit}>
            <p className='text-sm'>Edit</p>
            <RiEdit2Line size={18} />
          </div>
          <div className='z-30 p-3 w-32 hover:bg-gray-200 cursor-pointer flex justify-between items-center' onClick={props.click}>
            <p className='text-sm'>Delete</p>
            <RiDeleteBack2Line size={18} />
          </div>
        </div>
      }
    </div>
  )
}

export default MemberAction