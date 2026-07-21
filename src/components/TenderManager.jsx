import { useState, useEffect } from 'react';
// Adjust this import to match wherever your existing Supabase client lives
// (the same one your appointments / job-applications dashboards already use).
import { supabase } from '../lib/supabase';

const EMPTY_FORM = {
  id: null,
  tender_code: '',
  title: '',
  category: '',
  status: 'draft',
  summary: '',
  requirements: [''],
  closing_date: '',
  document_url: '',
  document_size: '',
};

const STATUS_STYLES = {
  draft: 'bg-slate-100 text-slate-600 border-slate-300',
  open: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  closed: 'bg-amber-50 text-amber-700 border-amber-300',
  awarded:
    'bg-[var(--color-primary-light)]/20 text-[var(--color-primary)] border-[var(--color-primary)]',
};

const APPLICATION_STATUS_OPTIONS = [
  'submitted',
  'under_review',
  'shortlisted',
  'rejected',
  'awarded',
];

const VENDOR_STATUS_OPTIONS = ['pending', 'verified', 'rejected'];

const VENDOR_STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-300',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  rejected: 'bg-red-50 text-red-700 border-red-300',
};

// Same list used on the public /procurement/register form — kept here too so
// the filter dropdown doesn't depend on vendors already existing in a category.
const VENDOR_CATEGORIES = [
  'Medical Supplies & Equipment',
  'Pharmaceuticals',
  'Construction & Works',
  'ICT & Software Services',
  'Food & Catering Supplies',
  'General Services & Consultancy',
];

