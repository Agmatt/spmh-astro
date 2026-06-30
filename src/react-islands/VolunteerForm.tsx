import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zzlngxryoalajdpsbpnn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bG5neHJ5b2FsYWpkcHNicG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MDk3NjYsImV4cCI6MjA5ODE4NTc2Nn0.NN2MqqqOITkizXpMw1qrAwbb4GYIySa7jsIcWnmP-Ag';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const VolunteerForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        occupation: '',
        message: '',
    });
    const [interests, setInterests] = useState<string[]>([]);
    const [availability, setAvailability] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const interestOptions = [
        'Health Clinics',
        'Food Assistance',
        'Community Outreach',
        'Administration',
        'Logistics',
        'Other',
    ];

    const availabilityOptions = [
        'Weekdays',
        'Weekends',
        'Public Holidays',
        'Flexible',
        'One-off',
        'Ongoing',
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleInterestToggle = (interest: string) => {
        setInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleAvailabilityToggle = (slot: string) => {
        setAvailability(prev =>
            prev.includes(slot)
                ? prev.filter(a => a !== slot)
                : [...prev, slot]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.phone) {
            setError('Please fill in all required fields');
            return;
        }

        if (interests.length === 0) {
            setError('Please select at least one area of interest');
            return;
        }

        if (availability.length === 0) {
            setError('Please select your availability');
            return;
        }

        setLoading(true);

        try {
            // Save to Supabase
            const { error: dbError } = await supabase.from('volunteers').insert([
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email || null,
                    phone: formData.phone,
                    location: formData.location || null,
                    occupation: formData.occupation || null,
                    interests: interests.join(', '),
                    availability: availability.join(', '),
                    message: formData.message || null,
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
            // This would call a Supabase Edge Function or external service

            setSubmitted(true);
            console.log('Volunteer application submitted successfully');
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className='bg-white px-4 md:px-6 py-16'>
                <div className='max-w-3xl mx-auto text-center'>
                    <div className='flex justify-center mb-4'>
                        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700'>
                            ✓
                        </div>
                    </div>
                    <h2 className='text-2xl font-bold text-blue-900 mb-2'>Thank you for signing up!</h2>
                    <p className='text-gray-600 mb-6'>
                        We've received your volunteer application. Our team will review it and contact you soon at {formData.phone}.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({
                                firstName: '',
                                lastName: '',
                                email: '',
                                phone: '',
                                location: '',
                                occupation: '',
                                message: '',
                            });
                            setInterests([]);
                            setAvailability([]);
                        }}
                        className='bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors'
                    >
                        Submit Another Application
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className='bg-white px-4 md:px-6 py-16'>
            <div className='max-w-3xl mx-auto'>
                <h2 className='text-2xl font-bold text-blue-900 mb-2'>Sign Up to Volunteer</h2>
                <div className='w-12 h-1 bg-orange-500 rounded mb-8'></div>

                {error && (
                    <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700'>
                        {error}
                    </div>
                )}

                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div className='grid sm:grid-cols-2 gap-5'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='firstName'>
                                First Name <span className='text-orange-500'>*</span>
                            </label>
                            <input
                                id='firstName'
                                type='text'
                                placeholder='e.g. Mary'
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='lastName'>
                                Last Name <span className='text-orange-500'>*</span>
                            </label>
                            <input
                                id='lastName'
                                type='text'
                                placeholder='e.g. Achieng'
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                    </div>

                    <div className='grid sm:grid-cols-2 gap-5'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='email'>
                                Email Address
                            </label>
                            <input
                                id='email'
                                type='email'
                                placeholder='you@example.com'
                                value={formData.email}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='phone'>
                                Phone Number <span className='text-orange-500'>*</span>
                            </label>
                            <input
                                id='phone'
                                type='tel'
                                placeholder='+254 7XX XXX XXX'
                                value={formData.phone}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                    </div>

                    <div className='grid sm:grid-cols-2 gap-5'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='location'>
                                Town / Sub-County
                            </label>
                            <input
                                id='location'
                                type='text'
                                placeholder='e.g. Homa Bay'
                                value={formData.location}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='occupation'>
                                Occupation / Profession
                            </label>
                            <input
                                id='occupation'
                                type='text'
                                placeholder='e.g. Nurse'
                                value={formData.occupation}
                                onChange={handleInputChange}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition'
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Area of Interest <span className='text-orange-500'>*</span>
                        </label>
                        <div className='grid sm:grid-cols-3 gap-3'>
                            {interestOptions.map(area => (
                                <label
                                    key={area}
                                    className='flex items-center gap-2.5 bg-[#fdf6ee] border border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:border-orange-400 transition-colors'
                                >
                                    <input
                                        type='checkbox'
                                        checked={interests.includes(area)}
                                        onChange={() => handleInterestToggle(area)}
                                        className='accent-orange-500 w-4 h-4'
                                    />
                                    <span className='text-sm text-gray-700'>{area}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Availability <span className='text-orange-500'>*</span>
                        </label>
                        <div className='grid sm:grid-cols-3 gap-3'>
                            {availabilityOptions.map(slot => (
                                <label
                                    key={slot}
                                    className='flex items-center gap-2.5 bg-[#fdf6ee] border border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:border-orange-400 transition-colors'
                                >
                                    <input
                                        type='checkbox'
                                        checked={availability.includes(slot)}
                                        onChange={() => handleAvailabilityToggle(slot)}
                                        className='accent-orange-500 w-4 h-4'
                                    />
                                    <span className='text-sm text-gray-700'>{slot}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1.5' htmlFor='message'>
                            Why do you want to volunteer? <span className='text-gray-400 font-normal'>(optional)</span>
                        </label>
                        <textarea
                            id='message'
                            rows={4}
                            placeholder='Tell us your motivations...'
                            value={formData.message}
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
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default VolunteerForm;