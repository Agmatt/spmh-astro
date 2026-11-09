// src/react-islands/AppointmentBooking.jsx
// Public booking form. Talks only to /api/appointments/book:
//  GET  → booked counts per date (no patient data is ever read here)
//  POST → validated booking, with delivery flags for the confirmation screen

import { useState, useEffect } from 'react';

const MAX_PER_DAY = 15;

const CLINICS = [
    { id: 'sopc', name: 'Surgical Outpatient Clinic (SOPC)', day: 'Monday', weekday: 1 },
    { id: 'mopc', name: 'Medical Outpatient Clinic (MOPC)', day: 'Tuesday', weekday: 2 },
    { id: 'obgyn', name: 'OB/GYN Outpatient Clinic', day: 'Wednesday', weekday: 3 },
    { id: 'popc', name: 'Pediatric Outpatient Clinic (POPC)', day: 'Thursday', weekday: 4 },
];

const TIME_SLOTS = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];

const EMPTY = { clinic: '', date: '', time: '', fullName: '', phone: '', email: '', medicalHistory: '' };

// Next 8 weeks of the clinic's weekday, as YYYY-MM-DD (UTC, matches the server)
function upcomingDates(weekday) {
    const dates = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    for (let i = 0; i < 56; i++) {
        const d = new Date(today);
        d.setUTCDate(today.getUTCDate() + i);
        if (d.getUTCDay() === weekday) dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
}

const validName = (n) => (!n.trim() ? 'Name is required' : n.trim().length < 3 ? 'Enter your full name (at least 3 characters)' : '');
const validPhone = (p) => {
    if (!p.trim()) return 'Phone number is required';
    const c = p.replace(/[\s\-().]/g, '');
    return /^(?:\+254|254|0)[17]\d{8}$/.test(c) ? '' : 'Enter a valid Kenyan number, e.g. 0712345678 or +254712345678';
};
const validEmail = (e) => (!e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? '' : 'Enter a valid email address');

export default function AppointmentBooking() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(EMPTY);
    const [touched, setTouched] = useState({});
    const [availableDates, setAvailableDates] = useState([]);
    const [counts, setCounts] = useState({});
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmation, setConfirmation] = useState(null);

    const clinic = CLINICS.find((c) => c.id === form.clinic);
    const errors = {
        fullName: touched.fullName ? validName(form.fullName) : '',
        phone: touched.phone ? validPhone(form.phone) : '',
        email: touched.email ? validEmail(form.email) : '',
    };
    const detailsValid = !validName(form.fullName) && !validPhone(form.phone) && !validEmail(form.email);
    const dateFull = (d) => (counts[d] ?? 0) >= MAX_PER_DAY;

    async function chooseClinic(id) {
        const c = CLINICS.find((x) => x.id === id);
        const dates = upcomingDates(c.weekday);
        setForm({ ...EMPTY, clinic: id });
        setAvailableDates(dates);
        setCounts({});
        setError('');
        setStep(2);
        setLoadingAvailability(true);
        try {
            const res = await fetch(`/api/appointments/book?clinic=${id}&dates=${dates.join(',')}`);
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || 'Could not load availability.');
            setCounts(data.counts || {});
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingAvailability(false);
        }
    }

    function chooseDate(date) {
        if (!date) return setForm({ ...form, date: '', time: '' });
        if (dateFull(date)) {
            setError(`That ${clinic.day} is fully booked. Please choose another.`);
            return setForm({ ...form, date: '', time: '' });
        }
        setError('');
        setForm({ ...form, date, time: '' });
    }

    async function submit(e) {
        e.preventDefault();
        setTouched({ fullName: true, phone: true, email: true });
        if (!detailsValid) return;

        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clinic: form.clinic,
                    date: form.date,
                    time: form.time,
                    fullName: form.fullName,
                    phone: form.phone,
                    email: form.email,
                    medicalHistory: form.medicalHistory,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error || 'Could not complete your booking. Please try again.');
                if (res.status === 409) setStep(2); // full: back to date choice
                return;
            }
            setConfirmation({ ...data, fullName: form.fullName, email: form.email });
        } catch {
            setError('Network problem. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    }

    function startAgain() {
        setConfirmation(null);
        setForm(EMPTY);
        setStep(1);
        setError('');
        setTouched({});
    }

    // ── Confirmation ────────────────────────────────────────────────────────
    if (confirmation) {
        const emailLine = !confirmation.emailRequested
            ? 'You did not give an email address, so no email was sent. Please write these details down.'
            : confirmation.patientEmailSent
                ? `A confirmation email has been sent to ${confirmation.email}.`
                : `We could not send the confirmation email to ${confirmation.email}. Please write these details down.`;

        return (
            <div className='text-center py-6'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700 mx-auto mb-4'>✓</div>
                <h2 className='text-2xl font-bold text-[#0d3b6e] mb-2'>Booking confirmed</h2>
                <p className='text-gray-600 mb-6'>{confirmation.fullName}, your appointment is saved.</p>
                <div className='bg-gray-50 rounded-lg p-4 text-left text-sm space-y-1 mb-4'>
                    <p><span className='font-semibold'>Clinic:</span> {CLINICS.find((c) => c.id === form.clinic)?.name ?? confirmation.clinic}</p>
                    <p><span className='font-semibold'>Day:</span> {confirmation.day}</p>
                    <p><span className='font-semibold'>Date:</span> {confirmation.date}</p>
                    <p><span className='font-semibold'>Time:</span> {confirmation.time}</p>
                </div>
                <p className={`text-sm mb-6 ${confirmation.emailRequested && !confirmation.patientEmailSent ? 'text-amber-700' : 'text-gray-600'}`}>
                    {emailLine}
                </p>
                <button onClick={startAgain} className='w-full py-3 rounded-lg bg-[#0d3b6e] text-white font-bold'>
                    Book another appointment
                </button>
            </div>
        );
    }

    // ── Steps ───────────────────────────────────────────────────────────────
    const inputClass = (bad) =>
        `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${bad ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-300 focus:ring-[#0d3b6e]/20'}`;

    return (
        <div>
            <div className='mb-6'>
                <div className='flex justify-between text-sm mb-2'>
                    <span className='font-medium text-[#0d3b6e]'>Step {step} of 3</span>
                    <span className='text-gray-500'>{Math.round((step / 3) * 100)}%</span>
                </div>
                <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div className='h-full bg-[#0d3b6e] transition-all' style={{ width: `${(step / 3) * 100}%` }} />
                </div>
            </div>

            {error && <div className='mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700'>{error}</div>}

            {step === 1 && (
                <div>
                    <h3 className='text-xl font-bold text-[#0d3b6e] mb-2'>Select a clinic</h3>
                    <p className='text-gray-600 mb-5'>Each clinic runs on one day of the week.</p>
                    <div className='space-y-3'>
                        {CLINICS.map((c) => (
                            <button key={c.id} type='button' onClick={() => chooseClinic(c.id)}
                                className='w-full p-4 rounded-lg border-2 border-gray-200 text-left hover:border-[#0d3b6e] transition'>
                                <p className='font-bold text-[#0d3b6e]'>{c.name}</p>
                                <p className='text-sm text-gray-500 mt-1'>{c.day}s, 8:00 AM – 12:00 PM</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && clinic && (
                <div>
                    <h3 className='text-xl font-bold text-[#0d3b6e] mb-2'>Pick a date and time</h3>
                    <p className='text-gray-600 mb-5'>{clinic.name} runs on {clinic.day}s.</p>

                    <label className='block text-sm font-medium text-[#0d3b6e] mb-2'>Date</label>
                    {loadingAvailability ? (
                        <p className='text-sm text-gray-500 mb-5'>Checking availability…</p>
                    ) : (
                        <select value={form.date} onChange={(e) => chooseDate(e.target.value)} className={`${inputClass(false)} mb-5`}>
                            <option value=''>-- Select a date --</option>
                            {availableDates.map((d) => {
                                const full = dateFull(d);
                                const left = MAX_PER_DAY - (counts[d] ?? 0);
                                const label = new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
                                return (
                                    <option key={d} value={d} disabled={full}>
                                        {label} – {full ? 'FULL' : `${left} slots left`}
                                    </option>
                                );
                            })}
                        </select>
                    )}

                    {form.date && (
                        <>
                            <label className='block text-sm font-medium text-[#0d3b6e] mb-3'>Time</label>
                            <div className='grid grid-cols-4 gap-2 mb-6'>
                                {TIME_SLOTS.map((t) => (
                                    <button key={t} type='button' onClick={() => { setForm({ ...form, time: t }); setStep(3); }}
                                        className={`py-2 rounded-lg border text-sm font-medium ${form.time === t ? 'bg-[#0d3b6e] text-white border-[#0d3b6e]' : 'border-gray-300 text-[#0d3b6e] hover:border-[#0d3b6e]'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <button type='button' onClick={() => setStep(1)} className='w-full py-2.5 rounded-lg border border-gray-300 text-[#0d3b6e] font-medium'>
                        Back
                    </button>
                </div>
            )}

            {step === 3 && (
                <form onSubmit={submit} className='space-y-4'>
                    <h3 className='text-xl font-bold text-[#0d3b6e]'>Your details</h3>
                    <p className='text-gray-600 text-sm'>* required. Your phone number is how we reach you, so please check it.</p>

                    <div>
                        <label className='block text-sm font-medium text-[#0d3b6e] mb-1.5'>Full name *</label>
                        <input type='text' value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            onBlur={() => setTouched({ ...touched, fullName: true })} placeholder='John Doe' className={inputClass(!!errors.fullName)} />
                        {errors.fullName && <p className='text-xs text-red-600 mt-1'>{errors.fullName}</p>}
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#0d3b6e] mb-1.5'>Phone number *</label>
                        <input type='tel' value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            onBlur={() => setTouched({ ...touched, phone: true })} placeholder='0712 345 678' className={inputClass(!!errors.phone)} />
                        {errors.phone && <p className='text-xs text-red-600 mt-1'>{errors.phone}</p>}
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#0d3b6e] mb-1.5'>Email <span className='text-gray-500 font-normal'>(optional, for a written confirmation)</span></label>
                        <input type='email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            onBlur={() => setTouched({ ...touched, email: true })} placeholder='john@example.com' className={inputClass(!!errors.email)} />
                        {errors.email && <p className='text-xs text-red-600 mt-1'>{errors.email}</p>}
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#0d3b6e] mb-1.5'>Medical history / complaints <span className='text-gray-500 font-normal'>(optional)</span></label>
                        <textarea rows={4} value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
                            placeholder='Allergies, current medications, or symptoms we should know about?' className={inputClass(false)} />
                    </div>

                    <div className='bg-gray-50 rounded-lg p-3 text-sm text-gray-700'>
                        <strong>{clinic?.name}</strong> · {form.date} · {form.time}
                    </div>

                    <button type='submit' disabled={submitting} className='w-full py-3 rounded-lg bg-[#0d3b6e] text-white font-bold disabled:opacity-50'>
                        {submitting ? 'Booking…' : 'Confirm appointment'}
                    </button>
                    <button type='button' onClick={() => setStep(2)} disabled={submitting} className='w-full py-2.5 rounded-lg border border-gray-300 text-[#0d3b6e] font-medium'>
                        Back
                    </button>
                </form>
            )}
        </div>
    );
}