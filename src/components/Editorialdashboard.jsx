// src/components/Editorialdashboard.jsx
// Rendered by src/pages/admin/editorial/index.astro AFTER the server has
// checked the session, role and idle timeout. This component does not do
// its own login. It uses the cookie-based client so its queries carry the
// same session the server verified.

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { getEditorialBrowserSupabase } from '../lib/editorial-supabase-browser';

const supabase = getEditorialBrowserSupabase();

const IDLE_TIME = 15 * 60 * 1000; // 15 minutes, same as the server gate

const PILLARS = [
  { key: 'clinical', label: 'Clinical Services', color: '#1565c0' },
  { key: 'workforce', label: 'Health Workforce', color: '#2E7D32' },
  {
    key: 'infrastructure',
    label: 'Infrastructure & Digital',
    color: '#00695C',
  },
  { key: 'financing', label: 'Health Financing', color: '#B26A00' },
  { key: 'community', label: 'Community Health', color: '#6A1B9A' },
  { key: 'governance', label: 'Governance', color: '#860f0f' },
];

const EMPTY_FORM = {
  type: 'article',
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  author: '',
  cover_image: null,
  cover_image_url: '',
  status: 'draft',
  published_at: new Date().toISOString().split('T')[0],
  event_date: '',
  location: '',
  pillar: '',
};

function suggestPillar(title = '', excerpt = '') {
  const t = (title + ' ' + excerpt).toLowerCase();
  const rules = [
    [
      'clinical',
      /(icu|maternity|surgery|emergency|newborn|delivery|clinical|opd|inpatient|pediatric|vaccin)/,
    ],
    [
      'workforce',
      /(staff|training|cpd|nurse|doctor|recruit|workforce|leadership|midwife)/,
    ],
    [
      'infrastructure',
      /(emr|digital|equipment|theatre|building|renovation|infrastructure|telemedicine|ict|biomedical)/,
    ],
    [
      'financing',
      /(sha|nhif|claims|revenue|donor|financing|budget|cost|funding)/,
    ],
    [
      'community',
      /(outreach|chp|community|camp|screening|public health|village)/,
    ],
    [
      'governance',
      /(board|governance|partnership|diocese|bishop|policy|ethics)/,
    ],
  ];
  for (const [key, re] of rules) if (re.test(t)) return key;
  return '';
}

