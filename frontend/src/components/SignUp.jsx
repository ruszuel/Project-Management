import React, { useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'
import {Formik} from 'formik'
import InputField from './InputField'
import pic from '../assets/images/Register.png'
import { RiEyeCloseLine, RiEyeLine, RiEyeOffLine } from '@remixicon/react'

const SignUp = () => {
  const [togglePass, setTogglePass] = useState(false)
  const [confP, setConP] = useState(false)
  const signUpSchema = yup.object().shape({
    firstname: yup.string().max(20, 'You have reached the maximum limit').required(),
    lastname: yup.string().max(20, 'You have reached the maximum limit').required() ,
    email: yup.string().email().required(),
    username: yup.string().max(20).required(),
    password: yup.string().min(8).max(20).required(),
    confPass: yup.string().oneOf([yup.ref('password'), null], "Password doesn't match").required()
  })

  return (
   <div className='bg-white flex-1 flex flex-col px-6'>
    <div className='flex justify-center items-center h-screen'>
      {/* FORMS */}
      <section className='flex-1 font-poppins justify-center flex '>
        <div className='flex flex-col gap-y-10 w-1/2'>
          <div className='flex flex-col gap-3'>
            <h1 className='font-semibold text-4xl'>Create an account</h1>
            <p className='text-base'>Please enter your personal details.</p>
          </div>
          <div className='w-full'>
            <Formik
              initialValues={{firstname: '', lastname: '', email: '', username: '', password: '', confPass: ''}}
              validationSchema={signUpSchema}
              onSubmit={(val, action) => {

              }}
            >
            {(props) => (
              <div className='flex flex-col gap-y-10'>
                {/* FORMS */}
                <section className='flex flex-col gap-y-9'>
                  <div className='flex flex-col gap-y-9 w-full'>
                    <div>
                      <p className='text-red-400 text-sm justify-self-end'>{props.errors.firstname && props.touched.firstname && props.errors.firstname}</p>
                      <InputField type={'text'} placeholder={'Firstname'} onChange={props.handleChange('firstname')} onBlur={props.handleBlur('firstname')}/>
                    </div>
                    <div>
                      <p className='text-red-400 text-sm justify-self-end'>{props.errors.lastname && props.touched.lastname && props.errors.lastname}</p>
                      <InputField type={'text'} placeholder={'Lastname'} onChange={props.handleChange('lastname')} onBlur={props.handleBlur('lastname')}/>
                    </div>
                    <div>
                      <p className='text-red-400 text-sm justify-self-end'>{props.errors.email && props.touched.email && props.errors.email}</p>
                      <InputField type={'email'} placeholder={'Email'} onChange={props.handleChange('email')} onBlur={props.handleBlur('email')}/>
                    </div>
                    <div>
                      <p className='text-red-400 text-sm justify-self-end'>{props.errors.username && props.touched.username && props.errors.username}</p>
                      <InputField type={'text'} placeholder={'Username'} onChange={props.handleChange('username')} onBlur={props.handleBlur('username')}/>
                    </div>
                    <div>
                      <p className='text-red-400 text-sm justify-self-end'>{props.errors.password && props.touched.password && props.errors.password}</p>
                      <div className='flex'>
                          <InputField type={ togglePass ? 'text' : 'password'} placeholder={'Password'} onChange={props.handleChange('password')} onBlur={props.handleBlur('password')}/>
                          {togglePass ? <RiEyeLine size={24} color='gray' className='-ml-8 cursor-pointer' onClick={() => setTogglePass(false)}/> : <RiEyeCloseLine size={24} color='gray' className='-ml-8 cursor-pointer' onClick={() => setTogglePass(true)}/>}
                        </div>
                    </div>   
                    <div>
                      <p className='text-red-400 text-sm justify-self-end'>{props.errors.confPass && props.touched.confPass && props.errors.confPass}</p>
                      <div className='flex'>
                          <InputField type={ confP ? 'text' : 'password'} placeholder={'Re-enter password'} onChange={props.handleChange('confPass')} onBlur={props.handleBlur('confPass')}/>
                          {confP ? <RiEyeLine size={24} color='gray' className='-ml-8 cursor-pointer' onClick={() => setConP(false)}/> : <RiEyeCloseLine size={24} color='gray' className='-ml-8 cursor-pointer' onClick={() => setConP(true)}/>}
                        </div>
                    </div> 
                  </div>
                </section>
                <button type="submit" className='bg-black text-white p-4 rounded-md mb-4 hover:bg-gray-700'>Register</button>
                <div className='flex gap-x-1 items-center justify-center'>
                  <p>Already have an account? </p>
                  <a href="/" className='font-medium underline'> Log in</a>
                </div>
              </div>
            )}
            </Formik>
          </div>
        </div>
      </section>

      <section className='flex-1'>
      <div className='flex flex-1 relative justify-center items-center'>
        <div className='relative flex'> 
          <div className='h-[28rem] w-[28rem] bg-[#B4E9FF] absolute z-0'></div>
          <div className='h-[28rem] w-[28rem] bg-yellow-100 mt-[18rem] ml-48 z-20'></div>
        </div>
        <img src={pic} className='z-20 absolute w-[36rem]'/>
      </div>
      </section>
    </div>
   </div>
  )
}

export default SignUp