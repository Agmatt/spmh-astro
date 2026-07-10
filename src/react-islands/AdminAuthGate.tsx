import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ApplicationsAdminDashboard from './ApplicationsDashboard';
import CareerAdmin from './CareerAdmin';

const SUPABASE_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AdminAuthGate = () => {
    const [session, setSession] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [activeTab, setActiveTab] = useState<'appointments' | 'careers'>('appointments');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setCheckingAuth(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setAuthError('Please provide both institutional email and password.');
            return;
        }

        setLoggingIn(true);
        setAuthError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (err: any) {
            setAuthError(err.message || 'Invalid administrative credentials.');
        } finally {
            setLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Securing Connection...</p>
                </div>
            </div>
        );
    }

    // RENDER: Top-Tier Institutional Split-Screen Login
    if (!session) {
        return (
            <div className="min-h-screen flex bg-white font-sans">

                {/* LEFT COLUMN: Hospital Visual (Hidden on mobile) */}
                <div
                    className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-no-repeat overflow-hidden"
                    style={{ backgroundImage: `url('/img/8.jpg')` }} /* <-- Update this filename to match the image in your public folder */
                >
                    {/* Deep Blue Institutional Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-slate-900/90 mix-blend-multiply"></div>

                    <div className="relative z-10 w-full flex flex-col justify-between p-12 lg:p-20 text-white">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6">
                                St. Paul's <br />Mission Hospital
                            </h1>
                            <p className="text-lg text-blue-100 font-medium max-w-md leading-relaxed opacity-90">
                                Centralized administrative control for clinical operations, staff management, and departmental logistics.
                            </p>
                        </div>

                        <div className="mt-auto">
                            <p className="text-xs font-bold tracking-widest uppercase text-blue-300/60">
                                System Version 2.4 • Authorized Personnel Only
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Minimalist Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 lg:p-24 bg-muted/50">
                    <div className="w-full max-w-md bg-white p-4 md:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                        <div className="mb-10">
                            <h2 className="text-2xl font-black text-secondary tracking-tight">System Login</h2>
                            <p className="text-sm text-gray-500 font-medium mt-2">Enter your institutional credentials to proceed.</p>
                        </div>

                        {authError && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold rounded-r-lg">
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Institutional Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@spmh.co.ke"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Access Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm font-medium"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loggingIn}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider text-sm py-4 rounded-xl transition-all disabled:opacity-70 shadow-lg shadow-blue-600/20 mt-4"
                            >
                                {loggingIn ? 'Authenticating...' : 'Access Dashboard'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: Authenticated Dashboard (Unchanged Layout)
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
                        <div>
                            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">SPMH Management Portal</span>
                            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">CENTRAL ADMINISTRATIVE SYSTEM</h1>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <nav className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                                <button
                                    onClick={() => setActiveTab('appointments')}
                                    className={`px-4 md:px-5 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-lg transition-all duration-200 ${activeTab === 'appointments'
                                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                                            : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Appointments
                                </button>
                                <button
                                    onClick={() => setActiveTab('careers')}
                                    className={`px-4 md:px-5 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-lg transition-all duration-200 ${activeTab === 'careers'
                                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                                            : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    HR Careers
                                </button>
                            </nav>

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-all"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="w-full">
                {activeTab === 'appointments' ? (
                    <div className="animate-fadeIn">
                        <ApplicationsAdminDashboard />
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        <CareerAdmin />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminAuthGate;