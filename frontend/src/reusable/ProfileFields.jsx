import React from 'react'

const ProfileFields = (props) => {
  return (
    <div className='w-[50%] grid gap-1'>
        <p className='font-medium text-sm'>{props.title}</p>
        <input type="text" className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' disabled value={props.value}/>
    </div>
  )
}

export default ProfileFields