import { c as createComponent, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DbIzBR6F.mjs';
export { renderers } from '../../renderers.mjs';

const $$Blog = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog - Life at SPMH" })}`;
}, "E:/PROJECT/SPMH/src/pages/life-at-spmh/blog.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/life-at-spmh/blog.astro";
const $$url = "/life-at-spmh/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Blog,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
