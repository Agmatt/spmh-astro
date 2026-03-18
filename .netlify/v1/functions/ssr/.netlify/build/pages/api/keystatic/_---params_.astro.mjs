import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import { parseString } from 'set-cookie-parser';
import { config as config$1, collection, fields } from '@keystatic/core';
export { renderers } from '../../../renderers.mjs';

function makeHandler(_config) {
  return async function keystaticAPIRoute(context) {
    var _context$locals, _ref, _config$clientId, _ref2, _config$clientSecret, _ref3, _config$secret;
    const envVarsForCf = (_context$locals = context.locals) === null || _context$locals === void 0 || (_context$locals = _context$locals.runtime) === null || _context$locals === void 0 ? void 0 : _context$locals.env;
    const handler = makeGenericAPIRouteHandler({
      ..._config,
      clientId: (_ref = (_config$clientId = _config.clientId) !== null && _config$clientId !== void 0 ? _config$clientId : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_ID) !== null && _ref !== void 0 ? _ref : tryOrUndefined(() => {
        return undefined                                          ;
      }),
      clientSecret: (_ref2 = (_config$clientSecret = _config.clientSecret) !== null && _config$clientSecret !== void 0 ? _config$clientSecret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_SECRET) !== null && _ref2 !== void 0 ? _ref2 : tryOrUndefined(() => {
        return undefined                                              ;
      }),
      secret: (_ref3 = (_config$secret = _config.secret) !== null && _config$secret !== void 0 ? _config$secret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_SECRET) !== null && _ref3 !== void 0 ? _ref3 : tryOrUndefined(() => {
        return undefined                                ;
      })
    }, {
      slugEnvName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG"
    });
    const {
      body,
      headers,
      status
    } = await handler(context.request);
    let headersInADifferentStructure = /* @__PURE__ */ new Map();
    if (headers) {
      if (Array.isArray(headers)) {
        for (const [key, value] of headers) {
          if (!headersInADifferentStructure.has(key.toLowerCase())) {
            headersInADifferentStructure.set(key.toLowerCase(), []);
          }
          headersInADifferentStructure.get(key.toLowerCase()).push(value);
        }
      } else if (typeof headers.entries === "function") {
        for (const [key, value] of headers.entries()) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
        if ("getSetCookie" in headers && typeof headers.getSetCookie === "function") {
          const setCookieHeaders2 = headers.getSetCookie();
          if (setCookieHeaders2 !== null && setCookieHeaders2 !== void 0 && setCookieHeaders2.length) {
            headersInADifferentStructure.set("set-cookie", setCookieHeaders2);
          }
        }
      } else {
        for (const [key, value] of Object.entries(headers)) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
      }
    }
    const setCookieHeaders = headersInADifferentStructure.get("set-cookie");
    headersInADifferentStructure.delete("set-cookie");
    if (setCookieHeaders) {
      for (const setCookieValue of setCookieHeaders) {
        var _options$sameSite;
        const {
          name,
          value,
          ...options
        } = parseString(setCookieValue);
        const sameSite = (_options$sameSite = options.sameSite) === null || _options$sameSite === void 0 ? void 0 : _options$sameSite.toLowerCase();
        context.cookies.set(name, value, {
          domain: options.domain,
          expires: options.expires,
          httpOnly: options.httpOnly,
          maxAge: options.maxAge,
          path: options.path,
          sameSite: sameSite === "lax" || sameSite === "strict" || sameSite === "none" ? sameSite : void 0
        });
      }
    }
    return new Response(body, {
      status,
      headers: [...headersInADifferentStructure.entries()].flatMap(([key, val]) => val.map((x) => [key, x]))
    });
  };
}
function tryOrUndefined(fn) {
  try {
    return fn();
  } catch {
    return void 0;
  }
}

