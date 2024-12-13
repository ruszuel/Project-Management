import { RiAddCircleLine, RiEyeCloseLine, RiEyeLine, RiSettingsLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react'
import { useAuth, useTask } from '../Context';
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup'

const Members = () => {
  const { logout, data} = useAuth()
  const [members, setMembers] = useState([])
  const [togglePass, setTogglePass] =useState(false)
  const [toggleModal, setToggleModal] =useState(false)
  const [userdata, setUserdata] = useState([])
  const [membersdata, setMembersData] = useState([])
  const {project} = useTask()
  const managers = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const checkUSer = async () => {
      const users = await axios.get('http://127.0.0.1:8000/api/retrieve')
      setUserdata(users.data)
    }
    const checkMember = async () => {
      const users = await axios.get('http://127.0.0.1:8000/api/retrieve_member')
      setMembersData(users.data)
    }
    checkUSer()
    checkMember()
  }, [])

  const retrieveData = async () => {
    try{
      const res = await axios.post('http://127.0.0.1:8000/api/members', {project: project, manager: data.manager_id})
      if(res && res.status === 200){
        setMembers(res.data)
      }
    }catch(err){
      console.log(err)
    }
  }
  
  useEffect(() => {
    if(project){
      retrieveData()
    } 
  }, [project])

  const memberSchema = yup.object().shape({
    firstname: yup.string().required('required'),
    lastname: yup.string().required('required'),
    username: yup.string().required('required').test('is-existing-username', 'Username already exist', (val) => {return !userdata.map(values => values.username).includes(val)}).test('is-existing-username', 'Username already exist', (val) => {return !membersdata.map(values => values.username).includes(val)}),
    email: yup.string().email().required('required').test('is-existing-email', 'Email already exist', (val) => {return !userdata.map(values => values.email).includes(val)}).test('is-existing-email', 'Email already exist', (val) => {return !membersdata.map(values => values.email).includes(val)}),
    password: yup.string().min(8).required('required')
  })

  return (
    <div className='flex w-full h-screen p-5 font-poppins bg-gray-300 relative'>
      <div className='flex-1 bg-white rounded-lg shadow-md p-10 py-14 h-full gap-6 flex flex-col'>
        <div>
          <p className='font-semibold text-2xl'>Members</p>
          <p className='text-gray-400'>Here's a list of the members in the project!</p>
        </div>
        <div>
          <div className='flex w-full justify-end'>
            <button className='bg-[#1A2D42] text-white text-sm p-2 rounded-md flex items-center gap-1 hover:bg-[#1A2D42]/50' onClick={() => {project && setToggleModal(true)}}> <RiAddCircleLine size={18} color='white'/> Add member</button>
          </div>
        </div>
        <div className="rounded-md">
          <table className="w-full border-collapse border border-gray-400 rounded-md">
              <thead className="">
                  <tr className='text-sm'>
                      <th className="border border-gray-400 px-4 py-2">Firstname</th>
                      <th className="border border-gray-400 px-4 py-2">Lastname</th>
                      <th className="border border-gray-400 px-4 py-2">Username</th>
                      <th className="border border-gray-400 px-4 py-2">Email</th>
                      <th className="border border-gray-400 px-4 py-2">Actions</th>
                  </tr>
              </thead>
              <tbody className='text-center'>

                  {members.map((mem, index) => (
                      <tr className='text-sm' key={index}>
                          <td className="border border-gray-400 px-4 py-2">{mem.firstname}</td>
                          <td className="border border-gray-400 px-4 py-2">{mem.lastname}</td>
                          <td className="border border-gray-400 px-4 py-2">{mem.username}</td>
                          <td className="border border-gray-400 px-4 py-2">{mem.email}</td>
                          <td className="px-4 py-2 grid place-items-center"><RiSettingsLine size={18}/></td>
                      </tr>
                  ))}
                  
              </tbody>
          </table>
        </div>
      </div>

      {toggleModal &&          
      <div className='flex flex-col justify-center items-center inset-0 bg-black/50 z-50 fixed'>
        <div className='bg-white p-5 rounded-md w-2/6 flex flex-col gap-10'>
            <p className='text-xl font-semibold'>Create member</p>
            <Formik
                initialValues={{firstname: '', lastname: '', username: '', email: '', password:''}}
                validationSchema={memberSchema}
                onSubmit={async (val, action) => {
                    const data={
                      project: project,
                      manager: managers.manager_id,
                      firstname: val.firstname,
                      lastname: val.lastname,
                      username: val.username,
                      email: val.email,
                      password: val.password
                    }
                    try {
                      const ress = await axios.post('http://127.0.0.1:8000/api/create_member', data)
                      if(ress && ress.status === 200){
                        setToggleModal(false)
                        retrieveData()
                      }
                    } catch (error) {
                      console.log(error)
                    }
                    
                }}
            >
                {(props) => (
                    <div className='flex flex-col gap-4'>
                      <div className='flex gap-4'>
                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <p className='font-medium text-sm'>Firstname</p>
                                <p className='text-red-400 text-sm justify-self-end'>{props.errors.firstname && props.touched.firstname && props.errors.firstname}</p>
                            </div>
                              <input type={'text'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('firstname')} onBlur={props.handleBlur('firstname')}/>
                        </div>
                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <p className='font-medium text-sm'>Lastname</p>
                                <p className='text-red-400 text-sm justify-self-end'>{props.errors.lastname && props.touched.lastname && props.errors.lastname}</p>
                            </div>
                              <input type={'text'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('lastname')} onBlur={props.handleBlur('lastname')}/>
                        </div>
                      </div>

                      <div className='flex gap-4'>
                        <div className='w-full'>
                            <div className='flex justify-between'>
                              <p className='font-medium text-sm'>Username</p>
                              <p className='text-red-400 text-sm justify-self-end'>{props.errors.username && props.touched.username && props.errors.username}</p>
                          </div>
                              <input type={'text'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('username')} onBlur={props.handleBlur('username')}/>
                        </div>
                        <div className='w-full'>
                            <div className='flex justify-between'>
                              <p className='font-medium text-sm'>Email</p>
                              <p className='text-red-400 text-sm justify-self-end'>{props.errors.email && props.touched.email && props.errors.email}</p>
                            </div>
                            <input type={'email'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('email')} onBlur={props.handleBlur('email')}/>
                        </div>
                      </div>
                      <div>
                          <div className='flex justify-between'>
                            <p className='font-medium text-sm'>Password</p>
                            <p className='text-red-400 text-sm justify-self-end'>{props.errors.password && props.touched.password && props.errors.password}</p>
                        </div>
                      
                          <div className='relative flex items-center'>
                            <input type={togglePass ? 'text' : 'password'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('password')} onBlur={props.handleBlur('password')}/>
                            {togglePass ? <RiEyeLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePass(false)}/> : <RiEyeCloseLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePass(true)}/>}
                          </div>
                      </div>
                      <div className='flex items-center justify-end gap-2'>
                        <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => setToggleModal(false)}>Cancel</p>
                        <p className='px-3 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={props.handleSubmit}>Create</p>
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

export default Members