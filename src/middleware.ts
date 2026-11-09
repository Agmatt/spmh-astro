// src/middleware.ts
// Applies to every protected portal page and API route:
//  1. The browser may never store these responses, so Back always asks the server.
//  2. If the browser still restores a page from its Back cache, the page reloads
//     and the server checks the session again. No session → login page.
// The server gates (requireXxxUser) already protect the data; this stops the
// browser from showing stale copies after sign-out.

import { defineMiddleware } from 'astro:middleware';

const PROTECTED =
  /^\/(admin|api\/(cqi|editorial|appointments|tenders-portal))(\/|$)/;

const RELOAD_ON_RESTORE = `<script>
window.addEventListener('pageshow', function (e) {
  if (e.persisted) { location.reload(); }
});
</script>`;

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!PROTECTED.test(context.url.pathname)) return response;

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.delete('ETag');
  headers.delete('Last-Modified');

  const type = headers.get('content-type') ?? '';
  if (type.includes('text/html')) {
    const html = (await response.text()).replace(
      '</body>',
      `${RELOAD_ON_RESTORE}</body>`,
    );
    headers.delete('content-length');
    return new Response(html, { status: response.status, headers });
  }

  return new Response(response.body, { status: response.status, headers });
});
