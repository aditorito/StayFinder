import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { HomePage } from './pages/HomePage'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { PropertyDetails } from './pages/PropertyDetails'
import { Profile } from './pages/Profile'
import { PropertyListing } from './pages/PropertyListing'
import Payment from './pages/Payment'
import { PrivateRoute } from './components/PrivateRoute'; // 👈 import it



function App() {

  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />


          <Route path='/profile' element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>

          } />
          <Route path='/' element={<HomePage />} />
          <Route path='/listing/:id' element={<PropertyDetails />} />
          <Route path='/newproperty' element={<PropertyListing />} />

          <Route path='/payment' element={<Payment />} />
        </Routes>
      </BrowserRouter>

    </RecoilRoot>
  )
}

export default App
