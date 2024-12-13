import { RiDeleteBack2Line, RiSettingsLine } from '@remixicon/react'
import React, { useState } from 'react'

const MemberAction = (props) => {
    const [clicked, setClicked] = useState(false)

  return (
    <div className='flex justify-center relative'>
        <RiSettingsLine size={18} onClick={() => clicked ? setClicked(false) :  setClicked(true)}/>
        {clicked && 
            <div className='z-30 p-3 w-32 rounded-md shadow-md absolute hover:bg-gray-200 bg-white -left-10 top-6 cursor-pointer flex justify-between items-center' onClick={props.click}>
                <p className='text-sm'>Delete</p>
                <RiDeleteBack2Line size={18}/>
            </div>
        }
    </div>
  )
}

export default MemberAction