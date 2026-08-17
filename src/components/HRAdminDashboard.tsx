import React, { useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { AuthContext } from './HRAdminAuthGate';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_ACADEMICS_URL,
    import.meta.env.PUBLIC_SUPABASE_ACADEMICS_ANON_KEY
);

interface Application {
    id: string; // Verify your Supabase primary key is exactly "id" and not "application_id"
    full_name: string;
    email: string;
    phone: string;
    home_institution: string;
    rotation_type: string;
    duration_text: string;
    start_date: string;
    end_date: string;
    cover_letter: string;
    reference_code: string;
    status: 'submitted' | 'under_review' | 'approved' | 'declined';
    edit_count: number;
    hr_feedback: string | null;
    hr_reviewed_by: string | null;
    hr_reviewed_at: string | null;
    created_at: string;
    student_id?: string; // Added to fix the TS warning in your notification block
}

export default function HRAdminDashboard() {
    const { user, handleLogout } = useContext(AuthContext);

    const [applications, setApplications] = useState<Application[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [reviewingId, setReviewingId] = useState<string | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [applications, searchTerm, statusFilter]);

    const fetchApplications = async () => {
        setLoading(true);
        setError('');
        try {
            const { data, error: fetchError } = await supabase
                .from('internship_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) {
                console.error('Fetch error:', fetchError);
                throw fetchError;
            }

            setApplications(data || []);
        } catch (err: any) {
            console.error('Error loading applications:', err);
            setError(err.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let filtered = applications;

        if (searchTerm) {
            filtered = filtered.filter(
                (app) =>
                    app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.home_institution.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter((app) => app.status === statusFilter);
        }

        setFilteredApplications(filtered);
    };

    const handleReviewApplication = async (
        applicationId: string,
        decision: 'approved' | 'declined'
    ) => {
        setReviewLoading(true);
        setError('');

        try {
            const app = applications.find((a) => a.id === applicationId);
            if (!app) throw new Error('Application not found');

            const { error: updateError } = await supabase
                .from('internship_applications')
                .update({
                    status: decision,
                    hr_feedback: reviewNotes || null,
                    hr_reviewed_at: new Date().toISOString(),
                })
                .eq('id', applicationId);

            if (updateError) throw updateError;

            const { error: notifError } = await supabase
                .from('application_notifications')
                .insert([
                    {
                        student_id: app.student_id || null,
                        application_id: applicationId,
                        type: 'status_update',
                        title: decision === 'approved' ? '✓ Application Approved' : '✗ Application Declined',
                        message:
                            decision === 'approved'
                                ? 'Congratulations! Your application has been approved.'
                                : 'Thank you for your application. Unfortunately, it has been declined.',
                        read: false,
                    },
                ]);

            if (notifError) throw notifError;

            await fetch('/api/send-application-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentEmail: app.email,
                    studentName: app.full_name,
                    status: decision,
                    feedback: reviewNotes,
                }),
            });

            setSuccess(`Application ${decision} and email sent`);
            setReviewingId(null);
            setReviewNotes('');
            fetchApplications();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            console.error('Review error:', err);
            setError(err.message || 'Failed to review application');
        } finally {
            setReviewLoading(false);
        }
    };

    const exportToCSV = () => {
        const csv = Papa.unparse(filteredApplications);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredApplications);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Applications');
        XLSX.writeFile(wb, `applications-${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleLogoutClick = async () => {
        try {
            await handleLogout();
            // FIX 1: Force a redirect after the session clears
            window.location.href = '/login';
        } catch (err: any) {
            console.error('Logout error:', err);
            setError('Failed to logout');
        }
    };

    const stats = {
        total: applications.length,
        submitted: applications.filter((a) => a.status === 'submitted').length,
        approved: applications.filter((a) => a.status === 'approved').length,
        declined: applications.filter((a) => a.status === 'declined').length,
    };

    return (
        <div className='min-h-screen bg-[#F7F9FB]'>
            {/* Header */}
            <div className='border-b border-[#D8E0E7] bg-white sticky top-0 z-40'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <img
                            src='/images/spmh-logo.svg'
                            alt='SPMH'
                            className='h-8 w-auto'
                        />
                        <h1 className="font-['Playfair_Display'] text-lg font-semibold text-[#125276]">
                            Academics Manager
                        </h1>
                    </div>
                    <div className='flex items-center gap-4'>
                        <span className="font-['Outfit'] text-sm text-[#7A8A96]">
                            {user?.email}
                        </span>
                        <button
                            type="button" // FIX 2: Prevent accidental form submission
                            onClick={handleLogoutClick}
                            className="font-['Outfit'] text-sm bg-[#860f0f] text-white px-4 py-2 rounded-sm hover:bg-[#6B0B09] transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-6 py-8'>
                {error && (
                    <div className="mb-6 p-4 bg-[#860f0f]/10 border border-[#860f0f]/30 rounded-sm text-[#860f0f] font-['Outfit'] text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-[#1565c0]/10 border border-[#1565c0]/30 rounded-sm text-[#1565c0] font-['Outfit'] text-sm">
                        {success}
                    </div>
                )}

                {/* Stats Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                    {[
                        { label: 'Total', value: stats.total, color: 'bg-[#1565c0]' },
                        { label: 'Submitted', value: stats.submitted, color: 'bg-[#7A8A96]' },
                        { label: 'Approved', value: stats.approved, color: 'bg-[#16a34a]' },
                        { label: 'Declined', value: stats.declined, color: 'bg-[#860f0f]' },
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className={`${stat.color} rounded-sm p-6 text-white shadow-md`}>
                            <p className="font-['Outfit'] text-sm font-medium opacity-90 mb-2">
                                {stat.label}
                            </p>
                            <p className="font-['Playfair_Display'] text-3xl font-bold">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters & Export */}
                <div className='bg-white border border-[#D8E0E7] rounded-sm p-6 mb-6'>
                    <div className='space-y-4'>
                        <div className='grid sm:grid-cols-3 gap-4'>
                            <div>
                                <label className="block font-['Outfit'] text-xs font-medium text-[#14202B] mb-2">
                                    Search by Name, Email, or Institution
                                </label>
                                <input
                                    type='text'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder='Search...'
                                    className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30"
                                />
                            </div>
                            <div>
                                <label className="block font-['Outfit'] text-xs font-medium text-[#14202B] mb-2">
                                    Filter by Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30">
                                    <option value=''>All Statuses</option>
                                    <option value='submitted'>Submitted</option>
                                    <option value='under_review'>Under Review</option>
                                    <option value='approved'>Approved</option>
                                    <option value='declined'>Declined</option>
                                </select>
                            </div>
                            <div className='flex gap-2 items-end'>
                                <button
                                    type="button"
                                    onClick={exportToCSV}
                                    className="flex-1 font-['Outfit'] text-xs bg-[#125276] text-white px-4 py-2.5 rounded-sm hover:bg-[#0E3F52] transition-colors">
                                    Export CSV
                                </button>
                                <button
                                    type="button"
                                    onClick={exportToExcel}
                                    className="flex-1 font-['Outfit'] text-xs bg-[#1565c0] text-white px-4 py-2.5 rounded-sm hover:bg-[#0D4BA8] transition-colors">
                                    Export Excel
                                </button>
                            </div>
                        </div>
                        <p className="font-['Outfit'] text-xs text-[#7A8A96]">
                            Showing {filteredApplications.length} of {applications.length} applications
                        </p>
                    </div>
                </div>

                {/* Applications List */}
                {loading ? (
                    <div className='text-center py-12'>
                        <div
                            className='w-10 h-10 rounded-full mx-auto mb-4 animate-spin'
                            style={{
                                border: '3px solid #D8E0E7',
                                borderTopColor: '#1565c0',
                            }}
                        />
                        <p className="font-['Outfit'] text-[#7A8A96]">Loading applications...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className='bg-white border border-[#D8E0E7] rounded-sm p-12 text-center'>
                        <p className="font-['Outfit'] text-[#7A8A96]">
                            No applications found
                        </p>
                    </div>
                ) : (
                    <div className='space-y-3'>
                        {filteredApplications.map((app) => (
                            <div
                                key={app.id}
                                className='bg-white border border-[#D8E0E7] rounded-sm overflow-hidden'>
                                {/* Summary Row */}
                                <button
                                    type="button" // FIX 3: Prevent row clicks from triggering a page refresh
                                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                    className='w-full p-5 flex items-center justify-between hover:bg-[#F7F9FB] transition-colors text-left'>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <span
                                                className={`font-['Outfit'] text-xs px-2 py-1 rounded-sm font-semibold ${app.status === 'approved'
                                                    ? 'bg-[#16a34a]/10 text-[#16a34a]'
                                                    : app.status === 'declined'
                                                        ? 'bg-[#860f0f]/10 text-[#860f0f]'
                                                        : 'bg-[#7A8A96]/10 text-[#7A8A96]'
                                                    }`}>
                                                {app.status.toUpperCase()}
                                            </span>
                                            <span className="font-['Outfit'] text-xs text-[#7A8A96]">
                                                {app.reference_code}
                                            </span>
                                        </div>
                                        <h3 className="font-['Playfair_Display'] text-base font-semibold text-[#125276] truncate">
                                            {app.full_name}
                                        </h3>
                                        <p className="font-['Outfit'] text-xs text-[#7A8A96] mt-1">
                                            {app.email} · {app.home_institution}
                                        </p>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-[#7A8A96] transition-transform duration-300 flex-shrink-0 ml-4 ${expandedId === app.id ? 'rotate-180' : ''
                                            }`}
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M19 14l-7 7m0 0l-7-7m7 7V3'
                                        />
                                    </svg>
                                </button>

                                {/* Expanded Details */}
                                {expandedId === app.id && (
                                    <div className='border-t border-[#D8E0E7] bg-[#F7F9FB] p-6 space-y-4'>
                                        <div className='grid sm:grid-cols-2 gap-6'>
                                            <div>
                                                <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-1">Full Name</label>
                                                <p className="font-['Outfit'] text-sm text-[#3E5262]">{app.full_name}</p>
                                            </div>
                                            <div>
                                                <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-1">Email</label>
                                                <p className="font-['Outfit'] text-sm text-[#3E5262]">
                                                    <a href={`mailto:${app.email}`} className='text-[#1565c0] hover:underline'>
                                                        {app.email}
                                                    </a>
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-1">Phone</label>
                                                <p className="font-['Outfit'] text-sm text-[#3E5262]">{app.phone}</p>
                                            </div>
                                            <div>
                                                <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-1">Institution</label>
                                                <p className="font-['Outfit'] text-sm text-[#3E5262]">{app.home_institution}</p>
                                            </div>
                                            <div>
                                                <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-1">Rotation Type</label>
                                                <p className="font-['Outfit'] text-sm text-[#3E5262]">{app.rotation_type}</p>
                                            </div>
                                            <div>
                                                <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-1">Duration</label>
                                                <p className="font-['Outfit'] text-sm text-[#3E5262]">{app.duration_text}</p>
                                            </div>
                                            <div>
                                                <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-1">Start Date</label>
                                                <p className="font-['Outfit'] text-sm text-[#3E5262]">
                                                    {new Date(app.start_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-1">End Date</label>
                                                <p className="font-['Outfit'] text-sm text-[#3E5262]">
                                                    {new Date(app.end_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-1">Cover Letter</label>
                                            <p className="font-['Outfit'] text-sm text-[#3E5262] whitespace-pre-wrap max-h-40 overflow-y-auto">
                                                {app.cover_letter}
                                            </p>
                                        </div>

                                        {app.hr_feedback && (
                                            <div className='bg-white border border-[#D8E0E7] rounded-sm p-4'>
                                                <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-2">HR Feedback</label>
                                                <p className="font-['Outfit'] text-sm text-[#3E5262]">{app.hr_feedback}</p>
                                            </div>
                                        )}

                                        {/* FIX 4: Completed the truncated Review Section */}
                                        {reviewingId === app.id ? (
                                            <div className='bg-white border border-[#D8E0E7] rounded-sm p-4 space-y-4'>
                                                <div>
                                                    <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-2">
                                                        Optional Feedback/Notes
                                                    </label>
                                                    <textarea
                                                        value={reviewNotes}
                                                        onChange={(e) => setReviewNotes(e.target.value)}
                                                        className="w-full bg-white border border-[#D8E0E7] rounded-sm px-4 py-2 font-['Outfit'] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30 min-h-[100px]"
                                                        placeholder="Enter feedback to send to the applicant..."
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReviewApplication(app.id, 'approved')}
                                                        disabled={reviewLoading}
                                                        className="bg-[#16a34a] text-white px-4 py-2 rounded-sm text-sm hover:bg-[#15803d] transition-colors disabled:opacity-50 font-['Outfit']"
                                                    >
                                                        {reviewLoading ? 'Processing...' : 'Approve Application'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReviewApplication(app.id, 'declined')}
                                                        disabled={reviewLoading}
                                                        className="bg-[#860f0f] text-white px-4 py-2 rounded-sm text-sm hover:bg-[#6B0B09] transition-colors disabled:opacity-50 font-['Outfit']"
                                                    >
                                                        {reviewLoading ? 'Processing...' : 'Decline Application'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReviewingId(null);
                                                            setReviewNotes('');
                                                        }}
                                                        disabled={reviewLoading}
                                                        className="bg-[#7A8A96] text-white px-4 py-2 rounded-sm text-sm hover:bg-[#606E7A] transition-colors disabled:opacity-50 font-['Outfit']"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setReviewingId(app.id)}
                                                    className="bg-[#125276] text-white px-5 py-2 rounded-sm text-sm hover:bg-[#0E3F52] transition-colors font-['Outfit']"
                                                >
                                                    Review Application
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}