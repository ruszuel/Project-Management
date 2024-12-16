import './App.css'
import {Routes, Route} from 'react-router-dom'
import  Home  from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import ForgotPass from './components/ForgotPass'
import ProtectedRoutes from './ProtectedRoutes'
import Layout from './Layout'
import Members from './components/Members'
import Profile from './components/Profile'
import Task from './components/Task'
import ProjectSchedule from './components/ProjectSchedule'
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route element={<ProtectedRoutes/>}>
          <Route element={<Layout/>}>
            <Route path='/home' element={<Home/>}/>
            <Route path='/forgot-pass' element={<ForgotPass/>}/>
            <Route path='/members' element={<Members/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/task' element={<Task/>}/>
            <Route path ='/projectschedule' element={<ProjectSchedule/>}/>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