const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function EditorialDashboard({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  const idleRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Link.configure({ openOnClick: false }),
    ],
    content: form.body,
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, body: editor.getHTML() }));
    },
  });

  // Client-side idle logout (the server also enforces it on each page load)
  useEffect(() => {
    const reset = () => {
      clearTimeout(idleRef.current);
      idleRef.current = setTimeout(handleLogout, IDLE_TIME);
    };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(idleRef.current);
    };
  }, []);

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.assign('/admin/editorial/login');
  }

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) setError(`Failed to load content: ${error.message}`);
    else setItems(data || []);
    setLoading(false);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fileName = `covers/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);
      if (error) throw error;
      const { data: pub } = supabase.storage
        .from('content-images')
        .getPublicUrl(data.path);
      setForm((prev) => ({
        ...prev,
        cover_image: data.path,
        cover_image_url: pub.publicUrl,
      }));
      flash(setSuccess, 'Image uploaded');
    } catch (err) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title || !form.body)
      return setError('Title and body are required');
    if (form.type === 'event' && !form.event_date)
      return setError('Event date is required for events');
    if (!form.pillar)
      return setError(
        'Please select a Strategic Pillar (or click "Auto-suggest")',
      );

    const payload = {
      type: form.type,
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      excerpt: form.excerpt,
      body: form.body,
      author: form.author,
      cover_image: form.cover_image_url || null,
      status: form.status,
      published_at: form.status === 'published' ? form.published_at : null,
      event_date: form.type === 'event' ? form.event_date : null,
      location: form.type === 'event' ? form.location : null,
      pillar: form.pillar,
    };

    const result = editingId
      ? await supabase.from('content_items').update(payload).eq('id', editingId)
      : await supabase
          .from('content_items')
          .insert([{ ...payload, created_by: userId }]);

    if (result.error) {
      setError(result.error.message || 'Failed to save post');
      return;
    }

    flash(setSuccess, editingId ? 'Post updated' : 'Post created');
    resetForm();
    setActiveTab('list');
    fetchItems();
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    editor?.commands.setContent('');
    setEditingId(null);
  }

  function editItem(item) {
    setForm({
      type: item.type,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      body: item.body || '',
      author: item.author || '',
      cover_image: item.cover_image,
      cover_image_url: item.cover_image || '',
      status: item.status,
      published_at: item.published_at ? item.published_at.split('T')[0] : '',
      event_date: item.event_date ? item.event_date.split('T')[0] : '',
      location: item.location || '',
      pillar: item.pillar || '',
    });
    editor?.commands.setContent(item.body || '');
    setEditingId(item.id);
    setActiveTab('create');
  }

  async function deleteItem(id) {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);
    if (error) setError(`Failed to delete post: ${error.message}`);
    else {
      flash(setSuccess, 'Post deleted');
      fetchItems();
    }
  }

  const tabClass = (on) =>
    `text-sm font-medium pb-3 border-b-2 transition-colors ${
      on
        ? 'text-[#125276] border-[#125276]'
        : 'text-[#7A8A96] border-transparent hover:text-[#3E5262]'
    }`;

  const toolbarBtn = (on) =>
    `px-3 py-1.5 rounded text-xs font-medium transition-colors ${
      on
        ? 'bg-[#1565c0] text-white'
        : 'bg-white border border-[#D8E0E7] text-[#14202B] hover:bg-[#F7F9FB]'
    }`;

  const inputClass =
    'w-full bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30';

  return (
    <div className='min-h-screen bg-[#F7F9FB]'>
      <div className='max-w-7xl mx-auto px-6 py-6 border-b border-[#D8E0E7] bg-white'>
        <div className='flex gap-6'>
          <button
            onClick={() => {
              setActiveTab('list');
              resetForm();
            }}
            className={tabClass(activeTab === 'list')}>
            All Posts ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={tabClass(activeTab === 'create')}>
            {editingId ? 'Edit Post' : 'New Post'}
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {error && (
          <div className='p-4 bg-[#860f0f]/10 border border-[#860f0f]/30 rounded-sm text-[#860f0f] text-sm mb-6'>
            {error}
          </div>
        )}
        {success && (
          <div className='p-4 bg-[#1565c0]/10 border border-[#1565c0]/30 rounded-sm text-[#1565c0] text-sm mb-6'>
            {success}
          </div>
        )}

        {activeTab === 'list' ? (
          <div className='space-y-3'>
            {loading ? (
              <p className='text-[#7A8A96] py-8 text-center'>
                Loading posts...
              </p>
            ) : items.length === 0 ? (
              <p className='text-[#7A8A96] py-8 text-center'>
                No posts visible to you yet. If you expect posts here, check the
                editorial role and the content_items policies.
              </p>
            ) : (
              items.map((item) => {
                const pillar = PILLARS.find((p) => p.key === item.pillar);
                return (
                  <div
                    key={item.id}
                    className='bg-white border border-[#D8E0E7] rounded-sm p-5 flex items-center justify-between'>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-3 mb-1 flex-wrap'>
                        <span className='text-xs font-semibold uppercase text-[#1565c0]'>
                          {item.type}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-sm ${
                            item.status === 'published'
                              ? 'bg-[#1565c0]/10 text-[#1565c0]'
                              : item.status === 'draft'
                                ? 'bg-[#7A8A96]/10 text-[#7A8A96]'
                                : 'bg-[#860f0f]/10 text-[#860f0f]'
                          }`}>
                          {item.status}
                        </span>
                        {pillar ? (
                          <span
                            className='text-xs px-2 py-1 rounded-sm font-medium'
                            style={{
                              background: pillar.color + '15',
                              color: pillar.color,
                            }}>
                            {pillar.label}
                          </span>
                        ) : (
                          <span className='text-xs px-2 py-1 rounded-sm bg-[#860f0f]/10 text-[#860f0f]'>
                            ⚠ No pillar
                          </span>
                        )}
                      </div>
                      <h3 className='text-base font-semibold text-[#125276] truncate'>
                        {item.title}
                      </h3>
                      <p className='text-xs text-[#7A8A96] mt-0.5'>
                        {new Date(item.created_at).toLocaleDateString('en-KE')}{' '}
                        · {item.author || '—'}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 shrink-0 ml-4'>
                      <button
                        onClick={() => editItem(item)}
                        className='text-xs bg-[#125276] text-white px-3 py-2 rounded-sm hover:bg-[#0E3F52] transition-colors'>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className='text-xs bg-[#860f0f] text-white px-3 py-2 rounded-sm hover:bg-[#6B0B09] transition-colors'>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className='max-w-2xl space-y-6 bg-white border border-[#D8E0E7] rounded-sm p-8'>
            <div>
              <div className='flex items-center justify-between mb-2'>
                <label className='block text-sm font-medium text-[#14202B]'>
                  Strategic Pillar *
                </label>
                <button
                  type='button'
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      pillar: suggestPillar(prev.title, prev.excerpt),
                    }))
                  }
                  className='text-xs text-[#1565c0] hover:underline'>
                  Auto-suggest from title
                </button>
              </div>
              <select
                name='pillar'
                value={form.pillar}
                onChange={handleInputChange}
                className={inputClass}>
                <option value=''>— Select a pillar —</option>
                {PILLARS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
              {form.pillar && (
                <p className='text-xs text-[#7A8A96] mt-1.5'>
                  This item will appear on{' '}
                  <a
                    href={`/news-and-media/pillar/${form.pillar}/`}
                    target='_blank'
                    rel='noopener'
                    className='text-[#1565c0] hover:underline'>
                    /news-and-media/pillar/{form.pillar}/
                  </a>
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-[#14202B] mb-2'>
                Content Type
              </label>
              <select
                name='type'
                value={form.type}
                onChange={handleInputChange}
                className={inputClass}>
                <option value='article'>Story (Article)</option>
                <option value='blog'>Blog Post</option>
                <option value='press_release'>Press Release</option>
                <option value='event'>Event</option>
              </select>
            </div>

            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-[#14202B] mb-2'>
                  Title *
                </label>
                <input
                  type='text'
                  required
                  name='title'
                  value={form.title}
                  onChange={handleInputChange}
                  onBlur={() =>
                    !form.slug &&
                    setForm((prev) => ({
                      ...prev,
                      slug: generateSlug(prev.title),
                    }))
                  }
                  placeholder='Enter title'
                  className={inputClass}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-[#14202B] mb-2'>
                  Slug
                </label>
                <input
                  type='text'
                  name='slug'
                  value={form.slug}
                  onChange={handleInputChange}
                  placeholder='auto-generated'
                  className={`${inputClass} text-[#7A8A96]`}
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-[#14202B] mb-2'>
                Excerpt / Summary
              </label>
              <textarea
                name='excerpt'
                value={form.excerpt}
                onChange={handleInputChange}
                placeholder='Brief summary for preview'
                rows='2'
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-[#14202B] mb-2'>
                Body Content *
              </label>
              <div className='border border-[#D8E0E7] rounded-sm bg-white'>
                <div className='flex flex-wrap gap-1 border-b border-[#D8E0E7] p-2 bg-[#F7F9FB]'>
                  <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={toolbarBtn(editor?.isActive('bold'))}>
                    Bold
                  </button>
                  <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={toolbarBtn(editor?.isActive('italic'))}>
                    Italic
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={toolbarBtn(
                      editor?.isActive('heading', { level: 2 }),
                    )}>
                    H2
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={toolbarBtn(
                      editor?.isActive('heading', { level: 3 }),
                    )}>
                    H3
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={toolbarBtn(editor?.isActive('bulletList'))}>
                    • List
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                    className={toolbarBtn(editor?.isActive('orderedList'))}>
                    1. List
                  </button>
                  <button
                    type='button'
                    onClick={() => editor?.chain().focus().clearNodes().run()}
                    className={toolbarBtn(false)}>
                    Clear
                  </button>
                </div>
                <EditorContent
                  editor={editor}
                  className='prose prose-sm max-w-none px-4 py-3 min-h-64 outline-none'
                  style={{ fontSize: '14px', lineHeight: '1.6' }}
                />
              </div>
              <p className='text-xs text-[#7A8A96] mt-1'>
                Click buttons above to format. No HTML needed.
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-[#14202B] mb-2'>
                Author Name
              </label>
              <input
                type='text'
                name='author'
                value={form.author}
                onChange={handleInputChange}
                placeholder='e.g., Communications Team'
                className={inputClass}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-[#14202B] mb-2'>
                Cover Image
              </label>
              <div className='flex flex-col gap-3'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className='text-sm'
                />
                {form.cover_image_url && (
                  <div className='rounded-sm overflow-hidden bg-[#E7ECF0]'>
                    <img
                      src={form.cover_image_url}
                      alt='Cover'
                      className='w-full h-40 object-cover'
                    />
                  </div>
                )}
              </div>
            </div>

            {form.type === 'event' && (
              <div className='grid sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-[#14202B] mb-2'>
                    Event Date *
                  </label>
                  <input
                    type='date'
                    required
                    name='event_date'
                    value={form.event_date}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-[#14202B] mb-2'>
                    Location
                  </label>
                  <input
                    type='text'
                    name='location'
                    value={form.location}
                    onChange={handleInputChange}
                    placeholder='e.g., Main Hall, SPMH'
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-[#14202B] mb-2'>
                  Status
                </label>
                <select
                  name='status'
                  value={form.status}
                  onChange={handleInputChange}
                  className={inputClass}>
                  <option value='draft'>Draft</option>
                  <option value='published'>Published</option>
                  <option value='archived'>Archived</option>
                </select>
              </div>
              {form.status === 'published' && (
                <div>
                  <label className='block text-sm font-medium text-[#14202B] mb-2'>
                    Publish Date
                  </label>
                  <input
                    type='date'
                    name='published_at'
                    value={form.published_at}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='submit'
                className='flex-1 font-medium bg-[#1565c0] text-white rounded-sm py-3 hover:bg-[#0D4BA8] transition-colors'>
                {editingId ? 'Update Post' : 'Create Post'}
              </button>
              {editingId && (
                <button
                  type='button'
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className='flex-1 font-medium bg-[#7A8A96] text-white rounded-sm py-3 hover:bg-[#5A6B77] transition-colors'>
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Show a success message for 3 seconds, then clear it
function flash(setter, text) {
  setter(text);
  setTimeout(() => setter(''), 3000);
}
