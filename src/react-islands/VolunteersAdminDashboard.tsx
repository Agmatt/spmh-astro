import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';

type Volunteer = {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    location: string | null;
    occupation: string | null;
    interests: string | null;
    availability: string | null;
    message: string | null;
    status: 'active' | 'pending' | 'inactive' | null;
    created_at: string;
};

const STATUSES = ['active', 'pending', 'inactive'] as const;

const VolunteersAdminDashboard = () => {
    const supabase = useMemo(
        () =>
            createBrowserClient(
                import.meta.env.PUBLIC_SUPABASE_URL,
                import.meta.env.PUBLIC_SUPABASE_ANON_KEY
            ),
        []
    );

    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    const applyFilters = useCallback(
        (data: Volunteer[]) => {
            let filtered = data;
            if (statusFilter !== 'all') {
                filtered = filtered.filter((v) => v.status === statusFilter);
            }
            setFilteredVolunteers(filtered);
        },
        [statusFilter]
    );

    const fetchVolunteers = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('volunteers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVolunteers((data ?? []) as Volunteer[]);
            applyFilters((data ?? []) as Volunteer[]);
        } catch (err) {
            console.error('Error fetching volunteers:', err);
        } finally {
            setLoading(false);
        }
    }, [supabase, applyFilters]);

    useEffect(() => {
        fetchVolunteers();
    }, [fetchVolunteers]);

    useEffect(() => {
        applyFilters(volunteers);
    }, [statusFilter, volunteers, applyFilters]);

    const updateVolunteerStatus = async (id: string, newStatus: string) => {
        setVolunteers((prev) =>
            prev.map((v) => (v.id === id ? { ...v, status: newStatus as Volunteer['status'] } : v))
        );

        try {
            const { error } = await supabase
                .from('volunteers')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating volunteer:', err);
            await fetchVolunteers();
        }
    };

    const deleteVolunteer = async (id: string) => {
        if (!confirm('Delete this volunteer record permanently?')) return;

        const previous = volunteers;
        setVolunteers((prev) => prev.filter((v) => v.id !== id));

        try {
            const { error } = await supabase.from('volunteers').delete().eq('id', id);
            if (error) throw error;
        } catch (err) {
            console.error('Error deleting volunteer:', err);
            setVolunteers(previous);
        }
    };

    const statCardData = [
        { label: 'Total', count: volunteers.length, color: 'from-slate-600 to-slate-700' },
        { label: 'Active', count: volunteers.filter((v) => v.status === 'active').length, color: 'from-green-600 to-green-700' },
        { label: 'Pending', count: volunteers.filter((v) => v.status === 'pending').length, color: 'from-amber-600 to-amber-700' },
        { label: 'Inactive', count: volunteers.filter((v) => v.status === 'inactive').length, color: 'from-red-600 to-red-700' },
    ];

    const statusBgColor: Record<string, string> = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-amber-100 text-amber-800',
        inactive: 'bg-red-100 text-red-800',
    };

    return (
        <div className="space-y-6">
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statCardData.map((card) => (
                    <div
                        key={card.label}
                        className={`bg-gradient-to-br ${card.color} rounded-xl p-5 text-white shadow-lg`}
                    >
                        <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">
                            {card.label}
                        </p>
                        <p className="text-3xl font-black">{card.count}</p>
                    </div>
                ))}
            </div>

            {/* FILTER */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-3">
                    Filter by Status
                </label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 bg-slate-50"
                >
                    <option value="all">All Statuses</option>
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* TABLE/LIST */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                        <p className="text-sm text-slate-600 font-medium">Loading volunteers...</p>
                    </div>
                ) : filteredVolunteers.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <p className="text-slate-500 text-sm font-medium">No volunteers found</p>
                    </div>
                ) : (
                    <>
                        {/* DESKTOP VIEW */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100 border-b border-slate-200">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-700 tracking-wider">Name</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-700 tracking-wider">Email</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-700 tracking-wider">Phone</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-700 tracking-wider">Location</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-700 tracking-wider">Interests</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-700 tracking-wider">Status</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-700 tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredVolunteers.map((vol) => (
                                        <tr key={vol.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                                                {vol.first_name} {vol.last_name}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{vol.email || '-'}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{vol.phone}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{vol.location || '-'}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600 max-w-xs truncate">
                                                {vol.interests}
                                            </td>
                                            <td className="px-5 py-4">
                                                <select
                                                    value={vol.status || 'pending'}
                                                    onChange={(e) => updateVolunteerStatus(vol.id, e.target.value)}
                                                    className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none ${statusBgColor[vol.status || 'pending'] || statusBgColor.pending
                                                        }`}
                                                >
                                                    {STATUSES.map((s) => (
                                                        <option key={s} value={s}>
                                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => deleteVolunteer(vol.id)}
                                                    className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE VIEW */}
                        <div className="md:hidden divide-y divide-slate-200">
                            {filteredVolunteers.map((vol) => (
                                <div key={vol.id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 text-sm">
                                                {vol.first_name} {vol.last_name}
                                            </p>
                                            <p className="text-xs text-slate-600">{vol.email || '-'}</p>
                                            <p className="text-xs text-slate-600">{vol.phone}</p>
                                        </div>
                                        <select
                                            value={vol.status || 'pending'}
                                            onChange={(e) => updateVolunteerStatus(vol.id, e.target.value)}
                                            className={`text-xs font-bold uppercase tracking-wide px-2 py-1.5 rounded-full border-0 cursor-pointer outline-none flex-shrink-0 ${statusBgColor[vol.status || 'pending'] || statusBgColor.pending
                                                }`}
                                        >
                                            {STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <p className="text-xs font-medium text-slate-600">
                                        📍 {vol.location || '-'}
                                    </p>
                                    <button
                                        onClick={() => deleteVolunteer(vol.id)}
                                        className="text-xs font-bold text-red-600 uppercase tracking-wider"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <p className="text-xs text-slate-500 font-medium">
                Showing {filteredVolunteers.length} of {volunteers.length} volunteers
            </p>
        </div>
    );
};

export default VolunteersAdminDashboard;