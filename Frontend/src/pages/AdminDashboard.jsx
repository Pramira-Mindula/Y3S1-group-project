import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import AdminUserManagement from './admin/AdminUserManagement';
// import AdminMentorAdd from './AdminMentorAdd'; // 💡 ඔයා තාම මේ ෆයිල් එක හැදුවේ නැත්නම් මේක මෙහෙම Comment කරලා තියන්න

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* 1. Sidebar */}
      <div className="w-[300px] bg-gray-800 text-white flex flex-col">
        <div className="p-5 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* මෙතන /admin කියලා ලින්ක් හැදුවා */}
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-gray-700 bg-gray-700/50">
            Dashboard Home
          </Link>
          
          <Link to="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-700">
            User Management
          </Link>

          
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-bold"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col"> 
        {/* p-6 කියන padding එක අනිවාර්යයෙන් තියෙන්න ඕනේ ලස්සනට පේන්න */}
        <main className="p-6 flex-1 overflow-y-auto">
            
            {/* Nested Routes */}
            <Routes>
              {/* /admin වලට ආවාම පෙන්වන එක */}
              <Route path="/" element={
                <div>
                  <h2 className="text-2xl font-bold mb-4">Orders / Home Dashboard</h2>
                  <div className="bg-white p-6 rounded shadow">Welcome to the main dashboard!</div>
                </div>
              } />

              

              {/* /admin/users වලට ආවාම පෙන්වන එක */}
              <Route path="/users" element={
               <AdminUserManagement />
              } />
            </Routes>

        </main>
      </div>

    </div>
  );
}