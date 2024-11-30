import React, { useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'
import {Formik} from 'formik'
import InputField from './InputField'

const SignUp = () => {
  const [togglePass, setTogglePass] = useState(false)
  const signUpSchema = yup.object().shape({
    firstname: yup.string().max(20, 'You have reached the maximum limit').required(),
    lastname: yup.string().max(20, 'You have reached the maximum limit').required() ,
    email: yup.string().email().required(),
    username: yup.string().max(20).required(),
    password: yup.string().min(8).max(20).required()
  })

  return (
   <div className='flex flex-col h-screen'>
    <div className='flex flex-1'>
      <section className='flex-1 p-4 font-poppins items-center'>
        <div className='w-full h-full flex items-center justify-end'>
          <Formik
            initialValues={{firstname: '', lastname: '', email: '', username: '', password: ''}}
            validationSchema={signUpSchema}
            onSubmit={(val, action) => {

            }}
          >
          {(props) => (
            <div className='flex flex-col gap-y-10'>
              <div className='flex flex-col gap-3'>
                <h1 className='font-semibold text-4xl'>Create an account</h1>
                <p className='text-base'>Please enter your personal details.</p>
              </div>

              {/* FORMS */}
              <div className='flex flex-col gap-y-9'>
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
                  <InputField type={'password'} placeholder={'Password'} onChange={props.handleChange('password')} onBlur={props.handleBlur('password')}/>
                </div>
              </div>
            </div>
          )}
          </Formik>
        </div>
      </section>
      <section className='flex-1'>
        
      </section>
    </div>
   </div>
  )
}

export default SignUp