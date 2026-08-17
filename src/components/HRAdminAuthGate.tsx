import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_ACADEMICS_URL,
    import.meta.env.PUBLIC_SUPABASE_ACADEMICS_ANON_KEY
);

const IDLE_TIME = 15 * 60 * 1000; // 15 minutes

interface AuthState {
    user: any;
    session: any;
    isLoading: boolean;
}

export default function HRAdminAuthGate({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
    });

    const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session?.user) {
                    setAuth({
                        user: session.user,
                        session,
                        isLoading: false,
                    });
                } else {
                    setAuth({
                        user: null,
                        session: null,
                        isLoading: false,
                    });
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                setAuth({
                    user: null,
                    session: null,
                    isLoading: false,
                });
            }
        };

        checkAuth();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setAuth({
                    user: session.user,
                    session,
                    isLoading: false,
                });
            } else {
                setAuth({
                    user: null,
                    session: null,
                    isLoading: false,
                });
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    // Idle logout
    useEffect(() => {
        if (!auth.user) return;

        const resetIdleTimer = () => {
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = setTimeout(() => {
                handleLogout();
            }, IDLE_TIME);
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach((event) => window.addEventListener(event, resetIdleTimer));
        resetIdleTimer();

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, resetIdleTimer),
            );
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        };
    }, [auth.user]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setAuth({
            user: null,
            session: null,
            isLoading: false,
        });
    };

    if (auth.isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-[#F7F9FB]'>
                <div className='text-center'>
                    <div
                        className='w-12 h-12 rounded-full mx-auto mb-4 animate-spin'
                        style={{
                            border: '3px solid #D8E0E7',
                            borderTopColor: '#1565c0',
                        }}
                    />
                    <p className="font-['Outfit'] text-sm text-[#7A8A96]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!auth.user) {
        return <LoginPage />;
    }

    return (
        <>
            {/* Auth Context Provider - Logout available to children */}
            <AuthContext.Provider value={{ user: auth.user, handleLogout }}>
                {children}
            </AuthContext.Provider>
        </>
    );
}

export const AuthContext = React.createContext<{
    user: any;
    handleLogout: () => Promise<void>;
}>({
    user: null,
    handleLogout: async () => { },
});

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setLoginError(error.message || 'Login failed. Please check your credentials.');
                setIsLoading(false);
                return;
            }

            if (data.user) {
                setEmail('');
                setPassword('');
                // Auth state will update automatically
            }
        } catch (err) {
            setLoginError('Login failed. Please try again.');
            console.error(err);
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setLoginError('Please enter your email address.');
            return;
        }

        setIsLoading(true);
        setLoginError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/academics/reset-password`,
            });

            if (error) {
                setLoginError(error.message || 'Failed to send reset email.');
                setIsLoading(false);
                return;
            }

            setResetSent(true);
            setTimeout(() => setResetSent(false), 5000);
        } catch (err) {
            setLoginError('Failed to send reset email.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden'>
            <img
                src='/gallery/ed.jpg'
                alt='background image'
                loading='eager'
                className='absolute inset-0 w-full h-full object-cover'
                style={{ transform: 'scale(1.05)', opacity: 0.8 }}
            />
            <div
                className='absolute inset-0 pointer-events-none'
                style={{
                    background:
                        'linear-gradient(20deg, rgba(20,08,30,0.95), rgba(104,15,15,0.5) 70%)',
                }}
            />
            <div
                className='absolute inset-0 pointer-events-none opacity-[0.04]'
                style={{
                    backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            <div className='relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 md:p-8'>
                <div className='flex justify-center mb-6'>
                    <img
                        src='/gallery/bg.png'
                        alt='SPMH'
                        className='h-26 w-auto object-contain'
                        loading='eager'
                    />
                </div>

                <h2 className="text-2xl font-bold mb-1 font-['Lato'] text-[#1c1c1e]">
                    Academics Manager
                </h2>
                <p className="text-sm mb-6 font-['Open Sans'] text-[#6b7280]">
                    Sign in to manage student applications & partnerships
                </p>

                <form onSubmit={handleLogin} className='space-y-4'>
                    <div>
                        <label className="block text-xs font-semibold mb-1.5 font-['Open Sans'] text-[#1c1c1e]">
                            Email
                        </label>
                        <input
                            type='email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='hr@spmh.co.ke'
                            className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all font-['Outfit'] border-[#ece8e1] text-[#1c1c1e] focus:border-[#860f0f]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-1.5 font-['Open Sans'] text-[#1c1c1e]">
                            Password
                        </label>
                        <input
                            type='password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='••••••••'
                            className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all font-['Outfit'] border-[#ece8e1] text-[#1c1c1e] focus:border-[#860f0f]"
                        />
                    </div>

                    {loginError && (
                        <div className="p-3 rounded-lg text-sm font-['Open Sans'] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c]">
                            {loginError}
                        </div>
                    )}

                    {resetSent && (
                        <div className="p-3 rounded-lg text-sm font-['Open Sans'] bg-[#f0fdf4] border border-[#86efac] text-[#166534]">
                            Password reset email sent. Check your inbox.
                        </div>
                    )}

                    <button
                        type='submit'
                        disabled={isLoading}
                        className="w-full py-3 rounded-lg text-white font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 font-['Open Sans'] bg-[#860f0f]">
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className='mt-4 pt-4 border-t border-[#ece8e1]'>
                    <button
                        type='button'
                        onClick={handleForgotPassword}
                        disabled={isLoading}
                        className="w-full text-center text-xs font-['Open Sans'] text-[#860f0f] hover:underline disabled:opacity-50">
                        Forgot your password?
                    </button>
                </div>

                <p className="text-center text-xs mt-6 font-['Open Sans'] text-[#9ca3af]">
                    <a href='/' className='text-[#860f0f] hover:underline'>
                        Back to home
                    </a>
                </p>
            </div>
        </div>
    );
}