import Login from './login/page';
import Signup from './signup/page';
import FacebookLogin from './login/facebook';
import ResetPassword from './forget-password/reset_password';
import ForgetPassword from './forget-password/page';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />\
          <Route path='/signup' element={<Signup />} />
          <Route path='/facebook-login' element={<FacebookLogin />} />
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
