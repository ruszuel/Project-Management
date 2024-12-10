import React, { useState } from 'react'
import ProfileFields from '../reusable/ProfileFields'
import { useAuth } from '../Context'
import { RiEyeCloseLine, RiEyeLine } from '@remixicon/react'
import * as yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'

const Profile = () => {
    const { setDel, setChangeP, data} = useAuth()
    const [isDisable, setIsDisable] = useState(true)
    const [togglePass, setTogglePass] = useState(false)

    const profileScheme = yup.object().shape({
        firstname: yup.string().required().max(20),
        lastname: yup.string().required().max(20)
    })

  return (
    <div className='p-7 px-10 font-poppins flex flex-col h-screen gap-10'> 
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
                    <input type={togglePass ? 'text' : 'password'} className='w-full p-3 pr-12 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' disabled={true} defaultValue={data.password}/>
                    {togglePass ? <RiEyeLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePass(false)}/> : <RiEyeCloseLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePass(true)}/>}
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
    </div>
  )
}

export default Profile