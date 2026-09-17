import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

// ── SUPABASE CLIENTS ──────────────────────────────────────────────────────
const applicationsSupabase = createClient(
    'https://tzliykelldkbweogledq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ'
);

const partnershipsSupabase = createClient(
    'https://zzlngxryoalajdpsbpnn.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bG5neHJ5b2FsYWpkcHNicG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MDk3NjYsImV4cCI6MjA5ODE4NTc2Nn0.NN2MqqqOITkizXpMw1qrAwbb4GYIySa7jsIcWnmP-Ag'
);

// NOTE: Volunteers uses one of the above Supabase projects (same auth gate)
// Update with your actual volunteers Supabase URL/key if it's separate
const volunteersSupabase = partnershipsSupabase; // Default to partnerships project

// ── COLORS ──────────────────────────────────────────────────────────────
const C = {
    dark: '#1c1c1e',
    red: '#860f0f',
    redHov: '#a01212',
    redBg: '#fef2f2',
    warm: '#f9f6f2',
    border: '#ece8e1',
    muted: '#6b7280',
    mutedLt: '#9ca3af',
};

// ── LOOKUP TABLES ────────────────────────────────────────────────────────
const positionNames = {
    gp: 'General Practitioner',
    nurse: 'Registered Nurse',
    midwife: 'Midwife',
    surgeon: 'Surgeon',
    lab: 'Laboratory Technician',
    dentist: 'Dentist',
};

const statusStyle = {
    pending: { background: '#fef3c7', color: '#92400e' },
    reviewing: { background: '#dbeafe', color: '#1e40af' },
    shortlisted: { background: '#d1fae5', color: '#065f46' },
    rejected: { background: '#fee2e2', color: '#991b1b' },
    hired: { background: '#ede9fe', color: '#5b21b6' },
};

// ── EXPORT UTILITIES ─────────────────────────────────────────────────────
const exportToCSV = (data, filename) => {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }

    // Get headers from first record
    const headers = Object.keys(data[0]);

    // Create CSV content
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
        const values = headers.map(header => {
            const val = row[header];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val || '';
        });
        csv += values.join(',') + '\n';
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};

const exportToXLSX = (data, filename) => {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, filename);
};

