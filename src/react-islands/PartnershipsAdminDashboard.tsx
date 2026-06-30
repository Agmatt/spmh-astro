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
    { label: 'Total Inquiries', key: null, color: C.dark },
    { label: 'Pending', key: 'pending', color: '#92400e' },
    { label: 'In Review', key: 'reviewing', color: '#1e40af' },
    { label: 'Approved', key: 'approved', color: '#065f46' },
];

const statusStyle = {
    pending: { background: '#fef3c7', color: '#92400e' },
    reviewing: { background: '#dbeafe', color: '#1e40af' },
    approved: { background: '#d1fae5', color: '#065f46' },
    rejected: { background: '#fee2e2', color: '#991b1b' },
};

const PartnershipsAdminDashboard = () => {
    const [authState, setAuthState] = useState('loading');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [user, setUser] = useState(null);

    const [partnerships, setPartnerships] = useState([]);
    const [filteredPartnerships, setFilteredPartnerships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const idleTimerRef = useRef(null);
    const idleTimeoutRef = useRef(null);
    const IDLE_TIME = 15 * 60 * 1000;

    const statuses = ['pending', 'reviewing', 'approved', 'rejected'];

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
            if (session?.user) { setUser(session.user); setAuthState('dashboard'); fetchPartnerships(); }
            else setAuthState('login');
        } catch (err) { setAuthState('login'); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) { setLoginError(error.message); return; }
            if (data.user) { setUser(data.user); setAuthState('dashboard'); setEmail(''); setPassword(''); fetchPartnerships(); }
        } catch (err) { setLoginError('Login failed. Please try again.'); }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null); setAuthState('login'); setPartnerships([]); setFilteredPartnerships([]);
    };

    const fetchPartnerships = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('partnerships').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setPartnerships(data || []);
            applyFilters(data || []);
        } catch (err) { console.error('Error fetching partnerships:', err); }
        finally { setLoading(false); }
    };

    const applyFilters = (data) => {
        let filtered = data;
        if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter);
        setFilteredPartnerships(filtered);
    };

    const updatePartnershipStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase.from('partnerships').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
            fetchPartnerships();
        } catch (err) { console.error('Error updating partnership:', err); }
    };

    const deletePartnership = async (id) => {
        if (!confirm('Are you sure you want to delete this partnership inquiry?')) return;
        try {
            const { error } = await supabase.from('partnerships').delete().eq('id', id);
            if (error) throw error;
            fetchPartnerships();
        } catch (err) { console.error('Error deleting partnership:', err); }
    };

    if (authState === 'login') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
                style={{ background: C.dark }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(125deg, rgba(28,28,30,0.97) 50%, rgba(134,15,15,0.5) 100%)' }} />
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <img src="/img/58.jpg" alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'blur(10px)', transform: 'scale(1.05)' }} />
                <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="flex justify-center mb-6">
                        <img src="/gallery/bg.png" alt="SPMH" className="h-24 w-auto object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: C.dark }}>Sign in</h2>
                    <p className="text-sm mb-6" style={{ color: C.muted }}>Access the partnerships dashboard</p>
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

    const statCardGradients = [
        `linear-gradient(135deg, ${C.dark}, #2d2d30)`,
        'linear-gradient(135deg, #92400e, #b45309)',
        'linear-gradient(135deg, #1e40af, #2563eb)',
        'linear-gradient(135deg, #065f46, #059669)',
    ];

    return (
        <div className="min-h-screen" style={{ background: C.warm }}>
            <header className="sticky top-0 z-40 border-b bg-white"
                style={{ borderColor: C.border, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: C.red }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: C.dark }}>Partnerships</h1>
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

            <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {statCardDefs.map((card, i) => (
                        <div key={card.label} className="rounded-xl p-4 sm:p-5"
                            style={{ background: statCardGradients[i] }}>
                            <p className="text-xs font-medium mb-1 text-white/60">{card.label}</p>
                            <p className="text-3xl font-bold text-white">
                                {card.key === null
                                    ? partnerships.length
                                    : partnerships.filter(p => p.status === card.key).length}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border p-4 sm:p-6" style={{ borderColor: C.border }}>
                    <h2 className="text-sm font-semibold mb-4" style={{ color: C.dark }}>Filter</h2>
                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Status</label>
                        <select value={statusFilter}
                            onChange={e => { setStatusFilter(e.target.value); applyFilters(partnerships); }}
                            className="w-full sm:w-48 px-3 py-2 rounded-lg border text-sm outline-none"
                            style={{ borderColor: C.border, color: C.dark }}>
                            <option value="all">All Statuses</option>
                            {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ background: C.warm, borderBottom: `1px solid ${C.border}` }}>
                                <tr>
                                    {['Organization', 'Contact', 'Email', 'Type', 'Country', 'Areas', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                                            style={{ color: C.red }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPartnerships.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-sm" style={{ color: C.mutedLt }}>
                                            No partnership inquiries found
                                        </td>
                                    </tr>
                                ) : filteredPartnerships.map((part, idx) => (
                                    <tr key={part.id}
                                        className="border-b transition-colors"
                                        style={{ borderColor: '#f3f4f6', background: idx % 2 === 0 ? '#fff' : C.warm }}
                                        onMouseEnter={e => e.currentTarget.style.background = C.redBg}
                                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : C.warm}>
                                        <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: C.dark }}>{part.org_name}</td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{part.contact_name}</td>
                                        <td className="px-5 py-3.5 text-sm text-blue-600 hover:underline cursor-pointer">
                                            <a href={`mailto:${part.contact_email}`}>{part.contact_email}</a>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{part.org_type}</td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{part.country}</td>
                                        <td className="px-5 py-3.5 text-xs" style={{ color: C.muted }}>{part.collaboration_areas}</td>
                                        <td className="px-5 py-3.5">
                                            <select value={part.status || 'pending'}
                                                onChange={e => updatePartnershipStatus(part.id, e.target.value)}
                                                className="px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none"
                                                style={statusStyle[part.status] || {}}>
                                                {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <button onClick={() => deletePartnership(part.id)}
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

                    <div className="md:hidden divide-y" style={{ borderColor: '#f3f4f6' }}>
                        {filteredPartnerships.length === 0 ? (
                            <p className="px-4 py-10 text-center text-sm" style={{ color: C.mutedLt }}>No partnership inquiries found</p>
                        ) : filteredPartnerships.map(part => (
                            <div key={part.id} className="p-4 space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: C.dark }}>{part.org_name}</p>
                                        <p className="text-xs" style={{ color: C.muted }}>{part.contact_name}</p>
                                        <p className="text-xs text-blue-600">
                                            <a href={`mailto:${part.contact_email}`}>{part.contact_email}</a>
                                        </p>
                                    </div>
                                    <select value={part.status || 'pending'}
                                        onChange={e => updatePartnershipStatus(part.id, e.target.value)}
                                        className="px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none flex-shrink-0"
                                        style={statusStyle[part.status] || {}}>
                                        {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                                <p className="text-xs font-medium" style={{ color: C.muted }}>
                                    📍 {part.country}
                                </p>
                                <button onClick={() => deletePartnership(part.id)}
                                    className="text-xs font-semibold"
                                    style={{ color: '#dc2626' }}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs pb-4" style={{ color: C.mutedLt }}>
                    Showing {filteredPartnerships.length} of {partnerships.length} partnership inquiries
                </p>
            </main>
        </div>
    );
};

export default PartnershipsAdminDashboard;