import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_NEWS_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_NEWS_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const IDLE_TIME = 15 * 60 * 1000; // 15 minutes

const EditorialDashboard = () => {
  const [authState, setAuthState] = useState('loading');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const idleTimeoutRef = useRef(null);

  const [form, setForm] = useState({
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
  });

  // Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: form.body,
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, body: editor.getHTML() }));
    },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authState !== 'dashboard') return;

    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        handleLogout();
      }, IDLE_TIME);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer),
      );
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [authState]);

  useEffect(() => {
    if (authState === 'dashboard') {
      fetchItems();
    }
  }, [authState]);

  async function checkAuth() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setAuthState('dashboard');
      } else {
        setAuthState('login');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setAuthState('login');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      if (data.user) {
        setUser(data.user);
        setAuthState('dashboard');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
      console.error(err);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setAuthState('login');
    setItems([]);
    setForm({
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
    });
  }

  async function fetchItems() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError('Failed to load content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `covers/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('content-images').getPublicUrl(data.path);

      setForm((prev) => ({
        ...prev,
        cover_image: data.path,
        cover_image_url: publicUrl,
      }));
      setSuccess('Image uploaded');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Image upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  function generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title || !form.body) {
      setError('Title and body are required');
      return;
    }

    if (!form.slug) {
      form.slug = generateSlug(form.title);
    }

    if (form.type === 'event' && !form.event_date) {
      setError('Event date is required for events');
      return;
    }

    try {
      const payload = {
        type: form.type,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        body: form.body,
        author: form.author,
        cover_image: form.cover_image_url || null,
        status: form.status,
        published_at: form.status === 'published' ? form.published_at : null,
        event_date: form.type === 'event' ? form.event_date : null,
        location: form.type === 'event' ? form.location : null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('content_items')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Post updated');
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('content_items')
          .insert([{ ...payload, created_by: user.id }]);

        if (error) throw error;
        setSuccess('Post created');
      }

      resetForm();
      setActiveTab('list');
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save post');
      console.error(err);
    }
  }

  function resetForm() {
    setForm({
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
    });
    if (editor) {
      editor.commands.setContent('');
    }
    setEditingId(null);
  }

  function editItem(item) {
    setForm({
      type: item.type,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      body: item.body,
      author: item.author || '',
      cover_image: item.cover_image,
      cover_image_url: item.cover_image,
      status: item.status,
      published_at: item.published_at ? item.published_at.split('T')[0] : '',
      event_date: item.event_date ? item.event_date.split('T')[0] : '',
      location: item.location || '',
    });
    if (editor) {
      editor.commands.setContent(item.body || '');
    }
    setEditingId(item.id);
    setActiveTab('create');
  }

  async function deleteItem(id) {
    if (!confirm('Delete this post?')) return;

    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Post deleted');
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────
  if (authState === 'login') {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden'>
        <img
          src='/gallery/ed.jpg'
          alt='background image'
          loading='eager'
          className='absolute inset-0 w-full h-full object-cover'
          style={{ transform: 'scale(1.05)', opacity: 0.8 }}
        />
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background:
              'linear-gradient(20deg, rgba(20,08,30,0.95), rgba(104,15,15,0.5) 70%)',
          }}
        />
        <div
          className='absolute inset-0 pointer-events-none opacity-[0.04]'
          style={{
            backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className='relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 md:p-8'>
          <div className='flex justify-center mb-6'>
            <img
              src='/gallery/bg.png'
              alt='SPMH'
              className='h-26 w-auto object-contain'
              loading='eager'
            />
          </div>

          <h2 className="text-2xl font-bold mb-1 font-['Lato'] text-[#1c1c1e]">
            Editorial Access
          </h2>
          <p className="text-sm mb-6 font-['Open Sans'] text-[#6b7280]">
            Sign in to manage News & Media posts
          </p>

          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className="block text-xs font-semibold mb-1.5 font-['Open Sans'] text-[#1c1c1e]">
                Email
              </label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='editor@spmh.co.ke'
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all font-['Outfit'] border-[#ece8e1] text-[#1c1c1e] focus:border-[#860f0f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 font-['Open Sans'] text-[#1c1c1e]">
                Password
              </label>
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all font-['Outfit'] border-[#ece8e1] text-[#1c1c1e] focus:border-[#860f0f]"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg text-sm font-['Open Sans'] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c]">
                {loginError}
              </div>
            )}

            <button
              type='submit'
              className="w-full py-3 rounded-lg text-white font-bold text-sm transition-opacity hover:opacity-90 font-['Open Sans'] bg-[#860f0f]">
              Sign In
            </button>
          </form>

          <p className="text-center text-xs mt-6 font-['Open Sans'] text-[#9ca3af]">
            <a href='/' className='text-[#860f0f] hover:underline'>
              Back to home
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (authState === 'loading') {
    return (
      <div
        className='min-h-screen flex items-center justify-center'
        style={{ background: '#F7F9FB' }}>
        <div className='text-center'>
          <div
            className='w-12 h-12 rounded-full mx-auto mb-4 animate-spin'
            style={{
              border: '3px solid #D8E0E7',
              borderTopColor: '#1565c0',
            }}></div>
          <p className="font-['Outfit'] text-sm text-[#7A8A96]">Loading...</p>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ────────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen bg-[#F7F9FB]'>
      <div className='border-b border-[#D8E0E7] bg-white sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img
              src='/images/spmh-logo.svg'
              alt='SPMH'
              className='h-8 w-auto'
            />
            <h1 className="font-['Playfair_Display'] text-lg font-semibold text-[#125276]">
              Editorial Dashboard
            </h1>
          </div>
          <div className='flex items-center gap-4'>
            <span className="font-['Outfit'] text-sm text-[#7A8A96]">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="font-['Outfit'] text-sm bg-[#860f0f] text-white px-4 py-2 rounded-sm hover:bg-[#6B0B09] transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-6 border-b border-[#D8E0E7] bg-white'>
        <div className='flex gap-6'>
          <button
            onClick={() => {
              setActiveTab('list');
              resetForm();
            }}
            className={`font-['Outfit'] text-sm font-medium pb-3 border-b-2 transition-colors ${
              activeTab === 'list'
                ? 'text-[#125276] border-[#125276]'
                : 'text-[#7A8A96] border-transparent hover:text-[#3E5262]'
            }`}>
            All Posts ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`font-['Outfit'] text-sm font-medium pb-3 border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'text-[#125276] border-[#125276]'
                : 'text-[#7A8A96] border-transparent hover:text-[#3E5262]'
            }`}>
            {editingId ? 'Edit Post' : 'New Post'}
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {error && (
          <div className="p-4 bg-[#860f0f]/10 border border-[#860f0f]/30 rounded-sm text-[#860f0f] font-['Outfit'] text-sm mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-[#1565c0]/10 border border-[#1565c0]/30 rounded-sm text-[#1565c0] font-['Outfit'] text-sm mb-6">
            {success}
          </div>
        )}

        {activeTab === 'list' ? (
          <div className='space-y-3'>
            {loading ? (
              <p className="font-['Outfit'] text-[#7A8A96] py-8 text-center">
                Loading posts...
              </p>
            ) : items.length === 0 ? (
              <p className="font-['Outfit'] text-[#7A8A96] py-8 text-center">
                No posts yet. Create one to get started.
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className='bg-white border border-[#D8E0E7] rounded-sm p-5 flex items-center justify-between'>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-3 mb-1'>
                      <span className="font-['Outfit'] text-xs font-semibold uppercase text-[#1565c0]">
                        {item.type}
                      </span>
                      <span
                        className={`font-['Outfit'] text-xs px-2 py-1 rounded-sm ${
                          item.status === 'published'
                            ? 'bg-[#1565c0]/10 text-[#1565c0]'
                            : item.status === 'draft'
                              ? 'bg-[#7A8A96]/10 text-[#7A8A96]'
                              : 'bg-[#860f0f]/10 text-[#860f0f]'
                        }`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-['Playfair_Display'] text-base font-semibold text-[#125276] truncate">
                      {item.title}
                    </h3>
                    <p className="font-['Outfit'] text-xs text-[#7A8A96] mt-0.5">
                      {new Date(item.created_at).toLocaleDateString('en-KE')} ·{' '}
                      {item.author || '—'}
                    </p>
                  </div>
                  <div className='flex items-center gap-2 shrink-0 ml-4'>
                    <button
                      onClick={() => editItem(item)}
                      className="font-['Outfit'] text-xs bg-[#125276] text-white px-3 py-2 rounded-sm hover:bg-[#0E3F52] transition-colors">
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="font-['Outfit'] text-xs bg-[#860f0f] text-white px-3 py-2 rounded-sm hover:bg-[#6B0B09] transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className='max-w-2xl space-y-6 bg-white border border-[#D8E0E7] rounded-sm p-8'>
            <div>
              <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                Content Type
              </label>
              <select
                name='type'
                value={form.type}
                onChange={handleInputChange}
                className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30">
                <option value='article'>Story (Article)</option>
                <option value='blog'>Blog Post</option>
                <option value='press_release'>Press Release</option>
                <option value='event'>Event</option>
              </select>
            </div>

            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
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
                      slug: generateSlug(form.title),
                    }))
                  }
                  placeholder='Enter title'
                  className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30"
                />
              </div>
              <div>
                <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                  Slug
                </label>
                <input
                  type='text'
                  name='slug'
                  value={form.slug}
                  onChange={handleInputChange}
                  placeholder='auto-generated'
                  className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30 text-[#7A8A96]"
                />
              </div>
            </div>

            <div>
              <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                Excerpt / Summary
              </label>
              <textarea
                name='excerpt'
                value={form.excerpt}
                onChange={handleInputChange}
                placeholder='Brief summary for preview'
                rows='2'
                className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30 resize-none"
              />
            </div>

            {/* Tiptap Editor */}
            <div>
              <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                Body Content *
              </label>
              <div className='border border-[#D8E0E7] rounded-sm bg-white'>
                {/* Toolbar */}
                <div className='flex flex-wrap gap-1 border-b border-[#D8E0E7] p-2 bg-[#F7F9FB]'>
                  <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      editor?.isActive('bold')
                        ? 'bg-[#1565c0] text-white'
                        : 'bg-white border border-[#D8E0E7] text-[#14202B] hover:bg-[#F7F9FB]'
                    }`}>
                    Bold
                  </button>
                  <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      editor?.isActive('italic')
                        ? 'bg-[#1565c0] text-white'
                        : 'bg-white border border-[#D8E0E7] text-[#14202B] hover:bg-[#F7F9FB]'
                    }`}>
                    Italic
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      editor?.isActive('heading', { level: 2 })
                        ? 'bg-[#1565c0] text-white'
                        : 'bg-white border border-[#D8E0E7] text-[#14202B] hover:bg-[#F7F9FB]'
                    }`}>
                    H2
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      editor?.isActive('heading', { level: 3 })
                        ? 'bg-[#1565c0] text-white'
                        : 'bg-white border border-[#D8E0E7] text-[#14202B] hover:bg-[#F7F9FB]'
                    }`}>
                    H3
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      editor?.isActive('bulletList')
                        ? 'bg-[#1565c0] text-white'
                        : 'bg-white border border-[#D8E0E7] text-[#14202B] hover:bg-[#F7F9FB]'
                    }`}>
                    • List
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      editor?.isActive('orderedList')
                        ? 'bg-[#1565c0] text-white'
                        : 'bg-white border border-[#D8E0E7] text-[#14202B] hover:bg-[#F7F9FB]'
                    }`}>
                    1. List
                  </button>
                  <button
                    type='button'
                    onClick={() => editor?.chain().focus().clearNodes().run()}
                    className='px-3 py-1.5 rounded text-xs font-medium bg-white border border-[#D8E0E7] text-[#14202B] hover:bg-[#F7F9FB] transition-colors'>
                    Clear
                  </button>
                </div>

                {/* Editor */}
                <EditorContent
                  editor={editor}
                  className='prose prose-sm max-w-none px-4 py-3 min-h-64 outline-none'
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                />
              </div>
              <p className="font-['Outfit'] text-xs text-[#7A8A96] mt-1">
                Click buttons above to format. No HTML needed.
              </p>
            </div>

            <div>
              <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                Author Name
              </label>
              <input
                type='text'
                name='author'
                value={form.author}
                onChange={handleInputChange}
                placeholder='e.g., Communications Team'
                className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30"
              />
            </div>

            <div>
              <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                Cover Image
              </label>
              <div className='flex flex-col gap-3'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="font-['Outfit'] text-sm"
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
              <>
                <div className='grid sm:grid-cols-2 gap-4'>
                  <div>
                    <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                      Event Date *
                    </label>
                    <input
                      type='date'
                      required={form.type === 'event'}
                      name='event_date'
                      value={form.event_date}
                      onChange={handleInputChange}
                      className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30"
                    />
                  </div>
                  <div>
                    <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                      Location
                    </label>
                    <input
                      type='text'
                      name='location'
                      value={form.location}
                      onChange={handleInputChange}
                      placeholder='e.g., Main Hall, SPMH'
                      className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30"
                    />
                  </div>
                </div>
              </>
            )}

            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                  Status
                </label>
                <select
                  name='status'
                  value={form.status}
                  onChange={handleInputChange}
                  className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30">
                  <option value='draft'>Draft</option>
                  <option value='published'>Published</option>
                  <option value='archived'>Archived</option>
                </select>
              </div>
              {form.status === 'published' && (
                <div>
                  <label className="block font-['Outfit'] text-sm font-medium text-[#14202B] mb-2">
                    Publish Date
                  </label>
                  <input
                    type='date'
                    name='published_at'
                    value={form.published_at}
                    onChange={handleInputChange}
                    className="w-full font-['Outfit'] bg-[#F7F9FB] border border-[#D8E0E7] rounded-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1565c0]/30"
                  />
                </div>
              )}
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='submit'
                className="flex-1 font-['Outfit'] font-medium bg-[#1565c0] text-white rounded-sm py-3 hover:bg-[#0D4BA8] transition-colors">
                {editingId ? 'Update Post' : 'Create Post'}
              </button>
              {editingId && (
                <button
                  type='button'
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className="flex-1 font-['Outfit'] font-medium bg-[#7A8A96] text-white rounded-sm py-3 hover:bg-[#5A6B77] transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditorialDashboard;
