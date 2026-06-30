import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zzlngxryoalajdpsbpnn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bG5neHJ5b2FsYWpkcHNicG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MDk3NjYsImV4cCI6MjA5ODE4NTc2Nn0.NN2MqqqOITkizXpMw1qrAwbb4GYIySa7jsIcWnmP-Ag';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PartnershipForm = () => {
    const [formData, setFormData] = useState({
        orgName: '',
        orgType: '',
        country: '',
        website: '',
        contactName: '',
        contactRole: '',
        contactEmail: '',
        contactPhone: '',
        proposal: '',
    });
    const [collaborationAreas, setCollaborationAreas] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const areaOptions = [
        'Community Health Outreach',
        'Food & Nutrition',
        'Infrastructure / Equipment',
        'Capacity Building & Training',
        'Research & Documentation',
        'Other',
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleAreaToggle = (area: string) => {
        setCollaborationAreas(prev =>
            prev.includes(area)
                ? prev.filter(a => a !== area)
                : [...prev, area]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (
            !formData.orgName ||
            !formData.orgType ||
            !formData.country ||
            !formData.contactName ||
            !formData.contactRole ||
            !formData.contactEmail ||
            !formData.proposal
        ) {
            setError('Please fill in all required fields');
            return;
        }

        if (collaborationAreas.length === 0) {
            setError('Please select at least one area of collaboration');
            return;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.contactEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            // Save to Supabase
            const { error: dbError } = await supabase.from('partnerships').insert([
                {
                    org_name: formData.orgName,
                    org_type: formData.orgType,
                    country: formData.country,
                    website: formData.website || null,
                    contact_name: formData.contactName,
                    contact_role: formData.contactRole,
                    contact_email: formData.contactEmail,
                    contact_phone: formData.contactPhone || null,
                    collaboration_areas: collaborationAreas.join(', '),
                    proposal: formData.proposal,
                    status: 'pending',
                },
            ]);

            if (dbError) {
                setError(`Error submitting form: ${dbError.message}`);
                setLoading(false);
                return;
            }

            // TODO: Send email notification to admin
            // Example: await sendEmailNotification(formData)

            setSubmitted(true);
            console.log('Partnership expression of interest submitted successfully');
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <section className='bg-[#fdf6ee] px-4 md:px-6 py-16'>
                <div className='max-w-3xl mx-auto text-center'>
                    <div className='flex justify-center mb-4'>
                        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700'>
                            ✓
                        </div>
                    </div>
                    <h2 className='text-2xl font-bold text-blue-900 mb-2'>Expression of Interest Received</h2>
                    <p className='text-gray-600 mb-6'>
                        Thank you for expressing interest in partnering with SPMH. Our partnerships team will review your submission and contact you at {formData.contactEmail} within 3 working days.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({
                                orgName: '',
                                orgType: '',
                                country: '',
                                website: '',
                                contactName: '',
                                contactRole: '',
                                contactEmail: '',
                                contactPhone: '',
                                proposal: '',
                            });
                            setCollaborationAreas([]);
                        }}
                        className='bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors'
                    >
                        Submit Another Expression of Interest
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className='bg-[#fdf6ee] px-4 md:px-6 py-16'>
            <div className='max-w-3xl mx-auto'>
                <h2 className='text-2xl font-bold text-blue-900 mb-2'>Express Interest</h2>
                <div className='w-12 h-1 bg-orange-500 rounded mb-3'></div>
                <p className='text-sm text-gray-500 mb-8'>
                    Fill in the form below and our partnerships team will follow up within <span className='font-semibold text-gray-700'>3 working days</span> to explore how we can work together.
                </p>

                {error && (
                    <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700'>
                        {error}
                    </div>
                )}

                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div className='grid sm:grid-cols-2 gap-5'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='orgName'>
                                Organisation Name <span className='text-orange-500'>*</span>
                            </label>
                            <input
                                id='orgName'
                                type='text'
                                placeholder='e.g. Homa Bay Community Foundation'
                                value={formData.orgName}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='orgType'>
                                Organisation Type <span className='text-orange-500'>*</span>
                            </label>
                            <select
                                id='orgType'
                                value={formData.orgType}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition bg-white'
                            >
                                <option value=''>Select type...</option>
                                <option>International Donor / Foundation</option>
                                <option>Corporate / CSR Sponsor</option>
                                <option>Faith-Based Organisation</option>
                                <option>County / National Government</option>
                                <option>NGO / Development Organisation</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className='grid sm:grid-cols-2 gap-5'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='country'>
                                Country of Operation <span className='text-orange-500'>*</span>
                            </label>
                            <input
                                id='country'
                                type='text'
                                placeholder='e.g. Kenya'
                                value={formData.country}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='website'>
                                Website <span className='text-gray-400 font-normal'>(optional)</span>
                            </label>
                            <input
                                id='website'
                                type='url'
                                placeholder='https://www.yourorg.org'
                                value={formData.website}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                    </div>

                    <div className='grid sm:grid-cols-2 gap-5'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='contactName'>
                                Contact Person <span className='text-orange-500'>*</span>
                            </label>
                            <input
                                id='contactName'
                                type='text'
                                placeholder='Full name'
                                value={formData.contactName}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='contactRole'>
                                Role / Title <span className='text-orange-500'>*</span>
                            </label>
                            <input
                                id='contactRole'
                                type='text'
                                placeholder='e.g. Programme Officer'
                                value={formData.contactRole}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                    </div>

                    <div className='grid sm:grid-cols-2 gap-5'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='contactEmail'>
                                Email Address <span className='text-orange-500'>*</span>
                            </label>
                            <input
                                id='contactEmail'
                                type='email'
                                placeholder='contact@yourorg.org'
                                value={formData.contactEmail}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='contactPhone'>
                                Phone Number
                            </label>
                            <input
                                id='contactPhone'
                                type='tel'
                                placeholder='+254 7XX XXX XXX'
                                value={formData.contactPhone}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Proposed Area(s) of Collaboration <span className='text-orange-500'>*</span>
                        </label>
                        <div className='grid sm:grid-cols-3 gap-3'>
                            {areaOptions.map(area => (
                                <label
                                    key={area}
                                    className='flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:border-orange-400 transition-colors'
                                >
                                    <input
                                        type='checkbox'
                                        checked={collaborationAreas.includes(area)}
                                        onChange={() => handleAreaToggle(area)}
                                        className='accent-orange-500 w-4 h-4'
                                    />
                                    <span className='text-sm text-gray-700'>{area}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='proposal'>
                            Brief Description of Proposed Collaboration <span className='text-orange-500'>*</span>
                        </label>
                        <textarea
                            id='proposal'
                            rows={5}
                            placeholder='Describe how you envision working with SPMH...'
                            value={formData.proposal}
                            onChange={handleInputChange}
                            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition resize-none'
                        />
                    </div>

                    <div className='flex items-center gap-4 pt-2'>
                        <button
                            type='submit'
                            disabled={loading}
                            className='bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Submitting...' : 'Send Expression of Interest'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default PartnershipForm;