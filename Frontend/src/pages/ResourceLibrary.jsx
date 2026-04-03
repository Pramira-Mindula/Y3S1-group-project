import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Email Sharing State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [emailToShare, setEmailToShare] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const categories = ['Legal', 'Health', 'Career', 'Safety'];
  const safeResources = Array.isArray(resources) ? resources : [];

  useEffect(() => {
    fetchResources();
  }, [page, category, search]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Building the query string
      const queryParams = new URLSearchParams({ page, limit: 6 });
      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/resources?${queryParams}`);
      const incomingResources = Array.isArray(response.data?.resources) ? response.data.resources : [];
      setResources(incomingResources);
      const incomingTotalPages = Number.isInteger(response.data?.totalPages) && response.data.totalPages > 0 ? response.data.totalPages : 1;
      setTotalPages(incomingTotalPages);
    } catch (error) {
      toast.error('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/resources/share`, {
        resourceId: selectedResourceId,
        email: emailToShare
      });
      toast.success('Resource shared successfully!');
      setShareModalOpen(false);
      setEmailToShare('');
    } catch (error) {
      toast.error('Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const openShareModal = (id) => {
    setSelectedResourceId(id);
    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Filters */}
        <div className="mb-10 text-center md:text-left md:flex justify-between items-end">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Resource Library</h1>
            <p className="text-slate-600">Helpful guides and documents for your journey.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Search resources..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <select 
              value={category} 
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading resources...</div>
        ) : safeResources.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-xl shadow-sm">No resources found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeResources.map(resource => (
              <div key={resource._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition">
                <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-1 rounded-full w-max mb-4">
                  {resource.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{resource.title}</h3>
                <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
                  {resource.content}
                </p>
                
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                  {resource.link ? (
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-bold hover:text-teal-800 text-sm">
                      Read More &rarr;
                    </a>
                  ) : <span/>}
                  
                  <button 
                    onClick={() => openShareModal(resource._id)}
                    className="text-slate-500 hover:text-teal-600 text-sm flex items-center gap-1 font-medium transition"
                  >
                    ✉️ Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <span className="px-4 py-2 text-slate-600">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        )}

        {/* Share Modal */}
        {shareModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold mb-2 text-slate-900">Share via Email</h3>
              <p className="text-sm text-slate-500 mb-4">Enter an email address to send this resource directly to their inbox.</p>
              <form onSubmit={handleShare}>
                <input 
                  type="email" required placeholder="Enter email address" 
                  value={emailToShare} onChange={(e) => setEmailToShare(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded mb-4 focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShareModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded transition">Cancel</button>
                  <button type="submit" disabled={sendingEmail} className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-70">
                    {sendingEmail ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}