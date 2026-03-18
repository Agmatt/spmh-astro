import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DbIzBR6F.mjs';
export { renderers } from '../../renderers.mjs';

const $$Donate = createComponent(($$result, $$props, $$slots) => {
  const MPESA_TILL = "223791";
  const MPESA_NAME = "St. Paul's Mission Hospital";
  const BANK_NAME = "Kenya Commercial Bank (KCB)";
  const BANK_BRANCH = "Homa Bay Branch";
  const BANK_ACCOUNT = "XXXXXXXXXXXXXXXXX";
  const BANK_ACCT_NAME = "St. Paul's Mission Hospital";
  const BANK_SWIFT = "KCBLKENX";
  const impacts = [
    {
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      fill: true,
      title: "Newborn Unit care",
      desc: "Supports equipment, consumables, and nursing care for newborns requiring additional support after birth."
    },
    {
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      fill: false,
      title: "Care for patients who cannot pay",
      desc: "Directly funds treatment, medicines, and inpatient care for patients from the most vulnerable families in Homa Bay County."
    },
    {
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      fill: false,
      title: "New Maternity & Surgical Wing",
      desc: "Contributes to our 2026 capital development \u2014 expanding maternity beds, theatre capacity, and postnatal care facilities."
    },
    {
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      fill: false,
      title: "Medicines & medical supplies",
      desc: "Ensures our pharmacy and wards are stocked with essential medicines, dressings, and diagnostic consumables year-round."
    }
  ];
  const mpesaSteps = [
    "Go to <strong>M-Pesa</strong> on your phone",
    "Select <strong>Lipa na M-Pesa</strong>",
    "Select <strong>Buy Goods & Services</strong>",
    `Enter Till Number: <strong>${MPESA_TILL}</strong>`,
    "Enter the amount you wish to donate",
    "Enter your M-Pesa PIN and confirm",
    "You will receive an SMS confirmation from M-Pesa"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Donate \u2014 St. Paul's Mission Hospital" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<header class="relative min-h-[65vh] flex items-end overflow-hidden"> <div class="absolute inset-0 z-0"> <img src="/img/34.jpg" alt="Bishop and Sister at St. Paul's Mission Hospital" class="absolute inset-0 w-full h-full object-cover object-[center_top] brightness-[0.5]" loading="eager" fetchpriority="high"> <div class="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary/20 to-transparent"></div> </div> <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pb-16 pt-32 w-full"> <div class="grid lg:grid-cols-12 gap-8 items-end"> <div class="lg:col-span-7"> <p class="text-primary-light text-xs tracking-[0.22em] uppercase font-semibold mb-5 flex items-center gap-3"> <span class="w-8 h-px bg-primary-light inline-block"></span>
Support Our Mission
</p> <h1 class="font-display text-white text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.0]">
Give with<br> <span class="font-semibold italic text-primary-light">purpose.</span> </h1> </div> <div class="lg:col-span-5 pb-1"> <div class="border-l-2 border-white/20 pl-6"> <p class="text-white/70 text-base lg:text-lg font-display italic font-normal leading-relaxed">
"Each of you should give what you have decided in your heart to give — not reluctantly or under compulsion, for God loves a cheerful giver."
</p> <p class="text-white/35 text-[0.62rem] tracking-[0.18em] uppercase font-semibold mt-3">
2 Corinthians 9:7
</p> </div> </div> </div> </div> </header>  <section class="bg-surface py-20 lg:py-24"> <div class="max-w-7xl mx-auto px- lg:px-16"> <div class="max-w-xl mx-auto text-center mb-14"> <h2 class="font-display text-secondary text-3xl sm:text-4xl font-normal leading-snug">
Where every gift<br> <span class="font-semibold text-primary">goes directly.</span> </h2> </div> <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"> ${impacts.map((item) => renderTemplate`<div class="group bg-white border border-border/60
                      hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
                      transition-all duration-300 hover:-translate-y-0.5 p-7"> <div class="size-11 bg-surface-2 flex items-center justify-center mb-5
                        group-hover:bg-primary transition-all duration-300"> <svg class="size-5 text-primary group-hover:text-white transition-colors duration-300"${addAttribute(item.fill ? "currentColor" : "none", "fill")}${addAttribute(item.fill ? "none" : "currentColor", "stroke")} stroke-width="1.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(item.icon, "d")}></path> </svg> </div> <h3 class="text-secondary font-semibold text-sm leading-snug mb-2
                       group-hover:text-primary transition-colors duration-200"> ${item.title} </h3> <p class="text-muted text-xs leading-relaxed">${item.desc}</p> </div>`)} </div> </div> </section>  <section class="bg-white border-t border-border/60 py-20 lg:py-24"> <div class="max-w-7xl mx-auto px-2 md:px-4 lg:px-16"> <div class="max-w-xl mx-auto text-center mb-14"> <h2 class="font-display text-secondary text-3xl sm:text-4xl font-normal leading-snug"> <span class="font-semibold text-primary">How to give.</span> </h2> </div> <div class="grid lg:grid-cols-2 gap-8"> <!-- M-PESA --> <div class="bg-surface border border-border/60 p-4 md:p-8 flex flex-col gap-7"> <!-- Header --> <div class="flex items-start justify-between"> <div> <span class="text-[0.6rem] font-bold tracking-[0.18em] uppercase
                           bg-[#00b300]/10 text-[#00b300] border border-[#00b300]/20
                           px-2.5 py-1 inline-block mb-3">
Recommended · Fastest
</span> <h3 class="font-display text-secondary text-2xl font-semibold">M-Pesa</h3> <p class="text-muted text-xs mt-1">Buy Goods & Services</p> </div> <!-- Till number callout --> <div class="text-right"> <p class="text-muted/50 text-[0.58rem] tracking-widest uppercase">Till Number</p> <p class="font-display text-secondary text-2xl md:text-4xl font-bold leading-none mt-1"> ${MPESA_TILL} </p> <p class="text-muted text-[0.62rem] mt-1">${MPESA_NAME}</p> </div> </div> <!-- Divider --> <div class="h-px bg-border/60"></div> <!-- Steps --> <div> <p class="text-secondary text-xs font-bold tracking-[0.14em] uppercase mb-4">
Step by step:
</p> <ol class="space-y-3"> ${mpesaSteps.map((step, i) => renderTemplate`<li class="flex items-start gap-3"> <span class="size-5 rounded-full bg-[#00b300]/10 border border-[#00b300]/20
                               text-[#00b300] text-[0.6rem] font-bold flex items-center
                               justify-center shrink-0 mt-0.5"> ${i + 1} </span> <p class="text-muted text-sm leading-relaxed">${unescapeHTML(step)}</p> </li>`)} </ol> </div> <!-- WhatsApp confirmation nudge --> <div class="flex items-start gap-3 bg-white border border-border/60 px-4 py-3.5 mt-auto"> <svg class="size-4 text-[#25D366] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"> <path d="M11.99 2C6.477 2 2 6.477 2 12c0 1.99.578 3.844 1.576 5.403L2 22l4.757-1.547A9.958 9.958 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.99 2z"></path> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path> </svg> <p class="text-muted text-xs leading-relaxed">
Once you've sent your gift, tap the <span class="text-[#25D366] font-semibold">WhatsApp button</span> at the bottom-right of your screen to let us know — so we can acknowledge your generosity.
</p> </div> </div> <!-- BANK TRANSFER --> <div class="bg-surface border border-border/60 p-4 md:p-8 flex flex-col gap-7"> <!-- Header --> <div> <span class="text-[0.6rem] font-bold tracking-[0.18em] uppercase
                         bg-primary/10 text-primary border border-primary/20
                         px-2.5 py-1 inline-block mb-3">
For larger gifts · Institutional donors
</span> <h3 class="font-display text-secondary text-2xl font-semibold">Bank Transfer</h3> <p class="text-muted text-xs mt-1">EFT · Direct deposit · Cheque</p> </div> <!-- Divider --> <div class="h-px bg-border/60"></div> <!-- Bank details --> <div class="grid gap-4"> ${[
    { label: "Bank", value: BANK_NAME },
    { label: "Branch", value: BANK_BRANCH },
    { label: "Account name", value: BANK_ACCT_NAME },
    { label: "Account number", value: BANK_ACCOUNT },
    { label: "Swift code", value: BANK_SWIFT }
  ].map((row) => renderTemplate`<div class="flex items-start justify-between gap-4 py-3 border-b border-border/50 last:border-0"> <p class="text-muted/60 text-[0.62rem] tracking-widest uppercase shrink-0"> ${row.label} </p> <p class="text-secondary text-sm font-semibold text-right">${row.value}</p> </div>`)} </div> <!-- Reference note --> <div class="bg-white border border-border/60 px-4 py-3.5 mt-auto"> <p class="text-muted text-xs leading-relaxed"> <span class="text-secondary font-semibold">Please use your name as the payment reference</span> so we can identify your gift and send acknowledgement. For large or restricted donations, please contact us before transferring.
</p> </div> </div> </div> </div> </section>  <section class="bg-secondary py-14"> <!-- Subtle cross watermark --> <div class="absolute right-12 top-1/2 -translate-y-1/2 size-48 opacity-[0.05] pointer-events-none hidden lg:block"> <div class="absolute left-1/2 top-0 -translate-x-1/2 w-7 h-full bg-white rounded-sm"></div> <div class="absolute top-1/2 left-0 -translate-y-1/2 h-7 w-full bg-white rounded-sm"></div> </div> <div class="relative max-w-7xl mx-auto px-6 lg:px-16"> <div class="grid lg:grid-cols-2 gap-10 items-center"> <div> <p class="text-white/40 text-[0.62rem] tracking-[0.22em] uppercase font-semibold mb-4">
Your donation is safe
</p> <p class="font-display text-white text-xl lg:text-2xl italic font-normal leading-relaxed">
St. Paul's Mission Hospital is a registered non-profit faith-based organisation operating under the Catholic Diocese of Homa Bay. All donations are used solely for patient care and hospital development.
</p> </div> <div class="grid grid-cols-2 gap-4"> ${[
    { label: "Status", value: "Registered FBO\nNon-Profit" },
    { label: "Governance", value: "Catholic Diocese\nof Homa Bay" },
    { label: "Accreditation", value: "SHA Accredited\nLevel 4 Facility" },
    { label: "Affiliation", value: "KEC\u2013Catholic\nHealth Commission" }
  ].map((c) => renderTemplate`<div class="bg-white/5 border border-white/10 p-5"> <p class="text-white/35 text-[0.58rem] tracking-widest uppercase mb-1.5">${c.label}</p> <p class="text-white text-[0.72rem] font-bold uppercase leading-snug whitespace-pre-line"> ${c.value} </p> </div>`)} </div> </div> </div> </section> ` })}`;
}, "E:/PROJECT/SPMH/src/pages/get-involved/donate.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/get-involved/donate.astro";
const $$url = "/get-involved/donate";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Donate,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
