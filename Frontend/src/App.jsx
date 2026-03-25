
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Test from './pages/test'
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/adminDashboard';



function App() {
  

  return (
    <>
      
      <div >
        <Toaster/>
        <Routes>
             
             <Route path="/" element={<Login />} />
             <Route path="/admin/*" element={<AdminDashboard />} />
             <Route path="/test" element={<Test />} />
        </Routes>
        
        
      </div>
      
    </>
  )
}

export default App
