import React, { useCallback, useContext, useEffect, useState } from 'react'
import { RiAddLine, RiCommandLine, RiExpandUpDownLine, RiUser3Line} from '@remixicon/react'
import SidebarItem from '../reusable/SidebarItem'
import SidebarModal from '../reusable/SidebarModal'
import { useAuth, useTask } from '../Context'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ProjectModal from '../reusable/ProjectModal'

const SideBar = () => {
    const [visible, setVisible] = useState(false)
    const [projVisible, setProjVisible] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [projVal, setProjVal] = useState([])
    const [valProj, setValProj] = useState('')
    const [projOpen, setProjOpen] = useState(false)
    const [title, setTitle] = useState('')

    const { logout, data} = useAuth()
    const {setProject, project} = useTask()
    const managers = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate()

    useEffect(() => {
        if (data.role) {
            if(data.role === 'manager'){
                getProject();
            }  else{
                getMemProject()
            }
        }
    }, [data.username, data.role]);      

    const getProject = async () => {
        try {
            console.log(managers.manager_id)
            const res = await axios.post('http://127.0.0.1:8000/api/projects', {manager: managers.manager_id})
            if(res.status && res.status === 200){
                setProjVal(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getMemProject = async () => {
        console.log(data.project_id)
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/retrieve_member_project', {projID: data.project_id})
            if(res.status && res.status === 200){
                setProjVal(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCreate = useCallback(async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/create_project', {title: title, manager: managers.manager_id})
            if(response && response.status === 201){
                setProjOpen(false)
                getProject()
            }
        }catch (error) {
            console.log(error)
        }
    },[title])

  return (
    <div className='flex w-[16rem] h-screen font-poppins'>
        {/* main container */}
        <aside className='flex-1 bg-white flex flex-col pb-2 border-r border-gray-400 relative'>
            {/* sidebar */}
            <section className='flex-1 flex flex-col gap-y-8'>
                <div className='flex items-center px-5 pt-5 gap-2'>
                    {/* Logo plus title */}
                    <RiCommandLine size={32} color='#1a2d42'/>
                    <div className='flex'>
                        <p className='font-medium text-[#2e4156] text-xl'>Project</p>
                        <p className='font-medium text-[#1a2d42] text-xl'>Sync</p>
                    </div>
                </div>
                <div className=' px-5 bg-white flex items-center justify-between cursor-pointer'>
                    <RiCommandLine size={21} color='#1a2d42'/>
                    <div className='flex items-center relative' onClick={() => projVisible ? setProjVisible(false) : setProjVisible(true)}>
                        <input type='text' className='w-full p-3 border hover:hover:bg-[#aab7b7] border-gray-400 rounded-md text-sm placeholder-black cursor-pointer outline-none border-none' value={valProj} readOnly placeholder='Select Project'/>
                        <RiExpandUpDownLine size={18} color='black' className='absolute right-3'/>
                    </div>
                </div>
                <div className='w-full'>
                    {/* pages */}
                    <SidebarItem icon={'RiDashboardHorizontalLine'} item={'Project'}/>
                    <SidebarItem icon={'RiGroupLine'} item={'Members'} onClick={() => navigate('/members')}/>
                    <SidebarItem icon={'RiListCheck3'} item={'Tasks'} onClick={() => navigate('/task')}/>
                    <SidebarItem icon={'RiFileChartLine'} item={'Generate Reports'}/>
                    <SidebarItem icon={'RiCommandLine'} item={'Placeholder'}/>
                </div>
            </section>
            <div className='px-5 w-full justify-end flex flex-col'>
                {/* profile */}
                <div className='flex justify-between items-center rounded-md bg-[#coc8ca] shadow-lg hover:bg-[#aab7b7] p-2 cursor-pointer' onClick={() => visible ? setVisible(false) : setVisible(true)}>
                    <div className='flex gap-4 items-center'>
                        <RiUser3Line size={22} color='black'/>
                        <div>
                            <p className='text-sm'>{data.username}</p>
                            <p className='text-xs'>{data.email}</p>
                        </div>
                    </div>
                    <RiExpandUpDownLine size={18} color='black' className='justify-self-end'/>
                </div>
            </div>

            {visible &&
                <div className='w-3/4 h-fit bg-white absolute bottom-2 ml-60 rounded-md z-50 shadow-lg p-1'>
                    <SidebarModal icon={'RiUser3Line'} item={'View profile'}/>  
                    <SidebarModal icon={'RiSettings4Line'} item={'Account Settings'} onClick={() => {navigate('/profile'); setVisible(false)}}/>  
                    <SidebarModal icon={'RiLogoutBoxRLine'} item={'Log out'} onClick={() => {setIsOpen(true); setVisible(false)}}/>  
                </div>
            }

            {projVisible &&
                <div className='w-full h-fit bg-white absolute top-20 ml-60 rounded-md z-10 shadow-lg p-1'>
                    <p className='text-gray-400 px-2 py-1 text-sm'>Projects</p>
                    <>
                        {projVal.map((val, index) => (
                            <ProjectModal item={val.project_title} key={index} onClick={() => {setValProj(val.project_title); setProjVisible(false); setProject(val.project_id)}}/> 
                        ))}
                    </>
                    <div className={`border-t border-gray-400 py-1 ${data.role === 'manager' ? '' : 'hidden'}`}>
                        <button className='p-2 hover:bg-[rgb(170,183,183)]/75 w-full text-sm flex gap-3 rounded-sm items-center' onClick={() => {setProjOpen(true); setProjVisible(false)}}>
                        <div className='border border-gray-400 p-1 rounded-md'> 
                            <RiAddLine size={18} color='#1a2d42'/>
                        </div>
                        Create project  
                        </button>
                    </div>
                </div>
            }
        </aside>


        {isOpen &&
            <div className='flex flex-col justify-center items-center w-screen h-screen bg-black/50 absolute z-50'>
                <div className='bg-white p-5 rounded-md w-1/4 flex flex-col gap-2'>
                    <p className='text-lg font-semibold'>Are you sure you want to log out?</p>
                    <p className='text-sm font-light text-gray-400'>You will be returned to the login page and need to log in again to access your account.</p>
                    <div className='flex items-center justify-end gap-2'>
                        <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => setIsOpen(false)}>Cancel</p>
                        <p className='px-3 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={() => {setIsOpen(false);  logout(); <Navigate to={'/'}/>}}>Log out</p>
                    </div>
                </div>
            </div>
        }  

        {projOpen &&
            <div className='flex flex-col justify-center items-center w-screen h-screen bg-black/50 absolute z-50'>
                <div className='bg-white p-5 rounded-md w-2/6 flex flex-col gap-10'>
                    <div>
                        <p className='text-2xl font-semibold'>Create New Project</p>
                        <p className='text-gray-400'>Create your new project</p>
                    </div>
                    <form className='grid gap-4'>
                        <div>
                            <p className='font-semibold text-sm'>Project Title</p>
                            <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm' value={title} placeholder='Project' onChange={(e) => {setTitle(e.target.value); console.log(title)}} maxLength={30} required/>
                        </div>
                        <div className='flex items-center justify-end gap-2'>
                            <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => {setProjOpen(false)}}>Cancel</p>
                            <button className='px-3 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' type='submit' onClick={() => handleCreate()}>Create</button>
                        </div>
                    </form>
                    
                </div>
            </div>
        }
    </div>
  )
}

export default SideBar  