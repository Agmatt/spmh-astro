import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase-news';

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') ?? '').trim();
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 10), 20);

  if (q.length < 2) {
    return new Response(JSON.stringify({ results: [], total: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const like = `%${q.replace(/[%_]/g, '\\$&')}%`;

  const { data, error, count } = await supabase
    .from('content_items')
    .select('id, type, title, slug, excerpt, published_at, event_date', { count: 'exact' })
    .eq('status', 'published')
    .or(`title.ilike.${like},excerpt.ilike.${like},body.ilike.${like}`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    return new Response(JSON.stringify({ results: [], total: 0, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ results: data ?? [], total: count ?? 0 }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=30' },
  });
};