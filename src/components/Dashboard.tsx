import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PatientProfile {
    full_name: string;
    phone_number: string;
    email?: string;
}

export default function DashboardContent() {
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserData() {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                window.location.href = '/portal/login';
                return;
            }

            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                setProfile(data);
            } else if (error) {
                console.error('Error fetching patient profile:', error);
            }
            setLoading(false);
        }

        loadUserData();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/portal/login';
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-8">
            {/* Top Banner / Welcome card */}
            <div className="bg-white border border-border rounded-3xl shadow-sm p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Patient Portal Dashboard
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-2">
                        Welcome, {profile?.full_name || 'Patient'}
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        Manage your tele-consultations, active prescriptions, and appointments.
                    </p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors">
                    Sign Out
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">Upcoming Appointments</p>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <a href="/portal/book" className="text-xs font-semibold text-blue-600 hover:underline mt-3 inline-block">
                        Book consultation &rarr;
                    </a>
                </div>

                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">Active Prescriptions</p>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                    <span className="text-xs text-muted mt-3 inline-block">No active drug orders</span>
                </div>

                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">Account Contact</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{profile?.phone_number}</p>
                    <span className="text-xs text-emerald-600 font-semibold mt-3 inline-block">Verified & Active</span>
                </div>
            </div>
        </div>
    );
}