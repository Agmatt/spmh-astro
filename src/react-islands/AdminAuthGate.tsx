import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import ApplicationsAdminDashboard from './ApplicationsDashboard';
import CareerAdmin from './CareerAdmin';
import PartnershipsAdminDashboard from './PartnershipsAdminDashboard';
import VolunteersAdminDashboard from './VolunteersAdminDashboard';

// Applications Project (Appointments, Careers, etc.)
const SUPABASE_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ';

// Partnerships/Volunteers Project
const SUPABASE_URL_PV = 'https://zzlngxryoalajdpsbpnn.supabase.co';
const SUPABASE_ANON_KEY_PV = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bG5neHJ5b2FsYWpkcHNicG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MDk3NjYsImV4cCI6MjA5ODE4NTc2Nn0.NN2MqqqOITkizXpMw1qrAwbb4GYIySa7jsIcWnmP-Ag';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabasePV = createClient(SUPABASE_URL_PV, SUPABASE_ANON_KEY_PV);

const AdminAuthGate = () => {
    const [session, setSession] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [activeTab, setActiveTab] = useState<'appointments' | 'careers' | 'partnerships' | 'volunteers'>('appointments');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Single source of truth for auth state using onAuthStateChange
    useEffect(() => {
        // Check for existing session immediately
        const initializeAuth = async () => {
            try {
                const { data: { session: existingSession } } = await supabase.auth.getSession();
                setSession(existingSession);
            } catch (err) {
                console.error('Error checking session:', err);
            } finally {
                setIsInitializing(false);
            }
        };

        initializeAuth();

        // Listen for auth changes (login/logout from other tabs, token refresh, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => subscription?.unsubscribe();
    }, []); // Only run once on mount

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setAuthError('Please provide both institutional email and password.');
            return;
        }

        setIsLoggingIn(true);
        setAuthError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            // Session will be updated via onAuthStateChange listener
        } catch (err: any) {
            setAuthError(err.message || 'Invalid administrative credentials.');
            setIsLoggingIn(false);
        }
    };

    // Optimistic logout: clear UI immediately, let signOut happen in background
    const handleLogout = useCallback(() => {
        setIsLoggingOut(true);
        setSession(null); // Clear UI immediately
        setEmail('');
        setPassword('');
        setActiveTab('appointments');

        // Async sign out in background without blocking
        supabase.auth.signOut().catch(err => {
            console.error('Logout error:', err);
            // Session is already cleared from UI, so this is non-blocking
        }).finally(() => {
            setIsLoggingOut(false);
        });
    }, []);

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-600 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Initializing System...</p>
                </div>
            </div>
        );
    }

    // RENDER: Login Screen
    if (!session) {
        return (
            <div className="min-h-screen flex bg-white font-sans">
                {/* LEFT COLUMN: Institutional Visual */}
                <div
                    className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-no-repeat overflow-hidden"
                    style={{ backgroundImage: `url('/img/8.jpg')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-blue-950/90 to-slate-900/95 mix-blend-multiply"></div>

                    <div className="relative z-10 w-full flex flex-col justify-between p-12 lg:p-20 text-white">
                        <div>
                            <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.1] mb-6">
                                St. Paul's<br />Mission Hospital
                            </h1>
                            <p className="text-base text-blue-100 font-medium max-w-md leading-relaxed opacity-95">
                                Institutional Management System. Centralized control for clinical operations, personnel administration, and partner relations.
                            </p>
                        </div>

                        <div className="mt-auto">
                            <p className="text-xs font-bold tracking-widest uppercase text-blue-300/70">
                                System v2.5 • Authorized Personnel Only
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-slate-50">
                    <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                        <div className="mb-10">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Access</h2>
                            <p className="text-sm text-slate-600 font-medium mt-3">Enter institutional credentials to proceed</p>
                        </div>

                        {authError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 text-sm font-semibold rounded-lg">
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">Institutional Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@spmh.co.ke"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 focus:border-blue-600 transition-all text-sm font-medium"
                                    disabled={isLoggingIn}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">Access Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 focus:border-blue-600 transition-all text-sm font-medium"
                                    disabled={isLoggingIn}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold uppercase tracking-wider text-sm py-3 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
                            >
                                {isLoggingIn ? 'Authenticating...' : 'Access Dashboard'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: Authenticated Dashboard
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* INSTITUTIONAL HEADER */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
                        {/* BRANDING */}
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-blue-600 tracking-widest uppercase">SPMH Administration</span>
                            <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Central Management System</h1>
                        </div>

                        {/* NAV & CONTROLS */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* TAB NAVIGATION */}
                            <nav className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
                                {[
                                    { id: 'appointments', label: 'Appointments' },
                                    { id: 'careers', label: 'Careers' },
                                    { id: 'partnerships', label: 'Partnerships' },
                                    { id: 'volunteers', label: 'Volunteers' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-3 md:px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-lg transition-all duration-150 ${activeTab === tab.id
                                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>

                            {/* LOGOUT BUTTON */}
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-red-600 border border-slate-300 hover:border-red-300 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT AREA */}
            <main className="w-full">
                {activeTab === 'appointments' && (
                    <div className="animate-fadeIn">
                        <ApplicationsAdminDashboard />
                    </div>
                )}
                {activeTab === 'careers' && (
                    <div className="animate-fadeIn">
                        <CareerAdmin />
                    </div>
                )}
                {activeTab === 'partnerships' && (
                    <div className="animate-fadeIn">
                        <PartnershipsAdminDashboard supabase={supabasePV} session={session} />
                    </div>
                )}
                {activeTab === 'volunteers' && (
                    <div className="animate-fadeIn">
                        <VolunteersAdminDashboard supabase={supabasePV} session={session} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminAuthGate;