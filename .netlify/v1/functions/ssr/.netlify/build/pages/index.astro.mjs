import { c as createComponent, e as createAstro, m as maybeRenderHead, a as renderTemplate, d as addAttribute, b as renderScript, r as renderComponent } from '../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DbIzBR6F.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import 'clsx';
export { renderers } from '../renderers.mjs';

const slides = [
  {
    img: "/img/6.jpg",
    title: "Compassionate Care for Your Family",
    text: "Our dedicated team of healthcare professionals is here to provide the highest standard of care, ensuring your well-being is our top priority."
  },
  {
    img: "/img/10.jpg",
    title: "Our Mission",
    text: "Promoting health and well-being through preventive, promotive, and curative services, guided by our Catholic values."
  },
  {
    img: "/img/2.jpg",
    title: "Emergency Services, 24/7",
    text: "Our emergency department is staffed around the clock to provide immediate and life-saving care when you need it most."
  }
];
function Carousel() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7e3);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "relative w-full h-[85vh] bg-slate-900 overflow-hidden", children: [
    slides.map((slide, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `absolute inset-0 transition-transform duration-[1500ms] ease-in-out ${current === i ? "opacity-100 scale-100" : "opacity-0 scale-110"}`,
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: slide.img,
              alt: slide.title,
              className: "absolute inset-0 w-full h-full object-cover grayscale-[30%] brightness-[0.5]",
              loading: i === 0 ? "eager" : "lazy",
              fetchPriority: i === 0 ? "high" : "low"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex flex-col justify-center px-4 md:px-6 lg:px-32", children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: `transition-all duration-1000 delay-300 transform ${current === i ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-500 font-mono text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block", children: slide.label }),
                /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] max-w-4xl mb-6", children: slide.title.split(" ").map(
                  (word, index) => index === 2 ? /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "text-slate-400 italic font-serif lowercase md:uppercase md:not-italic font-light",
                      children: [
                        word,
                        " "
                      ]
                    },
                    index
                  ) : word + " "
                ) }),
                /* @__PURE__ */ jsx("p", { className: "text-white text-lg md:text-xl font-light max-w-xl leading-relaxed border-l border-white pl-6", children: slide.text })
              ]
            }
          ) })
        ]
      },
      i
    )),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 right-10 flex items-center space-x-4 z-20", children: slides.map((_, i) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setCurrent(i),
        className: "group py-4 focus:outline-none",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-[2px] transition-all duration-500 ${current === i ? "w-12 bg-blue-600" : "w-6 bg-white/30 group-hover:bg-white/60"}`
          }
        )
      },
      i
    )) })
  ] });
}

const $$Astro$1 = createAstro();
const $$IntroBand = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$IntroBand;
  return renderTemplate`${maybeRenderHead()}<div class="bg-white pt-8 pb-0"> <div class="max-w-7xl mx-auto px-2 md:px-4 lg:px-16"> <!-- Main intro: asymmetric two-col --> <div class="grid lg:grid-cols-12 gap-8 items-end pb-14 border-b border-border/60"> <!-- Left: big type — spans 7 --> <div class="lg:col-span-7"> <h1 class="font-display text-secondary font-normal leading-[1.06]
                   text-4xl sm:text-5xl lg:text-6xl xl:text-[4.2rem]">
St. Paul's<br>
Mission Hospital
</h1> <p class="font-display italic text-primary text-xl lg:text-2xl font-normal mt-3 leading-snug">
Four decades of compassionate care.
</p> </div> <!-- Right: descriptor + emergency — spans 5 --> <div class="lg:col-span-5 flex flex-col gap-6"> <p class="text-muted text-[0.95rem] leading-relaxed">
A trusted community hospital offering emergency care, surgery,
          maternity services, outpatient clinics, and more.
</p> <!-- Emergency strip --> <a href="#" class="group flex items-center gap-4 bg-accent/5 border border-accent/25 px-5 py-4
                  hover:bg-accent hover:border-accent transition-all duration-300"> <span class="relative flex size-3 shrink-0"> <span class="absolute inline-flex size-full rounded-full bg-accent/70 animate-ping"></span> <span class="relative inline-flex size-3 rounded-full bg-accent"></span> </span> <div class="flex-1"> <p class="text-accent group-hover:text-white text-sm font-semibold transition-colors duration-300">
