import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Validation utilities
const VALIDATION = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone) => {
    // Kenyan mobile numbers only: +254/254/0 prefix + 7xx or 1xx + 7 digits
    const stripped = phone.replace(/[\s\-()]/g, '');
    return /^(?:\+254|254|0)[17]\d{8}$/.test(stripped);
  },
  companyName: (name) => name.trim().length >= 3,
  contactName: (name) => name.trim().length >= 2,
  fileSize: (bytes) => bytes <= 5 * 1024 * 1024, // 5MB max
  fileType: (file) => file.type === 'application/pdf',
};

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

  // Rate limiting: track last submission timestamp per session
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const SUBMISSION_COOLDOWN = 2000; // 2 seconds between submissions

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

    if (!VALIDATION.companyName(form.company_name)) {
      newErrors.company_name = 'Company name must be at least 3 characters';
    }
    if (!VALIDATION.contactName(form.contact_name)) {
      newErrors.contact_name = 'Contact name must be at least 2 characters';
    }
    if (!VALIDATION.email(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (form.phone && !VALIDATION.phone(form.phone)) {
      newErrors.phone =
        'Enter a valid Kenyan number, e.g. 0712345678 or +254712345678';
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

    // Rate limiting check
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

        // Generate signed URL (valid for 365 days)
        const { data: signedData, error: signError } = await supabase.storage
          .from('tender-applications')
          .createSignedUrl(path, 365 * 24 * 60 * 60);

        if (signError) {
          console.error('Signed URL error:', signError);
          throw new Error('Failed to process your document. Please try again.');
        }

        documentUrl = signedData?.signedUrl;
      }

      // Sanitize inputs to prevent XSS
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
          phone: form.phone.trim() || null,
          document_url: documentUrl,
        });

      if (insertError) throw insertError;

      setLastSubmissionTime(now);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setGeneralError(
        err.message ||
          'Something went wrong submitting your application. Please try again or contact procurement@spmh.co.ke',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingTender)
    return (
      <div class='max-w-lg mx-auto py-16'>
        <div class='animate-pulse text-center'>
          <p class='text-sm text-slate-500'>Loading tender information…</p>
        </div>
      </div>
    );

  if (!tender) {
    return (
      <div class='max-w-lg mx-auto text-center py-16 border border-dashed border-slate-300 rounded-lg bg-slate-50'>
        <p class='text-lg font-semibold text-slate-700 mb-2'>
          Tender Not Found
        </p>
        <p class='text-sm text-slate-500 mb-6'>
          This tender is no longer open for applications, or the link is
          invalid.
        </p>
        <a href='/tenders' class='text-accent font-bold hover:underline'>
          ← Browse all tenders
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div class='max-w-lg mx-auto py-16'>
        <div class='bg-slate-50 border border-slate-200 rounded-lg p-4 md:p-8 text-center'>
          <div class='text-5xl mb-4 text-[#125276]'>✓</div>
          <h2 class='text-xl font-serif font-bold text-slate-900 mb-2'>
            Application Submitted
          </h2>
          <p class='text-slate-600 mb-6'>
            Your submission for <strong>{tender.tender_code}</strong> has been
            received and recorded securely.
          </p>
          <div class='bg-white rounded p-4 mb-6 text-left text-sm text-slate-600 border border-slate-200'>
            <p class='mb-2'>
              <strong>What happens next:</strong>
            </p>
            <ul class='space-y-1 ml-4 list-disc'>
              <li>Our procurement team will review your submission</li>
              <li>
                All applicants will be notified of outcomes by{' '}
                {tender.closing_date}
              </li>
            </ul>
          </div>
          <p class='text-xs text-slate-500 mb-6'>
            Keep a copy of your submission details for your records.
          </p>
          <a
            href='/about-us/tenders'
            class='inline-block bg-[#125276] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#0d3f5c] transition-colors'>
            View Other Opportunities
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class='max-w-lg mx-auto'>
      <div class='bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden'>
        {/* Header */}
        <div class='bg-slate-50 p-6 border-b border-slate-200'>
          <span class='text-xs font-bold text-accent'>
            {tender.tender_code}
          </span>
          <h2 class='text-xl font-serif font-bold text-slate-900 mt-1'>
            {tender.title}
          </h2>
          <p class='text-xs text-slate-500 mt-2'>
            Submit your application below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} class='p-4 md:p-6 space-y-5'>
          {generalError && (
            <div class='bg-red-50 border border-accent rounded p-4 text-sm text-accent'>
              {generalError}
            </div>
          )}

          {/* Company Name */}
          <div>
            <label class='block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2'>
              Company Name *
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
              placeholder='Your company name'
              class={`w-full border-2 rounded px-4 py-2 text-sm transition-colors ${
                errors.company_name
                  ? 'border-accent bg-red-50'
                  : 'border-slate-200 hover:border-slate-300 focus:border-[#125276]'
              } focus:outline-none`}
            />
            {errors.company_name && (
              <p class='text-xs text-accent mt-1'>{errors.company_name}</p>
            )}
          </div>

          {/* Contact Name */}
          <div>
            <label class='block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2'>
              Contact Person *
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
              class={`w-full border-2 rounded px-4 py-2 text-sm transition-colors ${
                errors.contact_name
                  ? 'border-accent bg-red-50'
                  : 'border-slate-200 hover:border-slate-300 focus:border-[#125276]'
              } focus:outline-none`}
            />
            {errors.contact_name && (
              <p class='text-xs text-accent mt-1'>{errors.contact_name}</p>
            )}
          </div>

          {/* Email & Phone (Grid) */}
          <div class='grid grid-cols-2 gap-4'>
            <div>
              <label class='block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2'>
                Email *
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
                class={`w-full border-2 rounded px-3 py-2 text-sm transition-colors ${
                  errors.email
                    ? 'border-accent bg-red-50'
                    : 'border-slate-200 hover:border-slate-300 focus:border-[#125276]'
                } focus:outline-none`}
              />
              {errors.email && (
                <p class='text-xs text-accent mt-1'>{errors.email}</p>
              )}
            </div>
            <div>
              <label class='block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2'>
                Phone
              </label>
              <input
                type='tel'
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder='0712345678'
                class={`w-full border-2 rounded px-3 py-2 text-sm transition-colors ${
                  errors.phone
                    ? 'border-accent bg-red-50'
                    : 'border-slate-200 hover:border-slate-300 focus:border-[#125276]'
                } focus:outline-none`}
              />
              {errors.phone && (
                <p class='text-xs text-accent mt-1'>{errors.phone}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label class='block text-xs font-bold uppercase tracking-widest text-slate-600 mb-2'>
              Supporting Documents (PDF, optional)
            </label>
            <label
              class={`block border-2 border-dashed rounded px-4 py-6 text-center cursor-pointer transition-colors ${
                fileError
                  ? 'border-accent bg-red-50'
                  : 'border-slate-300 hover:border-[#125276] hover:bg-slate-50'
              }`}>
              <input
                type='file'
                accept='application/pdf'
                onChange={handleFileChange}
                class='hidden'
              />
              {file ? (
                <div>
                  <p class='text-sm font-semibold text-slate-900'>
                    ✓ {file.name}
                  </p>
                  <p class='text-xs text-slate-500 mt-1'>
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p class='text-sm font-semibold text-slate-700 mb-1'>
                    📄 Click to upload PDF
                  </p>
                  <p class='text-xs text-slate-500'>Max 5MB, PDF format only</p>
                </div>
              )}
            </label>
            {fileError && <p class='text-xs text-accent mt-2'>{fileError}</p>}
          </div>

          {/* Privacy Notice */}
          <div class='bg-slate-50 border border-slate-200 rounded p-4'>
            <p class='text-xs text-slate-600'>
              <strong>Privacy & Security:</strong> Your information is encrypted
              and handled per Kenya's PDPA. We only use it to evaluate your
              application.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={submitting}
            class='w-full bg-[#125276] text-white font-bold py-3 rounded-lg hover:bg-[#0d3f5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
            {submitting ? 'Submitting…' : 'Submit Application'}
          </button>

          {/* Footer Note */}
          <p class='text-xs text-slate-500 text-center'>
            By submitting, you confirm you meet the tender requirements.
          </p>
        </form>
        <div class='text-center mx-auto my-5 flex-col md:flex-row item-center judstify-center gap-5'>
          <a href='/about-us/tenders' class='btn-primary text-center flex-1 mb-4 mr-4'>
            ← Back to Tenders
          </a>
          <a href='/' class='btn-secondary text-center flex-1'>
            Back to Main Website
          </a>
        </div>
      </div>
    </div>
  );
}
