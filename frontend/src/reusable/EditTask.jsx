import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react'
import { useAuth, useTask } from '../Context'
import { Toaster, toast } from 'sonner'


const EditTask = () => {
    const [membersdata, setMembersData] = useState([''])
    const [toggleStats, setToggleStats] = useState(false)
    const [togglePrio, setTogglePrio] = useState(false)
    const [toggleMembers, setToggleMembers] = useState(false)
    const [taskData, setTaskData] = useState([])
    const { setEditClick, project, taskID } = useTask()
    const managers = JSON.parse(localStorage.getItem('user'));

    const stats = [{ label: 'Ongoing', value: 'Ongoing' }, { label: 'Not started', value: 'Not started' }, { label: 'Completed', value: 'Completed' }, { label: 'Pending', value: 'Pending' }]
    const prio = [{ label: 'Low', value: 'Low' }, { label: 'Medium', value: 'Medium' }, { label: 'High', value: 'High' }, { label: 'Very High', value: 'Very High' }]
    const today = new Date().toISOString().slice(0, 10);
    const updateS = () => toast.success('Task updated succesfully')
    const taskSchema = yup.object().shape({
        feature: yup.string().required().max(40).min(5),
        statss: yup.string().required(),
        priority: yup.string().required(),
        sprint: yup.number().required(),
        deadline: yup.date().required(),
        assign: yup.string().required()
    })

    useEffect(() => {
        const getTask = async () => {
            try {
                const res = await axios.post('http://127.0.0.1:8000/api/member_task', { taskID: taskID })
                if (res && res.status === 200) {
                    setTaskData(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        console.log(taskID)
        getTask()
    }, [])

    useEffect(() => {
        const checkMember = async () => {
            const users = await axios.post('http://127.0.0.1:8000/api/retrieve_mem_proj', { projectID: project })
            setMembersData(users.data)
        }
        checkMember()
    }, [project])

    return (
        <div className='flex flex-col justify-center items-center inset-0 bg-black/20 fixed z-30 font-poppins'>
            <Toaster richColors position="top-right" duration={3000} toastOptions={{
                className: 'text-base'
            }} />
            <div className='bg-white p-5 rounded-md w-2/6 flex text-left flex-col gap-10'>
                <div className='text-left'>
                    <p className='text-2xl font-semibold'>Edit Task</p>
                    <p className='text-gray-400'>Edit and update this task</p>
                </div>
                <div className='flex flex-col gap-6'>
                    <Formik
                        initialValues={{
                            feature: taskData.length > 0 ? taskData[0].feature : '',
                            statss: taskData.length > 0 ? taskData[0].status : '',
                            priority: taskData.length > 0 ? taskData[0].priority : '',
                            sprint: taskData.length > 0 ? taskData[0].sprint : '',
                            deadline: taskData.length > 0 ? taskData[0].deadline : '',
                            assign: taskData.length > 0 ? taskData[0].assigned : ''
                        }}
                        validationSchema={taskSchema}
                        enableReinitialize={true}
                        onSubmit={async (val) => {

                            const newTask = {
                                taskID: taskID,
                                feature: val.feature,
                                status: val.statss,
                                assigned: val.assign,
                                sprint: val.sprint,
                                priority: val.priority,
                                deadline: val.deadline
                            }

                            try {
                                const datass = await axios.post('http://127.0.0.1:8000/api/update_task', newTask)
                                if (datass && datass.status === 200) {
                                    updateS()
                                    setEditClick(false)
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
                                        <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' placeholder='Features' onChange={props.handleChange('feature')} onBlur={props.handleBlur('feature')} value={props.values.feature} />
                                    </div>

                                    <div className='flex gap-3'>
                                        <div className='w-full'>
                                            <div className='flex justify-between'>
                                                <p className='font-semibold text-sm'>Status</p>
                                                <p className='text-red-400 text-sm justify-self-end'>{props.errors.statss && props.touched.statss && props.errors.statss}</p>
                                            </div>
                                            <div className='flex items-center relative'>
                                                <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly onChange={props.handleChange('statss')} onBlur={props.handleBlur('statss')} onClick={() => toggleStats ? setToggleStats(false) : setToggleStats(true)} placeholder='Set status' value={props.values.statss} />
                                                {toggleStats ? <RiArrowUpSLine size={18} className='absolute right-3' /> : <RiArrowDownSLine size={18} className='absolute right-3' />}

                                                <div className={`bg-white z-30 shadow-md absolute bottom-2 -mb-40 w-full overflow-y-scroll h-fit border border-gray-400 rounded-md no-scrollbar ${toggleStats ? '' : 'hidden'}`}>
                                                    {stats.map((val, index) => (
                                                        <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' key={index} onClick={() => { setToggleStats(false); props.setFieldValue('statss', val.value) }}>{val.label}</p>
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
                                                <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly onChange={props.handleChange('priority')} onBlur={props.handleBlur('priority')} placeholder='Set priotity' onClick={() => togglePrio ? setTogglePrio(false) : setTogglePrio(true)} value={props.values.priority} />
                                                {togglePrio ? <RiArrowUpSLine size={18} className='absolute right-3' /> : <RiArrowDownSLine size={18} className='absolute right-3' />}

                                                <div className={`bg-white z-30 shadow-md absolute bottom-2 -mb-40 w-full overflow-y-scroll h-fit border border-gray-400 rounded-md no-scrollbar ${togglePrio ? '' : 'hidden'}`}>
                                                    {prio.map((val, index) => (
                                                        <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' key={index} onClick={() => { setTogglePrio(false); props.setFieldValue('priority', val.value) }}>{val.label}</p>
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
                                            <input type='number' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' placeholder='Sprint' onChange={props.handleChange('sprint')} onBlur={props.handleBlur('sprint')} min={'1'} value={props.values.sprint} />
                                        </div>
                                        <div className='w-full'>
                                            <div className='flex justify-between'>
                                                <p className='font-semibold text-sm'>Deadline</p>
                                                <p className='text-red-400 text-sm justify-self-end'>{props.errors.deadline && props.touched.deadline && props.errors.deadline}</p>
                                            </div>
                                            <input type='date' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('deadline')} onBlur={props.handleBlur('deadline')} min={today} value={props.values.deadline} />
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <div className='flex justify-between'>
                                            <p className='font-semibold text-sm'>Assign to</p>
                                            <p className='text-red-400 text-sm justify-self-end'>{props.errors.assign && props.touched.assign && props.errors.assign}</p>
                                        </div>
                                        <div className='w-full'>
                                            <div className='flex items-center relative'>
                                                <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly value={props.values.assign} onChange={props.handleChange('assign')} onBlur={props.handleBlur('assign')} placeholder='Select member' onClick={() => toggleMembers ? setToggleMembers(false) : setToggleMembers(true)} />
                                                <RiArrowDownSLine size={18} className='absolute right-3' />

                                                <div className={`bg-white z-30 shadow-md absolute bottom-2 -mb-32 w-full overflow-y-scroll h-28 border border-gray-400 rounded-md no-scrollbar ${toggleMembers ? '' : 'hidden'}`}>
                                                    {membersdata && membersdata.map((val, index) => (
                                                        <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' key={index} onClick={() => { setToggleMembers(false); props.setFieldValue('assign', val.username) }}>{val.username}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className='flex items-center justify-end gap-2'>
                                    <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => setEditClick(false)}>Cancel</p>
                                    <p className='px-3 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={props.handleSubmit} >Update</p>
                                </div>
                            </>
                        )}
                    </Formik>

                </div>
            </div>
        </div>
    )
}

export default EditTask