// ApplyModal.jsx — responsive, scrollable application form modal

import { useState } from 'react';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://spmh-career-backend.onrender.com';

export default function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', coverLetter: '', cv: null,
  });
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // ── Handlers ────────────────────────────────────────────────────────────────
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File too large. Maximum allowed size is 5MB.');
      setStatus('error');
      e.target.value = '';
      return;
    }
    setForm((f) => ({ ...f, cv: file }));
    setFileName(file.name);
    setStatus('idle');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const data = new FormData();
    data.append('fullName', form.fullName.trim());
    data.append('email', form.email.trim());
    data.append('phone', form.phone.trim());
    data.append('position', job.title);
    data.append('coverLetter', form.coverLetter.trim());
    if (form.cv) data.append('cv', form.cv);

    try {
      const res = await fetch(`${BACKEND_URL}/api/apply`, {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || 'Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  // ── Trap Escape key ──────────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    // Overlay
    // items-end on mobile (bottom sheet) → items-center on sm+ (centred modal)
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      {/* Modal container */}
      <div
        className={[
          'bg-white w-full sm:max-w-lg',
          'rounded-t-2xl sm:rounded-2xl',
          'shadow-2xl',
          'flex flex-col',
          // Mobile: up to full height; sm+: capped at 92vh
          'max-h-[92vh]',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal header — sticky ─────────────────────────────────────── */}
        <div className="shrink-0 bg-gradient-to-r from-[#7B1A2E] to-[#5a1220] px-5 py-4 rounded-t-2xl flex items-start justify-between">
          {/* Mobile drag handle */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/30 rounded-full sm:hidden" />
          <div className="pt-2 sm:pt-0">
            <p className="text-white font-bold text-base leading-tight">{job.title}</p>
            <p className="text-red-200 text-xs mt-0.5">{job.department} · {job.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition shrink-0 mt-1 sm:mt-0"
            aria-label="Close application form"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {status === 'success' ? (
            // Success state
            <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Application Submitted!</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-1">
                Thank you for applying for{' '}
                <strong className="text-gray-700">{job.title}</strong>.
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Our HR team will be in touch within <strong className="text-gray-600">7–14 working days</strong>.
                A confirmation has been sent to your email.
              </p>
              <button
                onClick={onClose}
                className="bg-[#7B1A2E] text-white font-semibold px-8 py-2.5 rounded-lg hover:bg-[#5a1220] transition"
              >
                Close
              </button>
            </div>
          ) : (
            // Application form
            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              {/* Full name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Full Name <span className="text-[#7B1A2E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={set('fullName')}
                  placeholder="e.g. Jane Achieng Otieno"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1A2E]/25 focus:border-[#7B1A2E] transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Email Address <span className="text-[#7B1A2E]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@email.com"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1A2E]/25 focus:border-[#7B1A2E] transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Phone Number
                  <span className="ml-1.5 text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="e.g. 0712 345 678"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1A2E]/25 focus:border-[#7B1A2E] transition"
                />
              </div>

              {/* CV upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  CV / Resume
                  <span className="ml-1.5 text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-[#7B1A2E] hover:bg-red-50/40 transition group">
                  <div className="w-8 h-8 bg-red-50 group-hover:bg-red-100 rounded-md flex items-center justify-center shrink-0 transition">
                    <svg className="w-4 h-4 text-[#7B1A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {fileName || 'Click to upload your CV'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">PDF, DOC or DOCX — max 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Cover letter */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Cover Letter
                  <span className="ml-1.5 text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={form.coverLetter}
                  onChange={set('coverLetter')}
                  rows={4}
                  placeholder={`Tell us why you'd like to join SPMH and what you bring to the ${job.title} role…`}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B1A2E]/25 focus:border-[#7B1A2E] transition resize-none"
                />
              </div>

              {/* Error alert */}
              {status === 'error' && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errorMsg}
                </div>
              )}

            </form>
          )}
        </div>

        {/* ── Submit footer — sticky ────────────────────────────────────── */}
        {status !== 'success' && (
          <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4 rounded-b-2xl">
            <button
              onClick={handleSubmit}
              disabled={status === 'submitting'}
              className="w-full bg-[#7B1A2E] text-white font-bold py-3 rounded-lg hover:bg-[#5a1220] active:bg-[#3d0d14] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {status === 'submitting' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting Application…
                </>
              ) : (
                'Submit Application'
              )}
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-2.5">
              Your information is handled with complete confidentiality.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
