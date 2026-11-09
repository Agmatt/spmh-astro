import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase-ssr';

const ALLOWED_ORIGINS = [
  'https://recruitment.spmh.co.ke',
  'https://www.spmh.co.ke',
  'https://spmh.co.ke',
  'http://localhost:4321',
];

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const PUBLIC_ADMIN_PATHS = new Set([
  '/admin/login',
  '/admin/accept-invite',
  '/admin/forgot-password',
  '/admin/reset-password',
]);

// Forces a reload if the browser attempts to restore the page from bfcache
const RELOAD_ON_RESTORE = `
<script>
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { location.reload(); }
  });
</script>`;

export const onRequest = defineMiddleware(async (context, next) => {
  // ── 1. CSRF protection ───────────────────────────────────
  if (MUTATING_METHODS.has(context.request.method)) {
    const origin = context.request.headers.get('origin');
    const referer = context.request.headers.get('referer');

    let requestOrigin: string | null = origin;
    if (!requestOrigin && referer) {
      try {
        requestOrigin = new URL(referer).origin;
      } catch {
        requestOrigin = null;
      }
    }

    if (requestOrigin && !ALLOWED_ORIGINS.includes(requestOrigin)) {
      console.warn(
        '[csrf] blocked:',
        requestOrigin,
        '->',
        context.url.pathname,
      );
      return new Response('Cross-origin request blocked', { status: 403 });
    }
  }

  // ── 2. Admin route protection ────────────────────────────
  const url = new URL(context.request.url);
  const path = url.pathname;

  // If it's not an admin route, let it pass through untouched
  if (!path.startsWith('/admin')) {
    return next();
  }

  // Public admin paths bypass the session check entirely.
  if (PUBLIC_ADMIN_PATHS.has(path)) {
    return next();
  }

  const supabase = createSupabaseServerClient(context);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return context.redirect('/admin/login');
  }

  const { data: adminRow } = await supabase
    .from('admins')
    .select('role, full_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return context.redirect(
      '/admin/login?error=' +
        encodeURIComponent(
          'Your account is not authorised to access this dashboard.',
        ),
    );
  }

  context.locals.admin = {
    role: adminRow.role,
    full_name: adminRow.full_name ?? null,
  };
  context.locals.user = user;
  context.locals.supabase = supabase;

  // ── 3. Get the response ──────────────────────────────────
  const response = await next();

  // ── 4. Apply bfcache & cache prevention headers ──────────
  const headers = new Headers(response.headers);

  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.delete('ETag');
  headers.delete('Last-Modified');

  // ── 5. Inject the pageshow reload script for HTML ────────
  const type = headers.get('content-type') ?? '';
  if (type.includes('text/html')) {
    let html = await response.text();

    // Only inject if it's not already there to prevent double scripts
    if (!html.includes("window.addEventListener('pageshow'")) {
      html = html.replace('</body>', `${RELOAD_ON_RESTORE}</body>`);
    }

    headers.delete('content-length');
    return new Response(html, { status: response.status, headers });
  }

  return new Response(response.body, { status: response.status, headers });
});
