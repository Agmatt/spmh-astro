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
    mutedL: '#9ca3af',
};

const statusStyle = {
    approved: { background: '#d1fae5', color: '#065f46' },
    completed: { background: '#dbeafe', color: '#1e40af' },
    cancelled: { background: '#fee2e2', color: '#991b1b' },
};

const statCardGradients = [
    'linear-gradient(135deg, #1c1c1e, #2d2d30)',
    'linear-gradient(135deg, #065f46, #059669)',
    'linear-gradient(135deg, #1e40af, #2563eb)',
    'linear-gradient(135deg, #860f0f, #a01212)',
];

const AdminDashboard = () => {
    const [authState, setAuthState] = useState('loading');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [user, setUser] = useState(null);

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [clinicFilter, setClinicFilter] = useState('all');
    const [dayFilter, setDayFilter] = useState('all');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [patientNameFilter, setPatientNameFilter] = useState('');
    const [emailSearchFilter, setEmailSearchFilter] = useState('');
    const [emailPresenceFilter, setEmailPresenceFilter] = useState('all');

    const idleTimerRef = useRef(null);
    const idleTimeoutRef = useRef(null);
    const IDLE_TIME = 15 * 60 * 1000;

    const statuses = ['approved', 'completed', 'cancelled'];

    const clinicDays = {
        sopc: 'Monday',
        mopc: 'Tuesday',
        obgyn: 'Wednesday',
        popc: 'Thursday',
    };

    const clinicNames = {
        sopc: 'SOPC (Surgical)',
        mopc: 'MOPC (Medical)',
        obgyn: 'OB/GYN',
        popc: 'POPC (Pediatric)',
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
            if (session?.user) { setUser(session.user); setAuthState('dashboard'); fetchBookings(); }
            else setAuthState('login');
        } catch (err) { setAuthState('login'); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) { setLoginError(error.message); return; }
            if (data.user) { setUser(data.user); setAuthState('dashboard'); setEmail(''); setPassword(''); fetchBookings(); }
        } catch (err) { setLoginError('Login failed. Please try again.'); }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null); setAuthState('login'); setBookings([]); setFilteredBookings([]);
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setBookings(data || []);
            applyFilters(data || []);
        } catch (err) { console.error('Error fetching bookings:', err); }
        finally { setLoading(false); }
    };

    const applyFilters = (data) => {
        let filtered = data;

        // CLINIC FILTER
        if (clinicFilter !== 'all') {
            filtered = filtered.filter(b => b.clinic_name === clinicFilter);
        }

        // DAY FILTER
        if (dayFilter !== 'all') {
            filtered = filtered.filter(b => b.clinic_day === dayFilter);
        }

        // DATE RANGE FILTER
        if (dateFromFilter) {
            filtered = filtered.filter(b => b.appointment_date >= dateFromFilter);
        }
        if (dateToFilter) {
            filtered = filtered.filter(b => b.appointment_date <= dateToFilter);
        }

        // PATIENT NAME FILTER
        if (patientNameFilter.trim()) {
            const searchTerm = patientNameFilter.toLowerCase().trim();
            filtered = filtered.filter(b =>
                b.full_name && b.full_name.toLowerCase().includes(searchTerm)
            );
        }

        // EMAIL SEARCH FILTER
        if (emailSearchFilter.trim()) {
            const searchTerm = emailSearchFilter.toLowerCase().trim();
            filtered = filtered.filter(b =>
                b.email && b.email.toLowerCase().includes(searchTerm)
            );
        }

        // EMAIL PRESENCE FILTER
        if (emailPresenceFilter !== 'all') {
            if (emailPresenceFilter === 'has') {
                filtered = filtered.filter(b => b.email && b.email.trim());
            } else if (emailPresenceFilter === 'missing') {
                filtered = filtered.filter(b => !b.email || !b.email.trim());
            }
        }

        // STATUS FILTER
        if (statusFilter !== 'all') {
            filtered = filtered.filter(b => b.status === statusFilter);
        }

        setFilteredBookings(filtered);
    };

    const handleFilterChange = () => {
        applyFilters(bookings);
    };

    const clearFilters = () => {
        setClinicFilter('all');
        setDayFilter('all');
        setDateFromFilter('');
        setDateToFilter('');
        setStatusFilter('all');
        setPatientNameFilter('');
        setEmailSearchFilter('');
        setEmailPresenceFilter('all');
        applyFilters(bookings);
    };

    const updateBookingStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
            fetchBookings();
        } catch (err) { console.error('Error updating booking:', err); }
    };

    const deleteBooking = async (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        try {
            const { error } = await supabase.from('appointments').delete().eq('id', id);
            if (error) throw error;
            fetchBookings();
        } catch (err) { console.error('Error deleting booking:', err); }
    };

    // ── LOGIN ────────────────────────────────────────────────────────────────
    if (authState === 'login') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
                style={{ background: C.dark }}>
                <img src="/your-background-image.jpg" alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'blur(6px)', transform: 'scale(1.05)', opacity: 0.18 }} />
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(120deg, rgba(28,28,30,0.95) 48%, rgba(134,15,15,0.5) 100%)' }} />
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="flex justify-center mb-6">
                        <img src="/your-form-image.png" alt="SPMH" className="h-14 w-auto object-contain" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: C.red }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-tight" style={{ color: C.dark }}>OPC Admin Portal</p>
                            <p className="text-xs" style={{ color: C.muted }}>SPMH Appointment Management</p>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: C.dark }}>Sign in</h2>
                    <p className="text-sm mb-6" style={{ color: C.muted }}>Access the appointments dashboard</p>
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
                            <div className="p-3 rounded-lg text-sm"
                                style={{ background: C.redBg, border: '1px solid #fecaca', color: '#b91c1c' }}>
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
    const statCards = [
        { label: 'Total Bookings', value: bookings.length },
        { label: 'With Email', value: bookings.filter(b => b.email && b.email.trim()).length },
        { label: 'No Email', value: bookings.filter(b => !b.email || !b.email.trim()).length },
        { label: 'Approved', value: bookings.filter(b => b.status === 'approved').length },
    ];

    const isFiltered = clinicFilter !== 'all' || dayFilter !== 'all' || dateFromFilter || dateToFilter || statusFilter !== 'all' || patientNameFilter.trim() || emailSearchFilter.trim() || emailPresenceFilter !== 'all';

    return (
        <div className="min-h-screen" style={{ background: C.warm }}>
            <header className="sticky top-0 z-40 bg-white border-b"
                style={{ borderColor: C.border, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center"
                            style={{ background: C.red }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: C.dark }}>
                                Appointments
                            </h1>
                            <p className="text-xs hidden sm:block" style={{ color: C.mutedL }}>
                                Welcome, {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href="/"
                            className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
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
                    {statCards.map((card, i) => (
                        <div key={card.label} className="rounded-xl p-4 sm:p-5"
                            style={{ background: statCardGradients[i] }}>
                            <p className="text-xs font-medium mb-1 text-white/60">{card.label}</p>
                            <p className="text-3xl font-bold text-white">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* FILTERS */}
                <div className="bg-white rounded-xl border p-4 sm:p-6" style={{ borderColor: C.border }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold" style={{ color: C.dark }}>Filters</h2>
                        {isFiltered && (
                            <button
                                onClick={clearFilters}
                                className="text-xs font-medium px-3 py-1 rounded-lg transition-colors"
                                style={{ background: C.redBg, color: C.red }}>
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Row 1: Patient Name, Email Search & Clinic */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Patient Name</label>
                            <input
                                type="text"
                                value={patientNameFilter}
                                onChange={e => { setPatientNameFilter(e.target.value); handleFilterChange(); }}
                                placeholder="Search by name..."
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Email Search</label>
                            <input
                                type="text"
                                value={emailSearchFilter}
                                onChange={e => { setEmailSearchFilter(e.target.value); handleFilterChange(); }}
                                placeholder="Search by email..."
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Email Status</label>
                            <select value={emailPresenceFilter}
                                onChange={e => { setEmailPresenceFilter(e.target.value); handleFilterChange(); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }}>
                                <option value="all">All</option>
                                <option value="has">Has Email</option>
                                <option value="missing">No Email</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Clinic, Day & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Clinic</label>
                            <select value={clinicFilter}
                                onChange={e => { setClinicFilter(e.target.value); handleFilterChange(); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }}>
                                <option value="all">All Clinics</option>
                                <option value="sopc">SOPC (Surgical)</option>
                                <option value="mopc">MOPC (Medical)</option>
                                <option value="obgyn">OB/GYN</option>
                                <option value="popc">POPC (Pediatric)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Day</label>
                            <select value={dayFilter}
                                onChange={e => { setDayFilter(e.target.value); handleFilterChange(); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }}>
                                <option value="all">All Days</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Status</label>
                            <select value={statusFilter}
                                onChange={e => { setStatusFilter(e.target.value); handleFilterChange(); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }}>
                                <option value="all">All Statuses</option>
                                <option value="approved">Approved</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3: Date Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Date From</label>
                            <input type="date" value={dateFromFilter}
                                onChange={e => { setDateFromFilter(e.target.value); handleFilterChange(); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: C.dark }}>Date To</label>
                            <input type="date" value={dateToFilter}
                                onChange={e => { setDateToFilter(e.target.value); handleFilterChange(); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: C.border, color: C.dark }} />
                        </div>
                    </div>
                </div>

                {/* Table — desktop */}
                <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ background: C.warm, borderBottom: `1px solid ${C.border}` }}>
                                <tr>
                                    {['Name', 'Phone', 'Email', 'Clinic', 'Day', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                                            style={{ color: C.red }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-10 text-center text-sm" style={{ color: C.mutedL }}>
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : filteredBookings.map((booking, idx) => (
                                    <tr key={booking.id}
                                        className="border-b transition-colors"
                                        style={{ borderColor: '#f3f4f6', background: idx % 2 === 0 ? '#fff' : C.warm }}
                                        onMouseEnter={e => e.currentTarget.style.background = C.redBg}
                                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : C.warm}>
                                        <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: C.dark }}>{booking.full_name}</td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{booking.phone}</td>
                                        <td className="px-5 py-3.5 text-sm">
                                            {booking.email ? (
                                                <a href={`mailto:${booking.email}`}
                                                    className="text-blue-600 hover:underline break-all"
                                                    title={booking.email}>
                                                    {booking.email.length > 25 ? booking.email.substring(0, 25) + '...' : booking.email}
                                                </a>
                                            ) : (
                                                <span style={{ color: C.mutedL, fontStyle: 'italic' }}>—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>
                                            {clinicNames[booking.clinic_name] || booking.clinic_name}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>
                                            {booking.clinic_day || clinicDays[booking.clinic_name]}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{booking.appointment_date}</td>
                                        <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{booking.appointment_time}</td>
                                        <td className="px-5 py-3.5">
                                            <select value={booking.status}
                                                onChange={e => updateBookingStatus(booking.id, e.target.value)}
                                                className="px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none"
                                                style={statusStyle[booking.status] || { background: '#f3f4f6', color: '#374151' }}>
                                                {statuses.map(s => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <button onClick={() => deleteBooking(booking.id)}
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
                        {filteredBookings.length === 0 ? (
                            <p className="px-4 py-10 text-center text-sm" style={{ color: C.mutedL }}>No bookings found</p>
                        ) : filteredBookings.map(booking => (
                            <div key={booking.id} className="p-4 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: C.dark }}>{booking.full_name}</p>
                                        <p className="text-xs" style={{ color: C.muted }}>{booking.phone}</p>
                                        {booking.email && (
                                            <a href={`mailto:${booking.email}`}
                                                className="text-xs text-blue-600 hover:underline block"
                                                title={booking.email}>
                                                {booking.email.length > 30 ? booking.email.substring(0, 30) + '...' : booking.email}
                                            </a>
                                        )}
                                    </div>
                                    <select value={booking.status}
                                        onChange={e => updateBookingStatus(booking.id, e.target.value)}
                                        className="px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none flex-shrink-0"
                                        style={statusStyle[booking.status] || {}}>
                                        {statuses.map(s => (
                                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: C.muted }}>
                                    <span>🏥 {clinicNames[booking.clinic_name] || booking.clinic_name}</span>
                                    <span>📅 {booking.appointment_date}</span>
                                    <span>⏰ {booking.appointment_time}</span>
                                    <span>📆 {booking.clinic_day || clinicDays[booking.clinic_name]}</span>
                                </div>
                                <button onClick={() => deleteBooking(booking.id)}
                                    className="text-xs font-semibold" style={{ color: '#dc2626' }}>
                                    Delete booking
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs pb-4" style={{ color: C.mutedL }}>
                    Showing {filteredBookings.length} of {bookings.length} bookings
                </p>
            </main>
        </div>
    );
};

export default AdminDashboard;