import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const ADMIN_SECRET = 'spmh@admin26';

const CareerAdmin = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        department: '',
        experience: '',
        description: ''
    });

    // Memoized fetch function to prevent unnecessary re-fetches
    const fetchAllJobs = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
            setError('');
        } catch (err: any) {
            setError('Failed to load jobs: ' + err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Only run on mount
    useEffect(() => {
        fetchAllJobs();
    }, []); // Empty dependency array - only once

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddJob = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.department || !formData.experience || !formData.description) {
            setError('All fields are required.');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccessMessage('');

        const cleanId = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

        try {
            const response = await fetch('/api/manage-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'insert',
                    id: cleanId,
                    title: formData.title,
                    department: formData.department,
                    experience: formData.experience,
                    description: formData.description,
                    secret: ADMIN_SECRET
                })
            });

            const result = await response.json();
            if (!response.ok || result.error) throw new Error(result.error || 'Server error occurred.');

            setSuccessMessage('Job listing published successfully!');
            setFormData({ title: '', department: '', experience: '', description: '' });
            await fetchAllJobs(); // Refresh list
        } catch (err: any) {
            setError('Error adding job: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleJobStatus = async (id: string, currentStatus: boolean) => {
        const nextStatus = !currentStatus;

        // Optimistic UI update
        setJobs(prevJobs =>
            prevJobs.map(job => job.id === id ? { ...job, is_active: nextStatus } : job)
        );

        try {
            const response = await fetch('/api/manage-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'toggle',
                    id: id,
                    is_active: nextStatus,
                    secret: ADMIN_SECRET
                })
            });

            const result = await response.json();
            if (!response.ok || result.error) throw new Error(result.error || 'Server error occurred.');
        } catch (err: any) {
            // Rollback if server fails
            setJobs(prevJobs =>
                prevJobs.map(job => job.id === id ? { ...job, is_active: currentStatus } : job)
            );
            setError(`Failed to update status: ${err.message}`);
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (!window.confirm('Permanently delete this job opening?')) return;

        // Optimistic deletion
        const previousJobs = jobs;
        setJobs(prevJobs => prevJobs.filter(job => job.id !== id));

        try {
            const response = await fetch('/api/manage-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete',
                    id: id,
                    secret: ADMIN_SECRET
                })
            });

            const result = await response.json();
            if (!response.ok || result.error) throw new Error(result.error || 'Server error occurred.');
        } catch (err: any) {
            // Rollback on error
            setJobs(previousJobs);
            setError(`Failed to delete: ${err.message}`);
        }
    };

    const activeJobs = jobs.filter(job => job.is_active === true || job.is_active === null);
    const hiddenJobs = jobs.filter(job => job.is_active === false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* ERROR/SUCCESS MESSAGES */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-r-lg text-sm font-medium">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-600 text-green-700 rounded-r-lg text-sm font-medium">
                        {successMessage}
                    </div>
                )}

                {/* LAYOUT: Form on left, list on right (responsive) */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* LEFT: FORM PANEL */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:sticky lg:top-24">
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">New Position</h2>

                            <form onSubmit={handleAddJob} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Position Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Clinical Officer"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 text-sm bg-slate-50"
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Outpatient / Pediatrics"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 text-sm bg-slate-50"
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Experience</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 3+ Years"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 text-sm bg-slate-50"
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Description & Requirements</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={5}
                                        placeholder="Paste duties, qualifications, and timeline..."
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 text-sm bg-slate-50 font-mono text-xs whitespace-pre-wrap"
                                        disabled={submitting}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold uppercase tracking-wider text-xs py-3 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
                                >
                                    {submitting ? 'Publishing...' : 'Publish Listing'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: JOB LISTS */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-xl">
                                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                                <p className="text-sm text-slate-600 font-medium">Loading positions...</p>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-20 bg-white border-2 border-dashed border-slate-300 rounded-xl">
                                <p className="text-slate-500 text-sm font-medium">No job positions in the system yet</p>
                            </div>
                        ) : (
                            <>
                                {/* ACTIVE JOBS */}
                                <div>
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-300">
                                        <h3 className="text-sm font-black uppercase text-green-700 tracking-wider flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            Live Openings ({activeJobs.length})
                                        </h3>
                                        <span className="text-xs font-semibold text-slate-500">Visible to Applicants</span>
                                    </div>

                                    {activeJobs.length === 0 ? (
                                        <p className="text-xs text-slate-400 bg-slate-100 p-4 rounded-lg italic">No active positions currently listed</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {activeJobs.map((job) => (
                                                <div
                                                    key={job.id}
                                                    className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1 truncate">
                                                                {job.title}
                                                            </h4>
                                                            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                                                {job.department} • {job.experience}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <button
                                                                onClick={() => toggleJobStatus(job.id, true)}
                                                                className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                                                                disabled={loading}
                                                            >
                                                                Archive
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteJob(job.id)}
                                                                className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
                                                                disabled={loading}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ARCHIVED JOBS */}
                                {hiddenJobs.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-300">
                                            <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">
                                                📁 Archived ({hiddenJobs.length})
                                            </h3>
                                            <span className="text-xs font-semibold text-slate-500">Hidden from Applicants</span>
                                        </div>

                                        <div className="space-y-3 opacity-70">
                                            {hiddenJobs.map((job) => (
                                                <div
                                                    key={job.id}
                                                    className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-slate-500 text-sm sm:text-base mb-1 line-through truncate">
                                                                {job.title}
                                                            </h4>
                                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                                {job.department} • {job.experience}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <button
                                                                onClick={() => toggleJobStatus(job.id, false)}
                                                                className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                                                disabled={loading}
                                                            >
                                                                Restore
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteJob(job.id)}
                                                                className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                                                                disabled={loading}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerAdmin;