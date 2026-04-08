import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import AdminAllPosts from './pages/CommunityPosts/AdminAllPosts'; 
import MentorDashboard from './pages/mentor/MentorDashboard';

import Community from "./pages/CommunityPosts/pages/Community";
import SinglePost from "./pages/CommunityPosts/pages/SinglePost";
import MyPosts from "./pages/CommunityPosts/pages/MyPosts";
import ChatbotWidget from "./pages/chatbot/ChatbotWidget";


import ResourceLibrary from './pages/ResourceLibrary';

// --- NEW IMPORTS ---
// Make sure the paths match where you saved these new files!
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import MenteeDashboard from './pages/MenteeDashboard';
import Aboutus from './pages/Aboutus';

function App() {
  const location = useLocation();
  const showHeaderFooter = !location.pathname.startsWith('/admin') && location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <>
      {/* flex-col and min-h-screen push the footer to the bottom */}
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Toaster/>
        
        {/* 1. Header sits at the top of every page */}
        {showHeaderFooter && <Header/>}
         <>
      
        <ChatbotWidget />
        </>

        {/* 2. Main content area (flex-grow fills the empty space) */}
        <main className="flex-grow">
          <Routes>
               {/* --- New Home Page Route --- */}
               <Route path="/" element={<Home/>} />

               {/* --- Your Existing Routes --- */}
               <Route path='/register' element={<Register />} />
               <Route path="/login" element={<Login />} />
               <Route path="/admin/*" element={<AdminDashboard />} />
               <Route path='/mentor/*' element={<MentorDashboard />} />
               <Route path='/profile' element={<Profile />} />
               <Route path='/menteedash' element={<MenteeDashboard />} />
                <Route path='/resources' element={<ResourceLibrary />} />
                <Route path='/about' element={<Aboutus />} />

                 <Route path="/community" element={<Community />} />
                 <Route path="/post/:id" element={<SinglePost />} />
                 <Route path="/my-posts" element={<MyPosts />} />
          </Routes>
        </main>
        
        {/* 3. Footer sits at the bottom of every page */}
        {showHeaderFooter && <Footer/>}
        
      </div>
    </>
  )
}

export default App