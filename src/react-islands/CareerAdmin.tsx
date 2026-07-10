import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ';

// Reading data remains perfectly fine via the public client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Must match your server environment variable exactly
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

    // Keeping direct read protocol (Safe as long as Read is public)
    const fetchAllJobs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (err: any) {
            setError('Failed to fetch jobs: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllJobs();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // MODIFIED: Post payload through Astro Server Route
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

            setSuccessMessage('Job listing added successfully via secure server channel!');
            setFormData({ title: '', department: '', experience: '', description: '' });
            fetchAllJobs();
        } catch (err: any) {
            setError('Error adding job: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // MODIFIED: Toggle visibility through Astro Server Route
    const toggleJobStatus = async (id: string, currentStatus: boolean) => {
        const nextStatus = !currentStatus;

        // Optimistic UI Switch
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
            // Rollback local state if server route fails
            setJobs(prevJobs =>
                prevJobs.map(job => job.id === id ? { ...job, is_active: currentStatus } : job)
            );
            alert(`Failed to update status: ${err.message}`);
        }
    };

    // MODIFIED: Delete layout through Astro Server Route
    const handleDeleteJob = async (id: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this job opening?')) return;

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

            fetchAllJobs();
        } catch (err: any) {
            alert('Error deleting job: ' + err.message);
        }
    };

    const activeJobs = jobs.filter(job => job.is_active === true || job.is_active === null);
    const hiddenJobs = jobs.filter(job => job.is_active === false);

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6">
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {successMessage}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* LEFT CONTROL FORM */}
                <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit sticky top-24">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Post a New Position</h2>
                    <form onSubmit={handleAddJob} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Clinical Officer"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Department</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                placeholder="e.g., Outpatient / Pediatrics"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Experience Required</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="e.g., 3+ Years"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Job Description & Requirements</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={5}
                                placeholder="Paste duties, qualification metrics, and timeline details here..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm bg-gray-50 whitespace-pre-line"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Publishing...' : 'Publish Job Listing'}
                        </button>
                    </form>
                </div>

                {/* RIGHT SYSTEM LISTS */}
                <div className="lg:col-span-2 space-y-8">
                    {loading ? (
                        <p className="text-gray-500 text-sm font-medium animate-pulse">Synchronizing database entries...</p>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                            <p className="text-gray-400 text-sm font-medium">No job postings found in the system cache.</p>
                        </div>
                    ) : (
                        <>
                            {/* ACTIVE */}
                            <div>
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                                    <h2 className="text-sm font-black uppercase text-green-700 tracking-wider flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping"></span>
                                        Live Openings ({activeJobs.length})
                                    </h2>
                                    <span className="text-xs font-semibold text-gray-400">Visible on Public Portal</span>
                                </div>

                                {activeJobs.length === 0 ? (
                                    <p className="text-xs italic text-gray-400 bg-gray-100 p-4 rounded-lg">No active jobs are currently live for applicants.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {activeJobs.map((job) => (
                                            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-green-500">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-base mb-0.5">{job.title}</h3>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{job.department} &bull; {job.experience}</p>
                                                </div>
                                                <div className="flex items-center gap-2 self-end sm:self-center">
                                                    <button
                                                        onClick={() => toggleJobStatus(job.id, true)}
                                                        className="text-xs font-bold uppercase tracking-wide px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300/60 rounded-lg transition-colors"
                                                    >
                                                        Archive/Hide
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteJob(job.id)}
                                                        className="text-xs font-bold uppercase tracking-wide px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ARCHIVED */}
                            <div>
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                                    <h2 className="text-sm font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
                                        📁 Archived / Hidden Roles ({hiddenJobs.length})
                                    </h2>
                                    <span className="text-xs font-semibold text-gray-400">Hidden From Applicants</span>
                                </div>

                                {hiddenJobs.length === 0 ? (
                                    <p className="text-xs italic text-gray-400 p-2">No historical positions are currently archived.</p>
                                ) : (
                                    <div className="space-y-3 opacity-80">
                                        {hiddenJobs.map((job) => (
                                            <div key={job.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="font-bold text-gray-500 text-base mb-0.5 line-through">{job.title}</h3>
                                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{job.department} &bull; {job.experience}</p>
                                                </div>
                                                <div className="flex items-center gap-2 self-end sm:self-center">
                                                    <button
                                                        onClick={() => toggleJobStatus(job.id, false)}
                                                        className="text-xs font-bold uppercase tracking-wide px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
                                                    >
                                                        Make Live
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteJob(job.id)}
                                                        className="text-xs font-bold uppercase tracking-wide px-3 py-2 bg-transparent hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerAdmin;