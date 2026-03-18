import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_DSJiueLK.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about-us/contact.astro.mjs');
const _page2 = () => import('./pages/about-us/history.astro.mjs');
const _page3 = () => import('./pages/about-us/mission-vision-values.astro.mjs');
const _page4 = () => import('./pages/about-us/organization.astro.mjs');
const _page5 = () => import('./pages/about-us/strategic-plan.astro.mjs');
const _page6 = () => import('./pages/about-us/supplier-registration.astro.mjs');
const _page7 = () => import('./pages/about-us/tenders.astro.mjs');
const _page8 = () => import('./pages/api/keystatic/_---params_.astro.mjs');
const _page9 = () => import('./pages/developments/hdu.astro.mjs');
const _page10 = () => import('./pages/developments/maternity-surgical-wing.astro.mjs');
const _page11 = () => import('./pages/developments/newborn-unit.astro.mjs');
const _page12 = () => import('./pages/error.astro.mjs');
const _page13 = () => import('./pages/faq.astro.mjs');
const _page14 = () => import('./pages/get-involved/apply.astro.mjs');
const _page15 = () => import('./pages/get-involved/careers.astro.mjs');
const _page16 = () => import('./pages/get-involved/donate.astro.mjs');
const _page17 = () => import('./pages/get-involved/partners.astro.mjs');
const _page18 = () => import('./pages/get-involved/volunteer.astro.mjs');
const _page19 = () => import('./pages/get-involved.astro.mjs');
const _page20 = () => import('./pages/keystatic/_---params_.astro.mjs');
const _page21 = () => import('./pages/keystatic/_---params_.astro2.mjs');
const _page22 = () => import('./pages/life-at-spmh/blog.astro.mjs');
const _page23 = () => import('./pages/life-at-spmh/gallery.astro.mjs');
const _page24 = () => import('./pages/life-at-spmh/medical-camp.astro.mjs');
const _page25 = () => import('./pages/news-and-media/articles/_slug_.astro.mjs');
const _page26 = () => import('./pages/news-and-media/articles.astro.mjs');
const _page27 = () => import('./pages/news-and-media/blog.astro.mjs');
const _page28 = () => import('./pages/news-and-media/events.astro.mjs');
const _page29 = () => import('./pages/news-and-media/gallery.astro.mjs');
const _page30 = () => import('./pages/news-and-media.astro.mjs');
const _page31 = () => import('./pages/privacy-policy.astro.mjs');
const _page32 = () => import('./pages/services/antenatal-clinic.astro.mjs');
const _page33 = () => import('./pages/services/appointment.astro.mjs');
const _page34 = () => import('./pages/services/ccc.astro.mjs');
const _page35 = () => import('./pages/services/clinical.astro.mjs');
const _page36 = () => import('./pages/services/patient-support.astro.mjs');
const _page37 = () => import('./pages/services/surgical.astro.mjs');
const _page38 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about-us/contact.astro", _page1],
    ["src/pages/about-us/history.astro", _page2],
    ["src/pages/about-us/mission-vision-values.astro", _page3],
    ["src/pages/about-us/organization.astro", _page4],
    ["src/pages/about-us/strategic-plan.astro", _page5],
    ["src/pages/about-us/supplier-registration.astro", _page6],
    ["src/pages/about-us/tenders.astro", _page7],
    ["node_modules/@keystatic/astro/internal/keystatic-api.js", _page8],
    ["src/pages/developments/hdu.astro", _page9],
    ["src/pages/developments/maternity-surgical-wing.astro", _page10],
    ["src/pages/developments/newborn-unit.astro", _page11],
    ["src/pages/error.astro", _page12],
    ["src/pages/faq.astro", _page13],
    ["src/pages/get-involved/apply.astro", _page14],
    ["src/pages/get-involved/careers.astro", _page15],
    ["src/pages/get-involved/donate.astro", _page16],
    ["src/pages/get-involved/partners.astro", _page17],
    ["src/pages/get-involved/volunteer.astro", _page18],
    ["src/pages/get-involved/index.astro", _page19],
    ["src/pages/keystatic/[...params].astro", _page20],
    ["node_modules/@keystatic/astro/internal/keystatic-astro-page.astro", _page21],
    ["src/pages/life-at-spmh/blog.astro", _page22],
    ["src/pages/life-at-spmh/gallery.astro", _page23],
    ["src/pages/life-at-spmh/medical-camp.astro", _page24],
    ["src/pages/news-and-media/articles/[slug].astro", _page25],
    ["src/pages/news-and-media/articles/index.astro", _page26],
    ["src/pages/news-and-media/blog.astro", _page27],
    ["src/pages/news-and-media/events.astro", _page28],
    ["src/pages/news-and-media/gallery.astro", _page29],
    ["src/pages/news-and-media/index.astro", _page30],
    ["src/pages/privacy-policy.astro", _page31],
    ["src/pages/services/antenatal-clinic.astro", _page32],
    ["src/pages/services/appointment.astro", _page33],
    ["src/pages/services/ccc.astro", _page34],
    ["src/pages/services/clinical.astro", _page35],
    ["src/pages/services/patient-support.astro", _page36],
    ["src/pages/services/surgical.astro", _page37],
    ["src/pages/index.astro", _page38]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "b4e85294-aea4-49e0-820c-974f17f93914"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
