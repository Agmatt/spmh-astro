import { c as createComponent, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DbIzBR6F.mjs';
export { renderers } from '../../renderers.mjs';

const $$Apply = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Volunteer With Us" })}`;
}, "E:/PROJECT/SPMH/src/pages/get-involved/apply.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/get-involved/apply.astro";
const $$url = "/get-involved/apply";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Apply,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
