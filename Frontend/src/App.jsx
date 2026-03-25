
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/adminDashboard';
import Register from './pages/Register';



function App() {
  

  return (
    <>
      
      <div >
        <Toaster/>
        <Routes>
             <Route path='/register' element={<Register />} />
             <Route path="/login" element={<Login />} />
             <Route path="/admin/*" element={<AdminDashboard />} />
             
        </Routes>
        
        
      </div>
      
    </>
  )
}

export default App
