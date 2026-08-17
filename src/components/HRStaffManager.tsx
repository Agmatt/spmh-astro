import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_ACADEMICS_URL,
    import.meta.env.PUBLIC_SUPABASE_ACADEMICS_ANON_KEY
);

interface HRStaff {
    id: string;
    email: string;
    full_name: string;
    department: string;
    active: boolean;
    created_at: string;
}

export default function HRStaffManager() {
    const [staff, setStaff] = useState<HRStaff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        department: '',
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('hr_staff')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setStaff(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load staff');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { error: insertError } = await supabase
                .from('hr_staff')
                .insert([
                    {
                        email: formData.email,
                        full_name: formData.full_name,
                        department: formData.department,
                        active: true,
                    },
                ]);

            if (insertError) throw insertError;

            setSuccess('Staff member added successfully');
            setFormData({ email: '', full_name: '', department: '' });
            setShowForm(false);
            fetchStaff();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to add staff member');
        }
    };

    const toggleActive = async (id: string, currentActive: boolean) => {
        try {
            const { error: updateError } = await supabase
                .from('hr_staff')
                .update({ active: !currentActive })
                .eq('id', id);

            if (updateError) throw updateError;

            setSuccess(`Staff member ${!currentActive ? 'activated' : 'deactivated'}`);
            fetchStaff();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update staff member');
        }
    };

    const deleteStaff = async (id: string) => {
        if (!confirm('Are you sure you want to delete this staff member?')) return;

        try {
            const { error: deleteError } = await supabase
                .from('hr_staff')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setSuccess('Staff member removed');
            fetchStaff();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to delete staff member');
        }
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#125276]">
                    Manage HR Staff Access
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="font-['Outfit'] bg-[#1565c0] text-white px-4 py-2 rounded-sm hover:bg-[#0D4BA8] transition-colors">
                    {showForm ? 'Cancel' : 'Add Staff Member'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-[#860f0f]/10 border border-[#860f0f]/30 rounded-sm text-[#860f0f] font-['Outfit'] text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-[#1565c0]/10 border border-[#1565c0]/30 rounded-sm text-[#1565c0] font-['Outfit'] text-sm">
                    {success}
                </div>
            )}

            {showForm && (
                <div className='bg-white border border-[#D8E0E7] rounded-sm p-6 space-y-4'>
                    <form onSubmit={handleAddStaff} className='space-y-4'>
                        <div>
                            <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-2">
                                Email Address
                            </label>
                            <input
                                type='email'
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30"
                                placeholder="staff@example.com"
                            />
                        </div>
                        <div>
                            <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-2">
                                Full Name
                            </label>
                            <input
                                type='text'
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                                className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block font-['Outfit'] text-xs font-semibold text-[#14202B] mb-2">
                                Department
                            </label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                                className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30">
                                <option value=''>Select Department</option>
                                <option value='hr'>HR</option>
                                <option value='finance'>Finance</option>
                                <option value='admin'>Admin</option>
                                <option value='pharmacy'>Pharmacy</option>
                                <option value='clinical'>Clinical</option>
                            </select>
                        </div>
                        <button
                            type='submit'
                            className="w-full font-['Outfit'] font-medium bg-[#16a34a] text-white rounded-sm py-2.5 hover:bg-[#15803d] transition-colors">
                            Add Staff Member
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className='text-center py-12'>
                    <p className="font-['Outfit'] text-[#7A8A96]">Loading staff...</p>
                </div>
            ) : (
                <div className='bg-white border border-[#D8E0E7] rounded-sm overflow-hidden'>
                    <table className='w-full'>
                        <thead className='bg-[#F7F9FB] border-b border-[#D8E0E7]'>
                            <tr>
                                <th className="text-left px-6 py-3 font-['Outfit'] text-xs font-semibold text-[#14202B]">
                                    Email
                                </th>
                                <th className="text-left px-6 py-3 font-['Outfit'] text-xs font-semibold text-[#14202B]">
                                    Name
                                </th>
                                <th className="text-left px-6 py-3 font-['Outfit'] text-xs font-semibold text-[#14202B]">
                                    Department
                                </th>
                                <th className="text-left px-6 py-3 font-['Outfit'] text-xs font-semibold text-[#14202B]">
                                    Status
                                </th>
                                <th className="text-left px-6 py-3 font-['Outfit'] text-xs font-semibold text-[#14202B]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((member) => (
                                <tr key={member.id} className='border-b border-[#D8E0E7] hover:bg-[#F7F9FB]'>
                                    <td className="px-6 py-3 font-['Outfit'] text-sm text-[#3E5262]">
                                        {member.email}
                                    </td>
                                    <td className="px-6 py-3 font-['Outfit'] text-sm text-[#3E5262]">
                                        {member.full_name}
                                    </td>
                                    <td className="px-6 py-3 font-['Outfit'] text-sm text-[#3E5262]">
                                        {member.department}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`font-['Outfit'] text-xs px-2 py-1 rounded-sm font-semibold ${member.active
                                                    ? 'bg-[#16a34a]/10 text-[#16a34a]'
                                                    : 'bg-[#7A8A96]/10 text-[#7A8A96]'
                                                }`}>
                                            {member.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 space-x-2">
                                        <button
                                            onClick={() => toggleActive(member.id, member.active)}
                                            className="font-['Outfit'] text-xs bg-[#1565c0] text-white px-3 py-1 rounded-sm hover:bg-[#0D4BA8] transition-colors">
                                            {member.active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => deleteStaff(member.id)}
                                            className="font-['Outfit'] text-xs bg-[#860f0f] text-white px-3 py-1 rounded-sm hover:bg-[#6B0B09] transition-colors">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}