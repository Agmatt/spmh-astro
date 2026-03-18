import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DbIzBR6F.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const channels = [
    {
      id: "volunteer",
      title: "Volunteer",
      path: "/get-involved/volunteer",
      cta: "Register your interest",
      badge: "Open now",
      badgeCls: "bg-primary/10 text-primary border border-primary/20",
      desc: "If you feel called to serve \u2014 whether as a healthcare professional, a student, or simply someone with time and willingness \u2014 there is a place for you here. Volunteers support patient care, community outreach, and health education across Homa Bay County.",
      points: [
        "Clinical & non-clinical roles",
        "Short-term and long-term placements",
        "Open to individuals and groups"
      ],
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      accent: "text-primary",
      border: "hover:border-primary/40",
      ctaStyle: "bg-primary text-white hover:bg-primary-dark"
    },
    {
      id: "donate",
      title: "Donate",
      path: "/get-involved/donate",
      cta: "Support our mission",
      badge: "Every gift counts",
      badgeCls: "bg-accent/10 text-accent border border-accent/20",
      desc: "St. Paul's Mission Hospital has served Homa Bay's most vulnerable families since 1983 \u2014 often regardless of ability to pay. Your donation directly supports patient care, medical equipment, and our new Maternity & Surgical Wing development.",
      points: [
        "Supports underprivileged patient care",
        "Contributes to the new Maternity Wing",
        "Helps fund the Newborn Unit & HDU"
      ],
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      accent: "text-accent",
      border: "hover:border-accent/40",
      ctaStyle: "bg-accent text-white hover:bg-accent-dark"
    },
    {
      id: "careers",
      title: "Careers",
      path: "/get-involved/careers",
      cta: "Explore opportunities",
      badge: "We're hiring",
      badgeCls: "bg-secondary/10 text-secondary border border-secondary/20",
      desc: "Join a team of dedicated clinicians, nurses, and support staff committed to dignified healthcare in Homa Bay. We are a growing Level 4 facility on the path to Level 5 \u2014 offering meaningful work in a values-driven, faith-based environment.",
      points: [
        "Clinical and administrative roles",
        "Professional growth & training",
        "Contact HR directly to apply"
      ],
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      accent: "text-secondary",
      border: "hover:border-secondary/40",
      ctaStyle: "bg-secondary text-white hover:bg-secondary-dark"
    },
    {
      id: "partner",
      title: "Partner",
      path: "/get-involved/partners",
      cta: "Start a conversation",
      badge: "Open to proposals",
      badgeCls: "bg-primary/10 text-primary border border-primary/20",
      desc: "We welcome partnerships with NGOs, faith-based organisations, government agencies, private sector companies, and academic institutions. Together, we can extend the reach of quality healthcare across Homa Bay County and beyond.",
      points: [
        "Health programme co-development",
        "Equipment & infrastructure support",
        "Research and training collaboration"
      ],
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
      accent: "text-primary",
      border: "hover:border-primary/40",
      ctaStyle: "bg-primary text-white hover:bg-primary-dark"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Get Involved \u2014 St. Paul's Mission Hospital" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<header class="relative min-h-[70vh] flex items-end overflow-hidden"> <!-- Background image --> <div class="absolute inset-0 z-0"> <img src="/img/54.jpg" alt="St. Paul's Mission Hospital — Get Involved" class="absolute inset-0 w-full h-full object-cover object-center brightness-[0.3]" loading="lazy" fetchpriority="high"> <!-- Gradient: stronger at bottom so text sits on it cleanly --> <div class="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary/40 to-transparent"></div> </div> <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pb-16 pt-32 w-full"> <div class="grid lg:grid-cols-12 gap-8 items-end"> <!-- Left: headline --> <div class="lg:col-span-7"> <h1 class="font-display text-white text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.0] mb-0">
Be part of<br> <span class="font-semibold italic text-primary-light">the mission.</span> </h1> </div> <!-- Right: pull quote --> <div class="lg:col-span-5 pb-1"> <div class="border-l-2 border-white/20 pl-6"> <p class="font-display text-white/75 text-lg lg:text-xl italic font-normal leading-relaxed">
"Partners, caregivers, and communities — walking together toward healing, hope, and holistic impact."
</p> <p class="text-white/35 text-[0.62rem] tracking-[0.18em] uppercase font-semibold mt-3">
Strategic Plan 2026–2030
</p> </div> </div> </div> </div> </header>  <div class="bg-secondary border-b border-white/10"> <div class="max-w-7xl mx-auto px-6 lg:px-16 py-8
                flex flex-col sm:flex-row sm:items-center justify-between gap-4"> <p class="text-white/60 text-sm leading-relaxed max-w-2xl">
St. Paul's Mission Hospital has served Homa Bay County since 1983. Whether you give your time, your skills, your resources, or your voice — every contribution strengthens the care we can offer to the families who need it most.
</p> <div class="flex items-center gap-2 shrink-0"> <span class="relative flex size-2"> <span class="absolute inline-flex size-full rounded-full bg-primary-light/70"></span> <span class="relative inline-flex size-2 rounded-full bg-primary-light"></span> </span> <span class="text-white/50 text-xs tracking-[0.16em] uppercase font-semibold">
Faith-based · Not-for-profit · Est. 1983
</span> </div> </div> </div>  <section class="bg-surface py-20 lg:py-28"> <div class="max-w-7xl mx-auto px-4 lg:px-10"> <!-- Section header --> <div class="max-w-xl mb-14 mx-auto text-center"> <p class="text-primary text-center text-xs tracking-[0.22em] uppercase font-semibold mb-4">
Ways to contribute
</p> <h2 class="font-display text-secondary text-3xl sm:text-4xl font-normal leading-snug">
Find the role<br> <span class="font-semibold text-primary">that fits you.</span> </h2> </div> <!-- Cards grid --> <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"> ${channels.map((ch, i) => renderTemplate`<div${addAttribute(`group bg-white border border-border/60 ${ch.border}
                       hover:shadow-xl hover:shadow-secondary/8
                       transition-all duration-300 hover:-translate-y-1
                       flex flex-col`, "class")}> <!-- Card top --> <div class="p-7 flex-1 flex flex-col gap-5"> <!-- Number + icon row --> <div class="flex items-start justify-between"> <div${addAttribute(`size-12 bg-surface-2 flex items-center justify-center
                             group-hover:bg-secondary transition-all duration-300`, "class")}> <svg${addAttribute(`size-5 ${ch.accent} group-hover:text-white transition-colors duration-300`, "class")} fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(ch.icon, "d")}></path> </svg> </div> <span${addAttribute(`text-[0.58rem] font-bold tracking-[0.14em] uppercase px-2 py-1 ${ch.badgeCls}`, "class")}> ${ch.badge} </span> </div> <!-- Title --> <div> <h3${addAttribute(`font-display text-2xl font-semibold text-secondary
                            group-hover:${ch.accent.replace("text-", "text-")}
                            transition-colors duration-200 mb-3`, "class")}> ${ch.title} </h3> <p class="text-muted text-sm leading-relaxed"> ${ch.desc} </p> </div> <!-- Bullet points --> <ul class="space-y-2 mt-auto"> ${ch.points.map((pt) => renderTemplate`<li class="flex items-start gap-2.5"> <svg${addAttribute(`size-3.5 ${ch.accent} shrink-0 mt-0.5`, "class")} fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path> </svg> <span class="text-muted text-xs leading-relaxed">${pt}</span> </li>`)} </ul> </div> <!-- Card CTA --> <div class="px-7 pb-7"> <a${addAttribute(ch.path, "href")}${addAttribute(`group/btn w-full inline-flex items-center justify-center gap-2.5
                        text-xs font-bold tracking-[0.12em] uppercase px-5 py-3.5
                        transition-all duration-200 hover:-translate-y-0.5
                        hover:shadow-md ${ch.ctaStyle}`, "class")}> ${ch.cta} <svg class="size-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> </div> </div>`)} </div> </div> </section>  <section class="bg-secondary py-16 relative overflow-hidden"> <div class="relative max-w-7xl mx-auto px-4 lg:px-10"> <div class="grid lg:grid-cols-2 gap-10 items-center"> <div> <p class="text-white/40 text-[0.62rem] tracking-[0.22em] uppercase font-semibold mb-4">
