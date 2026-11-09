// src/components/AppointmentsDashboard.jsx
// Rendered by src/pages/admin/appointments/index.astro AFTER the server has
// checked session, role and idle timeout. No login screen and no hardcoded
// keys here: the cookie-based client carries the verified session.

import { useState, useEffect, useMemo } from 'react';
import { getAppointmentsBrowserSupabase } from '../lib/appointments-supabase-browser';

const supabase = getAppointmentsBrowserSupabase();

const IDLE_TIME = 15 * 60 * 1000; // matches the server gate

const C = {
  dark: '#1c1c1e',
  red: '#860f0f',
  redBg: '#fef2f2',
  warm: '#f9f6f2',
  border: '#ece8e1',
  muted: '#6b7280',
  mutedL: '#9ca3af',
};

const statusStyle = {
  approved: { background: '#d1fae5', color: '#065f46' },
  completed: { background: '#dbeafe', color: '#1e40af' },
  cancelled: { background: '#fee2e2', color: '#991b1b' },
};

const statCardGradients = [
  'linear-gradient(135deg, #1c1c1e, #2d2d30)',
  'linear-gradient(135deg, #065f46, #059669)',
  'linear-gradient(135deg, #1e40af, #2563eb)',
  'linear-gradient(135deg, #860f0f, #a01212)',
];

const STATUSES = ['approved', 'completed', 'cancelled'];

const CLINIC_NAMES = {
  sopc: 'SOPC (Surgical)',
  mopc: 'MOPC (Medical)',
  obgyn: 'OB/GYN',
  popc: 'POPC (Pediatric)',
};

const CLINIC_DAYS = {
  sopc: 'Monday',
  mopc: 'Tuesday',
  obgyn: 'Wednesday',
  popc: 'Thursday',
};

