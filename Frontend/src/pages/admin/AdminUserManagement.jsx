import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Component එක ලෝඩ් වෙද්දිම Users ලව අරන් එනවා
  useEffect(() => {
    fetchUsers();
  }, []);

  // 1. ඔක්කොම Users ලව Database එකෙන් ගන්නවා (Controller: getAllUsers)
  const fetchUsers = async () => {
    try {
      // ඔයාගේ Main route එක '/api/auth' හෝ '/auth' වෙන්න පුළුවන්. ඒක හරියටම දාගන්න.
      const response = await axios.get(import.meta.env.VITE_API_URL + '/auth/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error("Fetch Users Error:", error);
    } finally {
      setLoading(false);
    }
  };

 // 2. Mentor කෙනෙක්ව Approve කරනවා (Controller: verifyMentor)
  const handleApprove = async (userId) => {
    try {
      await axios.put(import.meta.env.VITE_API_URL + `/auth/verify-mentor/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Mentor Approved Successfully!');
      
      // Page එක Refresh කරන්නේ නැතුව UI එක අප්ඩේට් කරනවා
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, mentorDetails: { ...user.mentorDetails, isVerified: true } } 
          : user
      ));
    } catch (error) {
      toast.error('Approval failed!');
      console.error("Approve Error:", error);
    }
  };
 
  // 3. User කෙනෙක්ව Delete කරනවා (Controller: deleteUser)
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('User deleted successfully!');
      
      // Delete කරපු User ව Table එකෙන් අයින් කරනවා
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user!');
      console.error("Delete Error:", error);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600 font-bold">Loading Users Data...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User & Mentor Management</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white text-sm">
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
                
              <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{user.username}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                
                {/* Role Badge */}
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'mentor' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>

                {/* Status Column (Only applicable for Mentors) */}
                <td className="p-4 text-sm font-semibold">
                  {user.role === 'mentor' ? (
                    user.mentorDetails?.isVerified 
                      ? <span className="text-green-600">✅ Verified</span> 
                      : <span className="text-orange-500">⏳ Pending Approval</span>
                  ) : (
                    <span className="text-gray-500">Active</span>
                  )}
                </td>

                {/* Action Buttons */}
                <td className="p-4 text-center space-x-2 flex justify-center items-center">
                  
                  {/* Approve Button (Only for Pending Mentors) */}
                  {user.role === 'mentor' && !user.mentorDetails?.isVerified && (
                    <button 
                      onClick={() => handleApprove(user._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md shadow text-sm font-bold transition"
                    >
                      Approve
                    </button>
                  )}

                  {/* Delete Button (For everyone except Admin) */}
                  {user.role !== 'admin' ? (
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md shadow text-sm font-bold transition"
                    >
                      Delete
                    </button>
                  ) : (
                     <span className="text-gray-400 text-xs font-bold italic">Admin Action Disabled</span>
                  )}

                </td>
              </tr>
        ))}
          </tbody>
        </table>
        
        {/* If no users exist */}
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-medium">No users found in the system.</div>
        )}
      </div>
    </div>
  );
}