const config = config$1({
  storage: { kind: "local" },
  ui: {
    brand: { name: "St. Paul's Mission Hospital — CMS" }
  },
  collections: {
    // ── ARTICLES ──────────────────────────────────────────────
    articles: collection({
      label: "Articles",
      slugField: "title",
      path: "src/content/articles/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "date", "category"],
      schema: {
        title: fields.slug({
          name: { label: "Title" }
        }),
        date: fields.date({
          label: "Publication Date",
          validation: { isRequired: true }
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Clinical Updates", value: "Clinical Updates" },
            { label: "Community Health", value: "Community Health" },
            { label: "Hospital News", value: "Hospital News" },
            { label: "Staff Updates", value: "Staff Updates" },
            { label: "Announcements", value: "Announcements" }
          ],
          defaultValue: "Hospital News"
        }),
        author: fields.text({
          label: "Author",
          defaultValue: "Editorial Team"
        }),
        image: fields.image({
          label: "Featured Image",
          directory: "public/img/articles",
          publicPath: "/img/articles/"
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description: "A short summary shown on the articles listing page (1–2 sentences).",
          multiline: true,
          validation: { isRequired: true }
        }),
        featured: fields.checkbox({
          label: "Featured Article",
          description: "Featured articles appear in the top slot on the News & Media index.",
          defaultValue: false
        }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Drafts are hidden from the public website.",
          defaultValue: false
        }),
        content: fields.markdoc({
          label: "Article Body"
        })
      }
    }),
    // ── EVENTS ────────────────────────────────────────────────
    events: collection({
      label: "Events",
      slugField: "title",
      path: "src/content/events/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "date", "category"],
      schema: {
        title: fields.slug({
          name: { label: "Event Name" }
        }),
        date: fields.date({
          label: "Event Date",
          validation: { isRequired: true }
        }),
        endDate: fields.date({
          label: "End Date (leave blank for single-day events)"
        }),
        time: fields.text({
          label: "Time",
          description: "e.g. 9:00 AM – 3:00 PM",
          validation: { isRequired: true }
        }),
        location: fields.text({
          label: "Location",
          description: "e.g. SPMH Main Hall, Homa Bay Town",
          validation: { isRequired: true }
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Community Outreach", value: "Community Outreach" },
            { label: "Health Camp", value: "Health Camp" },
            { label: "Training", value: "Training" },
            { label: "Hospital Event", value: "Hospital Event" },
            { label: "Fundraising", value: "Fundraising" }
          ],
          defaultValue: "Hospital Event"
        }),
        image: fields.image({
          label: "Event Image",
          directory: "public/img/events",
          publicPath: "/img/events/"
        }),
        excerpt: fields.text({
          label: "Short Description",
          description: "Shown on the events listing page.",
          multiline: true,
          validation: { isRequired: true }
        }),
        draft: fields.checkbox({
          label: "Draft",
          defaultValue: false
        }),
        content: fields.markdoc({
          label: "Event Details"
        })
      }
    }),
    // ── GALLERY ───────────────────────────────────────────────
    gallery: collection({
      label: "Gallery Albums",
      slugField: "title",
      path: "src/content/gallery/*",
      format: "json",
      columns: ["title", "date", "category"],
      schema: {
        title: fields.slug({
          name: { label: "Album Title" }
        }),
        date: fields.date({
          label: "Date",
          validation: { isRequired: true }
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Maternity Wing", value: "Maternity Wing" },
            { label: "Community Outreach", value: "Community Outreach" },
            { label: "Staff Events", value: "Staff Events" },
            { label: "Facilities", value: "Facilities" },
            { label: "Patients & Care", value: "Patients & Care" }
          ],
          defaultValue: "Facilities"
        }),
        coverImage: fields.image({
          label: "Cover Photo",
          directory: "public/img/gallery",
          publicPath: "/img/gallery/",
          validation: { isRequired: true }
        }),
        photos: fields.array(
          fields.object({
            src: fields.image({
              label: "Photo",
              directory: "public/img/gallery",
              publicPath: "/img/gallery/"
            }),
            caption: fields.text({
              label: "Caption (optional)"
            })
          }),
          {
            label: "Photos",
            itemLabel: (props) => props.fields.caption.value || "Photo"
          }
        ),
        draft: fields.checkbox({
          label: "Draft",
          defaultValue: false
        })
      }
    })
  }
});

const all = makeHandler({ config });
const ALL = all;

const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  all,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
