import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AppointmentBooking = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        service: '',
        date: '',
        time: '',
        fullName: '',
        phone: '',
        email: '',
        medicalHistory: '',
        specialist: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const services = [
        { id: 'general', name: 'General Consultation' },
        { id: 'maternity', name: 'Maternity Services' },
        { id: 'emergency', name: 'Emergency Care' },
        { id: 'pediatric', name: 'Pediatric Care' },
        { id: 'surgical', name: 'Surgical Services' },
        { id: 'dental', name: 'Dental Care' },
    ];

    const specialists = [
        'General Practitioner',
        'Obstetrician',
        'Pediatrician',
        'Surgeon',
        'Dentist',
        'No preference',
    ];

    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    ];

    const handleServiceSelect = (serviceId: string) => {
        setFormData({ ...formData, service: serviceId });
        setStep(2);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, date: e.target.value });
    };

    const handleTimeSelect = (time: string) => {
        setFormData({ ...formData, time });
        setStep(3);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSpecialistSelect = (specialist: string) => {
        setFormData({ ...formData, specialist });
        setStep(4);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            formData.fullName &&
            formData.phone &&
            formData.service &&
            formData.date &&
            formData.time
        ) {
            setLoading(true);
            setError('');

            try {
                // Insert appointment with approved status directly (no pending state)
                const { data: insertData, error: insertError } = await supabase
                    .from('appointments')
                    .insert([
                        {
                            service: formData.service,
                            appointment_date: formData.date,
                            appointment_time: formData.time,
                            full_name: formData.fullName,
                            phone: formData.phone,
                            email: formData.email || null,
                            medical_history: formData.medicalHistory || null,
                            specialist: formData.specialist || null,
                            status: 'approved',
                        },
                    ])
                    .select();

                if (insertError) {
                    setError(`Error booking appointment: ${insertError.message}`);
                    setLoading(false);
                    return;
                }

                console.log('Appointment created and approved:', insertData);

                // TODO: Trigger email/SMS to patient and admin
                // Call Supabase Edge Function or external service:
                // await supabase.functions.invoke('send-booking-confirmation', {
                //   body: {
                //     appointmentId: insertData?.[0]?.id,
                //     fullName: formData.fullName,
                //     phone: formData.phone,
                //     email: formData.email,
                //     service: formData.service,
                //     date: formData.date,
                //     time: formData.time,
                //   },
                // });

                setSubmitted(true);
            } catch (err) {
                setError('An unexpected error occurred. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const goToStep = (stepNum: number) => {
        setStep(stepNum);
    };

    const resetBooking = () => {
        setSubmitted(false);
        setStep(1);
        setError('');
        setFormData({
            service: '',
            date: '',
            time: '',
            fullName: '',
            phone: '',
            email: '',
            medicalHistory: '',
            specialist: '',
        });
    };

    const progressPercentage = (step / 4) * 100;

    if (submitted) {
        const serviceName = services.find((s) => s.id === formData.service)?.name || '';

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
                            ✓
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Booking confirmed</h2>
                    <p className="text-muted mb-6">
                        Your appointment has been scheduled. A confirmation email and SMS have been sent to you.
                    </p>
                    <div className="bg-surface-2 rounded-lg p-4 text-left mb-6 text-sm space-y-2">
                        <p>
                            <span className="font-medium text-primary">Service:</span> {serviceName}
                        </p>
                        <p>
                            <span className="font-medium text-primary">Date:</span> {formData.date}
                        </p>
                        <p>
                            <span className="font-medium text-primary">Time:</span> {formData.time}
                        </p>
                    </div>
                    <button
                        onClick={resetBooking}
                        className="w-full btn-primary rounded-lg"
                    >
                        Book another appointment
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-border">
            {/* Progress bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-primary">Step {step} of 4</span>
                    <span className="text-sm text-muted">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Step 1: Service Selection */}
                {step === 1 && (
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Select a service</h3>
                        <p className="text-muted mb-6">What service do you need?</p>
                        <div className="grid grid-cols-2 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => handleServiceSelect(service.id)}
                                    className={`p-4 rounded-lg border-2 transition-all text-center font-medium ${formData.service === service.id
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-border text-primary hover:border-primary hover:bg-primary/5'
                                        }`}
                                >
                                    {service.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Date & Time Selection */}
                {step === 2 && (
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Pick a date and time</h3>
                        <p className="text-muted mb-6">Choose your preferred appointment slot</p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-primary mb-2">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-primary mb-3">Time</label>
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => handleTimeSelect(slot)}
                                        className={`py-2 px-3 rounded-lg border transition-all text-sm font-medium ${formData.time === slot
                                            ? 'bg-primary text-white border-primary'
                                            : 'border-border text-primary hover:border-primary hover:bg-primary/5'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => goToStep(1)}
                            className="mt-6 w-full py-2 px-4 rounded-lg border border-border text-primary hover:bg-surface-2 transition-colors font-medium"
                        >
                            Back
                        </button>
                    </div>
                )}

                {/* Step 3: Medical Info */}
                {step === 3 && (
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Tell us about yourself</h3>
                        <p className="text-muted mb-6">Brief medical history helps us prepare</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Full name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Phone number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+254 712 345 678"
                                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">
                                    Medical history / complaints
                                </label>
                                <textarea
                                    name="medicalHistory"
                                    value={formData.medicalHistory}
                                    onChange={handleInputChange}
                                    placeholder="Any allergies, current medications, or symptoms we should know about?"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 mt-6">
                            <button
                                type="button"
                                onClick={() => goToStep(4)}
                                className="w-full btn-primary rounded-lg"
                            >
                                Next
                            </button>
                            <button
                                type="button"
                                onClick={() => goToStep(2)}
                                className="w-full py-2 px-4 rounded-lg border border-border text-primary hover:bg-surface-2 transition-colors font-medium"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Specialist Selection */}
                {step === 4 && (
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Choose a specialist</h3>
                        <p className="text-muted mb-6">Select your preferred doctor type (optional for now)</p>

                        <div className="grid grid-cols-1 gap-3 mb-6">
                            {specialists.map((specialist) => (
                                <button
                                    key={specialist}
                                    type="button"
                                    onClick={() => handleSpecialistSelect(specialist)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${formData.specialist === specialist
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-border text-primary hover:border-primary hover:bg-primary/5'
                                        }`}
                                >
                                    {specialist}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Booking...' : 'Confirm appointment'}
                            </button>
                            <button
                                type="button"
                                onClick={() => goToStep(3)}
                                disabled={loading}
                                className="w-full py-2 px-4 rounded-lg border border-border text-primary hover:bg-surface-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AppointmentBooking;