Emergency Unit — Open 24 / 7
</p> <p class="text-accent/60 group-hover:text-white/70 text-xs transition-colors duration-300">
Walk in. No referral needed.
</p> </div> <svg class="size-4 text-accent/50 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> </div> </div> </div> </div>`;
}, "E:/PROJECT/SPMH/src/components/IntroBand.astro", void 0);

const $$AboutSection = createComponent(($$result, $$props, $$slots) => {
  const images = {
    // Large left: hospital exterior / building entrance feel
    exterior: "/img/15.jpg",
    // Top right: medical staff / team
    staff1: "/img/11.jpg"};
  return renderTemplate`${maybeRenderHead()}<section id="about" class="bg-white py-20 overflow-hidden"> <div class="max-w-7xl mx-auto px-2 md:px-4 lg:px-10"> <!-- Section eyebrow --> <div class="flex items-center gap-4 mb-10 reveal"> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold">
Who We Are
</p> <div class="h-px flex-1 max-w-[60px] bg-primary/30"></div> </div> <!-- ── Main editorial grid ── --> <div class="grid lg:grid-cols-12 gap-5 items-stretch"> <!-- LEFT: large exterior image — spans 7 cols --> <div class="lg:col-span-7 relative reveal"> <!-- Main image --> <div class="relative h-[420px] lg:h-[560px] overflow-hidden" data-aos="fade-right"> <img${addAttribute(images.exterior, "src")} alt="St. Paul's Mission Hospital — our facility" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy"> <!-- Subtle gradient overlay — bottom so text sits cleanly --> <div class="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/10 to-transparent"></div> </div> <!-- Founding year badge — overlaps image bottom-right corner --> </div> <!-- RIGHT: stacked staff images + text panel — spans 5 cols --> <div class="lg:col-span-5 flex flex-col gap-5"> <!-- Top staff image --> <div class="relative h-48 lg:h-56 overflow-hidden reveal" data-aos="fade-right"> <img${addAttribute(images.staff1, "src")} alt="St. Paul's medical team" class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105" loading="lazy"> <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div> <!-- Staff label badge --> <div class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 flex items-center gap-2"> <div class="size-2 rounded-full bg-primary"></div> <span class="text-secondary text-[0.65rem] tracking-[0.14em] uppercase font-semibold">
Our Team
</span> </div> </div> <!-- Text panel — the emotional core --> <div class="bg-surface border border-border/50 p-4 lg:p-8 flex flex-col justify-between flex-1 reveal" data-aos="fade-left"> <div> <h2 class="font-display text-secondary text-2xl lg:text-3xl font-normal leading-snug mb-4">
Built on faith.<br> </h2> <p class="text-muted text-sm leading-relaxed mb-5">
St. Paul's Mission Hospital has been part of this community since
              1983 — built not just as a medical facility, but as a place of
              genuine service. We started with a simple conviction: that every
              person deserves attentive, dignified care regardless of their
              circumstances.
</p> <p class="text-muted text-sm leading-relaxed">
Today, our dedicated team of doctors, nurses, and support staff
              carry that same conviction into every consultation, every ward
              round, and every family they walk alongside.
</p> </div> <!-- Bottom row: values pills --> <div class="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border/60" data-aos="fade-up"> ${[
    "Compassionate",
    "Dedicated",
    "Community-first",
    "Mission-driven"
  ].map((v) => renderTemplate`<span class="text-[0.65rem] tracking-[0.12em] uppercase font-semibold text-primary
                           bg-primary/8 border border-primary/15 px-3 py-1.5"> ${v} </span>`)} </div> </div> </div> </div> </div> </section>`;
}, "E:/PROJECT/SPMH/src/components/AboutSection.astro", void 0);

