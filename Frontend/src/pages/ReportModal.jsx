import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

// Pass isOpen, onClose, and the specific postId as props
export default function ReportModal({ isOpen, onClose, postId }) {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggested reasons for a safe community space
  const reasons = [
    'Harassment or Bullying',
    'Hate Speech',
    'Spam or Scam',
    'Misinformation',
    'Inappropriate Content',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error('Please select a reason.');
    if (reason === 'Other' && !otherReason.trim()) {
      return toast.error('Please type your reason.');
    }

    const finalReason = reason === 'Other' ? otherReason.trim() : reason;

    setIsSubmitting(true);
    try {
      // Matches your router.post('/report', ...)
      await axios.post(`${import.meta.env.VITE_API_URL}/safety/report`, 
        { postId, reason: finalReason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      toast.success('Post reported successfully. Thank you for keeping our community safe.');
      onClose(); // Close modal on success
    } catch (error) {
      // Handle the duplicate error code 11000 from your backend
      if (error.response?.status === 400) {
        toast.error('You have already reported this post.');
      } else {
        toast.error('Failed to submit report. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900">Report this Post</h3>
          <p className="text-sm text-slate-500 mt-1">
            Help us maintain a safe and empowering environment. Why are you reporting this?
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3 mb-6">
            {reasons.map((r, idx) => (
              <label key={idx} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                <input 
                  type="radio" 
                  name="reason" 
                  value={r} 
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-3 text-slate-700 font-medium">{r}</span>
              </label>
            ))}

            {reason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Please type your reason
                </label>
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  rows={4}
                  placeholder="Type your report reason here..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !reason || (reason === 'Other' && !otherReason.trim())}
              className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ReportModalPage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  return (
    <ReportModal
      isOpen={true}
      postId={postId}
      onClose={() => navigate(-1)}
    />
  );
}