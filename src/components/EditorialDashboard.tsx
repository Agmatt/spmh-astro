
// src/components/EditorialDashboard.tsx
// Main editorial dashboard component
// Manages articles, press releases, and events
// Import into editorial-dashboard.astro page

import React, { useState, useEffect, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

interface EditorialDashboardProps {
  supabase: SupabaseClient;
  session: Session;
}

interface ContentItem {
  id: number;
  content_type: 'article' | 'press_release';
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  category: string | null;
  pdf_url: string | null;
  is_published: boolean;
  published_at: string;
}

interface EventItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  location: string;
  cover_image: string | null;
  is_published: boolean;
}

export const EditorialDashboard: React.FC<EditorialDashboardProps> = ({ supabase, session }) => {
  const [tab, setTab] = useState<'articles' | 'press' | 'events'>('articles');
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [pressReleases, setPressReleases] = useState<ContentItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session?.user]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch articles
      const { data: articlesData } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', 'article')
        .order('published_at', { ascending: false });
      setArticles(articlesData || []);

      // Fetch press releases
      const { data: pressData } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', 'press_release')
        .order('published_at', { ascending: false });
      setPressReleases(pressData || []);

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      setEvents(eventsData || []);

    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/editorial-login';
  };

  return (
    <div class="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="font-serif text-2xl text-slate-900">Editorial Dashboard</h1>
            <p class="text-sm text-slate-500 mt-1">Manage news content for SPMH</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-slate-600">{session?.user?.email}</span>
            <button
              onClick={handleLogout}
              class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-6 py-8">
        {/* TAB NAVIGATION */}
        <div class="flex gap-4 border-b border-slate-200 mb-8">
          <button
            onClick={() => setTab('articles')}
            class={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${tab === 'articles'
                ? 'border-[#125276] text-[#125276]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            Articles ({articles.length})
          </button>
          <button
            onClick={() => setTab('press')}
            class={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${tab === 'press'
                ? 'border-[#125276] text-[#125276]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            Press Releases ({pressReleases.length})
          </button>
          <button
            onClick={() => setTab('events')}
            class={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${tab === 'events'
                ? 'border-[#125276] text-[#125276]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            Events ({events.length})
          </button>
        </div>

        {/* NEW BUTTON */}
        <div class="mb-6">
          <button
            onClick={() => setShowForm(true)}
            class="px-4 py-2 bg-[#125276] text-white font-medium rounded-lg hover:bg-[#0d3a5c] transition-colors"
          >
            + New {tab === 'articles' ? 'Article' : tab === 'press' ? 'Press Release' : 'Event'}
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div class="text-center py-12">
            <p class="text-slate-500">Loading content...</p>
          </div>
        )}

        {/* ARTICLES TAB */}
        {!loading && tab === 'articles' && (
          <div class="space-y-4">
            {articles.length === 0 ? (
              <p class="text-slate-500 text-center py-8">No articles yet. Create one to get started.</p>
            ) : (
              articles.map((article) => (
                <div key={article.id} class="bg-white rounded-lg border border-slate-200 p-4 flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-serif text-lg text-slate-900">{article.title}</h3>
                      <span
                        class={`inline-block px-2 py-1 text-xs font-semibold rounded ${article.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {article.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p class="text-sm text-slate-600 mb-2">{article.excerpt}</p>
                    <div class="flex gap-4 text-xs text-slate-500">
                      <span>Category: {article.category || '—'}</span>
                      <span>Updated: {new Date(article.published_at).toLocaleDateString('en-KE')}</span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded">
                      Edit
                    </button>
                    <button class="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PRESS RELEASES TAB */}
        {!loading && tab === 'press' && (
          <div class="space-y-4">
            {pressReleases.length === 0 ? (
              <p class="text-slate-500 text-center py-8">No press releases yet. Create one to get started.</p>
            ) : (
              pressReleases.map((release) => (
                <div key={release.id} class="bg-white rounded-lg border border-slate-200 p-4 flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-serif text-lg text-slate-900">{release.title}</h3>
                      <span
                        class={`inline-block px-2 py-1 text-xs font-semibold rounded ${release.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {release.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p class="text-sm text-slate-600 mb-2">{release.excerpt}</p>
                    <div class="flex gap-4 text-xs text-slate-500">
                      {release.pdf_url && <span>PDF attached</span>}
                      <span>Updated: {new Date(release.published_at).toLocaleDateString('en-KE')}</span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded">
                      Edit
                    </button>
                    <button class="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* EVENTS TAB */}
        {!loading && tab === 'events' && (
          <div class="space-y-4">
            {events.length === 0 ? (
              <p class="text-slate-500 text-center py-8">No events yet. Create one to get started.</p>
            ) : (
              events.map((event) => (
                <div key={event.id} class="bg-white rounded-lg border border-slate-200 p-4 flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-serif text-lg text-slate-900">{event.title}</h3>
                      <span
                        class={`inline-block px-2 py-1 text-xs font-semibold rounded ${event.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {event.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p class="text-sm text-slate-600 mb-2">{event.description}</p>
                    <div class="flex gap-4 text-xs text-slate-500">
                      <span>📍 {event.location}</span>
                      <span>📅 {new Date(event.event_date).toLocaleDateString('en-KE')}</span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded">
                      Edit
                    </button>
                    <button class="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};