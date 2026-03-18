import { c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderTemplate, r as renderComponent } from '../../chunks/astro/server_FwoxJmSS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DbIzBR6F.mjs';
import 'clsx';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$JobPortal = createComponent(($$result, $$props, $$slots) => {
  const APPLY_FORM_BASE = "https://tinyurl.com/nhcphwwa";
  const FORM_ENTRY_ID = "entry.1234567890";
  const jobs = [
    {
      id: "SPMH-2026-001",
      title: "Senior Medical Officer",
      category: "Clinical",
      department: "Emergency Medicine",
      type: "Full-time",
      posted: "3 days ago",
      deadline: "18 March 2026",
      summary: "Lead clinical care in our Emergency & Trauma Unit, supervising junior officers and ensuring compliance with Ministry of Health standards.",
      responsibilities: [
        "Supervise junior medical officers and interns during clinical rotations.",
        "Lead emergency response protocols and critical care interventions.",
        "Conduct clinical audits to ensure compliance with Ministry of Health standards.",
        "Participate in departmental meetings, mortality reviews, and CME sessions."
      ],
      requirements: [
        "Bachelor of Medicine and Bachelor of Surgery (MBChB).",
        "Valid KMPDC licence and current Annual Retention Certificate.",
        "Minimum 5 years post-internship experience in a busy hospital setting.",
        "Demonstrable experience in emergency or acute care settings."
      ]
    },
    {
      id: "SPMH-2026-002",
      title: "Specialized Nurse \u2014 ICU",
      category: "Nursing",
      department: "Intensive Care",
      type: "Full-time",
      posted: "3 days ago",
      deadline: "18 March 2026",
      summary: "Provide specialist nursing care for critically ill patients in our developing High Dependency and ICU environment.",
      responsibilities: [
        "Monitor and manage critically ill patients, including those on ventilator support.",
        "Collaborate with the multi-disciplinary team for patient stabilisation and recovery.",
        "Administer specialised medications and monitor haemodynamics.",
        "Maintain accurate clinical documentation and handover notes."
      ],
      requirements: [
        "Diploma or Degree in Nursing (KRCHN / KRN) \u2014 registered with NCK.",
        "Higher Diploma in Critical Care Nursing.",
        "Minimum 2 years experience in a critical care or HDU environment."
      ]
    },
    {
      id: "SPMH-2026-003",
      title: "Hospital Administrator",
      category: "Management",
      department: "Administration",
      type: "Full-time",
      posted: "3 days ago",
      deadline: "18 March 2026",
      summary: "Oversee daily hospital operations, administrative systems, and support services to ensure efficient and compliant facility management.",
      responsibilities: [
        "Oversee day-to-day administrative operations across all departments.",
        "Coordinate with department heads on resource allocation and planning.",
        "Ensure regulatory compliance with Ministry of Health and SHA requirements.",
        "Manage procurement, logistics, and non-clinical support services."
      ],
      requirements: [
        "Degree in Health Systems Management, Business Administration, or related field.",
        "Minimum 3 years experience in hospital or healthcare administration.",
        "Familiarity with SHA accreditation requirements and health facility regulations."
      ]
    },
    {
      id: "SPMH-2026-004",
      title: "Laboratory Technologist",
      category: "Technical",
      department: "Pathology & Lab",
      type: "Full-time",
      posted: "5 days ago",
      deadline: "25 March 2026",
      summary: "Process and analyse clinical specimens to support accurate diagnosis and patient management across all departments.",
      responsibilities: [
        "Receive, process, and analyse clinical specimens in accordance with SOPs.",
        "Calibrate and maintain laboratory equipment and reagent stocks.",
        "Ensure sample integrity, labelling accuracy, and turnaround times.",
        "Generate timely and accurate lab reports for clinical teams."
      ],
      requirements: [
        "Diploma or Degree in Medical Laboratory Technology.",
        "Registered with the Kenya Medical Laboratory Technicians and Technologists Board (KMLTTB).",
        "Minimum 1 year post-qualification experience in a clinical laboratory."
      ]
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div id="job-portal"${addAttribute(`{
    searchQuery: '',
    categoryFilter: 'All',
    showModal: false,
    allJobs: ${JSON.stringify(jobs)},
    activeJob: ${JSON.stringify(jobs[0])},
    get categories() {
      const cats = [...new Set(this.allJobs.map(j => j.category))];
      return ['All', ...cats];
    },
    get filteredJobs() {
      return this.allJobs.filter(job => {
        const matchSearch = this.searchQuery === '' ||
          job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchCat = this.categoryFilter === 'All' || job.category === this.categoryFilter;
        return matchSearch && matchCat;
      });
    },
    applyLink(title) {
      return '${APPLY_FORM_BASE}?${FORM_ENTRY_ID}=' + encodeURIComponent(title);
    },
    selectJob(job) {
      this.activeJob = job;
      this.showModal = true;
      document.body.classList.add('overflow-hidden');
    },
    closeModal() {
      this.showModal = false;
      document.body.classList.remove('overflow-hidden');
    }
  }`, "x-data")} class="max-w-7xl mx-auto px-2 md:px-4 lg:px-10 py-16" data-astro-cid-vcqaxmue> <!-- ── Header + filters ── --> <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-8 border-b border-border/60" data-astro-cid-vcqaxmue> <div data-astro-cid-vcqaxmue> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-2" data-astro-cid-vcqaxmue>
Current Openings
</p> <p class="text-muted text-sm" data-astro-cid-vcqaxmue> <span class="text-secondary font-semibold" x-text="filteredJobs.length" data-astro-cid-vcqaxmue></span> <span x-text="filteredJobs.length === 1 ? ' position available' : ' positions available'" data-astro-cid-vcqaxmue></span> </p> </div> <!-- Search + category filter --> <div class="flex flex-col sm:flex-row gap-3" data-astro-cid-vcqaxmue> <!-- Search --> <div class="relative" data-astro-cid-vcqaxmue> <input type="text" x-model="searchQuery" placeholder="Search roles or departments…" class="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white border border-border/70
                 text-sm text-secondary placeholder:text-muted/50
                 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10
                 transition-all duration-200" data-astro-cid-vcqaxmue> <svg class="absolute left-3 top-3 size-3.5 text-muted/50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-astro-cid-vcqaxmue> <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-vcqaxmue></path> </svg> </div> <!-- Category filter pills --> <div class="flex flex-wrap gap-2" data-astro-cid-vcqaxmue> <template x-for="cat in categories" :key="cat" data-astro-cid-vcqaxmue> <button @click="categoryFilter = cat" :class="categoryFilter === cat
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-muted border-border/70 hover:border-primary/40 hover:text-secondary'" class="px-3.5 py-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase
                   border transition-all duration-200" x-text="cat" data-astro-cid-vcqaxmue></button> </template> </div> </div> </div> <!-- ── Job cards grid ── --> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" x-show="filteredJobs.length > 0" data-astro-cid-vcqaxmue> <template x-for="job in filteredJobs" :key="job.id" data-astro-cid-vcqaxmue> <button @click="selectJob(job)" class="group text-left bg-white rounded-[1.5rem] border border-border/60
               hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
               transition-all duration-300 hover:-translate-y-0.5
               flex flex-col p-7 focus:outline-none focus:border-primary/40" data-astro-cid-vcqaxmue> <!-- Top row --> <div class="flex items-start justify-between mb-5" data-astro-cid-vcqaxmue> <span class="text-accent text-[0.58rem] font-bold tracking-[0.18em] uppercase" x-text="job.category" data-astro-cid-vcqaxmue></span> <span class="text-muted/50 text-[0.58rem] font-mono tracking-wide" x-text="job.id" data-astro-cid-vcqaxmue></span> </div> <!-- Title + summary --> <div class="flex-1" data-astro-cid-vcqaxmue> <h4 class="font-display text-xl font-semibold text-secondary
                     group-hover:text-primary transition-colors duration-200 mb-2 leading-snug" x-text="job.title" data-astro-cid-vcqaxmue></h4> <p class="text-muted text-xs leading-relaxed line-clamp-2" x-text="job.summary" data-astro-cid-vcqaxmue></p> </div> <!-- Footer row --> <div class="flex items-center justify-between mt-6 pt-5 border-t border-border/50" data-astro-cid-vcqaxmue> <div data-astro-cid-vcqaxmue> <p class="text-muted/60 text-[0.58rem] tracking-widest uppercase" data-astro-cid-vcqaxmue>
Department
</p> <p class="text-secondary text-xs font-semibold mt-0.5" x-text="job.department" data-astro-cid-vcqaxmue></p> </div> <div class="flex items-center gap-1.5 text-primary text-[0.65rem] font-bold
                      tracking-[0.1em] uppercase group-hover:gap-2.5 transition-all duration-200" data-astro-cid-vcqaxmue>
View role
<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-astro-cid-vcqaxmue> <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" data-astro-cid-vcqaxmue></path> </svg> </div> </div> </button> </template> </div> <!-- Empty state --> <div x-show="filteredJobs.length === 0" class="py-20 text-center" data-astro-cid-vcqaxmue> <div class="size-14 bg-surface-2 flex items-center justify-center mx-auto mb-4" data-astro-cid-vcqaxmue> <svg class="size-6 text-muted/40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" data-astro-cid-vcqaxmue> <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-vcqaxmue></path> </svg> </div> <p class="text-secondary font-semibold text-sm mb-1" data-astro-cid-vcqaxmue>No roles found</p> <p class="text-muted text-xs" data-astro-cid-vcqaxmue>Try a different search term or category.</p> </div> <!-- General application nudge --> <div class="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row
              sm:items-center justify-between gap-5" data-astro-cid-vcqaxmue> <div data-astro-cid-vcqaxmue> <p class="text-secondary font-semibold text-sm mb-1" data-astro-cid-vcqaxmue>
Don't see a role that fits?
</p> <p class="text-muted text-xs leading-relaxed max-w-md" data-astro-cid-vcqaxmue>
We welcome general applications from motivated healthcare professionals.
        Send us your CV and a brief note about how you'd like to contribute.
</p> </div> <a :href="applyLink('General Application')" target="_blank" rel="noopener noreferrer" class="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5
             border border-secondary text-secondary hover:bg-secondary hover:text-white
             text-xs font-bold tracking-[0.12em] uppercase
             transition-all duration-200" data-astro-cid-vcqaxmue>
Submit General Application
<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-astro-cid-vcqaxmue> <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" data-astro-cid-vcqaxmue></path> </svg> </a> </div> <!-- ══════════════════════════════════════
       MODAL
  ══════════════════════════════════════ --> <div x-show="showModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8" x-cloak data-astro-cid-vcqaxmue> <!-- Backdrop --> <div x-show="showModal" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" @click="closeModal()" class="absolute inset-0 bg-secondary/70 backdrop-blur-sm" data-astro-cid-vcqaxmue></div> <!-- Modal panel --> <div x-show="showModal" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 scale-95 translate-y-4" x-transition:enter-end="opacity-100 scale-100 translate-y-0" x-transition:leave="transition ease-in duration-200" x-transition:leave-start="opacity-100 scale-100" x-transition:leave-end="opacity-0 scale-95" class="relative w-full max-w-3xl bg-white shadow-2xl
             flex flex-col max-h-[88vh] overflow-hidden" data-astro-cid-vcqaxmue> <!-- Modal header --> <div class="px-8 pt-8 pb-6 border-b border-border/60" data-astro-cid-vcqaxmue> <!-- Close --> <button @click="closeModal()" class="absolute top-6 right-6 size-8 flex items-center justify-center
                 text-muted hover:text-accent transition-colors duration-200" aria-label="Close" data-astro-cid-vcqaxmue> <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-astro-cid-vcqaxmue> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-astro-cid-vcqaxmue></path> </svg> </button> <!-- Category + title --> <span class="text-accent text-[0.6rem] font-bold tracking-[0.2em] uppercase" x-text="activeJob.category" data-astro-cid-vcqaxmue></span> <h2 class="font-display text-secondary text-3xl sm:text-4xl font-semibold
                   leading-snug mt-2 mb-6 pr-10" x-text="activeJob.title" data-astro-cid-vcqaxmue></h2> <!-- Meta pills + Apply CTA --> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-astro-cid-vcqaxmue> <div class="flex flex-wrap gap-2" data-astro-cid-vcqaxmue> <span class="text-[0.6rem] font-bold tracking-[0.14em] uppercase
                         bg-surface border border-border/70 text-muted px-3 py-1" x-text="activeJob.id" data-astro-cid-vcqaxmue></span> <span class="text-[0.6rem] font-bold tracking-[0.14em] uppercase
                         bg-surface border border-border/70 text-muted px-3 py-1" x-text="activeJob.department" data-astro-cid-vcqaxmue></span> <span class="text-[0.6rem] font-bold tracking-[0.14em] uppercase
                         bg-surface border border-border/70 text-muted px-3 py-1" x-text="activeJob.type" data-astro-cid-vcqaxmue></span> </div> <a :href="applyLink(activeJob.title)" target="_blank" rel="noopener noreferrer" class="shrink-0 inline-flex items-center justify-center gap-2.5
                   bg-primary hover:bg-primary-dark text-white
                   text-[0.65rem] font-bold tracking-[0.14em] uppercase
                   px-8 py-3.5 transition-all duration-200
                   hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25" data-astro-cid-vcqaxmue>
Apply for this role
<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-astro-cid-vcqaxmue> <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" data-astro-cid-vcqaxmue></path> </svg> </a> </div> </div> <!-- Modal body — scrollable --> <div class="flex-1 overflow-y-auto px-8 py-8 space-y-10 custom-scrollbar" data-astro-cid-vcqaxmue> <!-- Summary --> <div class="bg-surface border-l-2 border-primary px-5 py-4" data-astro-cid-vcqaxmue> <p class="text-secondary text-sm leading-relaxed italic font-display" x-text="activeJob.summary" data-astro-cid-vcqaxmue></p> </div> <!-- Responsibilities --> <div data-astro-cid-vcqaxmue> <h5 class="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary
                     mb-5 flex items-center gap-2.5" data-astro-cid-vcqaxmue> <span class="w-5 h-px bg-primary/40" data-astro-cid-vcqaxmue></span>
Roles & Responsibilities
</h5> <ul class="space-y-3" data-astro-cid-vcqaxmue> <template x-for="task in activeJob.responsibilities" data-astro-cid-vcqaxmue> <li class="flex items-start gap-3 text-sm text-muted leading-relaxed" data-astro-cid-vcqaxmue> <svg class="size-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-astro-cid-vcqaxmue> <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-astro-cid-vcqaxmue></path> </svg> <span x-text="task" data-astro-cid-vcqaxmue></span> </li> </template> </ul> </div> <!-- Requirements --> <div data-astro-cid-vcqaxmue> <h5 class="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary
                     mb-5 flex items-center gap-2.5" data-astro-cid-vcqaxmue> <span class="w-5 h-px bg-primary/40" data-astro-cid-vcqaxmue></span>
Requirements
</h5> <div class="grid gap-2.5" data-astro-cid-vcqaxmue> <template x-for="req in activeJob.requirements" data-astro-cid-vcqaxmue> <div class="flex items-start gap-3 p-4 bg-surface border border-border/60" data-astro-cid-vcqaxmue> <svg class="size-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-astro-cid-vcqaxmue> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-vcqaxmue></path> </svg> <span class="text-sm text-secondary font-medium" x-text="req" data-astro-cid-vcqaxmue></span> </div> </template> </div> </div> </div> <!-- Modal footer --> <div class="px-8 py-5 bg-surface border-t border-border/60
                  flex items-center justify-between gap-4" data-astro-cid-vcqaxmue> <div class="flex gap-6" data-astro-cid-vcqaxmue> <div data-astro-cid-vcqaxmue> <p class="text-muted/50 text-[0.58rem] tracking-widest uppercase" data-astro-cid-vcqaxmue>
Posted
</p> <p class="text-secondary text-xs font-semibold mt-0.5" x-text="activeJob.posted" data-astro-cid-vcqaxmue></p> </div> <div data-astro-cid-vcqaxmue> <p class="text-muted/50 text-[0.58rem] tracking-widest uppercase" data-astro-cid-vcqaxmue>
Deadline
</p> <p class="text-accent text-xs font-semibold mt-0.5" x-text="activeJob.deadline" data-astro-cid-vcqaxmue></p> </div> </div> <p class="text-muted/40 text-[0.6rem] tracking-wide text-right hidden sm:block" data-astro-cid-vcqaxmue>
St. Paul's Mission Hospital · Homa Bay, Kenya
</p> </div> </div> </div> </div> `;
}, "E:/PROJECT/SPMH/src/components/JobPortal.astro", void 0);

const $$Careers = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Careers \u2014 St. Paul's Mission Hospital" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<header class="relative min-h-[65vh] flex items-end overflow-hidden"> <div class="absolute inset-0 z-0"> <img src="/img/55.jpg" alt="Careers at St. Paul's Mission Hospital" class="absolute inset-0 w-full h-full object-cover object-center brightness-[0.3]" loading="eager" fetchpriority="high"> <div class="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary/40 to-transparent"></div> </div> <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pb-16 pt-32 w-full"> <div class="grid lg:grid-cols-12 gap-8 items-end"> <!-- Left: headline --> <div class="lg:col-span-7"> <p class="text-primary-light text-xs tracking-[0.22em] uppercase font-semibold mb-5 flex items-center gap-3"> <span class="w-8 h-px bg-primary-light inline-block"></span>
Join Our Team
</p> <h1 class="font-display text-white text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.0]">
Meaningful work.<br> <span class="font-semibold italic text-primary-light">Real impact.</span> </h1> </div> <!-- Right: context --> <div class="lg:col-span-5 pb-1"> <div class="border-l-2 border-white/20 pl-6"> <p class="text-white/70 text-base lg:text-lg font-display italic font-normal leading-relaxed">
St. Paul's Mission Hospital is a growing Level 4 faith-based
              facility on the path to Level 5 by 2030. We are looking for
              dedicated professionals who share our commitment to compassionate,
              dignified care for every patient.
</p> <div class="flex items-center gap-4 mt-5"> <div class="text-center"> <p class="font-display text-white text-2xl font-bold leading-none">
9+
</p> <p class="text-white/40 text-[0.6rem] tracking-widest uppercase mt-1">
Departments
</p> </div> <div class="w-px h-8 bg-white/15"></div> <div class="text-center"> <p class="font-display text-white text-2xl font-bold leading-none">
1983
</p> <p class="text-white/40 text-[0.6rem] tracking-widest uppercase mt-1">
Est.
</p> </div> <div class="w-px h-8 bg-white/15"></div> <div class="text-center"> <p class="font-display text-white text-2xl font-bold leading-none">
L4→5
</p> <p class="text-white/40 text-[0.6rem] tracking-widest uppercase mt-1">
By 2030
</p> </div> </div> </div> </div> </div> </div> </header>  <div class="bg-secondary border-b border-white/10"> <div class="max-w-7xl mx-auto px-6 lg:px-16 py-7
                flex flex-col sm:flex-row sm:items-center justify-between gap-4"> <p class="text-white/60 text-sm leading-relaxed max-w-2xl">
All roles at St. Paul's are governed by our Ethics and Clinical
        Governance Committee and aligned with the Catholic Diocese of Homa Bay.
        We are an equal opportunity, faith-based employer.
</p> <div class="flex items-center gap-2 shrink-0"> <span class="relative flex size-2"> <span class="absolute inline-flex size-full rounded-full bg-primary-light/70 animate-ping"></span> <span class="relative inline-flex size-2 rounded-full bg-primary-light"></span> </span> <span class="text-white/50 text-xs tracking-[0.16em] uppercase font-semibold">
SHA Accredited · KMPDC Certified
</span> </div> </div> </div>  <main class="bg-surface"> ${renderComponent($$result2, "JobPortal", $$JobPortal, {})} </main>  <section class="bg-white border-t border-border/60 py-16"> <div class="max-w-7xl mx-auto px-6 lg:px-16"> <div class="grid lg:grid-cols-12 gap-10 items-start"> <div class="lg:col-span-4"> <p class="text-primary text-xs tracking-[0.22em] uppercase font-semibold mb-4 flex items-center gap-3"> <span class="w-8 h-px bg-primary inline-block"></span>
Why St. Paul's
</p> <h2 class="font-display text-secondary text-3xl font-normal leading-snug">
Work that<br> <span class="font-semibold italic text-primary">matters.</span> </h2> </div> <div class="lg:col-span-8 grid sm:grid-cols-2 gap-6"> ${[
    {
      title: "Mission-driven environment",
      desc: "Every role here contributes to the founding charism of the Franciscan Sisters of St. Joseph Asumbi \u2014 care for the whole person, especially the most vulnerable."
    },
    {
      title: "Professional growth",
      desc: "As we grow toward Level 5 status, new specialities and departments are being established \u2014 offering opportunities for leadership and career development."
    },
    {
      title: "Community impact",
      desc: "You will serve one of Kenya's most underserved regions. The work you do at St. Paul's has a direct and visible impact on the families of Homa Bay County."
    },
    {
      title: "Faith-based values",
      desc: "We operate in accordance with Catholic Social Teaching \u2014 dignity, solidarity, and a preferential option for the poor guide everything we do."
    }
  ].map((item) => renderTemplate`<div class="flex flex-col gap-3 p-6 bg-surface border border-border/60"> <svg class="size-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <h3 class="text-secondary font-semibold text-sm"> ${item.title} </h3> <p class="text-muted text-xs leading-relaxed">${item.desc}</p> </div>`)} </div> </div> </div> </section> ` })}`;
}, "E:/PROJECT/SPMH/src/pages/get-involved/careers.astro", void 0);

const $$file = "E:/PROJECT/SPMH/src/pages/get-involved/careers.astro";
const $$url = "/get-involved/careers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Careers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
