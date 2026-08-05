import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // ==========================================
    // CLIENT-SIDE VALIDATION (before signUp)
    // ==========================================

    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Phone number is required.');
      return;
    }

    // Validate phone format (E.164 or similar)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanedPhone = phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      setErrorMessage('Please enter a valid international phone number (e.g., +254712345678)');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!consent) {
      setErrorMessage('You must consent to data storage to continue.');
      return;
    }

    setIsLoading(true);

    try {
      // ==========================================
      // SIGN UP (with validated data)
      // ==========================================

      // Use real email if provided, otherwise fallback to synthetic phone email
      const authEmail = email.trim() ? email.trim() : `${cleanedPhone}@spmh.local`;

      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone_number: cleanedPhone,
            real_email: email.trim() || null,
          }
        }
      });

      if (error) {
        // Safely extract the error message whether it's a string, object, or standard PostgrestError
        const errorMsg = typeof error === 'string'
          ? error
          : error.message || JSON.stringify(error);

        console.error('Supabase Sign Up Error:', error);
        setErrorMessage(errorMsg);
        return;
      }

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/portal/login';
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white border border-border rounded-3xl shadow-xl p-8 md:p-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-sm text-muted">
            Register to book consultations, view prescriptions, and manage your care.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm font-semibold text-emerald-700">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <p className="text-sm font-semibold text-rose-700">{errorMessage}</p>
          </div>
        )}

        {/* Full Name */}
        <div className="mb-5">
          <label htmlFor="fullname" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-3 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 border-border transition-shadow"
            required
          />
        </div>

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
            placeholder="+254 712 345 678"
            className="w-full px-4 py-3 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 border-border transition-shadow"
            required
          />
          <p className="text-xs text-muted mt-1.5">
            Used to sign in — same number for M-Pesa payments.
          </p>
        </div>

        {/* Email (Optional) */}
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email Address <span className="text-muted font-normal">(optional)</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 border-border transition-shadow"
          />
          <p className="text-xs text-muted mt-1.5">
            Lets you reset your password if you forget it.
          </p>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full px-4 py-3 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 border-border transition-shadow"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="w-full px-4 py-3 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 border-border transition-shadow"
            required
          />
        </div>

        {/* Consent Checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-2.5 text-xs text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded border-border text-primary focus:ring-primary/40"
              required
            />
            <span>I consent to SPMH storing my information to manage my care, in line with the hospital's confidentiality standards.</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center">
          {!isLoading ? (
            'Create Account'
          ) : (
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-muted">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <a
          href="/portal/login"
          className="block w-full text-center border border-blue-600 text-blue-600 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors duration-200">
          Already Have an Account? Sign In
        </a>
      </div>
    </form>
  );
}