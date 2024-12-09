import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './Context'

const ProtectedRoutes = () => {
  const { user } = useAuth()
  return user ? <Outlet/> : <Navigate to={'/'} replace/>
}

export default ProtectedRoutes