const EMPTY_FILTERS = {
  clinic: 'all',
  day: 'all',
  dateFrom: '',
  dateTo: '',
  status: 'all',
  name: '',
  email: '',
  emailPresence: 'all',
  medical: 'all',
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

export default function AppointmentsDashboard({ userId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Client-side idle logout (the server also enforces it on each page load)
  useEffect(() => {
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(handleLogout, IDLE_TIME);
    };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(timer);
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.assign('/admin/appointments/login');
  }

  async function fetchBookings() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(`Failed to load bookings: ${error.message}`);
    else setBookings(data || []);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) setError(`Could not update status: ${error.message}`);
    else fetchBookings();
  }

  async function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) setError(`Could not delete booking: ${error.message}`);
    else fetchBookings();
  }

  const filtered = useMemo(() => {
    const f = filters;
    const name = f.name.trim().toLowerCase();
    const email = f.email.trim().toLowerCase();
    return bookings.filter((b) => {
      if (f.clinic !== 'all' && b.clinic_name !== f.clinic) return false;
      if (f.day !== 'all' && b.clinic_day !== f.day) return false;
      if (f.dateFrom && b.appointment_date < f.dateFrom) return false;
      if (f.dateTo && b.appointment_date > f.dateTo) return false;
      if (f.status !== 'all' && b.status !== f.status) return false;
      if (name && !(b.full_name || '').toLowerCase().includes(name)) return false;
      if (email && !(b.email || '').toLowerCase().includes(email)) return false;
      if (f.emailPresence === 'has' && !(b.email || '').trim()) return false;
      if (f.emailPresence === 'missing' && (b.email || '').trim()) return false;
      if (f.medical === 'has' && !(b.medical_history || '').trim()) return false;
      if (f.medical === 'missing' && (b.medical_history || '').trim()) return false;
      return true;
    });
  }, [bookings, filters]);

  const medicalCount = bookings.filter((b) => (b.medical_history || '').trim()).length;
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);
  const setF = (key) => (e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const rowsForExport = () =>
    filtered.map((b) => ({
      'Full Name': b.full_name || '',
      Phone: b.phone || '',
      Email: b.email || '',
      Clinic: CLINIC_NAMES[b.clinic_name] || b.clinic_name || '',
      Day: b.clinic_day || CLINIC_DAYS[b.clinic_name] || '',
      'Appointment Date': b.appointment_date || '',
      'Appointment Time': b.appointment_time || '',
      'Medical History': b.medical_history || '',
      Status: b.status || '',
      'Created At': b.created_at ? new Date(b.created_at).toLocaleString() : '',
    }));

  const stamp = () => new Date().toISOString().split('T')[0];

  function exportCSV() {
    if (!filtered.length) return alert('No data to export');
    setExporting(true);
    try {
      const rows = rowsForExport();
      const headers = Object.keys(rows[0]);
      const csv = [
        headers.map((h) => `"${h}"`).join(','),
        ...rows.map((r) =>
          headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','),
        ),
      ].join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments-${stamp()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  async function exportXLSX() {
    if (!filtered.length) return alert('No data to export');
    setExporting(true);
    try {
      const XLSX = await import('xlsx');
      const rows = rowsForExport();
      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = Object.keys(rows[0]).map((k) => ({ wch: Math.max(k.length, 12) }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Appointments');
      XLSX.writeFile(wb, `appointments-${stamp()}.xlsx`);
    } catch (err) {
      setError(`Failed to export XLSX: ${err.message}`);
    } finally {
      setExporting(false);
    }
  }

  const statCards = [
    { label: 'Total Bookings', value: bookings.length },
    { label: 'Approved', value: bookings.filter((b) => b.status === 'approved').length },
    { label: 'Completed', value: bookings.filter((b) => b.status === 'completed').length },
    { label: 'Cancelled', value: bookings.filter((b) => b.status === 'cancelled').length },
  ];

  const inputStyle = { borderColor: C.border, color: C.dark };
  const inputClass = 'w-full px-3 py-2 rounded-lg border text-sm outline-none';

  return (
    <div className='min-h-screen' style={{ background: C.warm }}>
      <main className='max-w-7xl mx-auto px-4 py-6 space-y-6'>
        {error && (
          <div className='p-3 rounded-lg text-sm' style={{ background: C.redBg, color: '#b91c1c', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          {statCards.map((card, i) => (
            <div key={card.label} className='rounded-xl p-4 sm:p-5' style={{ background: statCardGradients[i] }}>
              <p className='text-xs font-medium mb-1 text-white/60'>{card.label}</p>
              <p className='text-3xl font-bold text-white'>{card.value}</p>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className='bg-white rounded-xl border p-4 sm:p-6' style={{ borderColor: C.border }}>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-sm font-semibold' style={{ color: C.dark }}>Filters</h2>
            <div className='flex items-center gap-2'>
              {isFiltered && (
                <button onClick={() => setFilters(EMPTY_FILTERS)} className='text-xs font-medium px-3 py-1 rounded-lg' style={{ background: C.redBg, color: C.red }}>
                  Clear all
                </button>
              )}
              {filtered.length > 0 && (
                <div className='flex gap-2 pl-2 border-l' style={{ borderColor: C.border }}>
                  <button onClick={exportCSV} disabled={exporting} className='text-xs font-medium px-3 py-1 rounded-lg disabled:opacity-60' style={{ background: '#e0f2fe', color: '#0369a1' }}>
                    CSV
                  </button>
                  <button onClick={exportXLSX} disabled={exporting} className='text-xs font-medium px-3 py-1 rounded-lg disabled:opacity-60' style={{ background: '#dcfce7', color: '#166534' }}>
                    XLSX
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3'>
            <div>
              <label className='block text-xs font-medium mb-1.5' style={{ color: C.dark }}>Patient Name</label>
              <input type='text' value={filters.name} onChange={setF('name')} placeholder='Search by name...' className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className='block text-xs font-medium mb-1.5' style={{ color: C.dark }}>Email Search</label>
              <input type='text' value={filters.email} onChange={setF('email')} placeholder='Search by email...' className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className='block text-xs font-medium mb-1.5' style={{ color: C.dark }}>Medical History</label>
              <select value={filters.medical} onChange={setF('medical')} className={inputClass} style={inputStyle}>
                <option value='all'>All</option>
                <option value='has'>Has Notes ({medicalCount})</option>
                <option value='missing'>No Notes</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3'>
            <div>
              <label className='block text-xs font-medium mb-1.5' style={{ color: C.dark }}>Clinic</label>
              <select value={filters.clinic} onChange={setF('clinic')} className={inputClass} style={inputStyle}>
                <option value='all'>All Clinics</option>
                {Object.entries(CLINIC_NAMES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium mb-1.5' style={{ color: C.dark }}>Day</label>
              <select value={filters.day} onChange={setF('day')} className={inputClass} style={inputStyle}>
                <option value='all'>All Days</option>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium mb-1.5' style={{ color: C.dark }}>Status</label>
              <select value={filters.status} onChange={setF('status')} className={inputClass} style={inputStyle}>
                <option value='all'>All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{cap(s)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-medium mb-1.5' style={{ color: C.dark }}>Date From</label>
              <input type='date' value={filters.dateFrom} onChange={setF('dateFrom')} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className='block text-xs font-medium mb-1.5' style={{ color: C.dark }}>Date To</label>
              <input type='date' value={filters.dateTo} onChange={setF('dateTo')} className={inputClass} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* TABLE (desktop) */}
        <div className='bg-white rounded-xl border overflow-hidden' style={{ borderColor: C.border }}>
          <div className='hidden md:block overflow-x-auto'>
            <table className='w-full'>
              <thead style={{ background: C.warm, borderBottom: `1px solid ${C.border}` }}>
                <tr>
                  {['Name', 'Phone', 'Email', 'Clinic', 'Date', 'Time', 'Medical Notes', 'Status', 'Actions'].map((h) => (
                    <th key={h} className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide' style={{ color: C.red }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className='px-6 py-10 text-center text-sm' style={{ color: C.mutedL }}>Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={9} className='px-6 py-10 text-center text-sm' style={{ color: C.mutedL }}>No bookings found</td></tr>
                ) : filtered.map((b, idx) => (
                  <tr key={b.id} className='border-b cursor-pointer' style={{ borderColor: '#f3f4f6', background: idx % 2 === 0 ? '#fff' : C.warm }} onClick={() => setSelected(b)}>
                    <td className='px-5 py-3.5 text-sm font-semibold' style={{ color: C.dark }}>{b.full_name}</td>
                    <td className='px-5 py-3.5 text-sm' style={{ color: C.muted }}>{b.phone}</td>
                    <td className='px-5 py-3.5 text-sm'>
                      {b.email ? (
                        <a href={`mailto:${b.email}`} className='text-blue-600 hover:underline break-all' onClick={(e) => e.stopPropagation()}>{b.email}</a>
                      ) : (
                        <span style={{ color: C.mutedL, fontStyle: 'italic' }}>—</span>
                      )}
                    </td>
                    <td className='px-5 py-3.5 text-sm' style={{ color: C.muted }}>{CLINIC_NAMES[b.clinic_name] || b.clinic_name}</td>
                    <td className='px-5 py-3.5 text-sm' style={{ color: C.muted }}>{b.appointment_date}</td>
                    <td className='px-5 py-3.5 text-sm' style={{ color: C.muted }}>{b.appointment_time}</td>
                    <td className='px-5 py-3.5 text-xs font-semibold'>
                      <span className='px-3 py-1 rounded-full' style={{ background: b.medical_history ? C.redBg : '#f3f4f6', color: b.medical_history ? C.red : C.muted }}>
                        {b.medical_history ? 'View' : '—'}
                      </span>
                    </td>
                    <td className='px-5 py-3.5' onClick={(e) => e.stopPropagation()}>
                      <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className='px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none' style={statusStyle[b.status] || { background: '#f3f4f6', color: '#374151' }}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{cap(s)}</option>
                        ))}
                      </select>
                    </td>
                    <td className='px-5 py-3.5' onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => deleteBooking(b.id)} className='text-xs font-semibold' style={{ color: '#dc2626' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className='md:hidden divide-y' style={{ borderColor: '#f3f4f6' }}>
            {filtered.length === 0 ? (
              <p className='px-4 py-10 text-center text-sm' style={{ color: C.mutedL }}>No bookings found</p>
            ) : filtered.map((b) => (
              <div key={b.id} className='p-4 space-y-3 cursor-pointer' onClick={() => setSelected(b)}>
                <div className='flex items-start justify-between gap-2'>
                  <div>
                    <p className='text-sm font-bold' style={{ color: C.dark }}>{b.full_name}</p>
                    <p className='text-xs' style={{ color: C.muted }}>{b.phone}</p>
                  </div>
                  <span className='px-2 py-1 rounded-full text-xs font-semibold' style={statusStyle[b.status] || {}}>{cap(b.status)}</span>
                </div>
                <div className='flex flex-wrap gap-x-4 text-xs' style={{ color: C.muted }}>
                  <span>{CLINIC_NAMES[b.clinic_name] || b.clinic_name}</span>
                  <span>{b.appointment_date}</span>
                  <span>{b.appointment_time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className='text-xs pb-4' style={{ color: C.mutedL }}>
          Showing {filtered.length} of {bookings.length} bookings
        </p>
      </main>

      {/* PATIENT DETAILS MODAL */}
      {selected && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50' onClick={() => setSelected(null)}>
          <div className='bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='sticky top-0 bg-white border-b p-4 flex items-center justify-between' style={{ borderColor: C.border }}>
              <h3 className='text-lg font-bold' style={{ color: C.dark }}>Patient Details</h3>
              <button onClick={() => setSelected(null)} className='p-1 rounded-lg' style={{ color: C.muted }}>✕</button>
            </div>
            <div className='p-6 space-y-5'>
              <div>
                <p className='text-xs font-semibold uppercase mb-3' style={{ color: C.red }}>Personal Information</p>
                <p className='text-sm font-semibold' style={{ color: C.dark }}>{selected.full_name}</p>
                <p className='text-sm' style={{ color: C.muted }}>{selected.phone}</p>
                {selected.email && <p className='text-sm break-all' style={{ color: C.muted }}>{selected.email}</p>}
              </div>
              <div>
                <p className='text-xs font-semibold uppercase mb-3' style={{ color: C.red }}>Appointment</p>
                <p className='text-sm' style={{ color: C.dark }}>{CLINIC_NAMES[selected.clinic_name] || selected.clinic_name}</p>
                <p className='text-sm' style={{ color: C.muted }}>{selected.appointment_date} · {selected.appointment_time}</p>
                <p className='text-sm mt-1' style={{ color: C.muted }}>Status: {cap(selected.status)}</p>
              </div>
              {selected.medical_history ? (
                <div className='border-l-4 pl-4' style={{ borderColor: C.red, background: C.redBg }}>
                  <p className='text-xs font-semibold uppercase mb-2' style={{ color: C.red }}>Medical History / Complaints</p>
                  <p className='text-sm whitespace-pre-wrap' style={{ color: C.dark }}>{selected.medical_history}</p>
                </div>
              ) : (
                <p className='text-xs italic' style={{ color: C.mutedL }}>No medical history provided</p>
              )}
              <p className='text-xs' style={{ color: C.mutedL }}>
                Booked on: {selected.created_at ? new Date(selected.created_at).toLocaleString() : '—'}
              </p>
            </div>
            <div className='border-t p-4' style={{ borderColor: C.border }}>
              <button onClick={() => setSelected(null)} className='w-full py-2 rounded-lg text-white font-medium' style={{ background: C.red }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}