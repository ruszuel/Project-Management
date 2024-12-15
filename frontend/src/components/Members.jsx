import { RiAddCircleLine, RiArrowDownSLine, RiArrowUpSLine, RiEyeCloseLine, RiEyeLine, RiSettingsLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react'
import { useAuth, useTask } from '../Context';
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup'
import MemberAction from '../reusable/MemberAction';
import { Toaster, toast } from 'sonner'

const Members = () => {
  const { logout, data } = useAuth()
  const [members, setMembers] = useState([])
  const [togglePass, setTogglePass] = useState(false)
  const [toggleModal, setToggleModal] = useState(false)
  const [toggleAdd, setToggleAdd] = useState(false)
  const [toggleAddList, setToggleAddList] = useState(false)
  const [userdata, setUserdata] = useState([])
  const [membersdata, setMembersData] = useState([])
  const [allMember, setAllMember] = useState([])
  const [delProjID, setDelProjID] = useState('')
  const [delMemID, setDelMemID] = useState('')
  const [addVal, setAddVal] = useState('')
  const { project } = useTask()
  const managers = JSON.parse(localStorage.getItem('user'));


  const checkMember = async () => {
    const users = await axios.get('http://127.0.0.1:8000/api/retrieve_member')
    setMembersData(users.data)
  }

  const checkAllMembers = async () => {
    const users = await axios.post('http://127.0.0.1:8000/api/retrieve_all_mem', { manager: data.manager_id })
    setAllMember(users.data)
  }

  useEffect(() => {
    const checkUSer = async () => {
      const users = await axios.get('http://127.0.0.1:8000/api/retrieve')
      setUserdata(users.data)
    }

    checkUSer()
    checkMember()
    checkAllMembers()
  }, [toggleModal])

  const retrieveData = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/retrieve_mem_proj', { projectID: project })
      if (res && res.status === 200) {
        setMembers(res.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (project) {
      retrieveData()
    }
  }, [project, toggleModal])

  const onDelete = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/del_member', { projID: delProjID, username: delMemID })
      if (res && res.status === 200) {
        retrieveData()
        checkAllMembers()
        delToast()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const permadDelete = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/rm_member', { projID: delProjID, username: delMemID })
      if (res && res.status === 200) {
        retrieveData()
        checkAllMembers()
        delToast()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const memberSchema = yup.object().shape({
    firstname: yup.string().required('required'),
    lastname: yup.string().required('required'),
    username: yup.string().required('required').test('is-existing-username', 'Username already exist', (val) => { return !userdata.map(values => values.username).includes(val) }).test('is-existing-username', 'Username already exist', (val) => { return !membersdata.map(values => values.username).includes(val) }),
    email: yup.string().email().required('required').test('is-existing-email', 'Email already exist', (val) => { return !userdata.map(values => values.email).includes(val) }).test('is-existing-email', 'Email already exist', (val) => { return !membersdata.map(values => values.email).includes(val) }),
    password: yup.string().min(8).required('required')
  })

  const addMemSchema = yup.object().shape({
    member: yup.string().required()
  })
  const notify = () => toast.success("Added successfully");
  const delToast = () => toast.success('Deleted successfully')
  const addToast = () => toast.success('Member added successfully')
  return (
    <div className='flex w-full h-screen p-5 font-poppins bg-gray-300 relative'>
      <Toaster richColors position="top-right" duration={3000} toastOptions={{
        className: 'text-base'
      }} />
      <div className='flex-1 bg-white rounded-lg shadow-md p-10 py-14 h-full gap-6 flex flex-col'>
        <div>
          <p className='font-semibold text-2xl'>Members</p>
          <p className='text-gray-400'>Here's a list of the members in the project!</p>
        </div>
        <div>
          <div className='flex w-full justify-end gap-5'>
            <button className={`bg-[#1A2D42] text-white text-sm p-2 rounded-md flex items-center gap-1 hover:bg-[#1A2D42]/50 ${data.role === 'manager' ? '' : 'hidden'}`} onClick={() => { project && setToggleAdd(true) }}> <RiAddCircleLine size={18} color='white' /> Add member</button>
            <button className={`bg-[#1A2D42] text-white text-sm p-2 rounded-md flex items-center gap-1 hover:bg-[#1A2D42]/50 ${data.role === 'manager' ? '' : 'hidden'}`} onClick={() => { project && setToggleModal(true) }}> <RiAddCircleLine size={18} color='white' /> Create member</button>
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
                {data.role === 'manager' ? <th className="border border-gray-400 px-4 py-2">Actions</th> : ''}

              </tr>
            </thead>
            <tbody className='text-center'>

              {members.map((mem, index) => (
                <tr className='text-sm' key={index}>
                  <td className="border border-gray-400 px-4 py-2">{mem.firstname}</td>
                  <td className="border border-gray-400 px-4 py-2">{mem.lastname}</td>
                  <td className="border border-gray-400 px-4 py-2">{mem.username}</td>
                  <td className="border border-gray-400 px-4 py-2">{mem.email}</td>
                  {data.role === 'manager' ?
                    <td className="border border-gray-400 px-4 py-2" onClick={() => { setDelMemID(mem.username); setDelProjID(project) }}><MemberAction click={() => onDelete()} del={() => permadDelete()} /></td> : ''
                  }
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
              initialValues={{ firstname: '', lastname: '', username: '', email: '', password: '' }}
              validationSchema={memberSchema}
              onSubmit={async (val, action) => {
                checkMember()
                const data = {
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
                  if (ress && ress.status === 200) {
                    setToggleModal(false)
                    retrieveData()
                    checkMember()
                    notify()
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
                      <input type={'text'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('firstname')} onBlur={props.handleBlur('firstname')} />
                    </div>
                    <div className='w-full'>
                      <div className='flex justify-between'>
                        <p className='font-medium text-sm'>Lastname</p>
                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.lastname && props.touched.lastname && props.errors.lastname}</p>
                      </div>
                      <input type={'text'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('lastname')} onBlur={props.handleBlur('lastname')} />
                    </div>
                  </div>

                  <div className='flex gap-4'>
                    <div className='w-full'>
                      <div className='flex justify-between'>
                        <p className='font-medium text-sm'>Username</p>
                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.username && props.touched.username && props.errors.username}</p>
                      </div>
                      <input type={'text'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('username')} onBlur={props.handleBlur('username')} />
                    </div>
                    <div className='w-full'>
                      <div className='flex justify-between'>
                        <p className='font-medium text-sm'>Email</p>
                        <p className='text-red-400 text-sm justify-self-end'>{props.errors.email && props.touched.email && props.errors.email}</p>
                      </div>
                      <input type={'email'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('email')} onBlur={props.handleBlur('email')} />
                    </div>
                  </div>
                  <div>
                    <div className='flex justify-between'>
                      <p className='font-medium text-sm'>Password</p>
                      <p className='text-red-400 text-sm justify-self-end'>{props.errors.password && props.touched.password && props.errors.password}</p>
                    </div>

                    <div className='relative flex items-center'>
                      <input type={togglePass ? 'text' : 'password'} className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400' onChange={props.handleChange('password')} onBlur={props.handleBlur('password')} />
                      {togglePass ? <RiEyeLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePass(false)} /> : <RiEyeCloseLine size={24} color='gray' className='absolute right-0 mr-3 cursor-pointer' onClick={() => setTogglePass(true)} />}
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

      {toggleAdd &&
        <div className='flex flex-col justify-center items-center inset-0 bg-black/50 fixed z-30 font-poppins'>
          <div className='bg-white p-5 rounded-md w-1/5 flex text-left flex-col gap-10'>
            <div className='text-left'>
              <p className='text-2xl font-semibold'>Add member</p>
              <p className='text-gray-400'>Add member to your project</p>
            </div>
            <Formik
              initialValues={{ member: '' }}
              validationSchema={addMemSchema}
              onSubmit={async (val) => {
                console.log(addVal)
                try {
                  const user = await axios.post('http://127.0.0.1:8000/api/add_member', {username: val.member, proj_id: project})
                  if(user && user.status === 200){
                    addToast()
                    retrieveData()
                    setToggleAdd(false)
                  }
                } catch (error) {
                  console.log(error)
                }
              }}
            >
              {(prop) => (
                <form className='flex flex-col gap-8' onSubmit={() => setToggleAdd(false)}>
                  <div>
                    <div className='w-full'>
                      <div className='flex justify-between'>
                        <p className='font-semibold text-sm'>Members</p>
                        <p className='text-red-400 text-sm justify-self-end'>{prop.errors.member && prop.touched.member && prop.errors.member}</p>
                      </div>
                      <div className='flex items-center relative'>
                        <input type='text' className='w-full p-3 border border-gray-400 rounded-md focus:outline-gray-400 text-sm disabled:text-gray-400 cursor-pointer' onClick={() => toggleAddList ? setToggleAddList(false) : setToggleAddList(true)} readOnly onChange={prop.handleChange('member')} onBlur={prop.handleBlur('member')} placeholder='Select member' value={prop.values.member} />
                        {toggleAddList ? <RiArrowUpSLine size={18} className='absolute right-3' /> : <RiArrowDownSLine size={18} className='absolute right-3' />}

                        <div className={`bg-white z-30 shadow-md absolute bottom-1 -mb-24 w-full overflow-y-scroll h-20  border border-gray-400 rounded-md no-scrollbar ${toggleAddList ? '' : 'hidden'}`}>
                          {allMember.map((val, index) => (
                            <p className='text-sm p-2 cursor-pointer hover:bg-[#AAB7B7]' key={index} onClick={() => { setToggleAddList(false); setAddVal(val.member_id); prop.setFieldValue('member', val.username) }}>{val.username}</p>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className='flex items-center justify-end gap-2'>
                    <p className='px-3 py-2 border-gray-400/50 border rounded-md hover:bg-gray-200/50 text-sm cursor-pointer' onClick={() => setToggleAdd(false)}>Cancel</p>
                    <p className='px-3 py-2 bg-[#1A2D42] text-white rounded-md hover:bg-[#D4D8DD] text-sm cursor-pointer' onClick={prop.handleSubmit}>Add</p>
                  </div>
                </form>
              )}
            </Formik>

          </div>
        </div>
      }
    </div>
  )
}

export default Members