// ── MAIN COMPONENT ──────────────────────────────────────────────────────
const RecruitmentAdminDashboard = () => {
    const [authState, setAuthState] = useState('loading');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [user, setUser] = useState(null);

    const [activeTab, setActiveTab] = useState('applications');

    // Applications state
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [appLoading, setAppLoading] = useState(false);
    const [positionFilter, setPositionFilter] = useState('all');
    const [appStatusFilter, setAppStatusFilter] = useState('all');

    // Partnerships state
    const [partnerships, setPartnerships] = useState([]);
    const [filteredPartnerships, setFilteredPartnerships] = useState([]);
    const [partnershipLoading, setPartnershipLoading] = useState(false);
    const [partnershipStatusFilter, setPartnershipStatusFilter] = useState('all');

    // Volunteers state
    const [volunteers, setVolunteers] = useState([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [volunteerLoading, setVolunteerLoading] = useState(false);
    const [volunteerStatusFilter, setVolunteerStatusFilter] = useState('all');

    const idleTimerRef = useRef(null);
    const idleTimeoutRef = useRef(null);
    const IDLE_TIME = 15 * 60 * 1000;

    const positions = ['gp', 'nurse', 'midwife', 'surgeon', 'lab', 'dentist'];
    const appStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];
    const partnershipStatuses = ['pending', 'approved', 'rejected'];
    const volunteerStatuses = ['active', 'pending', 'inactive'];

    const volunteerStatusStyle = {
        active: { background: '#dcfce7', color: '#166534' },
        pending: { background: '#fef3c7', color: '#92400e' },
        inactive: { background: '#fee2e2', color: '#991b1b' },
    };

    // ── AUTH ─────────────────────────────────────────────────────────────
    useEffect(() => {
        checkAuth();
    }, []);

    // Refetch data whenever component mounts (including after navigation back)
    useEffect(() => {
        if (authState === 'dashboard' && user) {
            fetchApplications();
            fetchPartnerships();
            fetchVolunteers();
        }
    }, [user, authState]);

    useEffect(() => {
        if (authState !== 'dashboard') return;

        const resetIdleTimer = () => {
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = setTimeout(() => {
                handleLogout();
            }, IDLE_TIME);
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(event => window.addEventListener(event, resetIdleTimer));
        resetIdleTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, resetIdleTimer));
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        };
    }, [authState]);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await applicationsSupabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                setAuthState('dashboard');
                // FIX: Fetch data after auth state is set
                setTimeout(() => {
                    fetchApplications();
                    fetchPartnerships();
                    fetchVolunteers();
                }, 0);
            } else {
                setAuthState('login');
            }
        } catch (err) {
            console.error('Auth check error:', err);
            setAuthState('login');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const { data, error } = await applicationsSupabase.auth.signInWithPassword({ email, password });
            if (error) {
                setLoginError(error.message);
                return;
            }
            if (data.user) {
                setUser(data.user);
                setAuthState('dashboard');
                setEmail('');
                setPassword('');
                fetchApplications();
                fetchPartnerships();
                fetchVolunteers();
            }
        } catch (err) {
            setLoginError('Login failed. Please try again.');
            console.error(err);
        }
    };

    const handleLogout = async () => {
        await applicationsSupabase.auth.signOut();
        setUser(null);
        setAuthState('login');
        setApplications([]);
        setFilteredApplications([]);
        setPartnerships([]);
        setFilteredPartnerships([]);
        setVolunteers([]);
        setFilteredVolunteers([]);
    };

    const fetchApplications = async () => {
        setAppLoading(true);
        try {
            const { data, error } = await applicationsSupabase
                .from('applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
            applyApplicationFilters(data || []);
        } catch (err) {
            console.error('Error fetching applications:', err);
        } finally {
            setAppLoading(false);
        }
    };

    const fetchPartnerships = async () => {
        setPartnershipLoading(true);
        try {
            const { data, error } = await partnershipsSupabase
                .from('partnerships')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPartnerships(data || []);
            applyPartnershipFilters(data || []);
        } catch (err) {
            console.error('Error fetching partnerships:', err);
        } finally {
            setPartnershipLoading(false);
        }
    };

    const fetchVolunteers = async () => {
        setVolunteerLoading(true);
        try {
            const { data, error } = await volunteersSupabase
                .from('volunteers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVolunteers(data || []);
            applyVolunteerFilters(data || []);
        } catch (err) {
            console.error('Error fetching volunteers:', err);
        } finally {
            setVolunteerLoading(false);
        }
    };

    const applyApplicationFilters = (data) => {
        let filtered = data;
        if (positionFilter !== 'all') {
            filtered = filtered.filter(a => a.position_id === positionFilter);
        }
        if (appStatusFilter !== 'all') {
            filtered = filtered.filter(a => a.status === appStatusFilter);
        }
        setFilteredApplications(filtered);
    };

    const updateApplicationStatus = async (id, newStatus) => {
        try {
            const { error } = await applicationsSupabase
                .from('applications')
                .update({ status: newStatus })
                .eq('id', id);
            if (error) throw error;
            fetchApplications();
        } catch (err) {
            console.error('Error updating application:', err);
            alert('Failed to update status');
        }
    };

    const deleteApplication = async (id) => {
        if (!confirm('Delete this application?')) return;
        try {
            const { error } = await applicationsSupabase
                .from('applications')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchApplications();
        } catch (err) {
            console.error('Error deleting application:', err);
            alert('Failed to delete');
        }
    };

    const downloadCV = (cvUrl, fullName) => {
        if (!cvUrl) return;
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = `${fullName}-CV`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportApplications = (format) => {
        const data = filteredApplications.map(app => ({
            'Full Name': app.full_name,
            'Email': app.email,
            'Phone': app.phone,
            'Position': positionNames[app.position_id] || app.position_id,
            'Status': app.status,
            'Applied On': new Date(app.created_at).toLocaleDateString(),
            'CV URL': app.cv_url || 'N/A',
        }));

        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `SPMH-Applications-${timestamp}.${format === 'csv' ? 'csv' : 'xlsx'}`;

        if (format === 'csv') {
            exportToCSV(data, filename);
        } else {
            exportToXLSX(data, filename);
        }
    };

    // ── PARTNERSHIPS ─────────────────────────────────────────────────────
    const applyPartnershipFilters = (data) => {
        let filtered = data;
        if (partnershipStatusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === partnershipStatusFilter);
        }
        setFilteredPartnerships(filtered);
    };

    const updatePartnershipStatus = async (id, newStatus) => {
        try {
            const { error } = await partnershipsSupabase
                .from('partnerships')
                .update({ status: newStatus })
                .eq('id', id);
            if (error) throw error;
            fetchPartnerships();
        } catch (err) {
            console.error('Error updating partnership:', err);
            alert('Failed to update status');
        }
    };

    const deletePartnership = async (id) => {
        if (!confirm('Delete this partnership?')) return;
        try {
            const { error } = await partnershipsSupabase
                .from('partnerships')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchPartnerships();
        } catch (err) {
            console.error('Error deleting partnership:', err);
            alert('Failed to delete');
        }
    };

    const exportPartnerships = (format) => {
        const data = filteredPartnerships.map(p => ({
            'Organisation': p.org_name,
            'Type': p.org_type,
            'Country': p.country,
            'Contact': p.contact_name,
            'Role': p.contact_role,
            'Email': p.contact_email,
            'Phone': p.contact_phone || 'N/A',
            'Collaboration Areas': p.collaboration_areas,
            'Proposal': p.proposal,
            'Status': p.status,
            'Submitted': new Date(p.created_at).toLocaleDateString(),
        }));

        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `SPMH-Partnerships-${timestamp}.${format === 'csv' ? 'csv' : 'xlsx'}`;

        if (format === 'csv') {
            exportToCSV(data, filename);
        } else {
            exportToXLSX(data, filename);
        }
    };

    // ── VOLUNTEERS ──────────────────────────────────────────────────────
    const applyVolunteerFilters = (data) => {
        let filtered = data;
        if (volunteerStatusFilter !== 'all') {
            filtered = filtered.filter(v => v.status === volunteerStatusFilter);
        }
        setFilteredVolunteers(filtered);
    };

    const updateVolunteerStatus = async (id, newStatus) => {
        try {
            const { error } = await volunteersSupabase
                .from('volunteers')
                .update({ status: newStatus })
                .eq('id', id);
            if (error) throw error;
            fetchVolunteers();
        } catch (err) {
            console.error('Error updating volunteer:', err);
            alert('Failed to update status');
        }
    };

    const deleteVolunteer = async (id) => {
        if (!confirm('Delete this volunteer?')) return;
        try {
            const { error } = await volunteersSupabase
                .from('volunteers')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchVolunteers();
        } catch (err) {
            console.error('Error deleting volunteer:', err);
            alert('Failed to delete');
        }
    };

    const exportVolunteers = (format) => {
        const data = filteredVolunteers.map(v => ({
            'First Name': v.first_name,
            'Last Name': v.last_name,
            'Email': v.email || 'N/A',
            'Phone': v.phone || 'N/A',
            'Location': v.location || 'N/A',
            'Interests': v.interests || 'N/A',
            'Status': v.status,
            'Joined': new Date(v.created_at).toLocaleDateString(),
        }));

        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `SPMH-Volunteers-${timestamp}.${format === 'csv' ? 'csv' : 'xlsx'}`;

        if (format === 'csv') {
            exportToCSV(data, filename);
        } else {
            exportToXLSX(data, filename);
        }
    };

    // ── LOGIN SCREEN ─────────────────────────────────────────────────────
    if (authState === 'loading') {
        return <div className="min-h-screen flex items-center justify-center" style={{ background: C.warm }}>
            <p style={{ color: C.muted }}>Loading...</p>
        </div>;
    }

    if (authState === 'login') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.warm }}>
                <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md w-full" style={{ borderColor: C.border }}>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: C.dark }}>SPMH Recruitment</h1>
                    <p className="text-sm mb-6" style={{ color: C.mutedLt }}>Admin Dashboard</p>

                    {loginError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm" style={{ color: '#dc2626' }}>
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border }}
                                placeholder="admin@spmh.org"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border }}
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-lg font-semibold text-white transition-colors"
                            style={{ background: C.red }}
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── DASHBOARD ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen" style={{ background: C.warm }}>
            <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* Tabs */}
                <div className="flex gap-2 border-b overflow-x-auto" style={{ borderColor: C.border }}>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className="px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                        style={{
                            borderColor: activeTab === 'applications' ? C.red : 'transparent',
                            color: activeTab === 'applications' ? C.red : C.mutedLt,
                        }}
                    >
                        Job Applications ({applications.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('partnerships')}
                        className="px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                        style={{
                            borderColor: activeTab === 'partnerships' ? C.red : 'transparent',
                            color: activeTab === 'partnerships' ? C.red : C.mutedLt,
                        }}
                    >
                        Partnerships ({partnerships.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('volunteers')}
                        className="px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                        style={{
                            borderColor: activeTab === 'volunteers' ? C.red : 'transparent',
                            color: activeTab === 'volunteers' ? C.red : C.mutedLt,
                        }}
                    >
                        Volunteers ({volunteers.length})
                    </button>
                </div>

                {/* APPLICATIONS TAB */}
                {activeTab === 'applications' && (
                    <div className="space-y-6">
                        {/* Filters & Export */}
                        <div className="bg-white rounded-xl border p-4 sm:p-6 space-y-4" style={{ borderColor: C.border }}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Position</label>
                                    <select
                                        value={positionFilter}
                                        onChange={(e) => {
                                            setPositionFilter(e.target.value);
                                            applyApplicationFilters(applications);
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                        style={{ borderColor: C.border, color: C.dark }}
                                    >
                                        <option value="all">All Positions</option>
                                        {positions.map(p => <option key={p} value={p}>{positionNames[p]}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Status</label>
                                    <select
                                        value={appStatusFilter}
                                        onChange={(e) => {
                                            setAppStatusFilter(e.target.value);
                                            applyApplicationFilters(applications);
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                        style={{ borderColor: C.border, color: C.dark }}
                                    >
                                        <option value="all">All Statuses</option>
                                        {appStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Export</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => exportApplications('csv')}
                                            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                                            style={{ background: C.redBg, color: C.red }}
                                        >
                                            CSV
                                        </button>
                                        <button
                                            onClick={() => exportApplications('xlsx')}
                                            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                                            style={{ background: C.redBg, color: C.red }}
                                        >
                                            XLSX
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead style={{ background: C.warm, borderBottom: `1px solid ${C.border}` }}>
                                        <tr>
                                            {['Name', 'Email', 'Phone', 'Position', 'Status', 'CV', 'Actions'].map(h => (
                                                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: C.red }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApplications.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-10 text-center text-sm" style={{ color: C.mutedLt }}>
                                                    No applications found
                                                </td>
                                            </tr>
                                        ) : filteredApplications.map((app, idx) => (
                                            <tr
                                                key={app.id}
                                                className="border-b transition-colors"
                                                style={{ borderColor: '#f3f4f6', background: idx % 2 === 0 ? '#fff' : C.warm }}
                                                onMouseEnter={e => e.currentTarget.style.background = C.redBg}
                                                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : C.warm}
                                            >
                                                <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: C.dark }}>{app.full_name}</td>
                                                <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{app.email}</td>
                                                <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{app.phone}</td>
                                                <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{positionNames[app.position_id] || app.position_id}</td>
                                                <td className="px-5 py-3.5">
                                                    <select
                                                        value={app.status}
                                                        onChange={e => updateApplicationStatus(app.id, e.target.value)}
                                                        className="px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none"
                                                        style={statusStyle[app.status] || { background: '#f3f4f6', color: '#374151' }}
                                                    >
                                                        {appStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {app.cv_url ? (
                                                        <button
                                                            onClick={() => downloadCV(app.cv_url, app.full_name)}
                                                            className="text-xs font-semibold hover:underline"
                                                            style={{ color: C.red }}
                                                        >
                                                            Download
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs" style={{ color: C.mutedLt }}>No CV</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        onClick={() => deleteApplication(app.id)}
                                                        className="text-xs font-semibold"
                                                        style={{ color: '#dc2626' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile */}
                            <div className="md:hidden divide-y" style={{ borderColor: '#f3f4f6' }}>
                                {filteredApplications.length === 0 ? (
                                    <p className="px-4 py-10 text-center text-sm" style={{ color: C.mutedLt }}>No applications</p>
                                ) : filteredApplications.map(app => (
                                    <div key={app.id} className="p-4 space-y-2.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-bold" style={{ color: C.dark }}>{app.full_name}</p>
                                                <p className="text-xs" style={{ color: C.muted }}>{app.email}</p>
                                            </div>
                                            <select
                                                value={app.status}
                                                onChange={e => updateApplicationStatus(app.id, e.target.value)}
                                                className="px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none"
                                                style={statusStyle[app.status] || {}}
                                            >
                                                {appStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                            </select>
                                        </div>
                                        <p className="text-xs font-medium" style={{ color: C.muted }}>💼 {positionNames[app.position_id] || app.position_id}</p>
                                        <div className="flex gap-4">
                                            {app.cv_url && <button onClick={() => downloadCV(app.cv_url, app.full_name)} className="text-xs font-semibold" style={{ color: C.red }}>Download CV</button>}
                                            <button onClick={() => deleteApplication(app.id)} className="text-xs font-semibold" style={{ color: '#dc2626' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs pb-4" style={{ color: C.mutedLt }}>
                            Showing {filteredApplications.length} of {applications.length} applications
                        </p>
                    </div>
                )}

                {/* PARTNERSHIPS TAB */}
                {activeTab === 'partnerships' && (
                    <div className="space-y-6">
                        {/* Filters & Export */}
                        <div className="bg-white rounded-xl border p-4 sm:p-6 space-y-4" style={{ borderColor: C.border }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Status</label>
                                    <select
                                        value={partnershipStatusFilter}
                                        onChange={(e) => {
                                            setPartnershipStatusFilter(e.target.value);
                                            applyPartnershipFilters(partnerships);
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                        style={{ borderColor: C.border, color: C.dark }}
                                    >
                                        <option value="all">All Statuses</option>
                                        {partnershipStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Export</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => exportPartnerships('csv')}
                                            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                                            style={{ background: C.redBg, color: C.red }}
                                        >
                                            CSV
                                        </button>
                                        <button
                                            onClick={() => exportPartnerships('xlsx')}
                                            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                                            style={{ background: C.redBg, color: C.red }}
                                        >
                                            XLSX
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead style={{ background: C.warm, borderBottom: `1px solid ${C.border}` }}>
                                        <tr>
                                            {['Organisation', 'Type', 'Contact', 'Email', 'Collaboration Areas', 'Status', 'Actions'].map(h => (
                                                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: C.red }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPartnerships.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-10 text-center text-sm" style={{ color: C.mutedLt }}>
                                                    No partnerships found
                                                </td>
                                            </tr>
                                        ) : filteredPartnerships.map((p, idx) => (
                                            <tr
                                                key={p.id}
                                                className="border-b transition-colors"
                                                style={{ borderColor: '#f3f4f6', background: idx % 2 === 0 ? '#fff' : C.warm }}
                                                onMouseEnter={e => e.currentTarget.style.background = C.redBg}
                                                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : C.warm}
                                            >
                                                <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: C.dark }}>{p.org_name}</td>
                                                <td className="px-5 py-3.5 text-sm text-center" style={{ color: C.muted }}>
                                                    <span className="text-xs" title={p.org_type}>{p.org_type.split(' ').slice(0, 2).join(' ')}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>
                                                    <div>
                                                        <p className="font-medium">{p.contact_name}</p>
                                                        <p className="text-xs">{p.contact_role}</p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{p.contact_email}</td>
                                                <td className="px-5 py-3.5 text-sm text-center">
                                                    <span className="text-xs" title={p.collaboration_areas}>{p.collaboration_areas.split(',').length} areas</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <select
                                                        value={p.status}
                                                        onChange={e => updatePartnershipStatus(p.id, e.target.value)}
                                                        className="px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none"
                                                        style={statusStyle[p.status] || { background: '#f3f4f6', color: '#374151' }}
                                                    >
                                                        {partnershipStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        onClick={() => deletePartnership(p.id)}
                                                        className="text-xs font-semibold"
                                                        style={{ color: '#dc2626' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile */}
                            <div className="md:hidden divide-y" style={{ borderColor: '#f3f4f6' }}>
                                {filteredPartnerships.length === 0 ? (
                                    <p className="px-4 py-10 text-center text-sm" style={{ color: C.mutedLt }}>No partnerships</p>
                                ) : filteredPartnerships.map(p => (
                                    <div key={p.id} className="p-4 space-y-2.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-bold" style={{ color: C.dark }}>{p.org_name}</p>
                                                <p className="text-xs" style={{ color: C.muted }}>{p.contact_email}</p>
                                            </div>
                                            <select
                                                value={p.status}
                                                onChange={e => updatePartnershipStatus(p.id, e.target.value)}
                                                className="px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none"
                                                style={statusStyle[p.status] || {}}
                                            >
                                                {partnershipStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                            </select>
                                        </div>
                                        <p className="text-xs" style={{ color: C.muted }}>📍 {p.country}</p>
                                        <button
                                            onClick={() => deletePartnership(p.id)}
                                            className="text-xs font-semibold"
                                            style={{ color: '#dc2626' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs pb-4" style={{ color: C.mutedLt }}>
                            Showing {filteredPartnerships.length} of {partnerships.length} partnerships
                        </p>
                    </div>
                )}

                {/* VOLUNTEERS TAB */}
                {activeTab === 'volunteers' && (
                    <div className="space-y-6">
                        {/* Filters & Export */}
                        <div className="bg-white rounded-xl border p-4 sm:p-6 space-y-4" style={{ borderColor: C.border }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Status</label>
                                    <select
                                        value={volunteerStatusFilter}
                                        onChange={(e) => {
                                            setVolunteerStatusFilter(e.target.value);
                                            applyVolunteerFilters(volunteers);
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                        style={{ borderColor: C.border, color: C.dark }}
                                    >
                                        <option value="all">All Statuses</option>
                                        {volunteerStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Export</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => exportVolunteers('csv')}
                                            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                                            style={{ background: C.redBg, color: C.red }}
                                        >
                                            CSV
                                        </button>
                                        <button
                                            onClick={() => exportVolunteers('xlsx')}
                                            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                                            style={{ background: C.redBg, color: C.red }}
                                        >
                                            XLSX
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead style={{ background: C.warm, borderBottom: `1px solid ${C.border}` }}>
                                        <tr>
                                            {['Name', 'Email', 'Phone', 'Location', 'Interests', 'Status', 'Actions'].map(h => (
                                                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: C.red }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredVolunteers.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-10 text-center text-sm" style={{ color: C.mutedLt }}>
                                                    No volunteers found
                                                </td>
                                            </tr>
                                        ) : filteredVolunteers.map((vol, idx) => (
                                            <tr
                                                key={vol.id}
                                                className="border-b transition-colors"
                                                style={{ borderColor: '#f3f4f6', background: idx % 2 === 0 ? '#fff' : C.warm }}
                                                onMouseEnter={e => e.currentTarget.style.background = C.redBg}
                                                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : C.warm}
                                            >
                                                <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: C.dark }}>
                                                    {vol.first_name} {vol.last_name}
                                                </td>
                                                <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{vol.email || 'N/A'}</td>
                                                <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{vol.phone || 'N/A'}</td>
                                                <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{vol.location || 'N/A'}</td>
                                                <td className="px-5 py-3.5 text-sm text-center">
                                                    <span title={vol.interests} style={{ color: C.muted }}>
                                                        {vol.interests ? vol.interests.split(',').length : 0} area(s)
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <select
                                                        value={vol.status || 'pending'}
                                                        onChange={e => updateVolunteerStatus(vol.id, e.target.value)}
                                                        className="px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none"
                                                        style={volunteerStatusStyle[vol.status] || volunteerStatusStyle['pending']}
                                                    >
                                                        {volunteerStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        onClick={() => deleteVolunteer(vol.id)}
                                                        className="text-xs font-semibold"
                                                        style={{ color: '#dc2626' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile */}
                            <div className="md:hidden divide-y" style={{ borderColor: '#f3f4f6' }}>
                                {filteredVolunteers.length === 0 ? (
                                    <p className="px-4 py-10 text-center text-sm" style={{ color: C.mutedLt }}>No volunteers</p>
                                ) : filteredVolunteers.map(vol => (
                                    <div key={vol.id} className="p-4 space-y-2.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-bold" style={{ color: C.dark }}>
                                                    {vol.first_name} {vol.last_name}
                                                </p>
                                                <p className="text-xs" style={{ color: C.muted }}>{vol.email || 'N/A'}</p>
                                                <p className="text-xs" style={{ color: C.muted }}>{vol.phone || 'N/A'}</p>
                                            </div>
                                            <select
                                                value={vol.status || 'pending'}
                                                onChange={e => updateVolunteerStatus(vol.id, e.target.value)}
                                                className="px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none flex-shrink-0"
                                                style={volunteerStatusStyle[vol.status] || volunteerStatusStyle['pending']}
                                            >
                                                {volunteerStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                            </select>
                                        </div>
                                        <p className="text-xs font-medium" style={{ color: C.muted }}>
                                            📍 {vol.location || 'N/A'}
                                        </p>
                                        <button
                                            onClick={() => deleteVolunteer(vol.id)}
                                            className="text-xs font-semibold"
                                            style={{ color: '#dc2626' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs pb-4" style={{ color: C.mutedLt }}>
                            Showing {filteredVolunteers.length} of {volunteers.length} volunteers
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RecruitmentAdminDashboard;