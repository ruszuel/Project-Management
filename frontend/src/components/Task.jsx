import React, { useEffect, useState } from 'react'
import { RiAddCircleLine, RiArrowDownSLine, RiArrowUpSLine, RiSettingsLine } from '@remixicon/react'
import { useAuth, useTask } from '../Context'
import axios from 'axios'
import { Formik } from 'formik'
import * as yup from 'yup'
import TaskAction from '../reusable/TaskAction'
import EditTask from '../reusable/EditTask'

const Task = () => {
    const { project, editClick } = useTask()
    const { data } = useAuth()
    const [taskData, setTaskData] = useState([])
    const [newTask, setNewTask] = useState(false)
    const [toggleStats, setToggleStats] = useState(false)
    const [togglePrio, setTogglePrio] = useState(false)
    const [toggleMembers, setToggleMembers] = useState(false)
    const [membersdata, setMembersData] = useState([''])

    const [statsVal, setStatsVal] = useState()
    const [prioVal, setPrioVal] = useState()
    const [memberVal, setMemberVal] = useState('')

    const [delProjID, setDelProjID] = useState('')
    const [delTaskID, setDelTaskID] = useState('')
    const managers = JSON.parse(localStorage.getItem('user'));

    const stats = [{ label: 'Ongoing', value: 'Ongoing' }, { label: 'Not started', value: 'Not started' }, { label: 'Completed', value: 'Completed' }, { label: 'Pending', value: 'Pending' }]
    const prio = [{ label: 'Low', value: 'Low' }, { label: 'Medium', value: 'Medium' }, { label: 'High', value: 'High' }, { label: 'Very High', value: 'Very High' }]
    const today = new Date().toISOString().slice(0, 10);

    const retrieveData = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/tasks', { project: project })
            setTaskData(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const retrieveMemTask = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/indiv_task', {projID: project, username: managers.username})
            setTaskData(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log(data.role, project)
        if(data.role === 'manager'){
            retrieveData()
        }else if(data.role === 'member'){
            retrieveMemTask()
        }
    }, [project, editClick])

    useEffect(() => {
        const checkMember = async () => {
            const users = await axios.post('http://127.0.0.1:8000/api/members', { project: project, manager: managers.manager_id })
            setMembersData(users.data)
        }
        checkMember()
    }, [project])

    const onDelete = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/rm_task', { projID: delProjID, taskID: delTaskID })
            if (res && res.status === 200) {
                retrieveData()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const taskSchema = yup.object().shape({
        feature: yup.string().required().max(40).min(5),
        statss: yup.string().required(),
        priority: yup.string().required(),
        sprint: yup.number().required(),
        deadline: yup.date().required(),
        assign: yup.string().required()
    })

    return (
        <div className='flex w-full h-screen p-5 font-poppins bg-gray-300 relative'>
            <div className='flex-1 bg-white rounded-lg shadow-md p-10 py-14 h-full gap-10 flex flex-col'>
                <div>
                    <p className='font-semibold text-2xl'>Welcome back!</p>
                    <p className='text-gray-400'>Here's a list of the tasks for the project!</p>
                </div>

                <div className='flex flex-col gap-4'>
                    <div className='flex justify-end'>
                        <button className={`bg-[#1A2D42] text-white text-sm p-2 rounded-md flex items-center gap-1 hover:bg-[#1A2D42]/50 ${data.role === 'manager' ? '' : 'hidden'}`} onClick={() => { project && setNewTask(true) }}> <RiAddCircleLine size={18} color='white' /> Add task</button>
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

                                {taskData.map((task, index) => (
                                    <tr className='text-sm' key={task.task_id}>
                                        <td className="border border-gray-400 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.feature}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.status}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.assigned}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.sprint}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.priority}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.deadline}</td>
                                        <td className="border border-gray-400 px-4 py-2" onClick={() => { setDelProjID(project); setDelTaskID(task.task_id) }}>
                                            <TaskAction click={() => onDelete()} edit={task.task_id}/>
                                        </td>
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
                        <div className='flex flex-col gap-6'>
                            <Formik
                                initialValues={{ feature: '', statss: '', priority: '', sprint: '', deadline: '', assign: '' }}
                                validationSchema={taskSchema}
                                onSubmit={async (val) => {

                                    const newTask = {
                                        project: project,
                                        feature: val.feature,
                                        status: val.statss,
                                        assigned: val.assign,
                                        sprint: val.sprint,
                                        priority: val.priority,
                                        deadline: val.deadline
                                    }

                                    try {
                                        const datass = await axios.post('http://127.0.0.1:8000/api/new_task', newTask)
                                        if (datass && datass.status === 200) {
                                            setNewTask(false)
                                            retrieveData()
                                        }
                                    } catch (error) {

                                    }
                                }}
                            >
                                {(props) => (
                                    <>
                                        <section className='grid gap-4'>
                                            <div>
                                                <div className='flex justify-between'>
                                                    <p className='font-semibold text-sm'>Features</p>
                                                    <p className='text-red-400 text-sm justify-self-end'>{props.errors.feature && props.touched.feature && props.errors.feature}</p>
                                                </div>
                                                <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' placeholder='Features' onChange={props.handleChange('feature')} onBlur={props.handleBlur('feature')} />
                                            </div>

                                            <div className='flex gap-3'>
                                                <div className='w-full'>
                                                    <div className='flex justify-between'>
                                                        <p className='font-semibold text-sm'>Status</p>
                                                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.statss && props.touched.statss && props.errors.statss}</p>
                                                    </div>
                                                    <div className='flex items-center relative'>
                                                        <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly onChange={props.handleChange('statss')} onBlur={props.handleBlur('statss')} onClick={() => toggleStats ? setToggleStats(false) : setToggleStats(true)} placeholder='Set status' value={statsVal} />
                                                        {toggleStats ? <RiArrowUpSLine size={18} className='absolute right-3' /> : <RiArrowDownSLine size={18} className='absolute right-3' />}

                                                        <div className={`bg-white z-30 shadow-md absolute bottom-2 -mb-40 w-full overflow-y-scroll h-fit border border-gray-400 rounded-md no-scrollbar ${toggleStats ? '' : 'hidden'}`}>
                                                            {stats.map((val, index) => (
                                                                <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' key={index} onClick={() => { setStatsVal(val.value); setToggleStats(false); props.setFieldValue('statss', val.value) }}>{val.label}</p>
                                                            ))}
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className='w-full'>
                                                    <div className='flex justify-between'>
                                                        <p className='font-semibold text-sm'>Priority</p>
                                                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.priority && props.touched.priority && props.errors.priority}</p>
                                                    </div>
                                                    <div className='flex items-center relative'>
                                                        <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly onChange={props.handleChange('priority')} onBlur={props.handleBlur('priority')} placeholder='Set priotity' onClick={() => togglePrio ? setTogglePrio(false) : setTogglePrio(true)} value={prioVal} />
                                                        {togglePrio ? <RiArrowUpSLine size={18} className='absolute right-3' /> : <RiArrowDownSLine size={18} className='absolute right-3' />}

                                                        <div className={`bg-white z-30 shadow-md absolute bottom-2 -mb-40 w-full overflow-y-scroll h-fit border border-gray-400 rounded-md no-scrollbar ${togglePrio ? '' : 'hidden'}`}>
                                                            {prio.map((val, index) => (
                                                                <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' key={index} onClick={() => { setPrioVal(val.value); setTogglePrio(false); props.setFieldValue('priority', val.value) }}>{val.label}</p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex gap-3'>
                                                <div className='w-full'>
                                                    <div className='flex justify-between'>
                                                        <p className='font-semibold text-sm'>Sprint</p>
                                                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.sprint && props.touched.sprint && props.errors.sprint}</p>
                                                    </div>
                                                    <input type='number' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' placeholder='Sprint' onChange={props.handleChange('sprint')} onBlur={props.handleBlur('sprint')} min={'1'} />
                                                </div>
                                                <div className='w-full'>
                                                    <div className='flex justify-between'>
                                                        <p className='font-semibold text-sm'>Deadline</p>
                                                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.deadline && props.touched.deadline && props.errors.deadline}</p>
                                                    </div>
                                                    <input type='date' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('deadline')} onBlur={props.handleBlur('deadline')} min={today} />
                                                </div>
                                            </div>

                                            <div className='flex flex-col'>
                                                <div className='flex justify-between'>
                                                    <p className='font-semibold text-sm'>Assign to</p>
                                                    <p className='text-red-400 text-sm justify-self-end'>{props.errors.assign && props.touched.assign && props.errors.assign}</p>
                                                </div>
                                                <div className='w-full'>
                                                    <div className='flex items-center relative'>
                                                        <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly value={memberVal} onChange={props.handleChange('assign')} onBlur={props.handleBlur('assign')} placeholder='Select member' onClick={() => toggleMembers ? setToggleMembers(false) : setToggleMembers(true)} />
                                                        <RiArrowDownSLine size={18} className='absolute right-3' />

                                                        <div className={`bg-white z-30 shadow-md absolute bottom-2 -mb-32 w-full overflow-y-scroll h-28 border border-gray-400 rounded-md no-scrollbar ${toggleMembers ? '' : 'hidden'}`}>
                                                            {membersdata && membersdata.map((val, index) => (
                                                                <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' key={index} onClick={() => { setMemberVal(val.username); setToggleMembers(false); props.setFieldValue('assign', val.username) }}>{val.username}</p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <div className='flex items-center justify-end gap-2'>
                                            <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => { setNewTask(false); setPrioVal(''); setStatsVal('') }}>Cancel</p>
                                            <p className='px-3 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={props.handleSubmit} >Add task</p>
                                        </div>
                                    </>
                                )}
                            </Formik>

                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Task