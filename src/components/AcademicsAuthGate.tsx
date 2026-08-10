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
}

export default function AcademicsAuthGate({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        // Check current session
        const checkAuth = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (data?.session) {
                setAuth({
                    user: data.session.user,
                    session: data.session,
                    isLoading: false,
                    error: null,
                });
            } else {
                setAuth((prev) => ({ ...prev, isLoading: false }));
            }
        };

        checkAuth();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setAuth({
                    user: session.user,
                    session,
                    isLoading: false,
                    error: null,
                });
            } else {
                setAuth({ user: null, session: null, isLoading: false, error: null });
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

    if (!auth.user) {
        return <LoginRegisterPage setAuth={setAuth} />;
    }

    return <>{children}</>;
}

function LoginRegisterPage({
    setAuth,
}: {
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}) {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        homeInstitution: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        setIsLoading(false);

        if (error) {
            setError(error.message || 'Login failed. Please try again.');
        } else if (data.session) {
            setAuth({
                user: data.user,
                session: data.session,
                isLoading: false,
                error: null,
            });
            setSuccess('Logged in successfully!');
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (authError) {
            setError(authError.message || 'Sign up failed. Please try again.');
            setIsLoading(false);
            return;
        }

        if (authData.user) {
            // Create student profile in students table
            const { error: profileError } = await supabase.from('students').insert([
                {
                    id: authData.user.id,
                    email: formData.email,
                    full_name: formData.fullName,
                    phone: formData.phone,
                    home_institution: formData.homeInstitution,
                },
            ]);

            if (profileError) {
                setError('Failed to create profile. Please try again.');
                setIsLoading(false);
                return;
            }

            // Create welcome notification
            await supabase.from('application_notifications').insert([
                {
                    student_id: authData.user.id,
                    type: 'account_created',
                    title: 'Welcome to SPMH Academics',
                    message: `Your account has been created successfully. Check your email to verify your account before logging in.`,
                },
            ]);

            setSuccess(
                'Account created! Check your email to verify your account, then log in.'
            );
            setFormData({
                email: '',
                password: '',
                fullName: '',
                phone: '',
                homeInstitution: '',
            });
            setIsLogin(true);
        }

        setIsLoading(false);
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Please enter your email address.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
            redirectTo: `${window.location.origin}/academics-and-internships/reset-password`,
        });

        setIsLoading(false);

        if (error) {
            setError(error.message || 'Failed to send reset email.');
        } else {
            setSuccess('Password reset email sent. Check your inbox.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8">
                    {/* Logo/Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600 font-bold text-lg mb-4">
                            S
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">SPMH Academics</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mt-2">
                            Student Portal
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 border-b border-slate-200">
                        <button
                            onClick={() => {
                                setIsLogin(true);
                                setError(null);
                                setSuccess(null);
                            }}
                            className={`flex-1 pb-3 text-sm font-medium transition-colors ${isLogin
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}>
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false);
                                setError(null);
                                setSuccess(null);
                            }}
                            className={`flex-1 pb-3 text-sm font-medium transition-colors ${!isLogin
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}>
                            Sign Up
                        </button>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                            {success}
                        </div>
                    )}

                    {/* Login Form */}
                    {isLogin ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    placeholder="you@student.edu"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
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
                    ) : (
                        /* Sign Up Form */
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    placeholder="you@student.edu"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    placeholder="+254 700 000000"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                    Home Institution
                                </label>
                                <input
                                    type="text"
                                    name="homeInstitution"
                                    value={formData.homeInstitution}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    placeholder="University Name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition-colors">
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <p className="text-xs text-slate-500 text-center mt-6">
                        By continuing, you agree to our{' '}
                        <a href="/academics-and-internships/terms" className="text-blue-600 underline">
                            Terms of Attachment
                        </a>
                        {' '}and{' '}
                        <a href="/academics-and-internships/privacy-policy" className="text-blue-600 underline">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}