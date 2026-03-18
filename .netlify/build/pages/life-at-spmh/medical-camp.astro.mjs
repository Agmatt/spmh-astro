import { c as createComponent, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DbIzBR6F.mjs';
export { renderers } from '../../renderers.mjs';

const $$MedicalCamp = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Medical Camp" })}`;
}, "E:/PROJECT/SPMH/src/pages/life-at-spmh/medical-camp.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/life-at-spmh/medical-camp.astro";
const $$url = "/life-at-spmh/medical-camp";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$MedicalCamp,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
