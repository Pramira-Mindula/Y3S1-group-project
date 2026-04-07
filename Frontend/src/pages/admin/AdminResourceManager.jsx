import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminResourceManager() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'Safety', content: '', link: '' });

  const categories = ['Legal', 'Health', 'Career', 'Safety'];

  useEffect(() => {
    fetchAdminResources();
  }, []);

  const fetchAdminResources = async () => {
    try {
      // Admins usually want to see everything without pagination limits in standard tables, 
      // or a high limit. Adjust limit as needed.
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/resources?limit=50`);
      setResources(response.data.resources);
    } catch (error) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setFormData({ title: '', category: 'Safety', content: '', link: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (resource) => {
    setFormData({ 
      title: resource.title, 
      category: resource.category, 
      content: resource.content, 
      link: resource.link || '' 
    });
    setEditingId(resource._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        // Update
        await axios.put(`${import.meta.env.VITE_API_URL}/resources/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Resource updated!');
      } else {
        // Create
        await axios.post(`${import.meta.env.VITE_API_URL}/resources`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Resource created!');
      }
      setIsModalOpen(false);
      fetchAdminResources(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/resources/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Resource deleted');
      fetchAdminResources();
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Resource Manager</h2>
          <p className="text-slate-500 text-sm">Add, edit, or remove platform resources.</p>
        </div>
        <button onClick={openCreateModal} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg shadow font-medium transition">
          + Add New Resource
        </button>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600 uppercase tracking-wider">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map(res => (
                <tr key={res._id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-medium text-slate-800">{res.title}</td>
                  <td className="p-4">
                    <span className="bg-fuchsia-100 text-fuchsia-800 px-2 py-1 rounded text-xs font-bold">
                      {res.category}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-3">
                    <button onClick={() => openEditModal(res)} className="text-teal-600 hover:text-teal-800 font-medium text-sm">Edit</button>
                    <button onClick={() => handleDelete(res._id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-slate-900">
              {editingId ? 'Edit Resource' : 'Create New Resource'}
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-teal-500">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">External Link (Optional)</label>
                <input type="url" name="link" value={formData.link} onChange={handleInputChange} placeholder="https://..." className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Content / Description</label>
                <textarea required name="content" rows="4" value={formData.content} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded transition">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition font-bold">
                  {editingId ? 'Save Changes' : 'Create Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}