const $$Astro = createAstro();
const $$ServicesGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ServicesGrid;
  const services = [
    {
      title: "Outpatient & General Consultation",
      short: "OPD",
      desc: "For any new health concern, follow-up, or general medical advice.",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      fill: false,
      href: "/services/clinical#opd"
    },
    {
      title: "Emergency & Casualty",
      short: "24/7",
      desc: "Immediate care around the clock \u2014 no appointment needed.",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      fill: false,
      href: "/services/clinical#emergency",
      urgent: true
    },
    {
      title: "Maternal & Neonatal Care",
      short: "Maternity",
      desc: "Antenatal, delivery, postnatal, and newborn unit services.",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      fill: true,
      href: "/services/clinical#maternal"
    },
    {
      title: "Surgical Services",
      short: "Surgery",
      desc: "Elective and emergency surgical procedures with full recovery support.",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      fill: false,
      href: "/services/clinical#surgical"
    },
    {
      title: "CCC & HIV / AIDS Care",
      short: "CCC",
      desc: "Confidential HIV testing, counselling, and antiretroviral therapy.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      fill: false,
      href: "/services/clinical#ccc"
    },
    {
      title: "Physiotherapy & Rehabilitation",
      short: "Physio",
      desc: "Recovery support for injury, surgery, stroke, and chronic pain.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      fill: false,
      href: "/services/clinical#physio"
    },
    {
      title: "Laboratory & Diagnostics",
      short: "Lab & Imaging",
      desc: "Blood tests, X-Ray, and Ultrasound \u2014 most results same day.",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      fill: false,
      href: "/services/clinical#diagnostics"
    },
    {
      title: "Pharmacy",
      short: "Pharmacy",
      desc: "Prescription dispensing and medication guidance, every day.",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      fill: false,
      href: "/services/clinical#pharmacy"
    },
    {
      title: "Medical & In-patient Wards",
      short: "In-patient",
      desc: "Round-the-clock nursing and medical care for admitted patients.",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      fill: false,
      href: "/services/clinical#medical"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="services" class="py-20 lg:py-28 bg-surface" data-aos="fade-up"> <div class="max-w-7xl mx-auto px-2 md:px-4 lg:px-16"> <!-- ── Header ── --> <div class="mx-auto text-center gap-6 mb-12"> <div> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3 gap-3">
Our Services
</p> <h2 class="font-display text-secondary text-4xl lg:text-5xl font-normal leading-tight">
Nine ways we<br> <span class="font-semibold italic text-primary">care for you.</span> </h2> </div> <p class="text-muted text-sm leading-relaxed text-center">
From your first consultation to long-term recovery — we are here for every step of your health journey.
</p> </div> <!-- ── Grid ── --> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40"> ${services.map((service) => renderTemplate`<a${addAttribute(service.href, "href")}${addAttribute([
    "group relative bg-white p-7 flex flex-col gap-4",
    "hover:bg-surface transition-colors duration-200",
    "focus:outline-none focus:bg-surface"
  ], "class:list")}> <!-- Urgent badge — Emergency only --> ${service.urgent && renderTemplate`<div class="absolute top-5 right-5 flex items-center gap-1.5"> <span class="relative flex size-2"> <span class="absolute inline-flex size-full rounded-full bg-accent animate-ping opacity-75"></span> <span class="relative inline-flex size-2 rounded-full bg-accent"></span> </span> <span class="text-accent text-[0.55rem] font-bold tracking-[0.18em] uppercase">
24 / 7
</span> </div>`} <!-- Icon --> <div class="size-10 bg-surface-2 flex items-center justify-center
                      group-hover:bg-primary transition-all duration-300 shrink-0"> <svg class="size-5 text-primary group-hover:text-white transition-colors duration-300"${addAttribute(service.fill ? "currentColor" : "none", "fill")}${addAttribute(service.fill ? "none" : "currentColor", "stroke")} stroke-width="1.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(service.icon, "d")}></path> </svg> </div> <!-- Text --> <div class="flex-1"> <div class="flex items-start justify-between gap-2 mb-1.5"> <h3 class="text-secondary font-semibold text-sm leading-snug
                         group-hover:text-primary transition-colors duration-200"> ${service.title} </h3> </div> <p class="text-muted text-xs leading-relaxed"> ${service.desc} </p> </div> <!-- Arrow --> <div class="flex items-center gap-1.5 text-primary/0 group-hover:text-primary
                      text-[0.62rem] font-bold tracking-[0.1em] uppercase
                      transition-all duration-200 -mb-1">
Learn more
<svg class="size-3 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </div> </a>`)} </div> <!-- ── Footer link ── --> <div class="mt-10 pt-8 border-t border-border/60 flex flex-col sm:flex-row
                sm:items-center justify-between gap-5"> <p class="text-muted text-sm leading-relaxed max-w-md">
Each department has dedicated staff, clear hours, and a direct path to booking. Find full details, what to expect, and how to get there.
</p> <a href="/services/clinical" class="group shrink-0 inline-flex items-center gap-3
               bg-secondary hover:bg-primary text-white
               font-bold text-xs tracking-[0.14em] uppercase
               px-8 py-4 transition-all duration-200
               hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25">
