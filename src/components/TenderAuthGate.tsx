import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { createClient } from '@supabase/supabase-js';

// Own session, own audience (Accounts / Procurement), own login screen.
// This intentionally does NOT share AdminAuthGate — that gate is HR/Admin
// only. This client points at the same Supabase project because that's
// where the `tenders`, `tender_applications`, and `vendors` tables live,
// not because the two dashboards should share a login.
const SUPABASE_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ';

// Separate storageKey is the important part — without it, this client and
// AdminAuthGate's client would both persist their session under the same
// default localStorage key (since they share a project ref), and logging
// into one would silently log you into the other on the same browser.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { storageKey: 'spmh-tenders-auth' },
});

const TenderManager = lazy(() => import('./TenderManager'));

const IDLE_LIMIT_MS = 15 * 60 * 1000;
const IDLE_WARNING_MS = 2 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
const ACTIVITY_THROTTLE_MS = 1000;

const ModuleFallback = () => (
    <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
            <div className="w-7 h-7 border-2 border-slate-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading module…</p>
        </div>
    </div>
);

const TenderAuthGate = () => {
    const [session, setSession] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [showIdleWarning, setShowIdleWarning] = useState(false);
    const [idleSecondsLeft, setIdleSecondsLeft] = useState(Math.floor(IDLE_WARNING_MS / 1000));
    const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    useEffect(() => {
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

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });
        return () => subscription?.unsubscribe();
    }, []);

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
        } catch (err: any) {
            setAuthError(err.message || 'Invalid credentials.');
            setIsLoggingIn(false);
        }
    };

    // Optimistic logout — UI clears instantly, signOut() finishes in the background.
    const handleLogout = useCallback(() => {
        setIsLoggingOut(true);
        setShowIdleWarning(false);
        setSession(null);
        setEmail('');
        setPassword('');

        supabase.auth.signOut().catch((err) => {
            console.error('Logout error:', err);
        }).finally(() => {
            setIsLoggingOut(false);
        });
    }, []);

    const clearIdleTimers = useCallback(() => {
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        warningTimerRef.current = null;
        logoutTimerRef.current = null;
        countdownIntervalRef.current = null;
    }, []);

    const startCountdown = useCallback(() => {
        setShowIdleWarning(true);
        setIdleSecondsLeft(Math.floor(IDLE_WARNING_MS / 1000));
        countdownIntervalRef.current = setInterval(() => {
            setIdleSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
    }, []);

    const resetIdleTimers = useCallback(() => {
        clearIdleTimers();
        setShowIdleWarning(false);
        warningTimerRef.current = setTimeout(startCountdown, IDLE_LIMIT_MS - IDLE_WARNING_MS);
        logoutTimerRef.current = setTimeout(handleLogout, IDLE_LIMIT_MS);
    }, [clearIdleTimers, startCountdown, handleLogout]);

    useEffect(() => {
        if (!session) {
            clearIdleTimers();
            return;
        }
        resetIdleTimers();

        const onActivity = () => {
            const now = Date.now();
            if (now - lastActivityRef.current < ACTIVITY_THROTTLE_MS) return;
            lastActivityRef.current = now;
            resetIdleTimers();
        };

        ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, onActivity, { passive: true }));
        return () => {
            ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
            clearIdleTimers();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const staySignedIn = useCallback(() => {
        lastActivityRef.current = Date.now();
        resetIdleTimers();
    }, [resetIdleTimers]);

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-secondary)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-600 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Initializing Portal...</p>
                </div>
            </div>
        );
    }

    // RENDER: Login Screen
    if (!session) {
        return (
            <div className="min-h-screen flex bg-white font-sans">
                {/* LEFT: Institutional visual, procurement-specific messaging */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--color-secondary)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-[var(--color-secondary)]/95 to-slate-900/95"></div>
                    <div className="relative z-10 w-full flex flex-col justify-between p-12 lg:p-20 text-white">
                        <div>
                            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-white block mb-4">
                                Accounts &amp; Procurement
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-light tracking-tight leading-[1.15] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                                Tender & Vendor<br /><span className="font-bold text-[var(--color-primary-light)]">Management Portal</span>
                            </h1>
                            <p className="text-sm text-slate-300 font-medium max-w-md leading-relaxed">
                                Post tenders, review submitted applications, and manage the vendor registry for St. Paul's Mission Hospital.
                            </p>
                        </div>
                        <div className="mt-auto">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                Accounts &amp; Procurement Access Only
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Login form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-2 md:p-6 sm:p-12 lg:p-24 bg-gray-200">
                    <div className="w-full max-w-sm bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-[var(--color-border)]">
                        <div className="mb-10">
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--color-primary)] block mb-2">
                                Procurement Office
                            </span>
                            <h2 className="text-2xl font-black text-[var(--color-secondary)] tracking-tight">Portal Access</h2>
                            <p className="text-sm text-slate-500 font-medium mt-3">Sign in with your accounts credentials</p>
                        </div>

                        {authError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 text-sm font-semibold rounded-lg">
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="accounts@spmh.co.ke"
                                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 focus:border-[var(--color-primary)] transition-all text-sm font-medium"
                                    disabled={isLoggingIn}
                                    autoComplete="email"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 focus:border-[var(--color-primary)] transition-all text-sm font-medium"
                                    disabled={isLoggingIn}
                                    autoComplete="current-password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full bg-[var(--color-primary)] hover:opacity-90 text-white font-bold uppercase tracking-wider text-sm py-3 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isLoggingIn ? 'Authenticating...' : 'Access Portal'}
                            </button>
                        </form>

                        <p className="mt-8 text-[11px] text-slate-400 text-center leading-relaxed">
                            Sessions end automatically after 15 minutes of inactivity.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: Authenticated
    return (
        <div className="min-h-screen bg-[var(--color-surface)]">
            <header className="bg-[var(--color-secondary)] border-b border-slate-700/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--color-primary-light)]">
                                Accounts &amp; Procurement
                            </span>
                            <h1 className="text-base md:text-lg font-bold text-white tracking-tight">Tender &amp; Vendor Portal</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white border border-slate-600 hover:border-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50"
                        >
                            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full">
                <Suspense fallback={<ModuleFallback />}>
                    <TenderManager />
                </Suspense>
            </main>

            {showIdleWarning && (
                <div className="fixed inset-0 z-[60] bg-slate-950/50 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[var(--color-border)] p-7 text-center">
                        <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600 font-bold text-lg select-none">
                            !
                        </div>
                        <h3 className="text-sm font-black text-[var(--color-secondary)] uppercase tracking-wide mb-2">Still there?</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-1">
                            You've been idle. For security, this session will end in
                        </p>
                        <p className="text-2xl font-black text-[var(--color-accent)] font-mono mb-5 tabular-nums">
                            {Math.floor(idleSecondsLeft / 60)}:{String(idleSecondsLeft % 60).padStart(2, '0')}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={staySignedIn}
                                className="flex-1 bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold uppercase tracking-wide py-2.5 rounded-lg transition-colors"
                            >
                                Stay Signed In
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 border border-[var(--color-border)] text-slate-600 hover:bg-[var(--color-surface)] text-xs font-bold uppercase tracking-wide py-2.5 rounded-lg transition-colors"
                            >
                                Sign Out Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenderAuthGate;