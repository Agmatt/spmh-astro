import { c as createComponent, a as renderTemplate } from '../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$ = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "E:/PROJECT/SPMH/src/pages/keystatic/[...params].astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/keystatic/[...params].astro";
const $$url = "/keystatic/[...params]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
