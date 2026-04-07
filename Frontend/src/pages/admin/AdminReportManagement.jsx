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

    //enable if something changed
    const hasChanges = selectedReport && (
        statusValue !== selectedReport.status ||
        comment !== (selectedReport.actionComment || "")
    );

    // Save changes
    const handleSave = async () => {
        setSaving(true);
        try {
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

    // Format date
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

    if (loading) return <div className="p-6 text-center text-gray-600 font-bold">Loading Reports...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Report Management</h2>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white text-sm">
                            <th className="p-4">Report ID</th>
                            <th className="p-4">Reported By</th>
                            <th className="p-4">Post Title</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                                <td className="p-4 font-mono text-sm text-gray-700">
                                    #{report._id.slice(-8).toUpperCase()}
                                </td>
                                <td className="p-4 text-gray-600">{report.reportedBy?.username || "Unknown"}</td>
                                <td className="p-4 text-gray-600">{report.postId?.title || "Not Available"}</td>
                                <td className="p-4 text-gray-600 max-w-[150px] truncate">{report.reason}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        report.status === 'Dismissed' ? 'bg-red-100 text-red-700' :
                                        report.status === 'Resolved'  ? 'bg-green-100 text-green-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleOpenReport(report)}
                                        className="cursor-pointer flex items-center gap-1.5 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
                                    >
                                        {/* Eye Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reports.length === 0 && (
                    <div className="p-8 text-center text-gray-500 font-medium">No reports found.</div>
                )}
            </div>

            {/* ===================== POPUP MODAL ===================== */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-100 backdrop-blur-[1px] px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-800 rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-bold text-white">Report Details</h3>
                                <p className="text-s text-gray-400 font-mono mt-1">#{selectedReport._id.toUpperCase()}</p>
                            </div>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">

                            {/* ── Post Section ── */}
                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                                <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">Post</span>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-3">
                                    <Field label="Title"       value={selectedReport.postId?.title       || "Not Available"} />
                                    <Field label="Category"    value={selectedReport.postId?.category    || "—"} />
                                    <Field label="Description" value={selectedReport.postId?.description || "—"} span />
                                    <Field label="Posted On"   value={formatDate(selectedReport.postId?.createdAt)} span />
                                </div>
                            </div>

                            {/* ── Reported By Section ── */}
                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                                <div className="bg-purple-50 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-sm font-bold text-purple-700 uppercase tracking-wider">Reported By</span>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-3">
                                    <Field label="Username" value={selectedReport.reportedBy?.username || "Unknown"} />
                                    <Field label="Email"    value={selectedReport.reportedBy?.email    || "—"} />
                                </div>
                            </div>

                            {/* ── Report Section ── */}
                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                                <div className="bg-orange-50 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    </svg>
                                    <span className="text-sm font-bold text-orange-700 uppercase tracking-wider">Report</span>
                                </div>
                                <div className="p-4 grid grid-cols-2 gap-3">
                                    <Field label="Reason"     value={selectedReport.reason} span />
                                    <Field label="Reported On" value={formatDate(selectedReport.createdAt)} />
                                    <Field label="Last Updated" value={formatDate(selectedReport.updatedAt)} />
                                </div>
                            </div>

                            {/* ── Admin Action Section (Editable) ── */}
                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                                <div className="bg-green-50 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    <span className="text-sm font-bold text-green-700 uppercase tracking-wider">Admin Action</span>
                                </div>
                                <div className="p-4 space-y-4">
                                    {/* Status Dropdown */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                                        <select
                                            value={statusValue}
                                            onChange={(e) => setStatusValue(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Dismissed">Dismissed</option>
                                        </select>
                                    </div>
                                    {/* Comment Box */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Admin Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={3}
                                            placeholder="Describe the action taken..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-300 bg-gray-50 rounded-b-2xl">
                            <button
                                onClick={handleClose}
                                className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !hasChanges}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition shadow-sm"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save Changes
                                    </>
                                )}
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
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm text-gray-800 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">{value}</p>
        </div>
    );
}

//ashennsandeepa@gmail.com
//987654321