Explore all our services
<svg class="size-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> </div> </div> </section>`;
}, "E:/PROJECT/SPMH/src/components/ServicesGrid.astro", void 0);

const $$StatsBar = createComponent(($$result, $$props, $$slots) => {
  const stats = [
    {
      value: "40+",
      target: 40,
      suffix: "+",
      label: "Years of Service",
      sub: "Est. 1983",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    },
    {
      value: "24 / 7",
      target: 24,
      suffix: " / 7",
      label: "Emergency Care",
      sub: "Always open",
      icon: "M13 10V3L4 14h7v7l9-11h-7z"
    },
    {
      value: "9+",
      target: 9,
      suffix: "+",
      label: "Specialities",
      sub: "Under one roof",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    },
    {
      value: "1983",
      target: 1983,
      suffix: "",
      label: "Year Founded",
      sub: "Mission-driven since day one",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="bg-secondary py-0"> <!-- Top micro-bar --> <div class="border-b border-white/10 px-2 md:px-4 lg:px-10 py-5"> <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"> <p class="font-display text-white/80 text-base italic font-normal">
"Compassionate care for every member of our community — since 1983."
</p> <div class="flex items-center gap-2 shrink-0"> <span class="relative flex size-2"> <span class="absolute inline-flex size-full rounded-full bg-accent/70"></span> <span class="relative inline-flex size-2 rounded-full bg-accent"></span> </span> <span class="text-white/60 text-xs tracking-widest uppercase font-semibold">
Emergency always open
</span> </div> </div> </div> <!-- Stats row --> <div class="max-w-7xl mx-auto px-2 md:px-4 lg:px-10" id="stats-bar"> <div class="grid grid-cols-2 lg:grid-cols-4"> ${stats.map((s, i) => renderTemplate`<div class="group flex items-center gap-5 px-6 py-10
                    hover:bg-white/10 transition-colors duration-300
                    border-r border-white/10 last:border-r-0
                    [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r"> <!-- Icon --> <div class="size-6 md:size-11 flex items-center justify-center bg-white/10
                      group-hover:bg-primary transition-all duration-300 shrink-0"> <svg class="size-5 text-white/70 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(s.icon, "d")}></path> </svg> </div> <!-- Text --> <div> <div class="font-display text-white text-2xl md:text-3xl font-bold leading-none mb-1
                     tabular-nums" data-counter${addAttribute(s.target, "data-target")}${addAttribute(s.suffix, "data-suffix")} data-duration="1800"${addAttribute(i * 120, "data-delay")}> ${s.value} </div> <div class="text-white/80 text-sm font-medium">${s.label}</div> <div class="text-white/40 text-[0.65rem] tracking-wide uppercase mt-0.5">${s.sub}</div> </div> </div>`)} </div> </div> </section> ${renderScript($$result, "E:/PROJECT/SPMH/src/components/StatsBar.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/PROJECT/SPMH/src/components/StatsBar.astro", void 0);

const $$AppointmentCTA = createComponent(($$result, $$props, $$slots) => {
  const GOOGLE_FORM = "https://tinyurl.com/5fbsmj9x";
  return renderTemplate`${maybeRenderHead()}<section id="book" class="bg-gray-200 border-t border-border/60 py-16 lg:py-20"> <div class="max-w-7xl mx-auto px-4 lg:px-10"> <div class="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center"> <!-- LEFT: text --> <div> <div class="flex items-center gap-3 mb-5"> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold">
Book an Appointment
</p> <div class="h-px w-10 bg-primary/30"></div> </div> <h2 class="font-display text-secondary text-3xl sm:text-4xl font-normal leading-snug mb-4">
Ready to visit us?
</h2> <p class="text-muted text-sm leading-relaxed mb-6">
Use the booking form to request an appointment. Our team will review
          your request and call you back within 24 hours to confirm your slot
          and share what you need to know before your visit.
</p> <!-- Passive WhatsApp mention — no link --> <div class="flex items-start gap-2.5"> <svg class="size-4 text-[#25D366] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"> <path d="M11.99 2C6.477 2 2 6.477 2 12c0 1.99.578 3.844 1.576 5.403L2 22l4.757-1.547A9.958 9.958 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.99 2z"></path> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path> </svg> <p class="text-muted text-xs leading-relaxed">
You can also reach us on <span class="text-secondary font-semibold">WhatsApp</span> — tap the green button at the bottom-right of your screen.
</p> </div> </div> <!-- RIGHT: booking form CTA --> <div class="flex flex-col gap-5"> <a${addAttribute(GOOGLE_FORM, "href")} target="_blank" rel="noopener noreferrer" class="group flex items-center gap-5 px-7 py-6
                 bg-primary hover:bg-primary-dark border border-primary
                 hover:shadow-lg hover:shadow-primary/25
                 transition-all duration-200 hover:-translate-y-0.5"> <div class="size-11 bg-white/15 flex items-center justify-center shrink-0
                      group-hover:bg-white/20 transition-colors duration-200"> <svg class="size-5 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path> </svg> </div> <div class="flex-1"> <p class="text-white font-semibold text-base">Open Booking Form</p> <p class="text-white/60 text-xs mt-0.5">
We'll call to confirm your slot within 24 hours
</p> </div> <svg class="size-5 text-white/40 group-hover:text-white
                      group-hover:translate-x-1 transition-all duration-200 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </a> <p class="text-muted text-[0.68rem] leading-relaxed">
Requests are reviewed Mon – Sat, 8 am – 5 pm.
</p> <!-- Emergency footnote --> <div class="flex items-center gap-3 pt-4 border-t border-border/60"> <span class="relative flex size-2 shrink-0"> <span class="absolute inline-flex size-full rounded-full bg-accent/70"></span> <span class="relative inline-flex size-2 rounded-full bg-accent"></span> </span> <p class="text-muted text-xs">
For emergencies — walk in directly.
<span class="text-secondary font-semibold">We are open 24 hours, every day.</span>
No appointment needed.
</p> </div> </div> </div> </div> </section>`;
}, "E:/PROJECT/SPMH/src/components/AppointmentCTA.astro", void 0);

const features = [
  {
    id: "emergency",
    label: "Emergency & Trauma",
    badge: "24 / 7",
    badgeClass: "bg-accent/10 text-accent border border-accent/20",
    headline: "We're ready before you arrive.",
    body: "Our Emergency & Trauma Unit runs around the clock with a dedicated team of physicians, nurses, and support staff. Whether it's a road accident, a sudden cardiac event, or any acute crisis — walk in at any hour and be seen immediately. No referral. No waiting for an appointment.",
    points: [
      "Immediate triage on arrival",
      "Trauma resuscitation bay",
      "24-hour on-call specialist cover",
      "Direct admission pathway to wards"
    ],
    cta: "Get Emergency Care",
    ctaHref: "/services/emergency",
    accentColor: "#860f0f",
    bgAccent: "bg-accent",
    stat: { val: "< 5 min", label: "Average triage time" }
  },
  {
    id: "maternity",
    label: "Maternity & Newborn",
    badge: "Full Pathway",
    badgeClass: "bg-primary/10 text-primary border border-primary/20",
    headline: "Every birth is a milestone we honour.",
    body: "From your first antenatal visit through labour, delivery, and postnatal recovery — our maternity unit provides a continuous, woman-centred care experience. Our newborn unit handles both healthy infants and those requiring special care in a warm, safe environment.",
    points: [
      "Antenatal clinics & birth planning",
      "Skilled birth attendants on every shift",
      "Postnatal mother & baby support",
      "Newborn special care unit"
    ],
    cta: "Book Antenatal Visit",
    ctaHref: "/services/antenatal-clinic",
    accentColor: "#1565c0",
    bgAccent: "bg-primary",
    stat: { val: "MCH", label: "Serving mothers since" }
  },
  {
    id: "ccc",
    label: "Comprehensive Care Centre",
    badge: "Confidential",
    badgeClass: "bg-secondary/10 text-secondary border border-secondary/20",
    headline: "Care without judgement. Always.",
    body: "Our Comprehensive Care Centre (CCC) provides integrated, confidential HIV/AIDS services — from voluntary testing and counselling to antiretroviral treatment and long-term management. Every patient is treated with complete dignity and discretion by a trained, compassionate team.",
    points: [
      "Voluntary Counselling & Testing (VCT)",
      "Antiretroviral therapy (ART) management",
      "Nutritional support & adherence counselling",
      "Community linkage & follow-up"
    ],
    cta: "Visit the CCC",
    ctaHref: "/services/ccc",
    accentColor: "#125276",
    bgAccent: "bg-secondary",
    stat: { val: "100%", label: "Confidential & dignified" }
  }
];
function FeaturedServices() {
  const [active, setActive] = useState(0);
  const f = features[active];
  return /* @__PURE__ */ jsxs("section", { id: "featured", className: "py-24 bg-white overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-2 md:px-4 lg:px-10", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3", children: "Spotlight" }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl lg:text-5xl text-secondary font-normal leading-tight", children: "Featured Services" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-1 mb-1 border-b border-border", children: features.map((feat, i) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActive(i),
          className: `
                relative px-2 py-4 text-sm font-semibold tracking-wide transition-all duration-200
                ${active === i ? "text-primary" : "text-muted hover:text-secondary"}
              `,
          children: [
            feat.label,
            active === i && /* @__PURE__ */ jsx(
              "span",
              {
                className: "absolute bottom-0 inset-x-0 h-0.5 bg-primary",
                style: { background: feat.accentColor }
              }
            )
          ]
        },
        feat.id
      )) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "grid lg:grid-cols-5 gap-0 border border-border/60 mt-0",
          style: { animation: "fadeIn 0.35s ease" },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 p-4 md:p-8 lg:p-14 bg-white flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: `inline-block text-[0.62rem] font-bold tracking-[0.15em] uppercase px-2.5 py-1 mb-6 ${f.badgeClass}`, children: f.badge }),
                /* @__PURE__ */ jsx("h3", { className: "font-display text-3xl lg:text-4xl text-secondary font-normal leading-snug mb-5", children: f.headline }),
                /* @__PURE__ */ jsx("p", { className: "text-muted leading-relaxed text-[0.95rem] mb-8 max-w-xl", children: f.body }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-10", children: f.points.map((pt) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: "size-4 shrink-0 mt-0.5",
                      style: { color: f.accentColor },
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2.5",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", d: "M5 13l4 4L19 7" })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: pt })
                ] }, pt)) })
              ] }),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: f.ctaHref,
                  className: "inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-white px-7 py-4 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 self-start",
                  style: { background: f.accentColor },
                  children: [
                    f.cta,
                    /* @__PURE__ */ jsx("svg", { className: "size-4", fill: "none", stroke: "currentColor", "stroke-width": "2", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `lg:col-span-2 flex flex-col justify-between p-10 lg:p-12 ${f.bgAccent}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-white/50 text-[0.65rem] tracking-[0.2em] uppercase font-semibold mb-1", children: "At a glance" }),
                    /* @__PURE__ */ jsx("div", { className: "font-display text-white text-5xl font-bold leading-none mb-2", children: f.stat.val }),
                    /* @__PURE__ */ jsx("div", { className: "text-white/70 text-sm", children: f.stat.label })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex gap-2 mt-auto", children: features.map((_, i) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setActive(i),
                      className: `h-1.5 rounded-full transition-all duration-300 ${active === i ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/60"}`
                    },
                    i
                  )) })
                ]
              }
            )
          ]
        },
        f.id
      )
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      ` })
  ] });
}

const $$LatestDevelopments = createComponent(($$result, $$props, $$slots) => {
  const tabs = [
    {
      id: "groundbreaking",
      label: "New Maternity & Surgical Wing",
      badge: "Breaking Ground \xB7 2026",
      badgeCls: "bg-accent/10 text-accent border border-accent/20",
      status: "Upcoming",
      statusCls: "bg-accent text-white",
      headline: "A landmark investment in maternal and surgical care.",
      body: "St. Paul's Mission Hospital is breaking ground on a new Maternity and Surgical Wing \u2014 a cornerstone of our Strategic Plan 2026\u20132030. This development directly addresses our commitment to expanded inpatient capacity, improved maternal and newborn care, and enhanced surgical services, bringing us closer to Level 5 facility status by 2030.",
      points: [
        "Dedicated maternity beds",
        "Modern surgical theatre",
        "Postnatal care unit",
        "Expanded inpatient capacity",
        "Enhanced privacy & dignity",
        "Closer to Level 5 by 2030"
      ],
      stat: "2030",
      statLabel: "Level 5 target year",
      href: "/developments/maternity-surgical-wing",
      linkLabel: "View Project Details",
      img: "/img/56.jpg",
      imgAlt: "Groundbreaking \u2014 New Maternity and Surgical Wing",
      accentCol: "#860f0f",
      panelCls: "bg-[#860f0f]"
    },
    {
      id: "newborn",
      label: "Newborn Unit",
      badge: "Now Operational",
      badgeCls: "bg-primary/10 text-primary border border-primary/20",
      status: "Launched",
      statusCls: "bg-primary text-white",
      headline: "Our Newborn Unit is open \u2014 and changing lives from day one.",
      body: "St. Paul's Mission Hospital is proud to announce that our dedicated Newborn Unit is now fully operational. Designed to provide safe, specialised care for newborns who need additional support, the unit brings a critical new capability to Homa Bay County \u2014 ensuring that the smallest and most vulnerable patients receive expert attention from their very first hours.",
      points: [
        "Dedicated newborn care environment",
        "Skilled nursing staff on every shift",
        "Thermoregulation & monitoring",
        "Close integration with maternity ward",
        "Kangaroo mother care support",
        "Open to all \u2014 regardless of ability to pay"
      ],
      stat: "Day 1",
      statLabel: "Care starts from birth",
      href: "/developments/newborn-unit",
      linkLabel: "Learn About the Newborn Unit",
      img: "/img/nbu.jpg",
      imgAlt: "Newborn Unit \u2014 St. Paul's Mission Hospital",
      accentCol: "#1565c0",
      panelCls: "bg-primary"
    },
    {
      id: "hdu",
      label: "High Dependency Unit",
      badge: "Being Set Up",
      badgeCls: "bg-secondary/10 text-secondary border border-secondary/20",
      status: "In Progress",
      statusCls: "bg-secondary text-white",
      headline: "Bridging the gap between ward care and intensive care.",
      body: "Our High Dependency Unit (HDU) is currently being established \u2014 a critical step in our journey toward Level 5 facility status. The HDU will provide closer monitoring and more intensive nursing care for patients who are too unwell for a general ward but do not yet require full ICU intervention, significantly improving outcomes for high-risk patients.",
      points: [
        "Continuous vital signs monitoring",
        "Higher nurse-to-patient ratio",
        "Post-operative recovery support",
        "Bridge between ward and ICU-level care",
        "Aligned with Level 5 readiness plan",
        "Serving Homa Bay County & environs"
      ],
      stat: "2026",
      statLabel: "Target operational year",
      href: "/developments/hdu",
      linkLabel: "About the HDU Project",
      img: "/img/hdu.jpeg",
      imgAlt: "High Dependency Unit setup \u2014 St. Paul's Mission Hospital",
      accentCol: "#125276",
      panelCls: "bg-secondary"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="developments" class="py-24 bg-surface overflow-hidden"> <div class="max-w-7xl mx-auto px-2 md:px-4 lg:px-10"> <!-- ── Header ── --> <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 reveal"> <div> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3 flex items-center gap-3"> <span class="w-8 h-px bg-primary inline-block"></span>
Latest Developments
</p> <h2 class="font-display text-4xl lg:text-5xl text-secondary font-normal leading-tight">
Growing for<br> <span class="font-semibold italic text-primary">Homa Bay.</span> </h2> </div> <p class="text-muted text-sm leading-relaxed max-w-xs">
Three major developments that reflect our Strategic Plan 2026–2030 — and our commitment to better care for every patient.
</p> </div> <!-- ── Alpine.js tabbed component ── --> <div x-data="{ active: 'groundbreaking' }"> <!-- Tab strip — same pattern as FeaturedServices --> <div class="flex border-b border-border overflow-x-auto"> ${tabs.map((tab) => renderTemplate`<button${addAttribute(`active = '${tab.id}'`, "@click")}${addAttribute(`active === '${tab.id}' ? 'text-secondary border-b-2 border-[${tab.accentCol}]' : 'text-muted hover:text-secondary border-b-2 border-transparent'`, ":class")} class="relative px-2 md:px-4 lg:px-7 py-4 text-sm font-semibold tracking-wide whitespace-nowrap transition-colors duration-200 -mb-px"> ${tab.label} <!-- Active status dot --> <span${addAttribute(`active === '${tab.id}'`, "x-show")} class="ml-2 inline-flex items-center gap-1" x-cloak> <span${addAttribute(`inline-block text-[0.55rem] font-bold tracking-[0.12em] uppercase px-2 py-0.5 ${tab.statusCls}`, "class")}> ${tab.status} </span> </span> </button>`)} </div> <!-- ── Tab panels ── --> ${tabs.map((tab) => renderTemplate`<div${addAttribute(`active === '${tab.id}'`, "x-show")} x-transition:enter="transition duration-300 ease-out" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" class="grid lg:grid-cols-5 border border-border/60 border-t-0 items-stretch" x-cloak> <!-- LEFT content — 3 cols --> <div class="lg:col-span-3 p-4 md:p-8 lg:p-10 bg-white flex flex-col justify-between"> <div> <!-- Badge --> <span${addAttribute(`inline-block text-[0.62rem] font-bold tracking-[0.15em] uppercase px-2.5 py-1 mb-5 ${tab.badgeCls}`, "class")}> ${tab.badge} </span> <h3 class="font-display text-2xl lg:text-[1.85rem] text-secondary font-normal leading-snug mb-4"> ${tab.headline} </h3> <p class="text-muted text-sm leading-relaxed mb-7 max-w-lg"> ${tab.body} </p> <!-- Bullet points --> <ul class="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-8"> ${tab.points.map((pt) => renderTemplate`<li class="flex items-start gap-2.5"> <svg class="size-4 shrink-0 mt-0.5"${addAttribute(`color: ${tab.accentCol}`, "style")} fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path> </svg> <span class="text-slate-700 text-xs leading-relaxed">${pt}</span> </li>`)} </ul> </div> <!-- CTA link --> <a${addAttribute(tab.href, "href")} class="group inline-flex items-center gap-3 text-sm font-semibold
                     tracking-wide text-white px-7 py-4 self-start
                     transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5
                     hover:shadow-lg"${addAttribute(`background: ${tab.accentCol}`, "style")}> ${tab.linkLabel} <svg class="size-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </a> </div> <!-- RIGHT accent panel — 2 cols --> <div${addAttribute(`lg:col-span-2 flex flex-col ${tab.panelCls}`, "class")}> <!-- Image — aspect-[4/5] on mobile, fills panel height on desktop --> <div class="relative overflow-hidden aspect-[4/5] lg:aspect-auto lg:flex-1 group"> <img${addAttribute(tab.img, "src")}${addAttribute(tab.imgAlt, "alt")} class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy"> <!-- Subtle colour overlay so image sits within brand palette --> <div class="absolute inset-0 opacity-30"${addAttribute(`background: ${tab.accentCol}`, "style")}></div> <!-- "Breaking Ground" stamp — only on groundbreaking tab --> ${tab.id === "groundbreaking" && renderTemplate`<div class="absolute top-6 -right-2 rotate-[7deg] z-10"> <div class="bg-accent px-4 py-2 shadow-lg shadow-accent/30"> <p class="text-white text-[0.6rem] tracking-[0.22em] uppercase font-bold">
