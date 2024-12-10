import React, { useContext, useEffect, useState } from 'react'
import logo from '../assets/images/logo.png'
import {RiCommandLine, RiExpandUpDownLine, RiEyeCloseLine, RiEyeLine, RiTeamLine, RiUser3Line} from '@remixicon/react'
import SidebarItem from '../reusable/SidebarItem'
import SidebarModal from '../reusable/SidebarModal'
import { useAuth } from '../Context'
import { Navigate, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { Formik } from 'formik'

const SideBar = () => {
    const [visible, setVisible] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [togglePass, setTogglePass] = useState(false)
    const [toggleOld, setToggleOld] = useState(false)
    const [toggleConfirm, setToggleConfirm] = useState(false)
    const { logout, data, del, setDel, changeP, setChangeP} = useAuth()
    const navigate = useNavigate()

    const changePassScheme = yup.object().shape({
        oldPass: yup.string().required('This is a required field').min(8),
        newPass: yup.string().min(8).required('This is a required field'),
        confirmPass: yup.string().oneOf([yup.ref('newPass'), null]).required('This is a required field')
    })

  return (
    <div className='flex w-[15.3rem] h-screen font-poppins'>
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
                <div className='w-full'>
                    {/* pages */}
                    <SidebarItem icon={'RiDashboardHorizontalLine'} item={'Project'}/>
                    <SidebarItem icon={'RiGroupLine'} item={'Members'} onClick={() => navigate('/members')}/>
                    <SidebarItem icon={'RiListCheck3'} item={'Tasks'} onClick={() => navigate('/forgot-pass')}/>
                    <SidebarItem icon={'RiCommandLine'} item={'Placeholder'}/>
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
                <div className='w-3/4 h-fit bg-white absolute bottom-2 ml-60 rounded-md z-10 shadow-lg p-1'>
                    <SidebarModal icon={'RiUser3Line'} item={'View profile'}/>  
                    <SidebarModal icon={'RiSettings4Line'} item={'Account Settings'} onClick={() => {navigate('/profile'); setVisible(false)}}/>  
                    <SidebarModal icon={'RiLogoutBoxRLine'} item={'Log out'} onClick={() => {setIsOpen(true); setVisible(false)}}/>  
                </div>
            }
        </aside>
        {isOpen &&
            <div className='flex flex-col justify-center items-center w-screen h-screen bg-black/50 absolute'>
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
        
        {del && 
            <div className='flex flex-col justify-center items-center w-screen h-screen bg-black/50 absolute z-30'>
                <div className='bg-white p-5 rounded-md w-1/4 flex flex-col gap-2'>
                    <p className='text-lg font-semibold'>Are you sure you want to delete your account?</p>
                    <p className='text-sm font-light text-gray-400'>Your account will be deleted permanently. This action is irreversible.</p>
                    <div className='flex items-center justify-end gap-2'>
                        <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => setDel(false)}>No</p>
                        <p className='px-3 py-2 bg-red-900 text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={() => {setDel(false); logout(); <Navigate to={'/'}/>}}>Yes</p>
                    </div>
                </div>
            </div> 
        }
        {changeP && 
            <div className='flex flex-col justify-center items-center w-screen h-screen bg-black/50 absolute z-30'>
                <div className='bg-white p-5 rounded-md w-2/6 flex flex-col gap-10'>
                    <p className='text-xl font-semibold'>Change Password</p>
                    <Formik
                        initialValues={{oldPass: '', newPass: '', confirmPass: ''}}
                        validationSchema={changePassScheme}
                        onSubmit={(val) => {

                        }}
                    >
                        {(props) => (
                            <div className='grid gap-4'>
                                <div>
                                    <div className='flex justify-between'>
                                        <p className='font-medium text-sm'>Old Password</p>
                                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.oldPass && props.touched.oldPass && props.errors.oldPass}</p>
                                    </div>
                                
                                    <div className='relative flex items-center'>
                                        <input type={toggleOld ? 'text' : 'password'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('oldPass')} onBlur={props.handleBlur('oldPass')}/>
                                        {toggleOld ? <RiEyeLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setToggleOld(false)}/> : <RiEyeCloseLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setToggleOld(true)}/>}
                                    </div>
                                </div>

                                <div>
                                    <div className='flex justify-between'>
                                        <p className='font-medium text-sm'>New Password</p>
                                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.newPass && props.touched.newPass && props.errors.newPass}</p>
                                    </div>
                                    <div className='relative flex items-center'>
                                        <input type= {togglePass ? 'text' : 'password'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('newPass')} onBlur={props.handleBlur('newPass')}/>
                                        {togglePass ? <RiEyeLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePass(false)}/> : <RiEyeCloseLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePass(true)}/>}
                                    </div>
                                </div>

                                <div>
                                    <div className='flex justify-between'>
                                        <p className='font-medium text-sm'>Confirm Password</p>
                                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.confirmPass && props.touched.confirmPass && props.errors.confirmPass}</p>
                                    </div>
                                    <div className='relative flex items-center'>
                                        <input type={toggleConfirm ? 'text' : 'password'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('confirmPass')} onBlur={props.handleBlur('confirmPass')}/>
                                        {toggleConfirm ? <RiEyeLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setToggleConfirm(false)}/> : <RiEyeCloseLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setToggleConfirm(true)}/>}
                                    </div>
                                </div>
                                <div className='flex items-center justify-end gap-2'>
                                    <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => setChangeP(false)}>Cancel</p>
                                    <p className='px-3 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={props.handleSubmit}>Change password</p>
                                </div>
                            </div>
                            
                        )}
                    </Formik>
                    
                </div>
            </div> 
        }

    </div>
  )
}

export default SideBar  