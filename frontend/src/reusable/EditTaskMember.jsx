import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react'
import { useTask } from '../Context';
import axios from 'axios';
import { Toaster, toast } from 'sonner'

const EditTaskMember = () => {
    const [toggleStats, setToggleStats] = useState(false)
    const [statsVal, setStatsVal] = useState('')
    const { setEditClick, taskID } = useTask()
    const stats = [{ label: 'Ongoing', value: 'Ongoing' }, { label: 'Not started', value: 'Not started' }, { label: 'Completed', value: 'Completed' }, { label: 'Pending', value: 'Pending' }]
    const updateS = () => toast.success('Task updated succesfully')
    useEffect(() => {
        const getTask = async () => {
            try {
                const res = await axios.post('http://127.0.0.1:8000/api/member_task', { taskID: taskID })
                if (res && res.status === 200) {
                    setStatsVal(res.data.map(val => val.status.toString()))
                }
            } catch (error) {
                console.log(error)
            }
        }
        console.log(taskID)
        getTask()
    }, [])

    const updateStats = async () => {
        console.log(statsVal)
        try {
            const updatee = await axios.post('http://127.0.0.1:8000/api/update_indiv_task', { taskID: taskID, status: statsVal })
            if (updatee && updatee.status === 200) {
                updateS()
                setEditClick(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center inset-0 bg-black/50 fixed z-30 font-poppins'>
            <Toaster richColors position="top-right" duration={3000} toastOptions={{
                className: 'text-base'
            }} />
            <div className='bg-white p-5 rounded-md w-1/5 flex text-left flex-col gap-10'>
                <div className='text-left'>
                    <p className='text-2xl font-semibold'>Edit Task</p>
                    <p className='text-gray-400'>Update the status of your task</p>
                </div>

                <div>
                    <div className='w-full'>
                        <div className='flex justify-between'>
                            <p className='font-semibold text-sm'>Status</p>

                        </div>
                        <div className='flex items-center relative'>
                            <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' readOnly onClick={() => toggleStats ? setToggleStats(false) : setToggleStats(true)} value={statsVal} placeholder='Set status' />
                            {toggleStats ? <RiArrowUpSLine size={18} className='absolute right-3' /> : <RiArrowDownSLine size={18} className='absolute right-3' />}

                            <div className={`bg-white z-30 shadow-md absolute bottom-2 -mb-40 w-full overflow-y-scroll h-fit border border-gray-400 rounded-md no-scrollbar ${toggleStats ? '' : 'hidden'}`}>
                                {stats.map((val, index) => (
                                    <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' key={index} onClick={() => { setToggleStats(false); setStatsVal(val.value) }}>{val.label}</p>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                <div className='flex items-center justify-end gap-2'>
                    <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => setEditClick(false)}>Cancel</p>
                    <p className='px-3 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={() => updateStats()} >Update</p>
                </div>
            </div>
        </div>
    )
}

export default EditTaskMember