import './App.css'
import {Routes, Route} from 'react-router-dom'
import  Home  from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import ForgotPass from './components/ForgotPass'
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/forgot-pass' element={<ForgotPass/>}/>
      </Routes>
    </div>
  )
}

export default App
