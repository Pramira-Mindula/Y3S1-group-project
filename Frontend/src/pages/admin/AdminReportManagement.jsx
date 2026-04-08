import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminReportManagement() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [statusValue, setStatusValue] = useState("");
    const [comment, setComment] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            // CHANGED: Updated from /safety/reports to /api/reports to match backend
            const response = await axios.get(import.meta.env.VITE_API_URL + '/safety/reports', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReports(response.data);
        } catch (error) {
            toast.error('Failed to load Reports');
            console.error("Fetch Reports Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Open popup
    const handleOpenReport = (report) => {
        setSelectedReport(report);
        setStatusValue(report.status);
        setComment(report.actionComment || ""); // pre-fill if exists
    };

    // Close popup
    const handleClose = () => {
        setSelectedReport(null);
        setStatusValue("");
        setComment("");
    };

    // Enable if something changed
    const hasChanges = selectedReport && (
        statusValue !== selectedReport.status ||
        comment !== (selectedReport.actionComment || "")
    );

    // Save changes
    const handleSave = async () => {
        setSaving(true);
        try {
            // CHANGED: Updated from /safety/reports to /api/reports
            await axios.put(
                `${import.meta.env.VITE_API_URL}/safety/reports/${selectedReport._id}`,
                { status: statusValue, actionComment: comment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            toast.success('Report updated successfully!');
            setReports(prev =>
                prev.map(r => r._id === selectedReport._id ? { ...r, status: statusValue } : r)
            );
            handleClose();
        } catch (error) {
            toast.error('Failed to update report');
            console.error("Save Error:", error);
        } finally {
            setSaving(false);
        }
    };

    // NEW: Delete Report Function
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this report?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/safety/reports/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Report deleted successfully');
            setReports(prev => prev.filter(r => r._id !== id));
        } catch (error) {
            toast.error('Failed to delete report');
        }
    };

    // Format date
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

    if (loading) return <div className="p-6 text-center text-slate-600 font-bold">Loading Reports...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Report Management</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wide border-b border-slate-200">
                            <th className="p-4 font-semibold">Report ID</th>
                            <th className="p-4 font-semibold">Reported By</th>
                            <th className="p-4 font-semibold">Post Title</th>
                            <th className="p-4 font-semibold">Reason</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="p-4 font-mono text-sm text-purple-700 font-medium">
                                    #{report._id.slice(-8).toUpperCase()}
                                </td>
                                <td className="p-4 text-slate-700">{report.reportedBy?.username || "Unknown"}</td>
                                <td className="p-4 text-slate-700">{report.postId?.title || "Not Available"}</td>
                                <td className="p-4 text-slate-700 max-w-[150px] truncate">{report.reason}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        report.status === 'Dismissed' ? 'bg-slate-200 text-slate-700' :
                                        report.status === 'Resolved'  ? 'bg-teal-100 text-teal-800' :
                                        'bg-amber-100 text-amber-800'
                                    }`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center space-x-2 flex justify-center">
                                    <button
                                        onClick={() => handleOpenReport(report)}
                                        className="cursor-pointer flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDelete(report._id)}
                                        className="cursor-pointer flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reports.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-medium">No reports found. The community is safe!</div>
                )}
            </div>

            {/* ===================== POPUP MODAL ===================== */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-purple-700 rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-bold text-white">Report Details</h3>
                                <p className="text-xs text-purple-200 font-mono mt-1">#{selectedReport._id.toUpperCase()}</p>
                            </div>
                            <button onClick={handleClose} className="text-purple-200 hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1 bg-slate-50">

                            {/* ── Post Section ── */}
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                                <div className="bg-purple-50 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
                                    <span className="text-sm font-bold text-purple-700 uppercase tracking-wider">Reported Post</span>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-3">
                                    <Field label="Title"       value={selectedReport.postId?.title      || "Not Available"} />
                                    <Field label="Category"    value={selectedReport.postId?.category   || "—"} />
                                    <Field label="Description" value={selectedReport.postId?.description || "—"} span />
                                </div>
                            </div>

                            {/* ── Reported By Section ── */}
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                                <div className="bg-teal-50 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
                                    <span className="text-sm font-bold text-teal-700 uppercase tracking-wider">Reporter Info</span>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-3">
                                    <Field label="Username" value={selectedReport.reportedBy?.username || "Unknown"} />
                                    <Field label="Email"    value={selectedReport.reportedBy?.email    || "—"} />
                                    <Field label="Reason"   value={selectedReport.reason} span />
                                </div>
                            </div>

                            {/* ── Admin Action Section (Editable) ── */}
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                                <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Admin Action</span>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                                        <select
                                            value={statusValue}
                                            onChange={(e) => setStatusValue(e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Dismissed">Dismissed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Action Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={3}
                                            placeholder="Describe the action taken..."
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white rounded-b-2xl">
                            <button
                                onClick={handleClose}
                                className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !hasChanges}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 disabled:cursor-not-allowed transition shadow-sm"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Reusable read-only field component ──
function Field({ label, value, span }) {
    return (
        <div className={span ? "col-span-2" : ""}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm text-slate-800 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">{value}</p>
        </div>
    );
}