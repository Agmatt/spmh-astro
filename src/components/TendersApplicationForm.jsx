import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VALIDATION = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone) => {
    const stripped = phone.replace(/[\s\-()]/g, '');
    return /^(?:\+254|254|0)[17]\d{8}$/.test(stripped);
  },
  companyName: (name) => name.trim().length >= 3,
  contactName: (name) => name.trim().length >= 2,
  fileSize: (bytes) => bytes <= 5 * 1024 * 1024,
  fileType: (file) => file.type === 'application/pdf',
};

// Helper to format dates like "26th August 2026"
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';

  return `${day}${suffix} ${month} ${year}`;
}

export default function TenderApplicationForm({ tenderCode }) {
  const [tender, setTender] = useState(null);
  const [loadingTender, setLoadingTender] = useState(true);

  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
  });

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const SUBMISSION_COOLDOWN = 2000;

  useEffect(() => {
    if (!tenderCode) {
      setLoadingTender(false);
      return;
    }
    supabase
      .from('tenders')
      .select('id, tender_code, title, status, closing_date')
      .eq('tender_code', tenderCode)
      .eq('status', 'open')
      .single()
      .then(({ data }) => {
        setTender(data || null);
        setLoadingTender(false);
      });
  }, [tenderCode]);

  function validateForm() {
    const newErrors = {};
    if (!VALIDATION.companyName(form.company_name))
      newErrors.company_name = 'Company name must be at least 3 characters';
    if (!VALIDATION.contactName(form.contact_name))
      newErrors.contact_name = 'Contact name must be at least 2 characters';
    if (!VALIDATION.email(form.email))
      newErrors.email = 'Please enter a valid email address';

    // Phone is now Mandatory
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!VALIDATION.phone(form.phone)) {
      newErrors.phone = 'Enter a valid Kenyan number, e.g. 0712345678';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setFileError('');
      return;
    }
    if (!VALIDATION.fileType(selectedFile)) {
      setFileError('Only PDF files are accepted');
      setFile(null);
      return;
    }
    if (!VALIDATION.fileSize(selectedFile.size)) {
      setFileError('File size must not exceed 5MB');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setFileError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError('');

    // Document is now Mandatory
    if (!file) {
      setFileError('Supporting document (PDF) is required');
      return;
    }

    const now = Date.now();
    if (now - lastSubmissionTime < SUBMISSION_COOLDOWN) {
      setGeneralError('Please wait a moment before submitting again');
      return;
    }

    if (!validateForm() || !tender) return;

    setSubmitting(true);

    try {
      let documentUrl = null;
      if (file) {
        const path = `${tender.tender_code}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('tender-applications')
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: signedData, error: signError } = await supabase.storage
          .from('tender-applications')
          .createSignedUrl(path, 365 * 24 * 60 * 60);
        if (signError)
          throw new Error('Failed to process your document. Please try again.');
        documentUrl = signedData?.signedUrl;
      }

      const sanitize = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      };

      const { error: insertError } = await supabase
        .from('tender_applications')
        .insert({
          tender_id: tender.id,
          company_name: sanitize(form.company_name.trim()),
          contact_name: sanitize(form.contact_name.trim()),
          email: form.email.toLowerCase().trim(),
          phone: form.phone.trim(),
          document_url: documentUrl,
        });

      if (insertError) throw insertError;

      fetch('/api/send-tender-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.company_name.trim(),
          contactName: form.contact_name.trim(),
          email: form.email.toLowerCase().trim(),
          tenderCode: tender.tender_code,
          tenderTitle: tender.title,
        }),
      }).catch((err) => console.error('Email trigger failed:', err));

      setLastSubmissionTime(now);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setGeneralError(
        err.message ||
          'Something went wrong. Please try again or contact procurement@spmh.co.ke',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingTender) {
    return (
      <div className='max-w-lg mx-auto py-16'>
        <div className='animate-pulse text-center'>
          <p className='text-sm text-slate-500'>Loading tender information…</p>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className='max-w-lg mx-auto text-center py-16 border border-dashed border-slate-300 rounded-lg bg-gray-200'>
        <p className='text-lg font-semibold text-slate-700 mb-2'>
          Tender Not Found
        </p>
        <p className='text-sm text-slate-500 mb-6'>
          This tender is no longer open for applications, or the link is
          invalid.
        </p>
        <a
          href='/about-us/tenders'
          className='text-[#125276] font-bold hover:underline'>
          ← Browse all tenders
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className='max-w-lg mx-auto py-16'>
        <div className='bg-white border-2 border-emerald-500 rounded-xl p-8 text-center shadow-lg'>
          <div className='w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold'>
            ✓
          </div>
          <h2 className='text-2xl font-serif font-bold text-slate-900 mb-3'>
            Application Submitted
          </h2>
          <p className='text-slate-600 mb-6'>
            Your submission for{' '}
            <strong className='text-[#125276]'>{tender.tender_code}</strong> has
            been received and recorded securely. A confirmation email has been
            sent to <strong>{form.email}</strong>.
          </p>
          <div className='bg-slate-50 rounded-lg p-5 mb-8 text-left text-sm text-slate-600 border border-slate-200'>
            <p className='font-bold text-slate-800 mb-2'>What happens next:</p>
            <ul className='space-y-2 ml-4 list-disc marker:text-emerald-500'>
              <li>Our procurement team will review your submission</li>
              {/* Using the new formatDate function here */}
              {/* <li>
                All applicants will be notified of outcomes by{' '}
                {formatDate(tender.closing_date)}
              </li> */}
            </ul>
          </div>
          <a
            href='/about-us/tenders'
            className='inline-block bg-[#125276] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#0d3f5c] transition-colors shadow-sm'>
            View Other Opportunities
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-lg mx-auto'>
      <div className='bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden'>
        <div className='bg-[#125276] p-6 text-white'>
          <span className='text-xs font-bold text-emerald-300 uppercase tracking-wider'>
            {tender.tender_code}
          </span>
          <h2 className='text-2xl font-serif font-bold mt-1'>{tender.title}</h2>
          <p className='text-sm text-slate-300 mt-2'>
            Please fill in your details carefully to apply.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='p-6 md:p-8 space-y-6'>
          {generalError && (
            <div className='bg-red-50 border-l-4 border-red-500 rounded p-4 text-sm text-red-700 font-medium'>
              {generalError}
            </div>
          )}

          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2'>
              Company Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={form.company_name}
              onChange={(e) => {
                setForm({ ...form, company_name: e.target.value });
                if (errors.company_name)
                  setErrors({ ...errors, company_name: '' });
              }}
              placeholder='e.g. Acme Suppliers Ltd'
              className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-[#125276] focus:border-[#125276] outline-none ${
                errors.company_name
                  ? 'border-red-500 bg-red-50'
                  : 'border-slate-300'
              }`}
            />
            {errors.company_name && (
              <p className='text-xs text-red-600 mt-1.5 font-medium'>
                {errors.company_name}
              </p>
            )}
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2'>
              Contact Person <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              required
              value={form.contact_name}
              onChange={(e) => {
                setForm({ ...form, contact_name: e.target.value });
                if (errors.contact_name)
                  setErrors({ ...errors, contact_name: '' });
              }}
              placeholder='Full name'
              className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-[#125276] focus:border-[#125276] outline-none ${
                errors.contact_name
                  ? 'border-red-500 bg-red-50'
                  : 'border-slate-300'
              }`}
            />
            {errors.contact_name && (
              <p className='text-xs text-red-600 mt-1.5 font-medium'>
                {errors.contact_name}
              </p>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2'>
                Email <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                required
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder='name@company.com'
                className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-[#125276] focus:border-[#125276] outline-none ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.email && (
                <p className='text-xs text-red-600 mt-1.5 font-medium'>
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              {/* Phone is now Mandatory */}
              <label className='block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2'>
                Phone <span className='text-red-500'>*</span>
              </label>
              <input
                type='tel'
                required
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder='0712345678'
                className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:ring-2 focus:ring-[#125276] focus:border-[#125276] outline-none ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.phone && (
                <p className='text-xs text-red-600 mt-1.5 font-medium'>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            {/* Document is now Mandatory */}
            <label className='block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2'>
              Supporting Documents <span className='text-red-500'>*</span>
            </label>
            <label
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                fileError
                  ? 'border-red-500 bg-red-50'
                  : 'border-slate-300 hover:border-[#125276] hover:bg-slate-50'
              }`}>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <svg
                  className='w-8 h-8 mb-3 text-slate-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'></path>
                </svg>
                {file ? (
                  <p className='text-sm font-semibold text-[#125276]'>
                    ✓ {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  </p>
                ) : (
                  <>
                    <p className='mb-1 text-sm text-slate-600'>
                      <span className='font-semibold text-[#125276]'>
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </p>
                    <p className='text-xs text-slate-500'>
                      PDF format only (MAX. 5MB)
                    </p>
                  </>
                )}
              </div>
              <input
                type='file'
                accept='application/pdf'
                required
                onChange={handleFileChange}
                className='hidden'
              />
            </label>
            {fileError && (
              <p className='text-xs text-red-600 mt-2 font-medium'>
                {fileError}
              </p>
            )}
          </div>

          <div className='bg-blue-50 border border-blue-100 rounded-lg p-4'>
            <p className='text-xs text-blue-800 leading-relaxed'>
              <strong>Privacy & Security:</strong> Your information is encrypted
              and handled in accordance with Kenya's PDPA. We only use it to
              evaluate your application.
            </p>
          </div>

          <button
            type='submit'
            disabled={submitting}
            className='w-full bg-[#125276] text-white font-bold py-3.5 rounded-lg hover:bg-[#0d3f5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex justify-center items-center'>
            {submitting ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </button>

          <p className='text-xs text-slate-500 text-center'>
            By submitting, you confirm you meet the tender requirements.
          </p>
        </form>
      </div>
    </div>
  );
}
