import Login from './login/page';
import Signup from './signup/page';
import FacebookLogin from './login/facebook';
import ResetPassword from './forget-password/reset_password';
import ForgetPassword from './forget-password/page';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './homepage/page';
import Profile from './profile/page';
import UserProfile from './sidebar/userprofile';

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
          <Route path="/home" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<UserProfile />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
