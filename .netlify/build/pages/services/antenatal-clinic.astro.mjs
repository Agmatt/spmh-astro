import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DbIzBR6F.mjs';
/* empty css                                               */
export { renderers } from '../../renderers.mjs';

const $$AntenatalClinic = createComponent(($$result, $$props, $$slots) => {
  const visits = [
    {
      number: "1st Visit",
      weeks: "Before 16 Weeks",
      color: "bg-primary",
      items: [
        "Full medical history and physical examination",
        "Blood pressure, weight & height measurement",
        "Blood tests \u2014 Hb, blood group & Rhesus factor",
        "Urinalysis for protein, glucose, and infection",
        "HIV, Syphilis & Hepatitis B testing",
        "Nutrition counselling and danger sign education"
      ]
    },
    {
      number: "2nd Visit",
      weeks: "20 \u2013 24 Weeks",
      color: "bg-secondary",
      items: [
        "Fundal height measurement",
        "Foetal heartbeat check",
        "Iron and folate supplement review",
        "Screening for infections",
        "Foetal movement awareness education",
        "Birth preparedness discussion begins"
      ]
    },
    {
      number: "3rd Visit",
      weeks: "28 \u2013 32 Weeks",
      color: "bg-primary",
      items: [
        "Blood pressure monitoring",
        "Foetal movement assessment",
        "Weight tracking and nutritional review",
        "Discussion on birth preparedness",
        "Danger signs review",
        "Supplement compliance check"
      ]
    },
    {
      number: "4th Visit",
      weeks: "36 Weeks and beyond",
      color: "bg-secondary",
      items: [
        "Final pregnancy review",
        "Delivery plan confirmation",
        "Postnatal care counselling",
        "Breastfeeding preparation",
        "Emergency contacts and referral plan",
        "Newborn care education"
      ]
    }
  ];
  const examItems = [
    { label: "Blood Pressure", desc: "Initial check for hypertension or preeclampsia." },
    { label: "Pulse Rate", desc: "Assesses maternal heart rate and circulatory status." },
    { label: "Respiratory Rate", desc: "Identifies breathing difficulties or infections." },
    { label: "Temperature", desc: "Detects fever or signs of infection." },
    { label: "Weight & Height", desc: "Used to calculate BMI for nutritional assessment." },
    { label: "Breast Examination", desc: "Checks for abnormalities and prepares for breastfeeding." },
    { label: "Abdominal Examination", desc: "Determines uterine size and foetal growth." },
    { label: "External Genitalia", desc: "Inspected for lesions, discharge, or signs of infection." },
    { label: "General Appearance", desc: "Notes pallor, oedema, or jaundice." }
  ];
  const labTests = [
    { label: "Haemoglobin (Hb)", desc: "Detects anaemia and assesses blood health." },
    { label: "Blood Group & Rhesus Factor", desc: "Identifies risk of Rh incompatibility." },
    { label: "Urinalysis", desc: "Screens for protein, glucose, and infection." },
    { label: "Random Blood Sugar (RBS)", desc: "Detects gestational diabetes." },
    { label: "TB Screening", desc: "Early detection of tuberculosis in pregnancy." },
    { label: "Isoniazid Preventive Therapy (IPT)", desc: "Given to prevent TB infection progression." },
    { label: "Obstetric Ultrasound", desc: "Confirms gestational age and foetal well-being." },
    { label: "HIV, Syphilis & Hepatitis B", desc: "Essential for preventing mother-to-child transmission." },
    { label: "Couple HIV Counselling & Testing", desc: "Promotes shared prevention and care." },
    { label: "Vaccination Review", desc: "Ensures tetanus and relevant immunisations are up to date." }
  ];
  const tableColumns = [
    "No.",
    "Date",
    "Urine",
    "MUAC (cm)",
    "BP",
    "Hb",
    "Pallor",
    "Gestation (wks)",
    "Fundal Height",
    "Presentation",
    "Lie",
    "Foetal Heart Rate",
    "Foetal Movement",
    "Next Visit"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Antenatal Clinic \u2014 St. Paul's Mission Hospital", "data-astro-cid-fmzea4k6": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<header class="relative min-h-[52vh] flex items-end overflow-hidden" data-astro-cid-fmzea4k6> <div class="absolute inset-0 z-0" data-astro-cid-fmzea4k6> <img src="/img/14.jpg" alt="Antenatal care at St. Paul's Mission Hospital" class="absolute inset-0 w-full h-full object-cover object-center brightness-[0.45]" loading="la" fetchpriority="high" data-astro-cid-fmzea4k6> <div class="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary/20 to-transparent" data-astro-cid-fmzea4k6></div> </div> <div class="relative z-10 max-w-7xl mx-auto px-2 md:px-4 lg:px-16 pb-14 pt-28 w-full" data-astro-cid-fmzea4k6> <div class="grid lg:grid-cols-12 gap-8 items-end" data-astro-cid-fmzea4k6> <div class="lg:col-span-7" data-astro-cid-fmzea4k6> <p class="text-primary-light text-xs tracking-[0.22em] uppercase font-semibold mb-5 flex items-center gap-3" data-astro-cid-fmzea4k6> <span class="w-8 h-px bg-primary-light inline-block" data-astro-cid-fmzea4k6></span>
Maternal & Neonatal Care
</p> <h1 class="font-display text-white text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.0]" data-astro-cid-fmzea4k6>
Antenatal<br data-astro-cid-fmzea4k6> <span class="font-semibold italic text-primary-light" data-astro-cid-fmzea4k6>Clinic (ANC)</span> </h1> </div> <div class="lg:col-span-5 pb-1" data-astro-cid-fmzea4k6> <div class="border-l-2 border-white/20 pl-6" data-astro-cid-fmzea4k6> <p class="text-white/65 text-base font-display italic leading-relaxed" data-astro-cid-fmzea4k6>
Safe, supported care from your very first visit through to delivery — for you and your baby.
</p> </div> </div> </div> </div> </header>  <div class="bg-surface border-b border-border/60" data-aos="fade-up" data-astro-cid-fmzea4k6> <div class="max-w-7xl mx-auto px-6 lg:px-16 py-8" data-astro-cid-fmzea4k6> <div class="grid lg:grid-cols-3 gap-8 items-center" data-astro-cid-fmzea4k6> <div class="lg:col-span-2" data-astro-cid-fmzea4k6> <p class="text-muted text-sm leading-relaxed" data-astro-cid-fmzea4k6>
The Antenatal Clinic (ANC) at St. Paul's provides essential care and monitoring during pregnancy to ensure the health of both mother and baby. At each visit you will receive a comprehensive check-up, health education, and personalised guidance from our clinical team to help you enjoy a safe and healthy pregnancy.
</p> </div> <div data-astro-cid-fmzea4k6> <a href="/services/appointments" class="group inline-flex items-center justify-center gap-2.5 w-full
                    bg-primary hover:bg-primary-dark text-white
                    font-bold text-xs tracking-[0.12em] uppercase px-6 py-3.5
                    transition-all duration-200 hover:-translate-y-0.5" data-astro-cid-fmzea4k6> <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-astro-cid-fmzea4k6> <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-fmzea4k6></path> </svg>
Book an ANC Visit
<svg class="size-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-astro-cid-fmzea4k6> <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" data-astro-cid-fmzea4k6></path> </svg> </a> </div> </div> </div> </div> <div class="max-w-7xl mx-auto px-4 lg:px-16 py-16 lg:py-20 space-y-20 bg-gray-200" data-astro-cid-fmzea4k6> <!--  SECTION 1 — VISIT SCHEDULE (tabbed) --> <section data-aos="fade-left" data-astro-cid-fmzea4k6> <div class="mb-10 text-center px-2 md:px-4" data-astro-cid-fmzea4k6> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3 gap-3" data-astro-cid-fmzea4k6>
Your Visit Schedule
</p> <h2 class="font-display text-secondary text-3xl sm:text-4xl font-normal leading-snug" data-astro-cid-fmzea4k6>
What to expect<br data-astro-cid-fmzea4k6> <span class="font-semibold italic text-primary" data-astro-cid-fmzea4k6>at each visit.</span> </h2> </div> <div x-data="{ active: 0 }" class="border border-border/60" data-astro-cid-fmzea4k6> <!-- Tab nav --> <div class="grid grid-cols-2 sm:grid-cols-4 border-b border-border/60" data-astro-cid-fmzea4k6> ${visits.map((v, i) => renderTemplate`<button${addAttribute(`active = ${i}`, "@click")}${addAttribute(`active === ${i}
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-muted hover:text-secondary hover:bg-surface border-transparent'`, ":class")} class="relative flex flex-col items-start gap-1 px-5 py-4
                     border-b-2 sm:border-b-0 sm:border-r last:border-r-0
                     border-border/40 transition-all duration-200
                     focus:outline-none text-left" data-astro-cid-fmzea4k6> <span${addAttribute(`active === ${i} ? 'text-white/60' : 'text-muted/50'`, ":class")} class="text-[0.58rem] font-bold tracking-[0.2em] uppercase transition-colors duration-200" data-astro-cid-fmzea4k6> ${v.number} </span> <span${addAttribute(`active === ${i} ? 'text-white' : 'text-secondary'`, ":class")} class="font-semibold text-xs leading-snug transition-colors duration-200" data-astro-cid-fmzea4k6> ${v.weeks} </span> <!-- Active indicator bar --> <span${addAttribute(`active === ${i}`, "x-show")} class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-light sm:bottom-auto sm:top-0 sm:h-0.5" x-cloak data-astro-cid-fmzea4k6></span> </button>`)} </div> <!-- Tab panels --> ${visits.map((v, i) => renderTemplate`<div${addAttribute(`active === ${i}`, "x-show")} x-transition:enter="transition duration-300 ease-out" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" class="grid lg:grid-cols-5" x-cloak data-astro-cid-fmzea4k6> <!-- Left accent panel --> <div${addAttribute(`${v.color} lg:col-span-2 px-8 py-10 flex flex-col justify-between gap-6`, "class")} data-astro-cid-fmzea4k6> <div data-astro-cid-fmzea4k6> <p class="text-white/50 text-[0.6rem] font-bold tracking-[0.22em] uppercase mb-2" data-astro-cid-fmzea4k6> ${v.number} </p> <h3 class="font-display text-white text-2xl font-semibold leading-snug mb-4" data-astro-cid-fmzea4k6> ${v.weeks} </h3> <p class="text-white/60 text-sm leading-relaxed" data-astro-cid-fmzea4k6>
Select a visit above to see what our clinical team will check and discuss with you at each stage of your pregnancy.
</p> </div> <!-- Visit progress dots --> <div class="flex gap-2 mt-2" data-astro-cid-fmzea4k6> ${visits.map((_, j) => renderTemplate`<button${addAttribute(`active = ${j}`, "@click")}${addAttribute(`active === ${j} ? 'w-8 bg-white' : 'w-3 bg-white/30 hover:bg-white/60'`, ":class")} class="h-1.5 rounded-full transition-all duration-300" data-astro-cid-fmzea4k6></button>`)} </div> </div> <!-- Right content --> <div class="lg:col-span-3 bg-white px-8 py-10" data-astro-cid-fmzea4k6> <p class="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-primary mb-5" data-astro-cid-fmzea4k6>
What happens at this visit
</p> <ul class="grid sm:grid-cols-2 gap-x-8 gap-y-3" data-astro-cid-fmzea4k6> ${v.items.map((item) => renderTemplate`<li class="flex items-start gap-3" data-astro-cid-fmzea4k6> <svg class="size-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-astro-cid-fmzea4k6> <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-astro-cid-fmzea4k6></path> </svg> <span class="text-muted text-sm leading-relaxed" data-astro-cid-fmzea4k6>${item}</span> </li>`)} </ul> <!-- Next visit nudge --> ${i < visits.length - 1 && renderTemplate`<div class="mt-8 pt-6 border-t border-border/50 flex items-center justify-between" data-astro-cid-fmzea4k6> <p class="text-muted/60 text-xs" data-astro-cid-fmzea4k6>
Next: <span class="text-secondary font-semibold" data-astro-cid-fmzea4k6>${visits[i + 1].number} — ${visits[i + 1].weeks}</span> </p> <button${addAttribute(`active = ${i + 1}`, "@click")} class="inline-flex items-center gap-2 text-primary text-xs font-bold
                           tracking-[0.1em] uppercase hover:gap-3 transition-all duration-200" data-astro-cid-fmzea4k6>
View next visit
<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-astro-cid-fmzea4k6> <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" data-astro-cid-fmzea4k6></path> </svg> </button> </div>`} </div> </div>`)} </div> </section> <!--  SECTION 2 — PHYSICAL EXAMINATION --> <section data-aos="fade-right" data-astro-cid-fmzea4k6> <div class="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start px-2 md:px-4" data-astro-cid-fmzea4k6> <div class="lg:col-span-4 lg:sticky lg:top-24" data-astro-cid-fmzea4k6> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3 flex items-center gap-3" data-astro-cid-fmzea4k6>
First Visit
</p> <h2 class="font-display text-secondary text-3xl font-normal leading-snug mb-4" data-astro-cid-fmzea4k6>
Physical<br data-astro-cid-fmzea4k6> <span class="font-semibold italic text-primary" data-astro-cid-fmzea4k6>Examination.</span> </h2> <p class="text-muted text-sm leading-relaxed" data-astro-cid-fmzea4k6>
During your first ANC visit, our clinical team will carry out a thorough physical examination to understand your baseline health and identify any conditions that need attention early in your pregnancy.
</p> </div> <div class="lg:col-span-8" data-astro-cid-fmzea4k6> <div class="grid sm:grid-cols-2 gap-3" data-astro-cid-fmzea4k6> ${examItems.map((item, i) => renderTemplate`<div class="flex items-start gap-4 p-4 bg-surface border border-border/60
                          hover:border-primary/30 hover:shadow-sm transition-all duration-200" data-astro-cid-fmzea4k6> <div class="size-7 bg-primary/10 flex items-center justify-center shrink-0 mt-0.5" data-astro-cid-fmzea4k6> <span class="text-primary text-[0.6rem] font-bold" data-astro-cid-fmzea4k6>${String(i + 1).padStart(2, "0")}</span> </div> <div data-astro-cid-fmzea4k6> <p class="text-secondary font-semibold text-sm mb-0.5" data-astro-cid-fmzea4k6>${item.label}</p> <p class="text-muted text-xs leading-relaxed" data-astro-cid-fmzea4k6>${item.desc}</p> </div> </div>`)} </div> </div> </div> </section> <!--  SECTION 3 — LAB TESTS --> <section data-aos="fade-up" data-astro-cid-fmzea4k6> <div class="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start px-2 md:px-4" data-astro-cid-fmzea4k6> <div class="lg:col-span-8 lg:order-1" data-astro-cid-fmzea4k6> <div class="grid sm:grid-cols-2 gap-3" data-astro-cid-fmzea4k6> ${labTests.map((test) => renderTemplate`<div class="flex items-start gap-3 p-4 bg-white border border-border/60
                          hover:border-primary/30 hover:shadow-sm transition-all duration-200" data-astro-cid-fmzea4k6> <svg class="size-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-astro-cid-fmzea4k6> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fmzea4k6></path> </svg> <div data-astro-cid-fmzea4k6> <p class="text-secondary font-semibold text-sm mb-0.5" data-astro-cid-fmzea4k6>${test.label}</p> <p class="text-muted text-xs leading-relaxed" data-astro-cid-fmzea4k6>${test.desc}</p> </div> </div>`)} </div> </div> <div class="lg:col-span-4 lg:order-2 lg:sticky lg:top-24" data-astro-cid-fmzea4k6> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3 flex items-center gap-3" data-astro-cid-fmzea4k6>
Laboratory Tests
</p> <h2 class="font-display text-secondary text-3xl font-normal leading-snug mb-4" data-astro-cid-fmzea4k6>
Antenatal Profile<br data-astro-cid-fmzea4k6> <span class="font-semibold italic text-primary" data-astro-cid-fmzea4k6>& Investigations.</span> </h2> <p class="text-muted text-sm leading-relaxed mb-6" data-astro-cid-fmzea4k6>
These investigations help our team identify any risks early and ensure both you and your baby receive the right care throughout your pregnancy.
</p> <!-- Reassurance note --> <div class="bg-primary/5 border border-primary/15 p-5" data-astro-cid-fmzea4k6> <p class="text-primary font-semibold text-xs mb-1" data-astro-cid-fmzea4k6>A note on privacy</p> <p class="text-muted text-xs leading-relaxed" data-astro-cid-fmzea4k6>
All tests including HIV and STI screening are conducted with full confidentiality and your informed consent. You may ask questions at any point.
</p> </div> </div> </div> </section> <!--  SECTION 4 — TRACKING TABLE (PRINTABLE) --> <section id="anc-table bg-surface" data-aos="fade-down" data-astro-cid-fmzea4k6> <div class="mb-8 px-2 md:px-4 text-center" data-astro-cid-fmzea4k6> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3 gap-3" data-astro-cid-fmzea4k6>
Visit Record
</p> <h2 class="font-display text-secondary text-3xl font-normal leading-snug" data-astro-cid-fmzea4k6>
Pregnancy Tracking<br data-astro-cid-fmzea4k6> <span class="font-semibold italic text-primary" data-astro-cid-fmzea4k6>Table.</span> </h2> </div> <p class="text-muted text-xs leading-relaxed mb-6 mx-auto text-center" data-astro-cid-fmzea4k6>
This table is completed by your clinical team at each visit and forms part of your ongoing pregnancy record.
</p> <div class="overflow-x-auto border border-border/60" data-astro-cid-fmzea4k6> <table class="min-w-full text-xs text-secondary" data-astro-cid-fmzea4k6> <thead data-astro-cid-fmzea4k6> <tr class="bg-secondary text-white" data-astro-cid-fmzea4k6> ${tableColumns.map((col) => renderTemplate`<th class="py-3 px-3 text-left font-semibold whitespace-nowrap tracking-wide text-[0.62rem] uppercase" data-astro-cid-fmzea4k6> ${col} </th>`)} </tr> </thead> <tbody class="divide-y divide-border/40" data-astro-cid-fmzea4k6> ${Array.from({ length: 8 }).map((_, i) => renderTemplate`<tr class="hover:bg-surface/60 transition-colors duration-100" data-astro-cid-fmzea4k6> <td class="py-3.5 px-3 text-muted/60 font-mono text-[0.6rem]" data-astro-cid-fmzea4k6> ${String(i + 1).padStart(2, "0")} </td> ${Array.from({ length: tableColumns.length - 1 }).map(() => renderTemplate`<td class="py-3.5 px-3 border-r border-border/30 last:border-r-0" data-astro-cid-fmzea4k6> <div class="h-4 w-full border-b border-dashed border-border/50" data-astro-cid-fmzea4k6></div> </td>`)} </tr>`)} </tbody> </table> </div> <p class="text-muted/40 text-[0.6rem] tracking-wide uppercase mt-3 text-right" data-astro-cid-fmzea4k6>
8 contact rows
</p> </section> </div> ` })} `;
}, "E:/PROJECT/SPMH/src/pages/services/antenatal-clinic.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/services/antenatal-clinic.astro";
const $$url = "/services/antenatal-clinic";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AntenatalClinic,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
