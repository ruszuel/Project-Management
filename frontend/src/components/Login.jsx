import React, { useState } from 'react'
import * as yup from 'yup'
import { Formik } from 'formik'
import InputField from './InputField'
import { RiEyeCloseLine, RiEyeLine, RiEyeOffLine } from '@remixicon/react'
import { useNavigate } from "react-router-dom";
import pic from '../assets/images/Login.png'
import logo from '../assets/images/logo.png'
import axios from 'axios'
import { useAuth } from '../Context'

const Login = () => {
  const [togglePass, setTogglePass] = useState(false)
  const navigate = useNavigate()
  const {login} = useAuth()

  const loginScheme = yup.object().shape({
    email: yup.string().required('Please provide an email or username'),
    password: yup.string().required('Please provide a password')
  })

  return (
    <div className='bg-white flex-1 flex flex-col px-6'>
      <div className='flex justify-center items-center h-full'>
        <section className='flex-1 h-screen flex'>
          <div className='absolute top-0 flex items-center'>
            <div>
              <img src={logo} alt="" width={80}/>
            </div>
            <div></div>
            <p className='font-poppins font-semibold text-xl w-full text-blue-800'>Project <span className='text-orange-400'>Sync</span></p>
          </div>
          {/* images */} 
          <div className='flex flex-1 relative justify-center items-center'>
            <div className='relative flex'> 
              <div className='h-[22rem] w-[22rem] bg-[#B4E9FF] rounded-full absolute mt-20 ml-14 z-0'></div>
              <div className='h-[35rem] w-[35rem] bg-yellow-100 rounded-full mt-48 ml-48 z-20'></div>
            </div>
            <img src={pic} className='z-20 absolute w-[36rem]'/>
          </div>
        </section>

        {/* FORMS */}
        <section className='flex-1 font-poppins justify-center flex'>
          <div className='flex flex-col gap-y-10 w-1/2'>
            <div className='flex flex-col gap-3'>
              <h1 className='font-semibold text-4xl'>Welcome back</h1>
              <p className='text-lg'>Welcome back! Please enter your details</p>
            </div>
            <div className='w-full'>
              <Formik
                initialValues={{email: '', password: ''}}
                validationSchema={loginScheme}
                onSubmit={async(values, actions) => {
                  const data = {
                    usermail: values.email,
                    password: values.password
                  }

                  try {
                    const response = await axios.post('http://127.0.0.1:8000/api/login', data)
                    console.log('response data', response.data)
                    if(response.status === 200){
                      localStorage.setItem('user', JSON.stringify(response.data))
                      login()
                      navigate('/home')
                    }
                  } catch (error) {
                    console.log(error)
                    if(error.response.status === 404){
                      actions.setFieldError('email', 'Invalid credentials')
                      actions.setFieldError('password', 'Invalid credentials')
                    }
                  }
                }}
              >
                {(props) => (
                  <div className='flex flex-col gap-y-10'>
                    <section className='flex flex-col gap-y-5'>
                      <div className='flex flex-col'>
                        <div className='flex justify-end h-6'>
                          <p className={`text-red-400 text-sm justify-self-end ${props.errors.email && props.touched.email ? 'visible' : 'invisible'}`}>{props.errors.email && props.touched.email && props.errors.email}</p>
                        </div>  
                        <InputField type={'text'} placeholder={'Email or username'} onChange={props.handleChange('email')} onBlur={props.handleBlur('email')}/>
                      </div>
                      <div className='flex flex-col'>
                        <div className='flex justify-end items-start h-6'>
                          <p className={`text-red-400 text-sm justify-self-end ${props.errors.password && props.touched.password ? 'visible' : 'invisible'}`}>{props.errors.password && props.touched.password && props.errors.password}</p>
                        </div> 
                        <div className='flex'>
                          <InputField type={ togglePass ? 'text' : 'password'} placeholder={'Password'} onChange={props.handleChange('password')} onBlur={props.handleBlur('password')}/>
                          {togglePass ? <RiEyeLine size={24} color='gray' className='-ml-8 cursor-pointer' onClick={() => setTogglePass(false)}/> : <RiEyeCloseLine size={24} color='gray' className='-ml-8 cursor-pointer' onClick={() => setTogglePass(true)}/>}
                        </div>
                      </div>
                      <div className='flex justify-end'>
                        <a href="/forgot-pass" className='justify-self-end underline'>Forgot password</a>
                      </div>
                    </section> 
                    <button type="submit" className='bg-black text-white p-4 rounded-md mb-4 hover:bg-gray-700' onClick={props.handleSubmit}>Log In</button>
                    <div className='flex gap-x-1 items-center justify-center'>
                      <p>Don't have an account? </p>
                      <a href="/sign-up" className='font-medium underline'> Sign up for free</a>
                    </div>
                  </div>
                )}
              </Formik>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login