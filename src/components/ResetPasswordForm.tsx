import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_ACADEMICS_URL,
    import.meta.env.PUBLIC_SUPABASE_ACADEMICS_ANON_KEY
);

export default function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });

            setIsLoading(false);

            if (error) {
                setError(error.message || 'Failed to reset password');
            } else {
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = '/admin/academics';
                }, 2000);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
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

                {success ? (
                    <div className='text-center space-y-4'>
                        <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#f0fdf4]'>
                            <svg
                                className='w-8 h-8 text-[#16a34a]'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M5 13l4 4L19 7'
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold font-['Lato'] text-[#1c1c1e]">
                            Password Reset
                        </h2>
                        <p className="text-sm font-['Open Sans'] text-[#6b7280]">
                            Your password has been reset successfully. Redirecting to login...
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-1 font-['Lato'] text-[#1c1c1e]">
                            Reset Password
                        </h2>
                        <p className="text-sm mb-6 font-['Open Sans'] text-[#6b7280]">
                            Enter your new password below
                        </p>

                        <form onSubmit={handleReset} className='space-y-4'>
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 font-['Open Sans'] text-[#1c1c1e]">
                                    New Password
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

                            <div>
                                <label className="block text-xs font-semibold mb-1.5 font-['Open Sans'] text-[#1c1c1e]">
                                    Confirm Password
                                </label>
                                <input
                                    type='password'
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='••••••••'
                                    className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all font-['Outfit'] border-[#ece8e1] text-[#1c1c1e] focus:border-[#860f0f]"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg text-sm font-['Open Sans'] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c]">
                                    {error}
                                </div>
                            )}

                            <button
                                type='submit'
                                disabled={isLoading}
                                className="w-full py-3 rounded-lg text-white font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 font-['Open Sans'] bg-[#860f0f]">
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>

                        <p className="text-center text-xs mt-6 font-['Open Sans'] text-[#9ca3af]">
                            <a href='/admin/academics' className='text-[#860f0f] hover:underline'>
                                Back to login
                            </a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}