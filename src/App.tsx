import Login from './login/page';
import FacebookLogin from './login/facebook';
import Signup from './signup/page';
import ForgetPassword from './forget-password/page';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />\
          <Route path='/facebook-login' element={<FacebookLogin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forget-password' element={<ForgetPassword />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