export default function TenderManager() {
  const [tab, setTab] = useState('tenders'); // 'tenders' | 'applications'
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [docFile, setDocFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState('');

  const [applications, setApplications] = useState([]);
  const [appTenderFilter, setAppTenderFilter] = useState('all');
  const [appsLoading, setAppsLoading] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState('all');
  const [vendorsLoading, setVendorsLoading] = useState(false);

  useEffect(() => {
    loadTenders();
  }, []);

  useEffect(() => {
    if (tab === 'applications') loadApplications();
  }, [tab, appTenderFilter]);

  useEffect(() => {
    if (tab === 'vendors') loadVendors();
  }, [tab, vendorCategoryFilter]);

  async function loadTenders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tenders')
      .select('id, tender_code, title, status, closing_date')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setTenders(data);
    setLoading(false);
  }

  async function loadApplications() {
    setAppsLoading(true);
    let query = supabase
      .from('tender_applications')
      .select(
        'id, company_name, contact_name, email, document_url, submitted_at, status, tender_id, tenders(tender_code, title)',
      )
      .order('submitted_at', { ascending: false })
      .limit(200);
    if (appTenderFilter !== 'all')
      query = query.eq('tender_id', appTenderFilter);
    const { data, error } = await query;
    if (error) setError(error.message);
    else setApplications(data);
    setAppsLoading(false);
  }

  async function loadVendors() {
    setVendorsLoading(true);
    let query = supabase
      .from('vendors')
      .select(
        'id, company_name, category, kra_pin, reg_number, email, phone, status, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(200);
    if (vendorCategoryFilter !== 'all')
      query = query.eq('category', vendorCategoryFilter);
    const { data, error } = await query;
    if (error) setError(error.message);
    else setVendors(data);
    setVendorsLoading(false);
  }

  function openNewForm() {
    setForm(EMPTY_FORM);
    setDocFile(null);
    setError('');
    setShowForm(true);
  }

  async function openEditForm(t) {
    // List rows are trimmed to id/code/title/status/closing_date for a
    // faster initial load — pull the full record now that we actually need
    // the summary, requirements, and document fields for editing.
    setForm({
      ...EMPTY_FORM,
      id: t.id,
      tender_code: t.tender_code,
      title: t.title,
      status: t.status,
      closing_date: t.closing_date,
    });
    setDocFile(null);
    setError('');
    setEditLoading(true);
    setShowForm(true);

    const { data: full, error } = await supabase
      .from('tenders')
      .select('*')
      .eq('id', t.id)
      .single();

    if (error) {
      setError(error.message);
    } else {
      setForm({
        id: full.id,
        tender_code: full.tender_code,
        title: full.title,
        category: full.category,
        status: full.status,
        summary: full.summary,
        requirements: full.requirements?.length ? full.requirements : [''],
        closing_date: full.closing_date,
        document_url: full.document_url || '',
        document_size: full.document_size || '',
      });
    }
    setEditLoading(false);
  }

  function updateRequirement(i, value) {
    const next = [...form.requirements];
    next[i] = value;
    setForm({ ...form, requirements: next });
  }

  function addRequirement() {
    setForm({ ...form, requirements: [...form.requirements, ''] });
  }

  function removeRequirement(i) {
    setForm({
      ...form,
      requirements: form.requirements.filter((_, idx) => idx !== i),
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let documentUrl = form.document_url;
      let documentSize = form.document_size;

      if (docFile) {
        const path = `${form.tender_code || Date.now()}-${docFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('tender-documents')
          .upload(path, docFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: pub } = supabase.storage
          .from('tender-documents')
          .getPublicUrl(path);
        documentUrl = pub.publicUrl;
        documentSize = `${(docFile.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      const payload = {
        tender_code: form.tender_code,
        title: form.title,
        category: form.category,
        status: form.status,
        summary: form.summary,
        requirements: form.requirements.filter((r) => r.trim() !== ''),
        closing_date: form.closing_date,
        document_url: documentUrl || null,
        document_size: documentSize || null,
      };

      if (form.id) {
        const { error } = await supabase
          .from('tenders')
          .update(payload)
          .eq('id', form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tenders').insert(payload);
        if (error) throw error;
      }

      setShowForm(false);
      loadTenders();
    } catch (err) {
      setError(err.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusToggle(t, newStatus) {
    const { error } = await supabase
      .from('tenders')
      .update({ status: newStatus })
      .eq('id', t.id);
    if (error) setError(error.message);
    else loadTenders();
  }

  async function handleDelete(t) {
    if (
      !confirm(
        `Delete tender ${t.tender_code}? This also removes its applications.`,
      )
    )
      return;
    const { error } = await supabase.from('tenders').delete().eq('id', t.id);
    if (error) setError(error.message);
    else loadTenders();
  }

  async function handleApplicationStatus(app, newStatus) {
    const { error } = await supabase
      .from('tender_applications')
      .update({ status: newStatus, reviewed_at: new Date().toISOString() })
      .eq('id', app.id);
    if (error) setError(error.message);
    else loadApplications();
  }

  async function handleVendorStatus(vendor, newStatus) {
    const { error } = await supabase
      .from('vendors')
      .update({ status: newStatus })
      .eq('id', vendor.id);
    if (error) setError(error.message);
    else loadVendors();
  }

  return (
    <div className='max-w-6xl mx-auto p-4 sm:p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-xl font-bold text-[var(--color-secondary)]'>
            Tender Manager
          </h1>
          <p className='text-xs text-[var(--color-muted)] mt-1'>
            Post tenders and review incoming applications.
          </p>
        </div>
        {tab === 'tenders' && (
          <button
            onClick={openNewForm}
            className='text-xs font-bold px-4 py-2 rounded-md bg-[var(--color-primary)] text-white hover:opacity-90'>
            + New Tender
          </button>
        )}
      </div>

      <div className='flex gap-2 border-b border-[var(--color-border)] mb-6'>
        {['tenders', 'applications', 'vendors'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-bold uppercase tracking-wide px-4 py-2 border-b-2 -mb-px ${
              tab === t
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-slate-600'
            }`}>
            {t === 'tenders'
              ? 'Manage Tenders'
              : t === 'applications'
                ? 'Applications'
                : 'Vendors'}
          </button>
        ))}
      </div>

      {error && (
        <div className='mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-3'>
          {error}
        </div>
      )}

      {tab === 'tenders' && (
        <TendersTable
          tenders={tenders}
          loading={loading}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onStatusToggle={handleStatusToggle}
        />
      )}

      {tab === 'applications' && (
        <ApplicationsPanel
          tenders={tenders}
          applications={applications}
          loading={appsLoading}
          filter={appTenderFilter}
          onFilterChange={setAppTenderFilter}
          onStatusChange={handleApplicationStatus}
        />
      )}

      {tab === 'vendors' && (
        <VendorsPanel
          vendors={vendors}
          loading={vendorsLoading}
          filter={vendorCategoryFilter}
          onFilterChange={setVendorCategoryFilter}
          onStatusChange={handleVendorStatus}
        />
      )}

      {showForm && (
        <TenderFormModal
          form={form}
          setForm={setForm}
          docFile={docFile}
          setDocFile={setDocFile}
          saving={saving}
          editLoading={editLoading}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          updateRequirement={updateRequirement}
          addRequirement={addRequirement}
          removeRequirement={removeRequirement}
        />
      )}
    </div>
  );
}

function TendersTable({ tenders, loading, onEdit, onDelete, onStatusToggle }) {
  if (loading)
    return (
      <p className='text-xs text-[var(--color-muted)]'>Loading tenders…</p>
    );
  if (!tenders.length)
    return (
      <div className='text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg'>
        <p className='text-xs text-[var(--color-muted)]'>
          No tenders yet. Create one to get started.
        </p>
      </div>
    );

  return (
    <div className='overflow-x-auto border border-[var(--color-border)] rounded-lg'>
      <table className='w-full text-xs'>
        <thead className='bg-[var(--color-surface)] text-[var(--color-muted)] uppercase tracking-wide text-[10px]'>
          <tr>
            <th className='text-left p-3'>Code</th>
            <th className='text-left p-3'>Title</th>
            <th className='text-left p-3'>Status</th>
            <th className='text-left p-3'>Closes</th>
            <th className='text-right p-3'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((t) => (
            <tr key={t.id} className='border-t border-[var(--color-border)]'>
              <td className='p-3 font-mono text-[10px] text-[var(--color-muted)]'>
                {t.tender_code}
              </td>
              <td className='p-3 font-semibold text-[var(--color-secondary)] max-w-xs'>
                {t.title}
              </td>
              <td className='p-3'>
                <select
                  value={t.status}
                  onChange={(e) => onStatusToggle(t, e.target.value)}
                  className={`text-[10px] font-bold uppercase border rounded px-2 py-1 ${STATUS_STYLES[t.status]}`}>
                  <option value='draft'>Draft</option>
                  <option value='open'>Open</option>
                  <option value='closed'>Closed</option>
                  <option value='awarded'>Awarded</option>
                </select>
              </td>
              <td className='p-3 text-slate-600'>{t.closing_date}</td>
              <td className='p-3 text-right space-x-3'>
                <button
                  onClick={() => onEdit(t)}
                  className='text-[var(--color-primary)] font-bold hover:underline'>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t)}
                  className='text-red-600 font-bold hover:underline'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApplicationsPanel({
  tenders,
  applications,
  loading,
  filter,
  onFilterChange,
  onStatusChange,
}) {
  return (
    <div>
      <div className='mb-4 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2'>
        <label className='text-[10px] font-bold uppercase text-[var(--color-muted)] shrink-0'>
          Filter by tender
        </label>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className='w-full sm:w-auto sm:max-w-xs text-xs border border-[var(--color-border)] rounded px-2 py-1'>
          <option value='all'>All tenders</option>
          {tenders.map((t) => (
            <option key={t.id} value={t.id}>
              {t.tender_code} — {t.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className='text-xs text-[var(--color-muted)]'>
          Loading applications…
        </p>
      ) : !applications.length ? (
        <div className='text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg'>
          <p className='text-xs text-[var(--color-muted)]'>
            No applications for this selection yet.
          </p>
        </div>
      ) : (
        <div className='overflow-x-auto border border-[var(--color-border)] rounded-lg'>
          <table className='w-full text-xs'>
            <thead className='bg-[var(--color-surface)] text-[var(--color-muted)] uppercase tracking-wide text-[10px]'>
              <tr>
                <th className='text-left p-3'>Tender</th>
                <th className='text-left p-3'>Company</th>
                <th className='text-left p-3'>Contact</th>
                <th className='text-left p-3'>Submitted</th>
                <th className='text-left p-3'>Docs</th>
                <th className='text-left p-3'>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr
                  key={a.id}
                  className='border-t border-[var(--color-border)] align-top'>
                  <td className='p-3 font-mono text-[10px] text-[var(--color-muted)]'>
                    {a.tenders?.tender_code}
                  </td>
                  <td className='p-3 font-semibold text-[var(--color-secondary)]'>
                    {a.company_name}
                  </td>
                  <td className='p-3 text-slate-600'>
                    {a.contact_name}
                    <br />
                    <span className='text-[10px]'>{a.email}</span>
                  </td>
                  <td className='p-3 text-slate-600'>
                    {new Date(a.submitted_at).toLocaleDateString()}
                  </td>
                  <td className='p-3'>
                    {a.document_url ? (
                      <a
                        href={a.document_url}
                        target='_blank'
                        rel='noreferrer'
                        className='text-[var(--color-primary)] font-bold hover:underline'>
                        View
                      </a>
                    ) : (
                      <span className='text-[var(--color-muted)]'>—</span>
                    )}
                  </td>
                  <td className='p-3'>
                    <select
                      value={a.status}
                      onChange={(e) => onStatusChange(a, e.target.value)}
                      className='text-[10px] font-bold uppercase border border-[var(--color-border)] rounded px-2 py-1'>
                      {APPLICATION_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function VendorsPanel({
  vendors,
  loading,
  filter,
  onFilterChange,
  onStatusChange,
}) {
  return (
    <div>
      <div className='mb-4 flex items-center gap-2'>
        <label className='text-[10px] font-bold uppercase text-[var(--color-muted)]'>
          Filter by category
        </label>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className='text-xs border border-[var(--color-border)] rounded px-2 py-1'>
          <option value='all'>All categories</option>
          {VENDOR_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className='text-xs text-[var(--color-muted)]'>Loading vendors…</p>
      ) : !vendors.length ? (
        <div className='text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg'>
          <p className='text-xs text-[var(--color-muted)]'>
            No vendor registrations for this selection yet.
          </p>
        </div>
      ) : (
        <div className='overflow-x-auto border border-[var(--color-border)] rounded-lg'>
          <table className='w-full text-xs'>
            <thead className='bg-[var(--color-surface)] text-[var(--color-muted)] uppercase tracking-wide text-[10px]'>
              <tr>
                <th className='text-left p-3'>Company</th>
                <th className='text-left p-3'>Category</th>
                <th className='text-left p-3'>KRA PIN</th>
                <th className='text-left p-3'>Reg. No.</th>
                <th className='text-left p-3'>Contact</th>
                <th className='text-left p-3'>Registered</th>
                <th className='text-left p-3'>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr
                  key={v.id}
                  className='border-t border-[var(--color-border)] align-top'>
                  <td className='p-3 font-semibold text-[var(--color-secondary)]'>
                    {v.company_name}
                  </td>
                  <td className='p-3 text-slate-600'>{v.category}</td>
                  <td className='p-3 font-mono text-[10px] text-[var(--color-muted)]'>
                    {v.kra_pin}
                  </td>
                  <td className='p-3 font-mono text-[10px] text-[var(--color-muted)]'>
                    {v.reg_number}
                  </td>
                  <td className='p-3 text-slate-600'>
                    {v.email}
                    <br />
                    <span className='text-[10px]'>{v.phone}</span>
                  </td>
                  <td className='p-3 text-slate-600'>
                    {new Date(v.created_at).toLocaleDateString()}
                  </td>
                  <td className='p-3'>
                    <select
                      value={v.status}
                      onChange={(e) => onStatusChange(v, e.target.value)}
                      className={`text-[10px] font-bold uppercase border rounded px-2 py-1 ${VENDOR_STATUS_STYLES[v.status] || ''}`}>
                      {VENDOR_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TenderFormModal({
  form,
  setForm,
  docFile,
  setDocFile,
  saving,
  editLoading,
  onClose,
  onSave,
  updateRequirement,
  addRequirement,
  removeRequirement,
}) {
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6'>
        <h2 className='text-sm font-bold text-[var(--color-secondary)] mb-4'>
          {form.id ? 'Edit Tender' : 'New Tender'}
        </h2>
        {editLoading ? (
          <p className='text-xs text-[var(--color-muted)] py-8 text-center'>
            Loading tender details…
          </p>
        ) : (
          <form onSubmit={onSave} className='space-y-4 text-xs'>
            <div>
              <label className='block font-bold text-[10px] uppercase text-[var(--color-muted)] mb-1'>
                Tender code
              </label>
              <input
                required
                value={form.tender_code}
                onChange={(e) =>
                  setForm({ ...form, tender_code: e.target.value })
                }
                placeholder='SPMH-TND-2026-006'
                className='w-full border border-[var(--color-border)] rounded px-3 py-2'
              />
            </div>

            <div>
              <label className='block font-bold text-[10px] uppercase text-[var(--color-muted)] mb-1'>
                Title
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className='w-full border border-[var(--color-border)] rounded px-3 py-2'
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block font-bold text-[10px] uppercase text-[var(--color-muted)] mb-1'>
                  Category
                </label>
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className='w-full border border-[var(--color-border)] rounded px-3 py-2'
                />
              </div>
              <div>
                <label className='block font-bold text-[10px] uppercase text-[var(--color-muted)] mb-1'>
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className='w-full border border-[var(--color-border)] rounded px-3 py-2'>
                  <option value='draft'>Draft</option>
                  <option value='open'>Open</option>
                  <option value='closed'>Closed</option>
                  <option value='awarded'>Awarded</option>
                </select>
              </div>
            </div>

            <div>
              <label className='block font-bold text-[10px] uppercase text-[var(--color-muted)] mb-1'>
                Summary
              </label>
              <textarea
                required
                rows={3}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className='w-full border border-[var(--color-border)] rounded px-3 py-2'
              />
            </div>

            <div>
              <label className='block font-bold text-[10px] uppercase text-[var(--color-muted)] mb-1'>
                Mandatory requirements
              </label>
              <div className='space-y-2'>
                {form.requirements.map((r, i) => (
                  <div key={i} className='flex gap-2'>
                    <input
                      value={r}
                      onChange={(e) => updateRequirement(i, e.target.value)}
                      className='flex-1 border border-[var(--color-border)] rounded px-3 py-2'
                    />
                    <button
                      type='button'
                      onClick={() => removeRequirement(i)}
                      className='text-red-600 font-bold px-2'>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type='button'
                onClick={addRequirement}
                className='mt-2 text-[var(--color-primary)] font-bold'>
                + Add requirement
              </button>
            </div>

            <div>
              <label className='block font-bold text-[10px] uppercase text-[var(--color-muted)] mb-1'>
                Closing date
              </label>
              <input
                required
                type='date'
                value={form.closing_date}
                onChange={(e) =>
                  setForm({ ...form, closing_date: e.target.value })
                }
                className='w-full border border-[var(--color-border)] rounded px-3 py-2'
              />
            </div>

            <div>
              <label className='block font-bold text-[10px] uppercase text-[var(--color-muted)] mb-1'>
                Specs document (PDF)
              </label>
              {form.document_url && !docFile && (
                <p className='text-[10px] text-[var(--color-muted)] mb-1'>
                  Current:{' '}
                  <a
                    href={form.document_url}
                    target='_blank'
                    rel='noreferrer'
                    className='underline'>
                    view file
                  </a>
                </p>
              )}
              <input
                type='file'
                accept='application/pdf'
                onChange={(e) => setDocFile(e.target.files[0])}
                className='text-xs'
              />
            </div>

            <div className='flex justify-end gap-3 pt-2'>
              <button
                type='button'
                onClick={onClose}
                className='text-xs font-bold px-4 py-2 text-[var(--color-muted)]'>
                Cancel
              </button>
              <button
                type='submit'
                disabled={saving}
                className='text-xs font-bold px-4 py-2 rounded-md bg-[var(--color-primary)] text-white disabled:opacity-50'>
                {saving ? 'Saving…' : 'Save Tender'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
