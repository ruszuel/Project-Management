import { RiDeleteBack2Line, RiEdit2Line, RiSettingsLine } from '@remixicon/react'
import React, { useState } from 'react'
import EditTask from './EditTask'
import { useAuth, useTask } from '../Context'
import EditTaskMember from './EditTaskMember'

const MemberAction = (props) => {
  const [clicked, setClicked] = useState(false)
  const {editClick, setEditClick, setTaskID} = useTask()
  const {data} = useAuth()
  const taskID = props.edit
  return (
    <div className='flex justify-center relative h-full'>
      <RiSettingsLine size={18} onClick={() => clicked ? setClicked(false) : setClicked(true)} />
      {clicked &&
        <div className='absolute -left-10 top-6 h-fit bg-white rounded-md shadow-md z-30'>
          <div className=' p-3 w-32 hover:bg-gray-200 cursor-pointer flex justify-between items-center' onClick={() => {setClicked(false); setEditClick(true); setTaskID(taskID)}}>
            <p className='text-sm'>Edit</p>
            <RiEdit2Line size={18} />
          </div>
          <div className={`z-30 p-3 w-32 hover:bg-gray-200 cursor-pointer flex justify-between items-center ${data.role === 'manager' ? '' : 'hidden'}`} onClick={props.click}>
            <p className='text-sm'>Delete</p>
            <RiDeleteBack2Line size={18} />
          </div>
        </div>
      }

      {editClick &&(
        data.role === 'manager' ? <EditTask/> : <EditTaskMember/>
      )}
    </div>
  )
}

export default MemberAction