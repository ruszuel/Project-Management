import React from 'react'

const InputField = (props) => {
  return (
    <input type={props.type} placeholder={props.placeholder} className='w-full border-0 border-b border-gray-400 bg-transparent text-lg pb-2 focus:outline-none focus:border-black' onChange={props.onChange} onBlur={props.onBlur} />
  )
}

export default InputField