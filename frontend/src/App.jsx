import './App.css'
import {Routes, Route} from 'react-router-dom'
import  Home  from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import ForgotPass from './components/ForgotPass'
import ProtectedRoutes from './ProtectedRoutes'
import Layout from './Layout'
import Members from './components/Members'
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
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
