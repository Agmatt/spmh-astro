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
    const [notificationStatus, setNotificationStatus] = useState('');

    // Validation state
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

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

        for (let i = 0; i < 56; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            if (date.getDay() === targetDay) {
                dates.push(date.toISOString().split('T')[0]);
            }
        }
        return dates;
    };

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

    // Validation functions
    const validateFullName = (name) => {
        if (!name || !name.trim()) {
            return 'Name is required';
        }
        if (name.trim().length < 3) {
            return 'Enter full name (minimum 3 characters)';
        }
        return '';
    };

    const validatePhone = (phone) => {
        if (!phone || !phone.trim()) {
            return 'Phone number is required';
        }

        const cleanPhone = phone.replace(/[\s\-().]/g, '');

        if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('0')) {
            return 'Phone must start with + (international) or 0 (local)';
        }

        const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
        if (digitsOnly.length < 10) {
            return `Phone must have at least 10 digits (you have ${digitsOnly.length})`;
        }

        if (cleanPhone.startsWith('+')) {
            if (digitsOnly.length < 10 || digitsOnly.length > 15) {
                return 'International format: +country code + 9-13 digits';
            }
        }

        if (cleanPhone.startsWith('0')) {
            if (digitsOnly.length !== 10) {
                return 'Local format: 0 followed by 9 digits (10 total)';
            }
        }

        return '';
    };

    const validateEmail = (email) => {
        if (!email) return '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Enter valid email address';
        }
        return '';
    };

    const validateStep = (stepNum) => {
        const newErrors = {};

        if (stepNum === 1) {
            if (!formData.clinic) {
                newErrors.clinic = 'Select a clinic';
            }
        }

        if (stepNum === 2) {
            if (!formData.date) {
                newErrors.date = 'Select a date';
            }
            if (!formData.time) {
                newErrors.time = 'Select a time';
            }
        }

        if (stepNum === 3) {
            const nameError = validateFullName(formData.fullName);
            if (nameError) newErrors.fullName = nameError;

            const phoneError = validatePhone(formData.phone);
            if (phoneError) newErrors.phone = phoneError;

            const emailError = validateEmail(formData.email);
            if (emailError) newErrors.email = emailError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClinicSelect = async (clinicId) => {
        setFormData({ ...formData, clinic: clinicId, date: '', time: '' });
        setError('');
        setErrors({});
        setTouched({});
        setStep(2);

        const clinic = clinics.find(c => c.id === clinicId);
        const dates = getAvailableDatesForClinic(clinic.day);
        setAvailableDates(dates);
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
        setTouched({ ...touched, date: true });
    };

    const handleTimeSelect = (time) => {
        setFormData({ ...formData, time });
        setTouched({ ...touched, time: true });
        setStep(3);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setTouched({ ...touched, [name]: true });

        if (name === 'fullName') {
            const nameError = validateFullName(value);
            setErrors({ ...errors, fullName: nameError });
        }
        if (name === 'phone') {
            const phoneError = validatePhone(value);
            setErrors({ ...errors, phone: phoneError });
        }
        if (name === 'email') {
            const emailError = validateEmail(value);
            setErrors({ ...errors, email: emailError });
        }
    };

    // Send notifications via API
    const sendNotifications = async (bookingData) => {
        try {
            setNotificationStatus('sending');

            // Call your backend API to send email + SMS
            const response = await fetch('/api/send-booking-confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: bookingData.fullName,
                    phone: bookingData.phone,
                    email: bookingData.email,
                    clinic: bookingData.clinicName,
                    date: bookingData.date,
                    time: bookingData.time,
                }),
            });

            if (!response.ok) {
                console.warn('Notification send failed, but booking was saved');
                setNotificationStatus('');
                return true; // Booking still succeeded
            }

            setNotificationStatus('sent');
            return true;
        } catch (err) {
            console.warn('Error sending notifications:', err);
            setNotificationStatus('');
            return true; // Don't fail booking if notifications fail
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(3)) {
            return;
        }

        const selectedDateCapacity = dateCapacity[formData.date];
        if (selectedDateCapacity && selectedDateCapacity.isFull) {
            setError('This date just became full. Please select another date.');
            return;
        }

        if (formData.clinic && formData.fullName && formData.phone && formData.date && formData.time) {
            setLoading(true);
            setError('');

            try {
                const selectedClinic = clinics.find(c => c.id === formData.clinic);

                const { data: insertData, error: insertError } = await supabase
                    .from('appointments')
                    .insert([
                        {
                            clinic_name: formData.clinic,
                            clinic_day: selectedClinic?.day,
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

                // Send email + SMS notifications
                await sendNotifications({
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    clinicName: selectedClinic?.name,
                    date: formData.date,
                    time: formData.time,
                });

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
        setErrors({});
        setTouched({});
        setNotificationStatus('');
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
    const isStep3Valid = !errors.fullName && !errors.phone && !errors.email && formData.fullName && formData.phone;

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
                        Your appointment has been scheduled.
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

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
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

                {step === 3 && (
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Your information</h3>
                        <p className="text-muted mb-6">Please provide your details (* = required)</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Full name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    onBlur={() => setTouched({ ...touched, fullName: true })}
                                    placeholder="John Doe"
                                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${touched.fullName && errors.fullName
                                        ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                        : touched.fullName && formData.fullName
                                            ? 'border-green-400 focus:ring-green-200'
                                            : 'border-border focus:border-primary focus:ring-primary/20'
                                        }`}
                                />
                                {touched.fullName && errors.fullName && (
                                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                        ✗ {errors.fullName}
                                    </p>
                                )}
                                {touched.fullName && !errors.fullName && formData.fullName && (
                                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                        ✓ Looks good
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Phone number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onBlur={() => setTouched({ ...touched, phone: true })}
                                    placeholder="+254 712 345 678"
                                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${touched.phone && errors.phone
                                        ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                        : touched.phone && formData.phone
                                            ? 'border-green-400 focus:ring-green-200'
                                            : 'border-border focus:border-primary focus:ring-primary/20'
                                        }`}
                                />
                                {touched.phone && errors.phone && (
                                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                        ✗ {errors.phone}
                                    </p>
                                )}
                                {touched.phone && !errors.phone && formData.phone && (
                                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                        ✓ Valid phone number
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Email <span className="text-muted text-xs font-normal">(optional)</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={() => setTouched({ ...touched, email: true })}
                                    placeholder="john@example.com"
                                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${touched.email && errors.email
                                        ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                        : touched.email && formData.email
                                            ? 'border-green-400 focus:ring-green-200'
                                            : 'border-border focus:border-primary focus:ring-primary/20'
                                        }`}
                                />
                                {touched.email && errors.email && (
                                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                        ✗ {errors.email}
                                    </p>
                                )}
                                {touched.email && !errors.email && formData.email && (
                                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                        ✓ Valid email
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">
                                    Medical history / complaints <span className="text-muted text-xs font-normal">(optional)</span>
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
                                disabled={loading || !isStep3Valid}
                                className="w-full btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
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