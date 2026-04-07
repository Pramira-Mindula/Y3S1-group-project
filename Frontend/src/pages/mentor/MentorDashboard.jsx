import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import CreateSession from './CreateSession';
import MentorProfile from './MentorProfile';

export default function MentorDashboard() {
  const navigate = useNavigate();

    const handleLogout = () => {    
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* 1. Sidebar */}
      <div className="w-[300px] bg-gray-800 text-white flex flex-col">
        <div className="p-5 text-xl font-bold border-b border-gray-700">
          Mentor Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/mentor" className="block px-4 py-2 rounded hover:bg-gray-700">
            Dashboard Home
          </Link>
            <Link to="/mentor/sessions" className="block px-4 py-2 rounded hover:bg-gray-700">
            Create Sessions
          </Link>
          <Link to="/mentor/profile" className="block px-4 py-2 rounded hover:bg-gray-700"> 
            My Profile
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
            <main className="p-6 flex-1 overflow-y-auto">       
                <Routes>
                    <Route index element={
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Dashboard Home</h2>
                            <div className="bg-white p-6 rounded shadow">Welcome to your mentor dashboard!</div>
                        </div>
                    } />
                    <Route path="sessions" element={
                        <CreateSession/>
                    } />
                    <Route path="profile" element={
                        <MentorProfile/>
                    } />
                </Routes>
            </main>
        </div>
    </div>
  );
}