Breaking Ground
</p> </div> </div>`} </div> <!-- Stat callout --> <div class="p-8 flex flex-col gap-1"> <p class="text-white/50 text-[0.62rem] tracking-[0.2em] uppercase font-semibold">
At a glance
</p> <div class="font-display text-white text-5xl font-bold leading-none mt-1"> ${tab.stat} </div> <div class="text-white/65 text-sm mt-1"> ${tab.statLabel} </div> <!-- Tab dots — same as FeaturedServices --> <div class="flex gap-2 mt-5"> ${tabs.map((t) => renderTemplate`<button${addAttribute(`active = '${t.id}'`, "@click")}${addAttribute(`active === '${t.id}' ? 'w-8 bg-white' : 'w-3 bg-white/30 hover:bg-white/60'`, ":class")} class="h-1.5 rounded-full transition-all duration-300"></button>`)} </div> </div> </div> </div>`)} </div> </div> </section>`;
}, "E:/PROJECT/SPMH/src/components/LatestDevelopments.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "St Paul's Mission Hospital" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Carousel", Carousel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/PROJECT/SPMH/src/components/Carousel.jsx", "client:component-export": "default" })} ${renderComponent($$result2, "IntroBand", $$IntroBand, {})} ${renderComponent($$result2, "AboutSection", $$AboutSection, {})} ${renderComponent($$result2, "ServicesGrid", $$ServicesGrid, {})} ${renderComponent($$result2, "FeaturedServices", FeaturedServices, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "E:/PROJECT/SPMH/src/react-islands/FeaturedServices.tsx", "client:component-export": "default" })} ${renderComponent($$result2, "StatsBar", $$StatsBar, {})} ${renderComponent($$result2, "LatestDevelopments", $$LatestDevelopments, {})} ${renderComponent($$result2, "AppointmentCTA", $$AppointmentCTA, {})} ` })}`;
}, "E:/PROJECT/SPMH/src/pages/index.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
