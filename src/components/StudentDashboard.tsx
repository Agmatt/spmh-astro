import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface Application {
    id: string;
    full_name: string;
    rotation_type: string;
    start_date: string;
    end_date: string;
    status: string;
    hr_feedback: string | null;
    hr_reviewed_at: string | null;
    edit_count: number;
    created_at: string;
}

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}

export default function StudentDashboard({ user }: { user: any }) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'applications' | 'notifications'>('applications');
    const [expandedApp, setExpandedApp] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    const fetchData = async () => {
        if (!user?.id) return;

        setIsLoading(true);

        // Fetch applications
        const { data: appsData } = await supabase
            .from('internship_applications')
            .select('*')
            .eq('student_id', user.id)
            .order('created_at', { ascending: false });

        // Fetch notifications
        const { data: notifData } = await supabase
            .from('application_notifications')
            .select('*')
            .eq('student_id', user.id)
            .order('created_at', { ascending: false });

        setApplications(appsData || []);
        setNotifications(notifData || []);
        setIsLoading(false);

        // Mark notifications as read
        if (notifData && notifData.length > 0) {
            const unreadIds = notifData.filter((n) => !n.read).map((n) => n.id);
            if (unreadIds.length > 0) {
                await supabase
                    .from('application_notifications')
                    .update({ read: true })
                    .in('id', unreadIds);
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap = {
            submitted: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Submitted' },
            under_review: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Under Review' },
            approved: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Approved' },
            declined: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Declined' },
        };
        const config = statusMap[status as keyof typeof statusMap] || statusMap.submitted;
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="h-10 w-10 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto"></div>
                    <p className="text-slate-600 text-sm font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Welcome, {user?.email?.split('@')[0]}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">Manage your attachment applications</p>
                        </div>
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium px-4 py-2 rounded-lg transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'applications'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}>
                        My Applications ({applications.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'notifications'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}>
                        Notifications ({notifications.length})
                    </button>
                </div>

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                                <p className="text-slate-600 mb-4">You haven't submitted any applications yet.</p>
                                <a
                                    href="/academics-and-internships#internships"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
                                    Submit an Application
                                </a>
                            </div>
                        ) : (
                            applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div
                                        onClick={() =>
                                            setExpandedApp(expandedApp === app.id ? null : app.id)
                                        }
                                        className="p-6 cursor-pointer">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-base font-semibold text-slate-900 capitalize">
                                                        {app.rotation_type.replace('_', ' ')}
                                                    </h3>
                                                    {getStatusBadge(app.status)}
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    {formatDate(app.start_date)} — {formatDate(app.end_date)}
                                                </p>
                                            </div>
                                            <svg
                                                className={`w-5 h-5 text-slate-400 transition-transform ${expandedApp === app.id ? 'rotate-180' : ''
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedApp === app.id && (
                                        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                                        Submitted
                                                    </p>
                                                    <p className="text-sm text-slate-900">
                                                        {formatDate(app.created_at)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                                        Edits Used
                                                    </p>
                                                    <p className="text-sm text-slate-900">
                                                        {app.edit_count} of 3
                                                    </p>
                                                </div>
                                            </div>

                                            {app.hr_feedback && (
                                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                                        HR Feedback
                                                    </p>
                                                    <p className="text-sm text-slate-700">{app.hr_feedback}</p>
                                                </div>
                                            )}

                                            {app.status === 'submitted' && app.edit_count < 3 && (
                                                <a
                                                    href={`/academics-and-internships/edit-application/${app.id}`}
                                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
                                                    Edit Application
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="space-y-3">
                        {notifications.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                                <p className="text-slate-600">No notifications yet.</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            {notif.type === 'status_update' && (
                                                <svg
                                                    className="w-5 h-5 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            )}
                                            {notif.type === 'feedback' && (
                                                <svg
                                                    className="w-5 h-5 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            )}
                                            {(notif.type === 'account_created' ||
                                                notif.type === 'password_reset') && (
                                                    <svg
                                                        className="w-5 h-5 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-slate-900">
                                                {notif.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                                            <p className="text-xs text-slate-400 mt-2">
                                                {formatDate(notif.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}