Our founding charism
</p> <p class="font-display text-white text-2xl lg:text-3xl italic font-normal leading-relaxed">
"To heal, to serve, and to uphold human dignity by placing Christ at the centre of all that we do."
</p> <p class="text-white/35 text-[0.62rem] tracking-[0.16em] uppercase font-semibold mt-4">
Strategic Plan 2026–2030 · St. Paul's Mission Hospital
</p> </div> <div class="grid grid-cols-2 gap-4"> ${[
    { stat: "1983", label: "Year founded" },
    { stat: "L4\u21925", label: "Facility upgrade by 2030" },
    { stat: "9+", label: "Departments & specialities" },
    { stat: "24/7", label: "Emergency care" }
  ].map((s) => renderTemplate`<div class="bg-white/5 border border-white/10 p-5"> <div class="font-display text-white text-3xl font-bold leading-none mb-1"> ${s.stat} </div> <div class="text-white/45 text-xs leading-snug">${s.label}</div> </div>`)} </div> </div> </div> </section>  <section class="bg-white border-t border-border/60 py-16"> <div class="max-w-7xl mx-auto px-6 lg:px-16"> <div class="grid lg:grid-cols-12 gap-10 items-start"> <!-- Left: governance note --> <div class="lg:col-span-5"> <div class="flex items-center gap-2.5 mb-4"> <div class="size-1.5 rounded-full bg-primary"></div> <span class="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-secondary">
Institutional Governance
</span> </div> <p class="text-muted text-sm leading-relaxed">
St. Paul's Mission Hospital operates under the governed framework of the
<span class="text-secondary font-semibold">Catholic Diocese of Homa Bay</span>.
            All involvement — clinical, financial, or voluntary — is aligned with our
            Ethics and Clinical Governance Committee, ensuring the highest standard
            of patient care and organisational integrity.
</p> </div> <!-- Right: credentials grid --> <div class="lg:col-span-7 lg:pl-10 lg:border-l border-border/60
                    grid grid-cols-2 sm:grid-cols-3 gap-6"> ${[
    { label: "Accreditation", value: "SHA Accredited\nFacility" },
    { label: "Status", value: "Registered FBO\nNon-Profit" },
    { label: "Authority", value: "KMPDC\nCertified" },
    { label: "Affiliation", value: "KEC\u2013Catholic\nHealth Commission" },
    { label: "Data Privacy", value: "KDPA\nCompliant" },
    { label: "Transparency", value: "Open Governance\nFramework" }
  ].map((c) => renderTemplate`<div class="space-y-1.5"> <span class="text-[0.58rem] font-bold uppercase tracking-widest text-muted/60 block"> ${c.label} </span> <p class="text-[0.72rem] font-bold text-secondary uppercase leading-snug whitespace-pre-line"> ${c.value} </p> </div>`)} </div> </div> </div> </section> ` })}`;
}, "E:/PROJECT/SPMH/src/pages/get-involved/index.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/get-involved/index.astro";
const $$url = "/get-involved";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
