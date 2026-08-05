import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginForm() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePhone = () => {
        const trimmed = phone.trim();
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!trimmed) {
            setPhoneError('Phone number is required');
        } else if (!phoneRegex.test(trimmed.replace(/\s/g, ''))) {
            setPhoneError('Please enter a valid international phone number (e.g., +254712345678)');
        } else {
            setPhoneError('');
        }
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('Password is required');
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
        } else {
            setPasswordError('');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');
        validatePhone();
        validatePassword();

        if (phoneError || passwordError || !phone || !password) return;

        setLoading(true);

        try {
            const email = `${phone.replace(/\s/g, '')}@spmh.local`;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setGeneralError(
                    error.message === 'Invalid login credentials'
                        ? 'Phone number or password is incorrect'
                        : error.message
                );
            } else if (data.user) {
                window.location.href = '/portal/dashboard';
            }
        } catch (err) {
            setGeneralError('An error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="w-full max-w-md">
            <div className="bg-white border border-border rounded-3xl shadow-xl p-8 md:p-10">
                <div className="mb-8">
                    <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-muted">
                        Sign in to view your appointments, prescriptions, and consultations.
                    </p>
                </div>

                {/* Error message */}
                {generalError && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                        <p className="text-sm font-semibold text-rose-700">{generalError}</p>
                    </div>
                )}

                {/* Phone Number */}
                <div className="mb-5">
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={validatePhone}
                        placeholder="+254 712 345 678"
                        className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-900 placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow ${phoneError ? 'border-rose-500' : 'border-border'
                            }`}
                        required
                    />
                    {phoneError && <p className="text-xs text-rose-600 mt-1">{phoneError}</p>}
                </div>

                {/* Password */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" class="block text-sm font-semibold text-slate-700">
                            Password
                        </label>
                        <a href="/portal/forgot-password" class="text-xs font-semibold text-blue-600 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={validatePassword}
                            placeholder="Enter your password"
                            className={`w-full px-4 py-3 pr-12 border rounded-xl bg-white text-slate-900 placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow ${passwordError ? 'border-rose-500' : 'border-border'
                                }`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-slate-700 transition-colors"
                            aria-label="Toggle password visibility">
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {passwordError && <p className="text-xs text-rose-600 mt-1">{passwordError}</p>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center">
                    {!loading ? (
                        'Sign In to Portal'
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Signing in...
                        </span>
                    )}
                </button>

                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-xs text-muted">or</span>
                    <div className="flex-1 h-px bg-border"></div>
                </div>

                <a
                    href="/portal/register"
                    className="block w-full text-center border border-blue-600 text-blue-600 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors duration-200">
                    Create Patient Account
                </a>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
                <span>Your information is encrypted and confidential</span>
            </div>
        </form>
    );
}