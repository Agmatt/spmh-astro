import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zzlngxryoalajdpsbpnn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bG5neHJ5b2FsYWpkcHNicG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MDk3NjYsImV4cCI6MjA5ODE4NTc2Nn0.NN2MqqqOITkizXpMw1qrAwbb4GYIySa7jsIcWnmP-Ag';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MAX_BOOKINGS_PER_DAY = 15;

const AppointmentBooking = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        clinic: '',
        date: '',
        time: '',
        fullName: '',
        phone: '',
        email: '',
        medicalHistory: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [availableDates, setAvailableDates] = useState([]);
    const [dateCapacity, setDateCapacity] = useState({});

    const clinics = [
        { id: 'sopc', name: 'Surgical Outpatient Clinic (SOPC)', day: 'Monday' },
        { id: 'mopc', name: 'Medical Outpatient Clinic (MOPC)', day: 'Tuesday' },
        { id: 'obgyn', name: 'OB/GYN Outpatient Clinic', day: 'Wednesday' },
        { id: 'popc', name: 'Pediatric Outpatient Clinic (POPC)', day: 'Thursday' },
    ];

    const timeSlots = [
        '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    ];

    // Get next 8 weeks of available dates for a specific clinic day
    const getAvailableDatesForClinic = (clinicDay) => {
        const dayMap = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4 };
        const targetDay = dayMap[clinicDay];
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 56; i++) { // 8 weeks
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            if (date.getDay() === targetDay) {
                dates.push(date.toISOString().split('T')[0]);
            }
        }
        return dates;
    };

    // Check capacity for all available dates
    const checkCapacityForDates = async (clinicId, dates) => {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('appointment_date, id')
                .eq('clinic_name', clinicId);

            if (error) throw error;

            const capacityMap = {};
            dates.forEach(date => {
                const bookingsOnDate = data.filter(d => d.appointment_date === date).length;
                capacityMap[date] = {
                    booked: bookingsOnDate,
                    available: MAX_BOOKINGS_PER_DAY - bookingsOnDate,
                    isFull: bookingsOnDate >= MAX_BOOKINGS_PER_DAY,
                };
            });
            setDateCapacity(capacityMap);
            return capacityMap;
        } catch (err) {
            console.error('Error checking capacity:', err);
            return {};
        }
    };

    const handleClinicSelect = async (clinicId) => {
        setFormData({ ...formData, clinic: clinicId, date: '', time: '' });
        setError('');
        setStep(2);

        // Get available dates for this clinic
        const clinic = clinics.find(c => c.id === clinicId);
        const dates = getAvailableDatesForClinic(clinic.day);
        setAvailableDates(dates);

        // Check capacity for all dates
        await checkCapacityForDates(clinicId, dates);
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const capacity = dateCapacity[selectedDate];

        if (capacity && capacity.isFull) {
            setError(`⚠️ This date is fully booked (15/15). Please select another ${clinics.find(c => c.id === formData.clinic)?.day}.`);
            setFormData({ ...formData, date: '', time: '' });
            return;
        }

        setError('');
        setFormData({ ...formData, date: selectedDate, time: '' });
    };

    const handleTimeSelect = (time) => {
        setFormData({ ...formData, time });
        setStep(3);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Double-check capacity before submitting
        const selectedDateCapacity = dateCapacity[formData.date];
        if (selectedDateCapacity && selectedDateCapacity.isFull) {
            setError('This date just became full. Please select another date.');
            return;
        }

        if (
            formData.clinic &&
            formData.fullName &&
            formData.phone &&
            formData.date &&
            formData.time
        ) {
            setLoading(true);
            setError('');

            try {
                const selectedClinic = clinics.find(c => c.id === formData.clinic);

                const { data: insertData, error: insertError } = await supabase
                    .from('appointments')
                    .insert([
                        {
                            clinic_name: formData.clinic,
                            clinic_day: selectedClinic?.day,  // <-- REMOVE THIS LINE
                            appointment_date: formData.date,
                            appointment_time: formData.time,
                            full_name: formData.fullName,
                            phone: formData.phone,
                            email: formData.email || null,
                            medical_history: formData.medicalHistory || null,
                            status: 'approved',
                        },
                    ])
                    .select();

                if (insertError) {
                    setError(`Error booking appointment: ${insertError.message}`);
                    setLoading(false);
                    return;
                }

                console.log('Appointment created:', insertData);
                setSubmitted(true);
            } catch (err) {
                setError('An unexpected error occurred. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const goToStep = (stepNum) => {
        setStep(stepNum);
    };

    const resetBooking = () => {
        setSubmitted(false);
        setStep(1);
        setError('');
        setFormData({
            clinic: '',
            date: '',
            time: '',
            fullName: '',
            phone: '',
            email: '',
            medicalHistory: '',
        });
    };

    const selectedClinic = clinics.find(c => c.id === formData.clinic);
    const selectedDateCapacity = dateCapacity[formData.date];
    const progressPercentage = (step / 3) * 100;

    if (submitted) {
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
                            <span className="font-medium text-primary">Clinic:</span> {selectedClinic?.name}
                        </p>
                        <p>
                            <span className="font-medium text-primary">Day:</span> {selectedClinic?.day}
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
                    <span className="text-sm font-medium text-primary">Step {step} of 3</span>
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
                {/* Step 1: Clinic Selection */}
                {step === 1 && (
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Select a clinic</h3>
                        <p className="text-muted mb-6">Choose the clinic you want to visit. Each clinic operates on a specific day and has 15 available slots per day.</p>
                        <div className="space-y-3">
                            {clinics.map((clinic) => (
                                <button
                                    key={clinic.id}
                                    type="button"
                                    onClick={() => handleClinicSelect(clinic.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${formData.clinic === clinic.id
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-border text-primary hover:border-primary hover:bg-primary/5'
                                        }`}
                                >
                                    <p className="font-bold">{clinic.name}</p>
                                    <p className={`text-sm mt-1 ${formData.clinic === clinic.id ? 'text-white/80' : 'text-muted'}`}>
                                        Available: {clinic.day}s, 8:00 AM - 12:00 PM (Max 15 bookings/day)
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Date & Time Selection */}
                {step === 2 && (
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Pick a date and time</h3>
                        <p className="text-muted mb-2">
                            <span className="font-semibold">{selectedClinic?.name}</span> operates on <span className="font-semibold">{selectedClinic?.day}s</span>
                        </p>
                        <p className="text-muted mb-6">Please select a {selectedClinic?.day} for your appointment. Dates in red are fully booked.</p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-primary mb-2">Date</label>
                            <select
                                value={formData.date}
                                onChange={handleDateChange}
                                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">-- Select a date --</option>
                                {availableDates.map(date => {
                                    const capacity = dateCapacity[date];
                                    const isFull = capacity?.isFull;
                                    const availableSlots = capacity?.available || 0;
                                    const dateStr = new Date(date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

                                    return (
                                        <option
                                            key={date}
                                            value={date}
                                            disabled={isFull}
                                            style={{ color: isFull ? '#999' : '#000' }}
                                        >
                                            {dateStr} - {isFull ? 'FULL (15/15)' : `${availableSlots} slots available`}
                                        </option>
                                    );
                                })}
                            </select>
                            {formData.date && selectedDateCapacity && (
                                <p className={`text-sm mt-2 font-medium ${selectedDateCapacity.isFull ? 'text-red-600' : 'text-green-600'}`}>
                                    {selectedDateCapacity.booked}/{MAX_BOOKINGS_PER_DAY} booked • {selectedDateCapacity.available} available
                                </p>
                            )}
                        </div>

                        {formData.date && !selectedDateCapacity?.isFull && (
                            <div>
                                <label className="block text-sm font-medium text-primary mb-3">Time (8:00 AM - 12:00 PM)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => handleTimeSelect(slot)}
                                            className={`py-2 px-2 rounded-lg border transition-all text-sm font-medium ${formData.time === slot
                                                ? 'bg-primary text-white border-primary'
                                                : 'border-border text-primary hover:border-primary hover:bg-primary/5'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => goToStep(1)}
                            className="mt-6 w-full py-2 px-4 rounded-lg border border-border text-primary hover:bg-surface-2 transition-colors font-medium"
                        >
                            Back
                        </button>
                    </div>
                )}

                {/* Step 3: Patient Info */}
                {step === 3 && (
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Your information</h3>
                        <p className="text-muted mb-6">Please provide your details</p>

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
                                    Medical history / complaints (optional)
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
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Booking...' : 'Confirm appointment'}
                            </button>
                            <button
                                type="button"
                                onClick={() => goToStep(2)}
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