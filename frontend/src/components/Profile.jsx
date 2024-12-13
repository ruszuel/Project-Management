import React, { useState } from 'react'
import ProfileFields from '../reusable/ProfileFields'
import { useAuth } from '../Context'
import { RiEyeCloseLine, RiEyeLine } from '@remixicon/react'
import * as yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const {del, setDel, data, logout} = useAuth()
    const [isDisable, setIsDisable] = useState(true)
    const [togglePassword, setTogglePassword] = useState(false)

    const [togglePass, setTogglePass] = useState(false)
    const [toggleOld, setToggleOld] = useState(false)
    const [toggleConfirm, setToggleConfirm] = useState(false)
    const [changeP, setChangeP] = useState(false)
    const navigate = useNavigate()

    const profileScheme = yup.object().shape({
        firstname: yup.string().required().max(20),
        lastname: yup.string().required().max(20)
    })

    const changePassScheme = yup.object().shape({
        oldPass: yup.string().required('This is a required field').min(8),
        newPass: yup.string().min(8).required('This is a required field'),
        confirmPass: yup.string().oneOf([yup.ref('newPass'), null], 'Password doesn\'t match').required('This is a required field')
    })

    const deleteAccount = async () => {
        console.log(data.username)
        const datass = {
            username: data.username
        }
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/delete_account', datass)
            if(res.status && res.status === 200){
                setDel(false)
                logout()
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='p-7 px-10 font-poppins flex flex-col h-screen gap-10 relative'> 
        <div>
            <div>
                <p className='text-2xl font-semibold'>Account & Settings</p>
            </div>
        </div>
        {/* holder ng mga cards */}
        <div className='border border-gray-400 w-3/5 h-96 rounded-lg shadow-md justify-between p-4 flex flex-col gap-4 ml-24'>
            <p className='text-xl font-semibold mb-6'>Basic Details</p>

            <Formik
                initialValues={{firstname: '' || data.firstname, lastname: '' || data.lastname}}
                validationSchema={profileScheme}
                enableReinitialize
                onSubmit={ async(val, action) => {
                    const updatedData = {
                        username: data.username,
                        firstname: val.firstname,
                        lastname: val.lastname
                    }
                    try {
                        const res = await axios.post('http://127.0.0.1:8000/api/update_profile', updatedData)
                        if(res.status && res.status === 200){
                            setIsDisable(true)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    
                }}
            >
                {(props) => (
                    <>
                        <div className='flex flex-col gap-8 mb-6'>
                            <div className='flex gap-4'>
                                <ProfileFields title={'First Name'} value={props.values.firstname} disabled={isDisable} onChange={props.handleChange('firstname')} onBlur={props.handleBlur('firstname')}/>
                                <ProfileFields title={'Last Name'} value={props.values.lastname} disabled={isDisable} onChange={props.handleChange('lastname')} onBlur={props.handleBlur('lastname')}/>
                            </div>

                            <div className='flex gap-3'>
                                <ProfileFields title={'Username'} value={data.username} disabled={true}/>
                                <ProfileFields title={'Email'} value={data.email} disabled={true}/>
                            </div>
                        </div>

                        <div className='flex items-center justify-end gap-2'>
                            <p className='px-5 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => setIsDisable(false)}>Edit</p>
                            <p className='px-5 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={props.handleSubmit}>Save</p>
                        </div>
                    </>
                )}
            </Formik>
           
        </div>
        <div className='border border-gray-400 w-3/5 h-40 rounded-lg shadow-md p-4 ml-24'>
            {/* Password and Change Password */}
            <p className='text-xl font-semibold mb-6'>Password Manager</p>
            <div className='flex justify-between items-center'>
                <div className='w-[50%] relative flex items-center'>
                    <input type={togglePassword ? 'text' : 'password'} className='w-full p-3 pr-12 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' disabled={true} defaultValue={data.password}/>
                    {togglePassword ? <RiEyeLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePassword(false)}/> : <RiEyeCloseLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePassword(true)}/>}
                </div>
                
                <div className='flex items-center justify-end gap-2'>
                    <p className='px-5 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={() => setChangeP(true)}>Change Password</p>
                </div>
            </div>  
            
        </div>
        <div className='border border-gray-400 w-3/5 h-32 rounded-lg shadow-md p-4 ml-24'>
            {/* Delete Account */}
            <p className='text-xl font-semibold mb-6'>Delete Account</p>
            <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-400'>Delete your account and all of your source data. This action is irreversible.</p>
                <p className='px-5 py-2 bg-red-900 text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={() => setDel(true)}>Delete Account</p>            
            </div>
        </div>


        {del && 
            <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
                <div className='bg-white p-5 rounded-md w-1/4 flex flex-col gap-2'>
                    <p className='text-lg font-semibold'>Are you sure you want to delete your account?</p>
                    <p className='text-sm font-light text-gray-400'>Your account will be deleted permanently. This action is irreversible.</p>
                    <div className='flex items-center justify-end gap-2'>
                        <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => setDel(false)}>No</p>
                        <p className='px-3 py-2 bg-red-900 text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={deleteAccount}>Yes</p>
                    </div>
                </div>
            </div> 
        }

        {changeP && 
            <div className='flex flex-col justify-center items-center inset-0 bg-black/50 z-50 fixed'>
                <div className='bg-white p-5 rounded-md w-2/6 flex flex-col gap-10'>
                    <p className='text-xl font-semibold'>Change Password</p>
                    <Formik
                        initialValues={{oldPass: '', newPass: '', confirmPass: ''}}
                        validationSchema={changePassScheme}
                        onSubmit={async (val, action) => {
                            const datas = {
                                username: data.username,
                                oldPass: val.oldPass,
                                password: val.confirmPass
                            }

                            try {
                                const res = await axios.post('http://127.0.0.1:8000/api/change_pass', datas)
                                if(res.status && res.status === 200){
                                    setChangeP(false)
                                    logout()
                                }
                            } catch (error) {
                                if(error.response.status === 400)
                                    action.setFieldError('oldPass', 'Incorrect password. Please try again.')
                                    console.log('boss mali')
                            }
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

export default Profile