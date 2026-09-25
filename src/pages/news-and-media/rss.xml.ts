import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase-news';

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const TYPE_LABEL: Record<string, string> = {
  article: 'Story',
  blog: 'Blog',
  press_release: 'Press Release',
  event: 'Event',
};

export const GET: APIRoute = async ({ site, url }) => {
  const origin = site?.toString().replace(/\/$/, '') ?? url.origin;
  const feedUrl = `${origin}/news-and-media/rss.xml`;
  const siteUrl = `${origin}/news-and-media/`;

  let items: any[] = [];
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('id, type, title, slug, excerpt, cover_image, published_at, event_date')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(30);
    if (!error) items = data ?? [];
  } catch (e) {
    console.error('RSS fetch failed:', e);
  }

  const itemXml = items
    .map((item) => {
      const link = `${origin}/news-and-media/${item.slug}/`;
      const pub = item.published_at ?? item.event_date ?? new Date().toISOString();
      const pubDate = new Date(pub).toUTCString();
      const title = xmlEscape(item.title ?? '');
      const desc = xmlEscape(item.excerpt ?? '');
      const cat = xmlEscape(TYPE_LABEL[item.type] ?? item.type ?? '');

      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${cat}</category>
      <description>${desc}</description>${
        item.cover_image
          ? `\n      <enclosure url="${xmlEscape(item.cover_image)}" type="image/jpeg" />`
          : ''
      }
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>St. Paul's Mission Hospital — News &amp; Media</title>
    <link>${siteUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Stories, press releases, and events from St. Paul's Mission Hospital, Homa Bay, Kenya.</description>
    <language>en-KE</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
};