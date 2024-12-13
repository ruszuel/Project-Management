import React, { useEffect, useState } from 'react'
import {RiAddCircleLine, RiArrowDownSLine, RiArrowUpSLine, RiSettingsLine} from '@remixicon/react'
import { useTask } from '../Context'
import axios from 'axios'

const Task = () => {
    const {project} = useTask()
    const[toggleProj, setToggleProj] = useState(false)
    const [taskData, setTaskData] = useState([])
    const [newTask, setNewTask] = useState(false)
    const [toggleStats, setToggleStats] = useState(false)
    const [togglePrio, setTogglePrio] = useState(false)
    const [toggleMembers, setToggleMembers] = useState(false)

    const [statsVal, setStatsVal] = useState()
    const [prioVal, setPrioVal] = useState()
    const [memberVal, setMemberVal] = useState()

    const stats = [{label: 'Ongoing', value: 'Ongoing'}, {label: 'Not started', value: 'Not started'}, {label: 'Completed', value: 'Completed'}, {label: 'Pending', value: 'Pending'}]
    const prio = [{label: 'Low', value: 'Low'}, {label: 'Medium', value: 'Medium'}, {label: 'High', value: 'High'}, {label: 'Very High', value: 'Very High'}]  
    const today = new Date().toISOString().slice(0, 10);

    const retrieveData = async () => {
        try{
            const res = await axios.post('http://127.0.0.1:8000/api/tasks', {project: project})
            setTaskData(res.data)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        retrieveData()
    }, [project])

  return (
    <div className='flex w-full h-screen p-5 font-poppins bg-gray-300 relative'>
        <div className='flex-1 bg-white rounded-lg shadow-md p-10 py-14 h-full gap-6 flex flex-col'>
            <div>
                <p className='font-semibold text-2xl'>Welcome back!</p>
                <p className='text-gray-400'>Here's a list of the tasks for the project!</p>
            </div>

            <div className='flex flex-col gap-4'>
                <div className='flex justify-end'>
                    <button className='bg-[#1A2D42] text-white text-sm p-2 rounded-md flex items-center gap-1 hover:bg-[#1A2D42]/50' onClick={() => {setNewTask(true); console.log(newTask)}}> <RiAddCircleLine size={18} color='white'/> Add task</button>
            </div>

            <div className="rounded-md">
                <table className="w-full border-collapse border border-gray-400 rounded-md">
                    <thead className="">
                        <tr className='text-sm'>
                            <th className="border border-gray-400 px-4 py-2">Task</th>
                            <th className="border border-gray-400 px-4 py-2">Feature</th>
                            <th className="border border-gray-400 px-4 py-2">Status</th>
                            <th className="border border-gray-400 px-4 py-2">Assigned</th>
                            <th className="border border-gray-400 px-4 py-2">Sprint</th>
                            <th className="border border-gray-400 px-4 py-2">Priority</th>
                            <th className="border border-gray-400 px-4 py-2">Deadline</th>
                            <th className="border border-gray-400 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>

                        {taskData.map((task) => (
                            <tr className='text-sm' key={task.task_id}>
                                <td className="border border-gray-400 px-4 py-2">{task.task_id}</td>
                                <td className="border border-gray-400 px-4 py-2">{task.feature}</td>
                                <td className="border border-gray-400 px-4 py-2">{task.status}</td>
                                <td className="border border-gray-400 px-4 py-2">{task.assigned}</td>
                                <td className="border border-gray-400 px-4 py-2">{task.sprint}</td>
                                <td className="border border-gray-400 px-4 py-2">{task.priority}</td>
                                <td className="border border-gray-400 px-4 py-2">{task.deadline}</td>
                                <td className="px-4 py-2 grid place-items-center"><RiSettingsLine size={18}/></td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
        
        {newTask && 
            <div className='flex flex-col justify-center items-center inset-0 bg-black/50 fixed z-30'>
                <div className='bg-white p-5 rounded-md w-2/6 flex flex-col gap-10'>
                    <div>
                        <p className='text-2xl font-semibold'>Add New Task</p>
                        <p className='text-gray-400'>Create and assign new task for your project</p>
                    </div>
                    <section className='grid gap-4'>
                        <div>
                            <p className='font-semibold text-sm'>Features</p>
                            <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' placeholder='Features' required/>
                        </div>

                        <div className='flex gap-3'>
                            <div className='w-full'>
                                <p className='font-semibold text-sm'>Status</p>
                                <div className='flex items-center relative'>
                                    <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly onClick={() => toggleStats ? setToggleStats(false) : setToggleStats(true)} placeholder='Set status' value={statsVal}/>
                                    {toggleStats ? <RiArrowUpSLine size={18} className='absolute right-3'/> : <RiArrowDownSLine size={18} className='absolute right-3'/>}

                                    <div className={`bg-white z-30 shadow-md absolute bottom-2 -mb-40 w-full overflow-y-scroll h-fit border border-gray-400 rounded-md no-scrollbar ${toggleStats ? '' : 'hidden'}`}>
                                    
                                    {stats.map((val, index) => (
                                        <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' key={index} onClick={() => {setStatsVal(val.value); setToggleStats(false)}}>{val.label}</p>
                                    ))}
                                    </div>
                                </div>
                                
                            </div>
                            <div className='w-full'>
                                <p className='font-semibold text-sm'>Priority</p>
                                <div className='flex items-center relative'>
                                    <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly placeholder='Set priotity' onClick={() => togglePrio ? setTogglePrio(false) : setTogglePrio(true)} value={prioVal}/>
                                    {togglePrio ? <RiArrowUpSLine size={18} className='absolute right-3'/> : <RiArrowDownSLine size={18} className='absolute right-3'/>}

                                    <div className={`bg-white z-30 shadow-md absolute bottom-2 -mb-40 w-full overflow-y-scroll h-fit border border-gray-400 rounded-md no-scrollbar ${togglePrio ? '' : 'hidden'}`}>
                                        {prio.map((val) => (
                                            <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' onClick={() => {setPrioVal(val.value); setTogglePrio(false)}}>{val.label}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            <div className='w-full'>
                                <p className='font-semibold text-sm'>Sprint</p>
                                <input type='number' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' placeholder='Sprint' min={'1'}/>
                            </div>
                            <div className='w-full'>
                                <p className='font-semibold text-sm'>Deadline</p>
                                <input type='date' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' min={today}/>
                            </div>
                        </div>
                        
                        <div className='flex gap-3 items-center'>
                            <p className='font-semibold text-sm w-28'>Assign to:</p>
                            <div className='w-full'>
                                <div className='flex items-center relative'>    
                                    <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly placeholder='Select member' onClick={() => toggleMembers ? setToggleMembers(false) : setToggleMembers(true)}/>
                                    <RiArrowDownSLine size={18} className='absolute right-3'/>

                                    <div className={`bg-white z-30 shadow-md absolute -mb-32 w-full overflow-y-scroll h-20 border border-gray-400 rounded-md no-scrollbar ${toggleMembers ? '' : 'hidden'}`}>
                                        <p className='p-2'>asdasdadadas</p>
                                        <p className='p-2'>asdasdadadas</p>
                                        <p className='p-2'>asdasdadadas</p>
                                        <p className='p-2'>asdasdadadas</p>
                                        <p className='p-2'>asdasdadadas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <div className='flex items-center justify-end gap-2'>
                        <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => {setNewTask(false); setPrioVal(''); setStatsVal('')}}>Cancel</p>
                        <p className='px-3 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer'>Add task</p>
                    </div>
                </div>
            </div> 
        }
    </div>
  )
}

export default Task