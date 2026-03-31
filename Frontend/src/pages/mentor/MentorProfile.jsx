import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MentorProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    expertise: '',
    bio: '',
    experienceYears: '',
    linkedinUrl: ''
  });

  // 1. Fetch Mentor Profile on load
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Replace with your exact endpoint to get the logged-in user's profile
      const response = await axios.get(import.meta.env.VITE_API_URL + '/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const userData = response.data;
      setUser(userData);
      
      // Populate form data (handle nested mentorDetails safely)
      setFormData({
        username: userData.username || '',
        phone: userData.phone || '',
        expertise: userData.mentorDetails?.expertise || '',
        bio: userData.mentorDetails?.bio || '',
        experienceYears: userData.mentorDetails?.experienceYears || '',
        linkedinUrl: userData.mentorDetails?.linkedinUrl || ''
      });
    } catch (error) {
      toast.error('Failed to load profile.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit Profile Updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // The payload structure depends on your backend model. 
      // We send basic info and nest the mentor details.
      const updatePayload = {
        username: formData.username,
        phone: formData.phone,
        mentorDetails: {
          expertise: formData.expertise,
          bio: formData.bio,
          experienceYears: formData.experienceYears,
          linkedinUrl: formData.linkedinUrl
        }
      };

      // Replace with your exact endpoint for updating a profile
      const response = await axios.put(import.meta.env.VITE_API_URL + '/auth/profile', updatePayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Profile updated successfully!');
      setUser(response.data.user || response.data); // Update local user state
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-teal-600 font-bold">Loading your profile...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-slate-50">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-slate-800">My Profile</h2>
          <p className="text-slate-600">Manage your personal details and mentorship focus.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-bold transition shadow"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Profile Header Block */}
        <div className="bg-slate-800 p-6 text-white flex items-center gap-4">
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-2xl font-bold uppercase shadow-inner">
            {user?.username?.charAt(0) || 'M'}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.username}</h3>
            <p className="text-slate-300 text-sm">{user?.email}</p>
            <span className="mt-1 inline-block bg-teal-500/20 text-teal-300 text-xs font-bold px-2 py-0.5 rounded border border-teal-500/30 uppercase tracking-wide">
              Verified Mentor
            </span>
          </div>
        </div>

        {/* --- VIEW MODE --- */}
        {!isEditing ? (
          <div className="p-8 grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact & Basic Info</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="font-medium text-slate-800">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">LinkedIn Profile</p>
                  {user?.mentorDetails?.linkedinUrl ? (
                    <a href={user.mentorDetails.linkedinUrl} target="_blank" rel="noreferrer" className="text-teal-600 font-medium hover:underline break-all">
                      {user.mentorDetails.linkedinUrl}
                    </a>
                  ) : (
                    <p className="font-medium text-slate-800">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Mentorship Details</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Expertise / Focus Area</p>
                  <p className="font-medium text-slate-800">{user?.mentorDetails?.expertise || 'General Support'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Years of Experience</p>
                  <p className="font-medium text-slate-800">{user?.mentorDetails?.experienceYears ? `${user.mentorDetails.experienceYears} Years` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">About Me (Bio)</p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded mt-1 border border-slate-100">
                    {user?.mentorDetails?.bio || 'No bio written yet.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          
          /* --- EDIT MODE --- */
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Basic Info</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Username</label>
                  <input 
                    type="text" name="username" required
                    value={formData.username} onChange={handleChange}
                    className="p-2.5 rounded border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Email Address <span className="text-xs text-slate-400 font-normal">(Cannot be changed)</span></label>
                  <input 
                    type="email" disabled value={user?.email}
                    className="p-2.5 rounded border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Phone Number</label>
                  <input 
                    type="tel" name="phone"
                    value={formData.phone} onChange={handleChange}
                    className="p-2.5 rounded border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">LinkedIn URL</label>
                  <input 
                    type="url" name="linkedinUrl" placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedinUrl} onChange={handleChange}
                    className="p-2.5 rounded border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Mentorship Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Mentorship Details</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Primary Expertise</label>
                  <input 
                    type="text" name="expertise" placeholder="e.g., Career Growth, Work-Life Balance, Tech..."
                    value={formData.expertise} onChange={handleChange}
                    className="p-2.5 rounded border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Years of Experience</label>
                  <input 
                    type="number" name="experienceYears" min="0" placeholder="e.g., 5"
                    value={formData.experienceYears} onChange={handleChange}
                    className="p-2.5 rounded border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">About Me (Bio)</label>
                  <textarea 
                    name="bio" rows="5" required
                    placeholder="Tell mentees about your journey and how you can help them..."
                    value={formData.bio} onChange={handleChange}
                    className="p-2.5 rounded border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 justify-end pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  // Reset form to last known user data
                  setFormData({
                    username: user.username || '',
                    phone: user.phone || '',
                    expertise: user.mentorDetails?.expertise || '',
                    bio: user.mentorDetails?.bio || '',
                    experienceYears: user.mentorDetails?.experienceYears || '',
                    linkedinUrl: user.mentorDetails?.linkedinUrl || ''
                  });
                }}
                className="px-6 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" disabled={saving}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-lg font-bold transition shadow disabled:bg-teal-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}