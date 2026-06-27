import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AdminDashboard = () => {
    const [authState, setAuthState] = useState('loading'); // loading | login | dashboard
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [user, setUser] = useState(null);

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [serviceFilter, setServiceFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    // Idle timeout
    const idleTimerRef = useRef(null);
    const idleTimeoutRef = useRef(null);
    const IDLE_TIME = 15 * 60 * 1000; // 15 minutes

    const services = ['general', 'maternity', 'emergency', 'pediatric', 'surgical', 'dental'];
    const statuses = ['pending', 'approved', 'completed', 'cancelled'];

    // Check auth on mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Idle detection
    useEffect(() => {
        if (authState !== 'dashboard') return;

        const resetIdleTimer = () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

            idleTimeoutRef.current = setTimeout(() => {
                handleLogout();
            }, IDLE_TIME);
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            window.addEventListener(event, resetIdleTimer);
        });

        resetIdleTimer();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, resetIdleTimer);
            });
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        };
    }, [authState]);

    const checkAuth = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                setAuthState('dashboard');
                fetchBookings();
            } else {
                setAuthState('login');
            }
        } catch (err) {
            setAuthState('login');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setLoginError(error.message);
                return;
            }

            if (data.user) {
                setUser(data.user);
                setAuthState('dashboard');
                setEmail('');
                setPassword('');
                fetchBookings();
            }
        } catch (err) {
            setLoginError('Login failed. Please try again.');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setAuthState('login');
        setBookings([]);
        setFilteredBookings([]);
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
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (data) => {
        let filtered = data;

        if (serviceFilter !== 'all') {
            filtered = filtered.filter(b => b.service === serviceFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(b => b.status === statusFilter);
        }

        if (dateFilter) {
            filtered = filtered.filter(b => b.appointment_date === dateFilter);
        }

        setFilteredBookings(filtered);
    };

    const handleFilterChange = () => {
        applyFilters(bookings);
    };

    const updateBookingStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchBookings();
        } catch (err) {
            console.error('Error updating booking:', err);
        }
    };

    const deleteBooking = async (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        try {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchBookings();
        } catch (err) {
            console.error('Error deleting booking:', err);
        }
    };

    // ── LOGIN SCREEN ────────────────────────────────────────────────────────────
    if (authState === 'login') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                {/* ── SLOT 1: Replace this src with your background image path ── */}
                <img
                    src="/img/9.jpg"
                    alt="bg image"
                    loading='lazy'
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'blur(6px)', transform: 'scale(1.05)' }}
                />
                {/* Dark overlay so the form stays readable */}
                <div className="absolute inset-0" style={{ background: 'rgba(13, 59, 110, 0.55)' }} />
                <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 w-full max-w-md relative z-10">
                    {/* ── SLOT 2: Replace this src with your form image path ── */}
                    <div className="flex justify-center mb-6">
                        <img
                            src="/gallery/bg.png"
                            loading='lazy'
                            alt="SPMH"
                            className="h-30 w-auto object-contain"
                        />
                    </div>
                    {/* Brand strip */}
                    <h2 className="text-2xl font-bold mb-1" style={{ color: '#0d3b6e' }}>Sign in</h2>
                    <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Access the appointments portal</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@spmh.co.ke"
                                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all"
                                style={{ borderColor: '#d1d5db', color: '#111827' }}
                                onFocus={e => e.target.style.borderColor = '#125276'}
                                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all"
                                style={{ borderColor: '#d1d5db', color: '#111827' }}
                                onFocus={e => e.target.style.borderColor = '#125276'}
                                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                                required
                            />
                        </div>

                        {loginError && (
                            <div className="p-3 rounded-lg text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}>
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
                            style={{ background: 'linear-gradient(90deg, #0d3b6e, #125276)' }}
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── LOADING SCREEN ──────────────────────────────────────────────────────────
    if (authState === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4f8' }}>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin"
                        style={{ border: '3px solid #e5e7eb', borderTopColor: '#125276' }}></div>
                    <p className="text-sm" style={{ color: '#6b7280' }}>Loading...</p>
                </div>
            </div>
        );
    }

    // ── DASHBOARD ───────────────────────────────────────────────────────────────
    const statCardColors = [
        { bg: 'linear-gradient(135deg, #0d3b6e, #125276)', text: '#fff', label: '#bfdbfe' },
        { bg: 'linear-gradient(135deg, #92400e, #b45309)', text: '#fff', label: '#fde68a' },
        { bg: 'linear-gradient(135deg, #1e40af, #2563eb)', text: '#fff', label: '#bfdbfe' },
        { bg: 'linear-gradient(135deg, #065f46, #059669)', text: '#fff', label: '#a7f3d0' },
    ];
    const statCards = [
        { label: 'Total Bookings', value: bookings.length },
        { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
        { label: 'Approved', value: bookings.filter(b => b.status === 'approved').length },
        { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
    ];

    return (
        <div className="min-h-screen" style={{ background: '#f0f4f8' }}>

            {/* ── Header ── */}
            <header className="sticky top-0 z-40 border-b"
                style={{ background: '#fff', borderColor: '#e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center"
                            style={{ background: '#125276' }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: '#0d3b6e' }}>
                                Appointments
                            </h1>
                            <p className="text-xs hidden sm:block" style={{ color: '#9ca3af' }}>
                                Welcome, {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="/"
                            className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
                            style={{ borderColor: '#d1d5db', color: '#374151' }}
                        >
                            ← Website
                        </a>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                            style={{ background: '#860F0F' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {statCards.map((card, i) => (
                        <div key={card.label} className="rounded-xl p-4 sm:p-5"
                            style={{ background: statCardColors[i].bg }}>
                            <p className="text-xs font-medium mb-1" style={{ color: statCardColors[i].label }}>
                                {card.label}
                            </p>
                            <p className="text-3xl font-bold" style={{ color: statCardColors[i].text }}>
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border p-4 sm:p-6" style={{ borderColor: '#e5e7eb' }}>
                    <h2 className="text-sm font-semibold mb-4" style={{ color: '#0d3b6e' }}>Filters</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Service</label>
                            <select
                                value={serviceFilter}
                                onChange={(e) => { setServiceFilter(e.target.value); applyFilters(bookings); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: '#d1d5db', color: '#111827' }}
                            >
                                <option value="all">All Services</option>
                                {services.map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); applyFilters(bookings); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: '#d1d5db', color: '#111827' }}
                            >
                                <option value="all">All Statuses</option>
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Date</label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => { setDateFilter(e.target.value); applyFilters(bookings); }}
                                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                                style={{ borderColor: '#d1d5db', color: '#111827' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bookings — table on md+, cards on mobile */}
                <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                                <tr>
                                    {['Name', 'Phone', 'Service', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                                            style={{ color: '#125276' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-sm" style={{ color: '#9ca3af' }}>
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking, idx) => (
                                        <tr key={booking.id}
                                            className="border-b transition-colors"
                                            style={{
                                                borderColor: '#f3f4f6',
                                                background: idx % 2 === 0 ? '#fff' : '#f9fafb'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                                            onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f9fafb'}
                                        >
                                            <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#111827' }}>{booking.full_name}</td>
                                            <td className="px-5 py-3.5 text-sm" style={{ color: '#374151' }}>{booking.phone}</td>
                                            <td className="px-5 py-3.5 text-sm capitalize" style={{ color: '#374151' }}>{booking.service}</td>
                                            <td className="px-5 py-3.5 text-sm" style={{ color: '#374151' }}>{booking.appointment_date}</td>
                                            <td className="px-5 py-3.5 text-sm" style={{ color: '#374151' }}>{booking.appointment_time}</td>
                                            <td className="px-5 py-3.5">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                                    className="px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none"
                                                    style={
                                                        booking.status === 'pending' ? { background: '#fef3c7', color: '#92400e' } :
                                                            booking.status === 'approved' ? { background: '#dbeafe', color: '#1e40af' } :
                                                                booking.status === 'completed' ? { background: '#d1fae5', color: '#065f46' } :
                                                                    { background: '#fee2e2', color: '#991b1b' }
                                                    }
                                                >
                                                    {statuses.map(s => (
                                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    onClick={() => deleteBooking(booking.id)}
                                                    className="text-xs font-semibold transition-colors"
                                                    style={{ color: '#dc2626' }}
                                                    onMouseEnter={e => e.target.style.color = '#991b1b'}
                                                    onMouseLeave={e => e.target.style.color = '#dc2626'}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y" style={{ borderColor: '#f3f4f6' }}>
                        {filteredBookings.length === 0 ? (
                            <p className="px-4 py-10 text-center text-sm" style={{ color: '#9ca3af' }}>No bookings found</p>
                        ) : (
                            filteredBookings.map(booking => (
                                <div key={booking.id} className="p-4 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#111827' }}>{booking.full_name}</p>
                                            <p className="text-xs" style={{ color: '#6b7280' }}>{booking.phone}</p>
                                        </div>
                                        <select
                                            value={booking.status}
                                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                            className="px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none flex-shrink-0"
                                            style={
                                                booking.status === 'pending' ? { background: '#fef3c7', color: '#92400e' } :
                                                    booking.status === 'approved' ? { background: '#dbeafe', color: '#1e40af' } :
                                                        booking.status === 'completed' ? { background: '#d1fae5', color: '#065f46' } :
                                                            { background: '#fee2e2', color: '#991b1b' }
                                            }
                                        >
                                            {statuses.map(s => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: '#6b7280' }}>
                                        <span className="capitalize">📋 {booking.service}</span>
                                        <span>📅 {booking.appointment_date}</span>
                                        <span>⏰ {booking.appointment_time}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteBooking(booking.id)}
                                        className="text-xs font-semibold"
                                        style={{ color: '#dc2626' }}
                                    >
                                        Delete booking
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <p className="text-xs pb-4" style={{ color: '#9ca3af' }}>
                    Showing {filteredBookings.length} of {bookings.length} bookings
                </p>
            </main>
        </div>
    );
};

export default AdminDashboard;