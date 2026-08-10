import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export default function PartnershipInquiryForm() {
    const [formData, setFormData] = useState({
        institution_name: '',
        contact_person: '',
        email: '',
        location_type: 'local',
        inquiry_type: 'student_attachment',
        message: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Insert into partnership_inquiries table
            const { error: insertError } = await supabase
                .from('partnership_inquiries')
                .insert([{ ...formData, sent_to_hr: false }]);

            if (insertError) throw insertError;

            // Send email to HR via Resend (backend endpoint)
            await fetch('/api/send-partnership-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    institutionName: formData.institution_name,
                    contactPerson: formData.contact_person,
                    contactEmail: formData.email,
                    locationType: formData.location_type,
                    inquiryType: formData.inquiry_type,
                    message: formData.message,
                }),
            });

            // Mark as sent
            await supabase
                .from('partnership_inquiries')
                .update({ sent_to_hr: true })
                .eq('email', formData.email)
                .order('created_at', { ascending: false })
                .limit(1);

            setSuccess(true);
            setFormData({
                institution_name: '',
                contact_person: '',
                email: '',
                location_type: 'local',
                inquiry_type: 'student_attachment',
                message: '',
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(
                err.message || 'Error submitting partnership inquiry. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center text-sm text-emerald-700">
                    Inquiry sent successfully. Our administration team will contact your
                    office shortly.
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Institution Name
                </label>
                <input
                    type="text"
                    name="institution_name"
                    value={formData.institution_name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="University / College Name"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                        Contact Person
                    </label>
                    <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Coordinator Name"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="coord@institution.edu"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                        Institution Scope
                    </label>
                    <select
                        name="location_type"
                        value={formData.location_type}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="local">Local (Kenya)</option>
                        <option value="regional">Regional (East Africa)</option>
                        <option value="international">International</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                        Inquiry Type
                    </label>
                    <select
                        name="inquiry_type"
                        value={formData.inquiry_type}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="student_attachment">Student Attachment Pipeline</option>
                        <option value="research">Research Collaboration</option>
                        <option value="cme">Continuing Medical Education / Faculty Exchange</option>
                        <option value="mou">Formal MOU / Long-Term Partnership</option>
                        <option value="general">General Partnership Inquiry</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Message / Proposal Summary
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Provide details on expected student volume, research focus, or partnership goals..."
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-md">
                {isLoading ? 'Sending Inquiry...' : 'Send Inquiry to Administration'}
            </button>
        </form>
    );
}