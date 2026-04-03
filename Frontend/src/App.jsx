
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/adminDashboard';
import Register from './pages/Register';
import MentorDashboard from './pages/mentor/MentorDashboard';
import FindMentor from './pages/FindMentor';



function App() {
  

  return (
    <>
      
      <div >
        <Toaster/>
        <Routes>
             <Route path='/register' element={<Register />} />
             <Route path="/login" element={<Login />} />
             <Route path="/admin/*" element={<AdminDashboard />} />
             <Route path='/mentor/*' element={<MentorDashboard />} />
             <Route path='/findmentor' element={<FindMentor />} />
             
        </Routes>
        
        
      </div>
      
    </>
  )
}

export default App
