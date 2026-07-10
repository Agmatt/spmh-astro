import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

const statCardDefs = [
    { label: 'Total Applications', key: null, color: C.dark },
    { label: 'Pending', key: 'pending', color: '#92400e' },
    { label: 'Shortlisted', key: 'shortlisted', color: '#1e40af' },
    { label: 'Hired', key: 'hired', color: '#065f46' },
];

const statusStyle = {
    pending: { background: '#fef3c7', color: '#92400e' },
    reviewing: { background: '#dbeafe', color: '#1e40af' },
    shortlisted: { background: '#d1fae5', color: '#065f46' },
    rejected: { background: '#fee2e2', color: '#991b1b' },
    hired: { background: '#ede9fe', color: '#5b21b6' },
};

const ApplicationsAdminDashboard = () => {
    const [authState, setAuthState] = useState('loading');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [user, setUser] = useState(null);

    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const [positionFilter, setPositionFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const idleTimerRef = useRef(null);
    const idleTimeoutRef = useRef(null);
    const IDLE_TIME = 15 * 60 * 1000;

    const positions = ['gp', 'nurse', 'midwife', 'surgeon', 'lab', 'dentist'];
    const statuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];

    const positionNames = {
        gp: 'General Practitioner',
        nurse: 'Registered Nurse',
        midwife: 'Midwife',
        surgeon: 'Surgeon',
        lab: 'Laboratory Technician',
        dentist: 'Dentist',
    };

    useEffect(() => { checkAuth(); }, []);

    useEffect(() => {
        if (authState !== 'dashboard') return;
        const resetIdleTimer = () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = setTimeout(() => { handleLogout(); }, IDLE_TIME);
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
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) { setUser(session.user); setAuthState('dashboard'); fetchApplications(); }
            else setAuthState('login');
        } catch (err) { setAuthState('login'); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) { setLoginError(error.message); return; }
            if (data.user) { setUser(data.user); setAuthState('dashboard'); setEmail(''); setPassword(''); fetchApplications(); }
        } catch (err) { setLoginError('Login failed. Please try again.'); }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null); setAuthState('login'); setApplications([]); setFilteredApplications([]);
    };

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setApplications(data || []);
            applyFilters(data || []);
        } catch (err) { console.error('Error fetching applications:', err); }
        finally { setLoading(false); }
    };

    const applyFilters = (data) => {
        let filtered = data;
        if (positionFilter !== 'all') filtered = filtered.filter(a => a.position_id === positionFilter);
        if (statusFilter !== 'all') filtered = filtered.filter(a => a.status === statusFilter);
        setFilteredApplications(filtered);
    };

    const updateApplicationStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
            fetchApplications();
        } catch (err) { console.error('Error updating application:', err); }
    };

    const deleteApplication = async (id) => {
        if (!confirm('Are you sure you want to delete this application?')) return;
        try {
            const { error } = await supabase.from('applications').delete().eq('id', id);
            if (error) throw error;
            fetchApplications();
        } catch (err) { console.error('Error deleting application:', err); }
    };

    const downloadCV = (cvUrl, fullName) => {
        if (!cvUrl) return;
        const link = document.createElement('a');
        link.href = cvUrl; link.download = `${fullName}-CV`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

 

    // ── DASHBOARD ────────────────────────────────────────────────────────────
    const statCardGradients = [
        `linear-gradient(135deg, ${C.dark}, #2d2d30)`,
        'linear-gradient(135deg, #92400e, #b45309)',
        'linear-gradient(135deg, #1e40af, #2563eb)',
        'linear-gradient(135deg, #065f46, #059669)',
    ];

    return (
        <div className="min-h-screen" style={{ background: C.warm }}>
            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

                {/* Stat Cards — 2×2 on mobile, 4-col on sm+ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {statCardDefs.map((card, i) => (
                        <div key={card.label} className="rounded-xl p-4 sm:p-5"
                            style={{ background: statCardGradients[i] }}>
                            <p className="text-xs font-medium mb-1 text-white/60">{card.label}</p>
                            <p className="text-3xl font-bold text-white">
                                {card.key === null
                                    ? applications.length
                                    : applications.filter(a => a.status === card.key).length}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border p-4 sm:p-6" style={{ borderColor: C.border }}>
                    <h2 className="text-sm font-semibold mb-4" style={{ color: C.dark }}>Filters</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Position</label>
                            <select value={positionFilter}
                                onChange={e => { setPositionFilter(e.target.value); applyFilters(applications); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }}>
                                <option value="all">All Positions</option>
                                {positions.map(p => <option key={p} value={p}>{positionNames[p]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Status</label>
                            <select value={statusFilter}
                                onChange={e => { setStatusFilter(e.target.value); applyFilters(applications); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }}>
                                <option value="all">All Statuses</option>
                                {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table — hidden on mobile; cards on mobile */}
                <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ background: C.warm, borderBottom: `1px solid ${C.border}` }}>
                                <tr>
                                    {['Name', 'Email', 'Phone', 'Position', 'Status', 'CV', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                                            style={{ color: C.red }}>
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
                                    <tr key={app.id}
                                        className="border-b transition-colors"
                                        style={{ borderColor: '#f3f4f6', background: idx % 2 === 0 ? '#fff' : C.warm }}
                                        onMouseEnter={e => e.currentTarget.style.background = C.redBg}
                                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : C.warm}>
                                        <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: C.dark }}>{app.full_name}</td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{app.email}</td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{app.phone}</td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{positionNames[app.position_id] || app.position_id}</td>
                                        <td className="px-5 py-3.5">
                                            <select value={app.status}
                                                onChange={e => updateApplicationStatus(app.id, e.target.value)}
                                                className="px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none"
                                                style={statusStyle[app.status] || { background: '#f3f4f6', color: '#374151' }}>
                                                {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {app.cv_url ? (
                                                <button onClick={() => downloadCV(app.cv_url, app.full_name)}
                                                    className="text-xs font-semibold hover:underline"
                                                    style={{ color: C.red }}>
                                                    Download
                                                </button>
                                            ) : (
                                                <span className="text-xs" style={{ color: C.mutedLt }}>No CV</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <button onClick={() => deleteApplication(app.id)}
                                                className="text-xs font-semibold"
                                                style={{ color: '#dc2626' }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y" style={{ borderColor: '#f3f4f6' }}>
                        {filteredApplications.length === 0 ? (
                            <p className="px-4 py-10 text-center text-sm" style={{ color: C.mutedLt }}>No applications found</p>
                        ) : filteredApplications.map(app => (
                            <div key={app.id} className="p-4 space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: C.dark }}>{app.full_name}</p>
                                        <p className="text-xs" style={{ color: C.muted }}>{app.email}</p>
                                        <p className="text-xs" style={{ color: C.mutedLt }}>{app.phone}</p>
                                    </div>
                                    <select value={app.status}
                                        onChange={e => updateApplicationStatus(app.id, e.target.value)}
                                        className="px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none flex-shrink-0"
                                        style={statusStyle[app.status] || {}}>
                                        {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                                <p className="text-xs font-medium" style={{ color: C.muted }}>
                                    💼 {positionNames[app.position_id] || app.position_id}
                                </p>
                                <div className="flex gap-4">
                                    {app.cv_url && (
                                        <button onClick={() => downloadCV(app.cv_url, app.full_name)}
                                            className="text-xs font-semibold" style={{ color: C.red }}>
                                            Download CV
                                        </button>
                                    )}
                                    <button onClick={() => deleteApplication(app.id)}
                                        className="text-xs font-semibold" style={{ color: '#dc2626' }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs pb-4" style={{ color: C.mutedLt }}>
                    Showing {filteredApplications.length} of {applications.length} applications
                </p>
            </main>
        </div>
    );
};

export default ApplicationsAdminDashboard;