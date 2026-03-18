import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DbIzBR6F.mjs';
export { renderers } from '../../renderers.mjs';

const $$Clinical = createComponent(($$result, $$props, $$slots) => {
  const departments = [
    {
      id: "opd",
      title: "Outpatient & General Consultation",
      short: "OPD",
      meta: "General",
      image: "/img/3.jpg",
      tagline: "Your first point of care \u2014 every day of the week.",
      what: "Whether you have a new health concern, need a follow-up, or are unsure where to start \u2014 our outpatient team is here. We see adults and children for all general health needs.",
      treats: ["General illness & fever", "Chronic disease management", "Follow-up consultations", "Child health & growth monitoring", "Referrals to specialised units"],
      expect: "Register at the front desk, see a clinical officer or doctor, receive treatment or a referral. Most visits take under two hours.",
      when: "24 hours a day, 7 days a week. No appointment needed"
    },
    {
      id: "emergency",
      title: "Emergency & Casualty",
      short: "Emergency",
      meta: "24/7",
      image: "/img/5.jpg",
      tagline: "Immediate care, any hour of the day or night.",
      what: "Our emergency unit is open around the clock for any urgent medical situation. If you or someone you know is in immediate danger, come directly to our casualty entrance \u2014 do not wait.",
      treats: ["Road traffic injuries", "Severe fever or convulsions", "Difficulty breathing", "Chest pain", "Obstetric emergencies", "Poisoning & trauma"],
      expect: "You will be assessed immediately on arrival. Critical cases are attended to first. A nurse or clinical officer will triage you within minutes.",
      when: "24 hours a day, 7 days a week. No appointment needed \u2014 walk in or call ahead."
    },
    {
      id: "maternal",
      title: "Maternal & Neonatal Care",
      short: "Maternity",
      meta: "Maternity",
      image: "/img/49.jpg",
      tagline: "Safe, dignified care for mothers and their newborns.",
      what: "From your first antenatal visit through to delivery and postnatal recovery, our midwives and clinical team are with you at every step. Our Newborn Unit provides dedicated support for babies who need additional care after birth.",
      treats: ["Antenatal care & check-ups", "Safe delivery services", "Postnatal mother & baby care", "Newborn Unit (special care)", "Immunisation", "Family planning"],
      expect: "You can walk in for antenatal care any day. Delivery services are available 24 hours. Our midwives will guide you through every stage.",
      when: "Antenatal clinic: Monday to Friday (8 am -  1 pm). Delivery & emergency maternity: 24 hours, 7 days."
    },
    {
      id: "surgical",
      title: "Surgical Services",
      short: "Surgery",
      meta: "Surgical",
      image: "/img/15.jpg",
      tagline: "Planned and emergency surgical care you can trust.",
      what: "Our surgical team handles a range of elective and emergency procedures. All surgical cases are assessed first by a doctor \u2014 we will guide you through the process from consultation to recovery.",
      treats: ["General surgical procedures", "Caesarean section", "Wound care & debridement", "Minor surgical procedures", "Emergency operations"],
      expect: "Elective surgery requires a prior consultation and clinical assessment. Our team will explain the procedure, prepare you, and support your recovery.",
      when: "Elective surgeries: Monday to Friday. Emergency surgery: available 24 hours."
    },
    {
      id: "ccc",
      title: "CCC & HIV / AIDS Care",
      short: "CCC",
      meta: "Chronic Care",
      image: "/img/22.jpg",
      tagline: "Confidential, compassionate care for people living with HIV.",
      what: "Our Comprehensive Care Clinic provides ongoing support for people living with HIV/AIDS \u2014 including testing, counselling, antiretroviral treatment, and follow-up care. All services are strictly confidential.",
      treats: ["HIV testing & counselling", "Antiretroviral therapy (ART)", "Adherence support", "PMTCT (prevention of mother-to-child transmission)", "Nutritional support", "Opportunistic infection management"],
      expect: "You will meet with a counsellor and a clinician. All information is kept strictly confidential. We treat every patient with dignity and respect.",
      when: "Monday to Friday, 8:00 AM \u2013 4:00 PM."
    },
    {
      id: "physio",
      title: "Physiotherapy & Rehabilitation",
      short: "Physio",
      meta: "Rehab",
      image: "/img/43.jpg",
      tagline: "Helping you move, recover, and regain independence.",
      what: "Our physiotherapy team works with patients recovering from injury, surgery, stroke, or long-term conditions. We use hands-on therapy and guided exercises to restore movement and reduce pain.",
      treats: ["Post-surgery rehabilitation", "Stroke & neurological recovery", "Orthopaedic injuries", "Back & neck pain", "Occupational therapy", "Paediatric physiotherapy"],
      expect: "Your first session includes an assessment of your condition and goals. A personalised treatment plan is created and reviewed at each visit.",
      when: "Monday to Friday, 8:00 AM \u2013 4:00 PM. Appointment recommended."
    },
    {
      id: "diagnostics",
      title: "Laboratory & Diagnostics",
      short: "Lab & Imaging",
      meta: "Diagnostics",
      image: "/img/2.jpg",
      tagline: "Accurate results to guide your care.",
      what: "Our laboratory and imaging unit provides the tests your doctor needs to diagnose and monitor your health. Most routine results are available the same day.",
      treats: ["Blood tests & urinalysis", "X-Ray (digital)", "Ultrasound scanning", "Malaria & TB diagnostics", "Pregnancy tests", "Blood grouping & cross-matching"],
      expect: "Bring your doctor's request form. Sample collection is quick. Results are communicated directly to your clinician or handed to you as instructed.",
      when: "24 hours a day, 7 days a week. Fasting tests \u2014 please arrive before 9:00 AM."
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      short: "Pharmacy",
      meta: "Medicines",
      image: "/img/11.jpg",
      tagline: "Medicines and guidance available whenever you need them.",
      what: "Our pharmacy is stocked with essential medicines and is staffed by trained pharmaceutical professionals. We dispense prescriptions and provide clear guidance on how to take your medication safely.",
      treats: ["Prescription dispensing", "Over-the-counter medicines", "Chronic medication refills", "Drug counselling & advice", "Paediatric formulations"],
      expect: "Present your prescription at the dispensing window. Our pharmacist will explain your medication, dosage, and any precautions you need to be aware of.",
      when: "24 hours a day, 7 days a week. No appointment needed"
    },
    {
      id: "medical",
      title: "Medical & In-patient Wards",
      short: "Medical",
      meta: "In-patient",
      image: "/img/56.jpg",
      tagline: "Dedicated care for patients who need to stay with us.",
      what: "When your condition requires close monitoring or ongoing treatment, our in-patient wards provide round-the-clock nursing care under the supervision of our clinical team.",
      treats: ["Medical admissions", "IV therapy & infusions", "Monitoring of serious illness", "Post-operative recovery", "Paediatric in-patient care", "Nutritional support"],
      expect: "Admission is arranged through OPD, emergency, or a referral. Our nurses will explain your care plan, visiting hours, and what to expect during your stay.",
      when: "In-patient services run 24 hours. Ward rounds by doctors: morning and afternoon daily."
    }
  ];
  const needsCards = [
    { label: "I'm pregnant or a new mother", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", fill: true, target: "maternal" },
    { label: "I need a consultation", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", fill: false, target: "opd" },
    { label: "I need tests or imaging", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", fill: false, target: "diagnostics" },
    { label: "I need physiotherapy", icon: "M13 10V3L4 14h7v7l9-11h-7z", fill: false, target: "physio" },
    { label: "I need surgery", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", fill: false, target: "surgical" },
    { label: "This is an emergency", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", fill: false, target: "emergency" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Clinical Services \u2014 St. Paul's Mission Hospital" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<header class="relative min-h-[55vh] flex items-end overflow-hidden" data-aos="fade-up"> <div class="absolute inset-0 z-0"> <img src="/img/18.jpg" alt="Clinical care at St. Paul's Mission Hospital" class="absolute inset-0 w-full h-full object-cover object-top brightness-[0.45]" loading="eager" fetchpriority="high"> <div class="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary/20 to-transparent"></div> </div> <div class="relative z-10 max-w-7xl mx-auto px-4 lg:px-16 pb-14 pt-28 w-full"> <div class="grid lg:grid-cols-12 gap-8 items-end"> <div class="lg:col-span-7"> <p class="text-primary-light text-xs tracking-[0.22em] uppercase font-semibold mb-5 flex items-center gap-3">
Our Services
</p> <h1 class="font-display text-white text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.0]">
Care for every<br> <span class="font-semibold text-primary-light">need.</span> </h1> </div> <div class="lg:col-span-5 pb-1"> <div class="border-l-2 border-white/20 pl-6"> <p class="text-white/80 text-base font-display italic leading-relaxed">
Nine specialities. One mission — safe hands and caring hearts for every person who walks through our doors.
</p> </div> </div> </div> </div> </header>  <section class="bg-surface border-b border-border/60 py-14"> <div class="max-w-7xl mx-auto text-center px-4 lg:px-16"> <div class="mb-10"> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-3 gap-3"> <span class="w-8 h-px bg-primary inline-block"></span>
Find your care
</p> <h2 class="font-display text-secondary text-3xl font-normal leading-snug">
What brings you<br> <span class="font-semibold italic text-primary">to St. Paul's today?</span> </h2> </div> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"> ${needsCards.map((card) => renderTemplate`<a${addAttribute(`#${card.target}`, "href")} class="group flex flex-col items-center text-center gap-3 bg-white
                   border border-border/60 px-4 py-5
                   hover:border-primary/40 hover:shadow-md hover:shadow-primary/5
                   hover:-translate-y-0.5 transition-all duration-300"> <div class="size-11 bg-surface-2 flex items-center justify-center
                        group-hover:bg-primary transition-all duration-300"> <svg class="size-5 text-primary group-hover:text-white transition-colors duration-300"${addAttribute(card.fill ? "currentColor" : "none", "fill")}${addAttribute(card.fill ? "none" : "currentColor", "stroke")} stroke-width="1.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(card.icon, "d")}></path> </svg> </div> <p class="text-secondary text-xs font-semibold leading-snug
                      group-hover:text-primary transition-colors duration-200"> ${card.label} </p> </a>`)} </div> </div> </section>  <div class="sticky top-0 z-[90] bg-white border-b border-border/60 shadow-sm" x-data="{ active: 'opd' }" x-init="
    data-aos='fade-left'
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting) active = e.target.id })
      }, { rootMargin: '-40% 0px -55% 0px' });
      document.querySelectorAll('[data-dept]').forEach(el => obs.observe(el));
    "> <div class="max-w-7xl mx-auto px-6 lg:px-16"> <div class="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-3"> ${departments.map((d) => renderTemplate`<a${addAttribute(`#${d.id}`, "href")}${addAttribute(`active === '${d.id}'
              ? 'bg-primary text-white border-primary'
              : 'bg-surface text-muted border-border/60 hover:border-primary/30 hover:text-primary'`, ":class")} class="shrink-0 px-4 py-1.5 border text-xs font-bold tracking-[0.1em]
                   uppercase transition-all duration-200 whitespace-nowrap"> ${d.short} </a>`)} </div> </div> </div>  <div class="max-w-7xl mx-auto px-4 lg:px-16 py-16 lg:py-20 space-y-24 lg:space-y-32" data-aos="fade-right"> ${departments.map((dept, idx) => renderTemplate`<article${addAttribute(dept.id, "id")} data-dept class="scroll-mt-20 grid lg:grid-cols-12 gap-10 lg:gap-16 items-start"> <!-- Image — left on even, right on odd --> <div${addAttribute(`lg:col-span-5 ${idx % 2 !== 0 ? "lg:order-2" : ""}`, "class")}> <div class="relative overflow-hidden aspect-[4/3]"> <img${addAttribute(dept.image, "src")}${addAttribute(dept.title, "alt")} class="absolute inset-0 w-full h-full object-cover
                     transition-transform duration-700 hover:scale-[1.03]" loading="lazy"> <!-- Meta badge over image --> <div class="absolute top-4 left-4"> <span class="bg-secondary/90 text-white text-[0.58rem] font-bold
                           tracking-[0.16em] uppercase px-3 py-1.5"> ${dept.meta} </span> </div> </div> </div> <!-- Content --> <div${addAttribute(`lg:col-span-7 ${idx % 2 !== 0 ? "lg:order-1" : ""}`, "class")}> <!-- Title --> <div class="mb-6"> <p class="text-primary text-xs tracking-[0.2em] uppercase font-semibold mb-3"> ${dept.meta} </p> <h2 class="font-display text-secondary text-3xl sm:text-4xl font-semibold leading-snug mb-3"> ${dept.title} </h2> <p class="font-display text-muted text-lg italic font-normal leading-snug"> ${dept.tagline} </p> </div> <!-- About --> <p class="text-muted text-sm leading-relaxed mb-8 max-w-lg"> ${dept.what} </p> <!-- Three info columns --> <div class="grid sm:grid-cols-3 gap-5 mb-8"> <!-- What we treat --> <div class="bg-surface border border-border/60 p-4"> <p class="text-[0.6rem] font-bold tracking-[0.18em] uppercase text-primary mb-3">
What we treat
</p> <ul class="space-y-1.5"> ${dept.treats.map((t) => renderTemplate`<li class="flex items-start gap-2"> <span class="size-1.5 rounded-full bg-primary shrink-0 mt-1.5"></span> <span class="text-muted text-xs leading-snug">${t}</span> </li>`)} </ul> </div> <!-- What to expect --> <div class="bg-surface border border-border/60 p-4"> <p class="text-[0.6rem] font-bold tracking-[0.18em] uppercase text-primary mb-3">
What to expect
</p> <p class="text-muted text-xs leading-relaxed">${dept.expect}</p> </div> <!-- When to come --> <div class="bg-secondary p-4"> <p class="text-[0.6rem] font-bold tracking-[0.18em] uppercase text-primary-light mb-3">
When to come
</p> <p class="text-white/70 text-xs leading-relaxed">${dept.when}</p> </div> </div> </div> </article>`)} </div>  <section class="bg-muted py-16 lg:py-20 relative overflow-hidden"> <div class="relative max-w-7xl mx-auto px-4 lg:px-16" data-aos="fade-up"> <div class="grid lg:grid-cols-2 gap-10 items-center"> <div> <p class="text-primary-light text-xs tracking-[0.22em] uppercase font-semibold mb-4 flex items-center gap-3"> <span class="w-8 h-px bg-primary-light inline-block"></span>
We are here for you
</p> <h2 class="font-display text-white text-3xl sm:text-4xl font-normal leading-snug mb-4">
Ready to take<br> <span class="font-semibold italic text-primary-light">the next step?</span> </h2> <p class="text-white/50 text-sm leading-relaxed max-w-md">
Book your appointment online, or reach out to our team directly. We are here Monday to Saturday — and for emergencies, around the clock.
</p> </div> <div class="flex flex-col sm:flex-row gap-4"> <a href="/services/appointment" target="_blank" class="group inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark
                   text-white font-bold text-xs tracking-[0.14em] uppercase
                   px-8 py-4 transition-all duration-200
                   hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"> <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg>
Book an Appointment
<svg class="size-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> <a href="/about-us/contact" class="group inline-flex items-center justify-center gap-3
                   border border-white/25 hover:border-white/50 text-white
                   font-bold text-xs tracking-[0.14em] uppercase
                   px-8 py-4 transition-all duration-200 hover:bg-white/5"> <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg>
Contact Us
</a> </div> </div> </div> </section> ` })}`;
}, "E:/PROJECT/SPMH/src/pages/services/clinical.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/services/clinical.astro";
const $$url = "/services/clinical";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Clinical,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
