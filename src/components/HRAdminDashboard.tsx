import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface AuthState {
    user: any;
    session: any;
    isLoading: boolean;
    error: string | null;
    isHRAdmin: boolean;
}

export default function HRAdminAuthGate({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
        error: null,
        isHRAdmin: false,
    });

    useEffect(() => {
        const checkAuth = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (data?.session) {
                // Check for HR admin custom claims
                const user = data.session.user;
                const isHRAdmin = user.user_metadata?.role === 'hr_admin' ||
                    user.app_metadata?.role === 'hr_admin';

                if (!isHRAdmin) {
                    // Not an HR admin, redirect or deny access
                    setAuth({
                        user: null,
                        session: null,
                        isLoading: false,
                        error: 'Access denied. Only HR administrators can access this portal.',
                        isHRAdmin: false,
                    });
                    return;
                }

                setAuth({
                    user,
                    session: data.session,
                    isLoading: false,
                    error: null,
                    isHRAdmin: true,
                });
            } else {
                setAuth((prev) => ({ ...prev, isLoading: false }));
            }
        };

        checkAuth();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                const user = session.user;
                const isHRAdmin = user.user_metadata?.role === 'hr_admin' ||
                    user.app_metadata?.role === 'hr_admin';

                if (!isHRAdmin) {
                    setAuth({
                        user: null,
                        session: null,
                        isLoading: false,
                        error: 'Access denied. Only HR administrators can access this portal.',
                        isHRAdmin: false,
                    });
                    return;
                }

                setAuth({
                    user,
                    session,
                    isLoading: false,
                    error: null,
                    isHRAdmin: true,
                });
            } else {
                setAuth({
                    user: null,
                    session: null,
                    isLoading: false,
                    error: null,
                    isHRAdmin: false,
                });
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    if (auth.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center space-y-4">
                    <div className="h-10 w-10 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto"></div>
                    <p className="text-slate-600 text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (auth.error || !auth.isHRAdmin) {
        return <LoginPage error={auth.error} />;
    }

    if (!auth.user) {
        return <LoginPage />;
    }

    return <>{children}</>;
}

interface LoginPageProps {
    error?: string | null;
}

function LoginPage({ error }: LoginPageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(error || null);
    const [resetSent, setResetSent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setIsLoading(true);

        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setIsLoading(false);

        if (loginError) {
            setLoginError(loginError.message || 'Login failed. Please check your credentials.');
        } else if (data.session) {
            // Auth state will update automatically via onAuthStateChange
            setEmail('');
            setPassword('');
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setLoginError('Please enter your email address.');
            return;
        }

        setIsLoading(true);
        setLoginError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/admin/academics/reset-password`,
        });

        setIsLoading(false);

        if (error) {
            setLoginError(error.message || 'Failed to send reset email.');
        } else {
            setResetSent(true);
            setTimeout(() => setResetSent(false), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600 font-bold text-lg mb-4">
                            S
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">SPMH Academics</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mt-2">
                            Manager Portal
                        </p>
                    </div>

                    {/* Error Messages */}
                    {loginError && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
                            {loginError}
                        </div>
                    )}

                    {resetSent && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                            Password reset email sent. Check your inbox.
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition-colors">
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={isLoading}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </button>
                        </div>
                    </form>

                    {/* Footer Note */}
                    <p className="text-xs text-slate-500 text-center mt-6 pt-6 border-t border-slate-200">
                        This portal is for authorized SPMH HR and Academics management staff only.
                    </p>
                </div>
            </div>
        </div>
    );
}