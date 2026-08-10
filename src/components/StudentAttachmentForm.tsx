import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface StudentAttachmentFormProps {
    studentId?: string;
    studentEmail?: string;
}

export default function StudentAttachmentForm({
    studentId,
    studentEmail,
}: StudentAttachmentFormProps) {
    const [formData, setFormData] = useState({
        full_name: '',
        email: studentEmail || '',
        phone: '',
        home_institution: '',
        rotation_type: '',
        duration_text: '',
        start_date: '',
        end_date: '',
        cover_letter: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successReference, setSuccessReference] = useState<string | null>(null);

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
            const refCode =
                'SPMH-' + Math.random().toString(36).substring(2, 8).toUpperCase();

            const applicationData = {
                ...(studentId ? { student_id: studentId } : {}),
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                home_institution: formData.home_institution,
                rotation_type: formData.rotation_type,
                duration_text: formData.duration_text,
                start_date: formData.start_date,
                end_date: formData.end_date,
                cover_letter: formData.cover_letter,
                reference_code: refCode,
                status: 'submitted',
            };

            const { error: insertError } = await supabase
                .from('internship_applications')
                .insert([applicationData]);

            if (insertError) throw insertError;

            // Create notification if logged in
            if (studentId) {
                await supabase.from('application_notifications').insert([
                    {
                        student_id: studentId,
                        type: 'status_update',
                        title: 'Application Submitted',
                        message:
                            'Your attachment application has been submitted successfully. HR will review it shortly.',
                    },
                ]);
            }

            setSuccessReference(refCode);
            setFormData({
                full_name: '',
                email: studentEmail || '',
                phone: '',
                home_institution: '',
                rotation_type: '',
                duration_text: '',
                start_date: '',
                end_date: '',
                cover_letter: '',
            });
        } catch (err: any) {
            setError(err.message || 'Error submitting application. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (successReference) {
        return (
            <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <h4 className="text-lg font-bold text-emerald-900">
                    Application Submitted Successfully!
                </h4>
                <p className="text-sm text-emerald-700">
                    Save your unique reference code to check your status updates from HR:
                </p>
                <div className="bg-white p-3 rounded-lg font-mono font-bold text-blue-600 text-lg tracking-wider border border-emerald-300 inline-block break-all">
                    {successReference}
                </div>
                <div className="pt-2">
                    <a
                        href="/academics-and-internships/portal"
                        className="text-xs font-semibold text-blue-600 underline hover:text-blue-800">
                        Go to Applicant Status Tracker →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        placeholder="Jane Doe"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={!!studentEmail}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:bg-slate-100"
                        placeholder="jane@student.edu"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        placeholder="+254 700 000000"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Home Institution / College
                    </label>
                    <input
                        type="text"
                        name="home_institution"
                        value={formData.home_institution}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        placeholder="University Name"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Rotation / Department Type
                    </label>
                    <select
                        name="rotation_type"
                        value={formData.rotation_type}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none">
                        <option value="">Select Department</option>
                        <option value="clinical">Clinical / Nursing Rotation</option>
                        <option value="hr">Human Resources</option>
                        <option value="finance">Finance & Auditing</option>
                        <option value="pharmacy">Pharmacy & Supply Chain</option>
                        <option value="research">Research / Community Health</option>
                        <option value="other">Other Administrative Unit</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Duration (As Required by School)
                    </label>
                    <input
                        type="text"
                        name="duration_text"
                        value={formData.duration_text}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        placeholder="e.g. 3 Months (May - July)"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Proposed Start Date
                    </label>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                        Proposed End Date
                    </label>
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                    Cover Letter & Institution Letter Details
                </label>
                <textarea
                    name="cover_letter"
                    value={formData.cover_letter}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Briefly describe your course level and institutional attachment requirements..."
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white font-semibold py-3 rounded-xl transition-colors shadow-md">
                {isLoading ? 'Submitting Application...' : 'Submit Application to HR'}
            </button>
        </form>
    );
}