import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zzlngxryoalajdpsbpnn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bG5neHJ5b2FsYWpkcHNicG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MDk3NjYsImV4cCI6MjA5ODE4NTc2Nn0.NN2MqqqOITkizXpMw1qrAwbb4GYIySa7jsIcWnmP-Ag';

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

    // ── LOGIN ────────────────────────────────────────────────────────────────
    if (authState === 'login') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
                style={{ background: C.dark }}>
                {/* Diagonal crimson splash */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(125deg, rgba(28,28,30,0.97) 50%, rgba(134,15,15,0.5) 100%)' }} />
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                {/* ── SLOT 1: background image — replace src ── */}
                <img src="/img/58.jpg" alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'blur(10px)', transform: 'scale(1.05)', }} />

                <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

                    {/* ── SLOT 2: form logo — replace src ── */}
                    <div className="flex justify-center mb-6">
                        <img src="/gallery/bg.png" alt="SPMH" className="h-24 w-auto object-contain" />
                    </div>



                    <h2 className="text-2xl font-bold mb-1" style={{ color: C.dark }}>Sign in</h2>
                    <p className="text-sm mb-6" style={{ color: C.muted }}>Access the applications dashboard</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.dark }}>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="admin@spmh.co.ke"
                                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all"
                                style={{ borderColor: C.border, color: C.dark }}
                                onFocus={e => e.target.style.borderColor = C.red}
                                onBlur={e => e.target.style.borderColor = C.border}
                                required />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.dark }}>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all"
                                style={{ borderColor: C.border, color: C.dark }}
                                onFocus={e => e.target.style.borderColor = C.red}
                                onBlur={e => e.target.style.borderColor = C.border}
                                required />
                        </div>
                        {loginError && (
                            <div className="p-3 rounded-lg text-sm" style={{ background: C.redBg, border: `1px solid #fecaca`, color: '#b91c1c' }}>
                                {loginError}
                            </div>
                        )}
                        <button type="submit"
                            className="w-full py-3 rounded-lg text-white font-bold text-sm transition-opacity hover:opacity-90"
                            style={{ background: C.red }}>
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── LOADING ──────────────────────────────────────────────────────────────
    if (authState === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: C.warm }}>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin"
                        style={{ border: '3px solid #ece8e1', borderTopColor: C.red }}></div>
                    <p className="text-sm" style={{ color: C.muted }}>Loading...</p>
                </div>
            </div>
        );
    }

    // ── DASHBOARD ────────────────────────────────────────────────────────────
    const statCardGradients = [
        `linear-gradient(135deg, ${C.dark}, #2d2d30)`,
        'linear-gradient(135deg, #92400e, #b45309)',
        'linear-gradient(135deg, #1e40af, #2563eb)',
        'linear-gradient(135deg, #065f46, #059669)',
    ];

    return (
        <div className="min-h-screen" style={{ background: C.warm }}>

            {/* ── Header ── */}
            <header className="sticky top-0 z-40 border-b bg-white"
                style={{ borderColor: C.border, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: C.red }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: C.dark }}>Applications</h1>
                            <p className="text-xs hidden sm:block" style={{ color: C.mutedLt }}>Welcome, {user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href="/" className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
                            style={{ borderColor: C.border, color: C.dark }}>
                            ← Website
                        </a>
                        <button onClick={handleLogout}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                            style={{ background: C.red }}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

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